import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardNav from '../components/Dashboard/DashboardNav';
import Card from '../components/ui/Card';
import { Transaction } from '../types';

const History: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Mock data for demo
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        contact_id: '1',
        gift_id: '1',
        amount: 25.00,
        status: 'delivered',
        payment_method: 'payman',
        created_at: '2024-02-14T10:00:00Z',
        delivered_at: '2024-02-16T14:30:00Z',
        contact: {
          id: '1',
          name: 'Sarah Johnson',
          birthday: '2024-02-14',
          address: '123 Main St, NYC',
          created_at: '2024-01-01T00:00:00Z',
          user_id: user?.id || ''
        },
        gift: {
          id: '1',
          name: 'Premium Notebook',
          price: 25.00,
          image: 'https://images.pexels.com/photos/159832/notebook-pen-writing-learn-159832.jpeg',
          description: 'Beautiful leather-bound notebook',
          category: 'stationery'
        }
      },
      {
        id: '2',
        contact_id: '2',
        gift_id: '2',
        amount: 18.00,
        status: 'shipped',
        payment_method: 'payman',
        created_at: '2024-02-20T15:30:00Z',
        contact: {
          id: '2',
          name: 'Mike Chen',
          birthday: '2024-02-20',
          address: '456 Oak Ave, LA',
          created_at: '2024-01-01T00:00:00Z',
          user_id: user?.id || ''
        },
        gift: {
          id: '2',
          name: 'Artisan Coffee Beans',
          price: 18.00,
          image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
          description: 'Single-origin premium coffee beans',
          category: 'food'
        }
      }
    ];
    setTransactions(mockTransactions);
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'paid':
        return 'text-blue-700 bg-blue-100';
      case 'shipped':
        return 'text-purple-700 bg-purple-100';
      case 'delivered':
        return 'text-green-700 bg-green-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardNav />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-gray-600">View all your gift transactions and delivery status</p>
            </div>

            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={transaction.gift.image}
                        alt={transaction.gift.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {transaction.gift.name} → {transaction.contact.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {transaction.contact.address}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              {getStatusIcon(transaction.status)}
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium capitalize
                                ${getStatusColor(transaction.status)}
                              `}>
                                {transaction.status}
                              </span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ${transaction.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No transactions yet</p>
                <p className="text-sm text-gray-400">
                  Start sending gifts to see your transaction history here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;