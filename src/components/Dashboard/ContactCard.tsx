import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
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

  return (
    <Card hover className="p-6 cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{contact.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {format(birthdayDate, 'MMM d')} • {daysUntilBirthday} days
          </div>
        </div>
      </div>

      {contact.gift && (
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={contact.gift.image_url}
            alt={contact.gift.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{contact.gift.name}</p>
            <p className="text-sm text-gray-500">${contact.gift.price}</p>
          </div>
        </div>
      )}

      <div className="flex items-center text-sm text-gray-500">
        <MapPin className="w-4 h-4 mr-1" />
        {contact.address}
      </div>
    </Card>
  );
};

export default ContactCard;