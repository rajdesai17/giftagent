import React from 'react';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'paid' | 'shipped' | 'delivered';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    paid: {
      icon: CreditCard,
      label: 'Paid',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    shipped: {
      icon: Truck,
      label: 'Shipped',
      className: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    delivered: {
      icon: CheckCircle,
      label: 'Delivered',
      className: 'bg-green-50 text-green-700 border-green-200'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </span>
  );
}