import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Gift {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Contact {
  id: string;
  name: string;
  birthday: string;
  address: string;
  gift: Gift;
  createdAt: string;
  payeeId?: string;
}

export interface Transaction {
  id: string;
  recipientName: string;
  gift: Gift;
  status: 'paid' | 'shipped' | 'delivered';
  transactionDate: string;
  paymanId: string;
}

interface AppContextType {
  contacts: Contact[];
  transactions: Transaction[];
  loading: boolean;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'> & { payeeId?: string }) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error') => void;
  toast: { message: string; type: 'success' | 'error' } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockGifts: Gift[] = [
  { id: '1', name: 'Mini Succulent', price: 12, image: 'https://images.pexels.com/photos/1048035/pexels-photo-1048035.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Plants' },
  { id: '2', name: 'Artisan Chocolate Bar', price: 8, image: 'https://images.pexels.com/photos/977876/pexels-photo-977876.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Food' },
  { id: '3', name: 'Cute Mug', price: 15, image: 'https://images.pexels.com/photos/1033471/pexels-photo-1033471.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Home' },
  { id: '4', name: 'Desk Plant', price: 18, image: 'https://images.pexels.com/photos/1048035/pexels-photo-1048035.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Plants' },
  { id: '5', name: 'Scented Candle', price: 16, image: 'https://images.pexels.com/photos/6980537/pexels-photo-6980537.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Wellness' },
  { id: '6', name: 'Notebook', price: 10, image: 'https://images.pexels.com/photos/1033471/pexels-photo-1033471.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Stationery' }
];

export const gifts = mockGifts;

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      loadContacts();
      loadTransactions();
    } else {
      setContacts([]);
      setTransactions([]);
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedContacts: Contact[] = data.map(contact => ({
        id: contact.id,
        name: contact.name,
        birthday: contact.birthday,
        address: contact.address,
        gift: {
          id: contact.gift_id,
          name: contact.gift_name,
          price: contact.gift_price,
          image: contact.gift_image,
          category: contact.gift_category,
        },
        createdAt: contact.created_at,
        payeeId: contact.payee_id,
      }));

      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      showToast('Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions: Transaction[] = data.map(transaction => ({
        id: transaction.id,
        recipientName: transaction.recipient_name,
        gift: {
          id: transaction.gift_id,
          name: transaction.gift_name,
          price: transaction.gift_price,
          image: transaction.gift_image,
          category: transaction.gift_category,
        },
        status: transaction.status as 'paid' | 'shipped' | 'delivered',
        transactionDate: transaction.transaction_date,
        paymanId: transaction.payman_id,
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      showToast('Failed to load transactions', 'error');
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'createdAt'> & { payeeId?: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          name: contactData.name,
          birthday: contactData.birthday,
          address: contactData.address,
          gift_id: contactData.gift.id,
          gift_name: contactData.gift.name,
          gift_price: contactData.gift.price,
          gift_image: contactData.gift.image,
          gift_category: contactData.gift.category,
          payee_id: contactData.payeeId,
        });

      if (error) throw error;

      await loadContacts();
      showToast('Contact added successfully!', 'success');
    } catch (error) {
      console.error('Error adding contact:', error);
      showToast('Failed to add contact', 'error');
    }
  };

  const deleteContact = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadContacts();
      showToast('Contact deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast('Failed to delete contact', 'error');
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          recipient_name: transactionData.recipientName,
          gift_id: transactionData.gift.id,
          gift_name: transactionData.gift.name,
          gift_price: transactionData.gift.price,
          gift_image: transactionData.gift.image,
          gift_category: transactionData.gift.category,
          status: transactionData.status,
          transaction_date: transactionData.transactionDate,
          payman_id: transactionData.paymanId,
        });

      if (error) throw error;

      await loadTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <AppContext.Provider value={{
      contacts,
      transactions,
      loading,
      addContact,
      deleteContact,
      addTransaction,
      showToast,
      toast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}