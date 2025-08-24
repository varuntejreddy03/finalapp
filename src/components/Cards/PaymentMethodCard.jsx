import React from 'react';
import { LuCreditCard, LuSmartphone } from 'react-icons/lu';

const PaymentMethodCard = ({ type, number, name, expiry, upiId }) => {
  const maskCardNumber = (number) => {
    if (!number) return '';
    return `**** **** **** ${number.slice(-4)}`;
  };

  const maskUpiId = (upiId) => {
    if (!upiId) return '';
    const [username, domain] = upiId.split('@');
    return `${username.slice(0, 2)}***@${domain}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl text-white shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {type === 'card' ? <LuCreditCard size={24} /> : <LuSmartphone size={24} />}
          <span className="text-sm font-medium">
            {type === 'card' ? 'Debit Card' : 'UPI'}
          </span>
        </div>
        <div className="text-xs opacity-75">
          {type === 'card' ? 'VISA' : 'UPI'}
        </div>
      </div>
      
      {type === 'card' ? (
        <>
          <div className="text-lg font-mono mb-4 tracking-wider">
            {maskCardNumber(number)}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-75">CARD HOLDER</div>
              <div className="text-sm font-medium">{name}</div>
            </div>
            <div>
              <div className="text-xs opacity-75">EXPIRES</div>
              <div className="text-sm font-medium">{expiry}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-lg font-mono mb-4">
            {maskUpiId(upiId)}
          </div>
          <div className="text-sm font-medium">{name}</div>
        </>
      )}
    </div>
  );
};

export default PaymentMethodCard;