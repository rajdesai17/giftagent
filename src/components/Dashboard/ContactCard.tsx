import React from 'react';
import { Calendar, MapPin, Check, Clock } from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import Card from '../ui/Card';
import { Contact, Gift } from '../../types';

interface ContactCardProps {
  contact: Contact & { gift?: Gift };
  onClick?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onClick }) => {
  const birthdayDate = new Date(contact.birthday);
  const today = new Date();
  const currentYear = today.getFullYear();
  const nextBirthday = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate());
  
  // If birthday already passed this year, use next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }
  
  const daysUntilBirthday = differenceInDays(nextBirthday, today);

  const getGiftStatus = () => {
    if (!contact.gift) return null;
    if (isPast(new Date(contact.gift.delivery_date))) {
      return { text: 'Delivered', icon: Check, color: 'text-green-600' };
    }
    return { text: 'Scheduled', icon: Clock, color: 'text-blue-600' };
  };

  const giftStatus = getGiftStatus();

  return (
    <Card hover className="p-5" onClick={onClick}>
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{contact.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>{format(birthdayDate, 'MMM d')} • <strong>{daysUntilBirthday}</strong> days</span>
              </div>
            </div>
          </div>

          {contact.gift ? (
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={contact.gift.image}
                alt={contact.gift.name}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="truncate">
                <p className="font-medium text-gray-800 truncate">{contact.gift.name}</p>
                <p className="text-sm text-gray-500">${contact.gift.price}</p>
              </div>
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
              <p className="text-sm text-gray-400">No gift scheduled</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span className="truncate">{contact.address}</span>
          </div>
          {giftStatus && (
            <div className={`flex items-center text-sm font-medium ${giftStatus.color}`}>
              <giftStatus.icon className="w-4 h-4 mr-1.5" />
              <span>{giftStatus.text}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;