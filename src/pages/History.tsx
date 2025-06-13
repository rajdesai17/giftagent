import React from 'react';
import { Package, Calendar, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';

export default function History() {
  const { transactions } = useApp();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
          <div className="text-6xl mb-6">📦</div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            No transactions yet
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Your gift history will appear here once you start sending gifts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-medium text-gray-900">Gift History</h1>
        <p className="text-gray-600 mt-2">
          Track your gift transactions and delivery status
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-gray-900">Gift & Recipient</th>
                <th className="text-left px-6 py-4 font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-4 font-medium text-gray-900">Date</th>
                <th className="text-left px-6 py-4 font-medium text-gray-900">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={transaction.gift.image}
                        alt={transaction.gift.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{transaction.gift.name}</p>
                        <p className="text-sm text-gray-600">to {transaction.recipientName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(transaction.transactionDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-mono text-sm">{transaction.paymanId}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}