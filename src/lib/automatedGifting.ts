import { supabase } from './supabase';
import paymanClient from './payman';

export async function sendBirthdayGifts() {
  const today = new Date().toISOString().slice(5, 10); // MM-DD
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .like('birthday', `%${today}%`);

  for (const contact of contacts || []) {
    try {
      await paymanClient.ask(`send $${contact.gift_price} to ${contact.payee_id} for ${contact.gift_name}`);
      const { data: tx, error: txError } = await supabase.from('transactions').insert([{
        user_id: contact.user_id,
        recipient_name: contact.name,
        gift_id: contact.gift_id,
        gift_name: contact.gift_name,
        gift_price: contact.gift_price,
        gift_image: contact.gift_image,
        gift_category: contact.gift_category,
        status: 'paid',
        transaction_date: new Date().toISOString(),
        payman_id: contact.payee_id
      }]).select().single();
      if (txError) throw txError;
      setTimeout(async () => {
        await supabase.from('transactions').update({ status: 'shipped' }).eq('id', tx.id);
        setTimeout(async () => {
          await supabase.from('transactions').update({ status: 'delivered' }).eq('id', tx.id);
        }, 10000);
      }, 10000);
    } catch (err) {
      // Optionally log error
    }
  }
} 