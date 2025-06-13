import { createClient } from '@supabase/supabase-js';
import payman from './payman';

const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
);

const FROM_WALLET_ID = process.env.VITE_FROM_WALLET_ID!;

async function sendGiftsForToday() {
  // Get today's MM-DD
  const today = new Date();
  const mmdd = today.toISOString().slice(5, 10);

  // Fetch all contacts with a birthday today
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*');
  if (error) throw error;

  const birthdayContacts = contacts.filter((c: any) => c.birthday === mmdd);

  for (const contact of birthdayContacts) {
    // Prepare payment details
    const amount = contact.gift_price;
    const toWalletId = 'pd-1f048707-53da-6908-a779-972e0be1d5f8'; // Fixed recipient wallet ID
    const payment = await payman.payments.create({
      fromWalletId: FROM_WALLET_ID,
      toWalletId,
      amount,
      currency: 'TSD',
      description: `Birthday gift for ${contact.name}`,
      metadata: { contactId: contact.id, giftId: contact.gift_id }
    });

    // Log transaction in Supabase
    await supabase.from('transactions').insert({
      user_id: contact.user_id,
      recipient_name: contact.name,
      gift_id: contact.gift_id,
      gift_name: contact.gift_name,
      gift_price: contact.gift_price,
      gift_image: contact.gift_image,
      gift_category: contact.gift_category,
      status: 'paid',
      transaction_date: today.toISOString(),
      payman_id: payment.id,
    });
  }

  return { sent: birthdayContacts.length };
}

// For local testing or direct invocation
if (require.main === module) {
  sendGiftsForToday()
    .then(res => console.log('Gifts sent:', res))
    .catch(err => console.error('Error:', err));
}

export default sendGiftsForToday; 