import { supabase } from './supabase';
import paymanClient from './payman';
import { format } from 'date-fns';
import { config } from './config';

export async function checkAndSendBirthdayGifts() {
  try {
    // Get today's date in MM-DD format
    const today = format(new Date(), 'MM-dd');
    
    console.log('=== BIRTHDAY DEBUGGING ===');
    console.log('Today\'s date:', new Date().toISOString());
    console.log('Searching for birthday format:', today);
    console.log('LIKE pattern:', `%${today}%`);
    
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
    
    // Fetch contacts whose birthdays are today
    const { data: birthdayContacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .like('birthday', `%${today}%`);

    if (contactsError) throw contactsError;
    
    console.log(`Found ${birthdayContacts?.length || 0} birthdays today`);
    console.log('Birthday contacts:', birthdayContacts);
    console.log('=== END DEBUGGING ===');

    const storePaytag = config.storePaytag || config.STORE_PAYTAG;
    if (!storePaytag) throw new Error('Store Paytag not configured');

    // Process each birthday contact
    for (const contact of birthdayContacts || []) {
      try {
        // If contact has a preferred gift, use it
        if (contact.gift_id && contact.gift_price) {
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