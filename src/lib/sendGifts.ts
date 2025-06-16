import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
);

interface Contact {
  id: string;
  user_id: string;
  name: string;
  birthday: string;
  gift_id: string;
  gift_name: string;
  gift_price: number;
  gift_image: string;
  gift_category: string;
}

async function sendGiftsForToday() {
  // Get today's MM-DD
  const today = new Date();
  const mmdd = today.toISOString().slice(5, 10);

  // Fetch all contacts with a birthday today
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*');
  if (error) throw error;

  const birthdayContacts = (contacts as Contact[]).filter((c: Contact) => c.birthday === mmdd);

  // Use dynamic import for better ES module compatibility
  const { PaymanClient } = await import('@paymanai/payman-ts');
  
  const clientId = process.env.PAYMAN_CLIENT_ID as string;
  const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing Payman credentials in environment variables');
  }
  
  const payman = PaymanClient.withCredentials({
    clientId,
    clientSecret,
  });

  for (const contact of birthdayContacts) {
    // Prepare payment details
    const amount = contact.gift_price;
    const toPayeeId = 'pd-1f048707-53da-6908-a779-972e0be1d5f8'; // Fixed test payee ID
    
    // Use the new Payman client with ask() method
    const paymentPrompt = `Send ${amount} TSD to payee ${toPayeeId}. Description: Birthday gift for ${contact.name}`;
    await payman.ask(paymentPrompt);

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
      payman_id: `auto-${Date.now()}`, // Since we can't extract ID from ask() response
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