import { supabase } from './supabase';
import paymanClient from './payman';
import { format } from 'date-fns';
import { config } from './config';

interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  birthday: string;
  address: string;
  gift_id?: string;
  gift_name?: string;
  gift_price?: number;
  gift_image?: string;
  gift_category?: string;
}

export async function checkAndSendBirthdayGifts() {
  try {
    console.log('=== BIRTHDAY DEBUGGING ===');
    
    // Get today's date in MM-DD format
    const today = format(new Date(), 'MM-dd');
    console.log('Today\'s date:', new Date().toISOString());
    console.log('Searching for birthday format:', today);
    
    // Test database connection first
    console.log('Testing database connection...');
    try {
      const { error: testError } = await supabase
        .from('contacts')
        .select('count(*)')
        .limit(1);
      
      if (testError) {
        console.error('Database connection test failed:', testError);
        throw testError;
      }
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      throw dbError;
    }
    
    // First, let's see ALL contacts for debugging
    console.log('Fetching all contacts...');
    try {
      const { data: allContacts, error: allContactsError } = await supabase
        .from('contacts')
        .select('id, name, birthday, gift_id, gift_price');
      
      if (allContactsError) {
        console.error('Error fetching all contacts:', allContactsError);
        throw allContactsError;
      }
      
      console.log('All contacts in database:');
      if (!allContacts || allContacts.length === 0) {
        console.log('No contacts found in database');
      } else {
        allContacts.forEach(contact => {
          console.log(`- ${contact.name}: birthday="${contact.birthday}", gift_id=${contact.gift_id}, gift_price=${contact.gift_price}`);
        });
      }
    } catch (contactsError) {
      console.error('Failed to fetch all contacts:', contactsError);
      throw contactsError;
    }
    
    // Fetch contacts whose birthdays are today - handle both MM-DD and YYYY-MM-DD formats
    console.log('Fetching birthday contacts with query...');
    try {
      const { data: birthdayContacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .or(`birthday.like.%${today}%,birthday.like.%-${today}`);

      if (contactsError) {
        console.log('First query failed, trying alternative approach...');
        console.log('Query error:', contactsError);
        
        // Alternative approach: fetch all contacts and filter in JavaScript
        console.log('Fetching all contacts for JS filtering...');
        const { data: allContactsForFilter, error: allError } = await supabase
          .from('contacts')
          .select('*');
        
        if (allError) {
          console.error('Alternative query also failed:', allError);
          throw allError;
        }
        
        console.log(`Fetched ${allContactsForFilter?.length || 0} contacts for filtering`);
        
        // Filter contacts with birthdays today
        const filteredContacts = allContactsForFilter?.filter(contact => {
          const birthday = contact.birthday;
          const matches = birthday.includes(today) || birthday.endsWith(`-${today}`);
          if (matches) {
            console.log(`Found birthday match: ${contact.name} with birthday ${birthday}`);
          }
          return matches;
        }) || [];
        
        console.log(`Found ${filteredContacts.length} birthdays today (using JS filter)`);
        console.log('Birthday contacts:', filteredContacts.map(c => ({ name: c.name, birthday: c.birthday, gift_id: c.gift_id, gift_price: c.gift_price })));
        
        // Use filtered contacts
        await processBirthdayContacts(filteredContacts as Contact[]);
        
        console.log('=== END DEBUGGING ===');
        return {
          success: true,
          message: `Processed ${filteredContacts.length} birthday gifts`
        };
      }
      
      console.log(`Found ${birthdayContacts?.length || 0} birthdays today (using query)`);
      console.log('Birthday contacts:', birthdayContacts?.map(c => ({ name: c.name, birthday: c.birthday, gift_id: c.gift_id, gift_price: c.gift_price })));

      await processBirthdayContacts(birthdayContacts as Contact[] || []);

      console.log('=== END DEBUGGING ===');
      return {
        success: true,
        message: `Processed ${birthdayContacts?.length || 0} birthday gifts`
      };
    } catch (queryError) {
      console.error('Both query approaches failed:', queryError);
      throw queryError;
    }
  } catch (error) {
    console.error('Error in automated gifting:', error);
    console.log('=== END DEBUGGING (WITH ERROR) ===');
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function processBirthdayContacts(birthdayContacts: Contact[]) {
  console.log(`Processing ${birthdayContacts.length} birthday contacts...`);
  
  try {
    const storePaytag = config.storePaytag || config.STORE_PAYTAG;
    if (!storePaytag) {
      console.error('Store Paytag not configured');
      throw new Error('Store Paytag not configured');
    }
    
    console.log('Store Paytag configured:', !!storePaytag);

    // Process each birthday contact
    for (const contact of birthdayContacts) {
      try {
        console.log(`Checking contact: ${contact.name}`);
        
        // If contact has a preferred gift, use it
        if (contact.gift_id && contact.gift_price) {
          console.log(`Processing gift for ${contact.name}: ${contact.gift_name} ($${contact.gift_price})`);
          
          // Send payment to store
          await paymanClient.ask(
            `send $${contact.gift_price} to ${storePaytag} for ${contact.gift_name} (Birthday Gift for ${contact.name})`
          );

          // Log the transaction
          const { error: txError } = await supabase.from('transactions').insert([{
            user_id: contact.user_id,
            recipient_name: contact.name,
            gift_id: contact.gift_id,
            gift_name: contact.gift_name,
            gift_price: contact.gift_price,
            gift_image: contact.gift_image,
            gift_category: contact.gift_category,
            status: 'paid',
            transaction_date: new Date().toISOString(),
            payman_id: Date.now().toString() // Using timestamp as ID for now
          }]);

          if (txError) {
            console.error('Transaction logging error:', txError);
            throw txError;
          }

          console.log(`Successfully sent birthday gift to ${contact.name}`);
        } else {
          console.log(`Contact ${contact.name} has no gift configured (gift_id: ${contact.gift_id}, gift_price: ${contact.gift_price})`);
        }
      } catch (contactError) {
        console.error(`Error processing gift for ${contact.name}:`, contactError);
        // Continue with next contact even if one fails
      }
    }
    
    console.log('Finished processing all birthday contacts');
  } catch (processError) {
    console.error('Error in processBirthdayContacts:', processError);
    throw processError;
  }
}