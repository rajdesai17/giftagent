import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { mockGifts } from '../../lib/mockGifts';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { Gift, Contact } from '../../types';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contactToEdit?: Contact & { gift?: Gift };
}

const AddContactModal: React.FC<AddContactModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  contactToEdit 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    address: ''
  });

  const isEditing = !!contactToEdit;

  // Pre-populate form when editing
  useEffect(() => {
    if (contactToEdit && isOpen) {
      setFormData({
        name: contactToEdit.name,
        email: contactToEdit.email,
        phone: contactToEdit.phone,
        birthday: contactToEdit.birthday,
        address: contactToEdit.address
      });
      
      // Set selected gift if contact has one
      if (contactToEdit.gift) {
        const giftFromMock = mockGifts.find(g => g.id === contactToEdit.gift?.id);
        setSelectedGift(giftFromMock || null);
      } else {
        setSelectedGift(null);
      }
    } else if (!contactToEdit) {
      // Reset form for new contact
      setFormData({
        name: '',
        email: '',
        phone: '',
        birthday: '',
        address: ''
      });
      setSelectedGift(null);
    }
  }, [contactToEdit, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to add contacts');
      return;
    }

    // Enhanced validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!formData.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!formData.birthday) {
      setError('Birthday is required');
      return;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contactData = {
        user_id: user.id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        birthday: formData.birthday,
        address: formData.address.trim(),
        gift_id: selectedGift?.id || null,
        gift_name: selectedGift?.name || null,
        gift_price: selectedGift?.price || null,
        gift_image: selectedGift?.image || null,
        gift_category: selectedGift?.category || null,
      };

      if (isEditing) {
        // Update existing contact
        const { error: updateError } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', contactToEdit.id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new contact
        const { error: insertError } = await supabase
          .from('contacts')
          .insert([{
            ...contactData,
            created_at: new Date().toISOString()
          }])
          .select();

        if (insertError) throw insertError;
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        birthday: '',
        address: ''
      });
      setSelectedGift(null);
      
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} contact:`, err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage || `Failed to ${isEditing ? 'update' : 'add'} contact. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <Input
                name="name"
                placeholder="Contact Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday *</label>
              <Input
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <Input
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select a Gift (Optional)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockGifts.map((gift) => (
                <div
                  key={gift.id}
                  className={`cursor-pointer rounded-lg border p-2 transition-all hover:border-blue-400 ${
                    selectedGift?.id === gift.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedGift(selectedGift?.id === gift.id ? null : gift)}
                >
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <div className="text-sm font-medium">{gift.name}</div>
                  <div className="text-sm text-gray-500">${gift.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {loading 
                ? `${isEditing ? 'Updating' : 'Adding'} Contact...` 
                : `${isEditing ? 'Update' : 'Add'} Contact`
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddContactModal; 