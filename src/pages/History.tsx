import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Gift, Package2, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';

interface Transaction {
  id: string;
  recipient_name: string;
  gift_name: string;
  gift_price: number;
  gift_image: string;
  gift_category: string;
  status: string;
  transaction_date: string;
  created_at: string;
}

const History: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gift History</h1>
          <p className="text-gray-600">Track all your sent gifts and their delivery status</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gift history...</p>
        </div>
      ) : transactions.length === 0 ? (
        <Card className="text-center py-12">
          <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No gifts sent yet</p>
          <p className="text-sm text-gray-400">Your gift sending history will appear here</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={transaction.gift_image}
                      alt={transaction.gift_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Gift for {transaction.recipient_name}
                    </h3>
                    <p className="text-gray-500">{transaction.gift_name}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">
                        ${transaction.gift_price}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-500 space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(transaction.created_at)}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">{transaction.gift_category}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;