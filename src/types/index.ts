export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  gift_id?: string;
  gift_name?: string;
  gift_price?: number;
  gift_image?: string;
  gift_category?: string;
  created_at: string;
}

export interface Gift {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface ContactGift {
  id: string;
  contact_id: string;
  gift_id: string;
  contact: Contact;
  gift: Gift;
}

export interface Transaction {
  id: string;
  contact_id: string;
  gift_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  payment_method: string;
  created_at: string;
  delivered_at?: string;
  contact: Contact;
  gift: Gift;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  payman_connected: boolean;
}