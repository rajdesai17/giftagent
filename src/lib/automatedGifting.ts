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
    
    // Fetch all contacts and filter for today's birthdays
    const { data: allContacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*');

    if (contactsError) throw contactsError;

    // Filter contacts with birthdays today
    const birthdayContacts = allContacts?.filter(contact => {
      const birthday = contact.birthday;
      return birthday.includes(today) || birthday.endsWith(`-${today}`);
    }) || [];

    console.log(`Found ${birthdayContacts.length} birthdays today`);

    if (birthdayContacts.length === 0) {
      return {
        success: true,
        message: 'No birthdays today'
      };
    }

    // Process all birthday contacts concurrently
    const results = await processBirthdayContactsConcurrently(birthdayContacts as Contact[]);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return {
      success: true,
      message: `Processed ${birthdayContacts.length} birthday contacts: ${successCount} successful, ${failCount} failed`
    };
  } catch (error) {
    console.error('Error in automated gifting:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function processBirthdayContactsConcurrently(birthdayContacts: Contact[]) {
  const storePaytag = config.storePaytag || config.STORE_PAYTAG;
  if (!storePaytag) throw new Error('Store Paytag not configured');

  // Process all contacts in parallel
  const giftPromises = birthdayContacts.map(contact => processGiftForContact(contact, storePaytag));
  
  // Wait for all to complete (some may succeed, some may fail)
  const results = await Promise.allSettled(giftPromises);
  
  return results.map((result, index) => ({
    contact: birthdayContacts[index].name,
    success: result.status === 'fulfilled',
    error: result.status === 'rejected' ? result.reason : null
  }));
}

async function processGiftForContact(contact: Contact, storePaytag: string) {
  // Skip if no gift configured
  if (!contact.gift_id || !contact.gift_price) {
    console.log(`${contact.name}: No gift configured`);
    return;
  }

  // Send payment and log transaction concurrently
  const [paymentResult, transactionResult] = await Promise.allSettled([
    // Send payment to store
    paymanClient.ask(
      `send $${contact.gift_price} to ${storePaytag} for ${contact.gift_name} (Birthday Gift for ${contact.name})`
    ),
    
    // Log the transaction
    supabase.from('transactions').insert([{
      user_id: contact.user_id,
      recipient_name: contact.name,
      gift_id: contact.gift_id,
      gift_name: contact.gift_name,
      gift_price: contact.gift_price,
      gift_image: contact.gift_image,
      gift_category: contact.gift_category,
      status: 'paid',
      transaction_date: new Date().toISOString(),
      payman_id: Date.now().toString() + '-' + contact.id // Unique ID
    }])
  ]);

  // Check if payment failed
  if (paymentResult.status === 'rejected') {
    throw new Error(`Payment failed for ${contact.name}: ${paymentResult.reason}`);
  }

  // Check if transaction logging failed
  if (transactionResult.status === 'rejected') {
    console.error(`Transaction logging failed for ${contact.name}:`, transactionResult.reason);
    // Don't throw here - payment was successful
  }

  console.log(`✅ Gift sent to ${contact.name}: ${contact.gift_name} ($${contact.gift_price})`);
}