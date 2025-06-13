import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          birthday: string;
          address: string;
          gift_id: string;
          gift_name: string;
          gift_price: number;
          gift_image: string;
          gift_category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          birthday: string;
          address: string;
          gift_id: string;
          gift_name: string;
          gift_price: number;
          gift_image: string;
          gift_category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          birthday?: string;
          address?: string;
          gift_id?: string;
          gift_name?: string;
          gift_price?: number;
          gift_image?: string;
          gift_category?: string;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          recipient_name: string;
          gift_id: string;
          gift_name: string;
          gift_price: number;
          gift_image: string;
          gift_category: string;
          status: string;
          transaction_date: string;
          payman_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipient_name: string;
          gift_id: string;
          gift_name: string;
          gift_price: number;
          gift_image: string;
          gift_category: string;
          status?: string;
          transaction_date?: string;
          payman_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipient_name?: string;
          gift_id?: string;
          gift_name?: string;
          gift_price?: number;
          gift_image?: string;
          gift_category?: string;
          status?: string;
          transaction_date?: string;
          payman_id?: string;
          created_at?: string;
        };
      };
    };
  };
};