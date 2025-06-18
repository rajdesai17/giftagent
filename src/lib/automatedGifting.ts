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
    // Get today's date in MM-DD format
    const today = format(new Date(), 'MM-dd');
    
    console.log('=== BIRTHDAY DEBUGGING ===');
    console.log('Today\'s date:', new Date().toISOString());
    console.log('Searching for birthday format:', today);
    
    // First, let's see ALL contacts for debugging
    const { data: allContacts, error: allContactsError } = await supabase
      .from('contacts')
      .select('id, name, birthday, gift_id, gift_price');
    
    if (allContactsError) {
      console.error('Error fetching all contacts:', allContactsError);
    } else {
      console.log('All contacts in database:');
      allContacts?.forEach(contact => {
        console.log(`- ${contact.name}: birthday="${contact.birthday}", gift_id=${contact.gift_id}, gift_price=${contact.gift_price}`);
      });
    }
    
    // Fetch contacts whose birthdays are today - handle both MM-DD and YYYY-MM-DD formats
    const { data: birthdayContacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .or(`birthday.like.%${today}%,birthday.like.%-${today}`);

    if (contactsError) {
      console.log('First query failed, trying alternative approach...');
      
      // Alternative approach: fetch all contacts and filter in JavaScript
      const { data: allContactsForFilter, error: allError } = await supabase
        .from('contacts')
        .select('*');
      
      if (allError) throw allError;
      
      // Filter contacts with birthdays today
      const filteredContacts = allContactsForFilter?.filter(contact => {
        const birthday = contact.birthday;
        // Check if birthday contains today's MM-DD format
        return birthday.includes(today) || birthday.endsWith(`-${today}`);
      }) || [];
      
      console.log(`Found ${filteredContacts.length} birthdays today (using JS filter)`);
      console.log('Birthday contacts:', filteredContacts);
      
      // Use filtered contacts
      await processBirthdayContacts(filteredContacts as Contact[]);
      
      return {
        success: true,
        message: `Processed ${filteredContacts.length} birthday gifts`
      };
    }
    
    console.log(`Found ${birthdayContacts?.length || 0} birthdays today`);
    console.log('Birthday contacts:', birthdayContacts);
    console.log('=== END DEBUGGING ===');

    await processBirthdayContacts(birthdayContacts as Contact[] || []);

    return {
      success: true,
      message: `Processed ${birthdayContacts?.length || 0} birthday gifts`
    };
  } catch (error) {
    console.error('Error in automated gifting:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function processBirthdayContacts(birthdayContacts: Contact[]) {
  const storePaytag = config.storePaytag || config.STORE_PAYTAG;
  if (!storePaytag) throw new Error('Store Paytag not configured');

  // Process each birthday contact
  for (const contact of birthdayContacts) {
    try {
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

        if (txError) throw txError;

        console.log(`Successfully sent birthday gift to ${contact.name}`);
      } else {
        console.log(`Contact ${contact.name} has no gift configured (gift_id: ${contact.gift_id}, gift_price: ${contact.gift_price})`);
      }
    } catch (error) {
      console.error(`Error processing gift for ${contact.name}:`, error);
      // Continue with next contact even if one fails
    }
  }
}