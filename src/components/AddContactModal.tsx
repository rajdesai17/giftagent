import React, { useState } from 'react';
import { X, User, Calendar, MapPin, Gift } from 'lucide-react';
import { useApp, gifts, Gift as GiftType } from '../context/AppContext';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddContactModal({ isOpen, onClose }: AddContactModalProps) {
  const { addContact } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    address: '',
    selectedGift: null as GiftType | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthday || !formData.address || !formData.selectedGift) {
      return;
    }

    try {
      const tokenData = JSON.parse(localStorage.getItem('payman_token') || '{}');
      if (!tokenData.accessToken) {
        throw new Error('Not connected to Payman');
      }

      const payeeResponse = await fetch('/api/createPayee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.accessToken}`,
        },
        body: JSON.stringify({ name: formData.name, address: formData.address }),
      });

      if (!payeeResponse.ok) {
        throw new Error('Failed to create Payee in Payman');
      }

      const { payeeId } = await payeeResponse.json();

      addContact({
        name: formData.name,
        birthday: formData.birthday,
        address: formData.address,
        gift: formData.selectedGift,
        payeeId: payeeId,
      });

      setFormData({
        name: '',
        birthday: '',
        address: '',
        selectedGift: null
      });
      onClose();
    } catch (error) {
      console.error(error);
      // Here you could set an error state and display it to the user
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-900">Add New Contact</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Birthday (MM-DD)</span>
            </label>
            <input
              type="text"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="MM-DD (e.g., 03-15)"
              pattern="^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Full Address</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
              placeholder="Enter complete shipping address"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Gift className="h-4 w-4" />
              <span>Select Gift</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {gifts.map(gift => (
                <div
                  key={gift.id}
                  onClick={() => setFormData(prev => ({ ...prev, selectedGift: gift }))}
                  className={`cursor-pointer border-2 rounded-2xl p-3 transition-all hover:shadow-sm ${
                    formData.selectedGift?.id === gift.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-24 object-cover rounded-xl mb-2"
                  />
                  <p className="font-medium text-gray-900 text-sm">{gift.name}</p>
                  <p className="text-gray-600 font-medium text-sm">${gift.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name || !formData.birthday || !formData.address || !formData.selectedGift}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}