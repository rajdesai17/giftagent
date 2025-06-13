import React from 'react';
import { Calendar, MapPin, Trash2 } from 'lucide-react';
import { Contact } from '../context/AppContext';
import { useApp } from '../context/AppContext';

interface ContactCardProps {
  contact: Contact;
}

export default function ContactCard({ contact }: ContactCardProps) {
  const { deleteContact } = useApp();

  const formatBirthday = (birthday: string) => {
    const [month, day] = birthday.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}`;
  };

  const getNextBirthday = (birthday: string) => {
    const [month, day] = birthday.split('-');
    const currentYear = new Date().getFullYear();
    const birthdayThisYear = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    const today = new Date();
    
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(currentYear + 1);
    }
    
    const diffTime = birthdayThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today! 🎉';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-sm transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
          <div className="flex items-center space-x-2 text-gray-600 mt-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatBirthday(contact.birthday)}</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
              {getNextBirthday(contact.birthday)}
            </span>
          </div>
        </div>
        <button
          onClick={() => deleteContact(contact.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 p-2 hover:bg-red-50 rounded-xl"
          title="Delete contact"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <img
          src={contact.gift.image}
          alt={contact.gift.name}
          className="w-16 h-16 rounded-2xl object-cover"
        />
        <div>
          <p className="font-medium text-gray-900">{contact.gift.name}</p>
          <p className="text-sm text-gray-600">${contact.gift.price}</p>
        </div>
      </div>

      <div className="flex items-start space-x-2 text-gray-600">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p className="text-sm leading-relaxed">{contact.address}</p>
      </div>
    </div>
  );
}