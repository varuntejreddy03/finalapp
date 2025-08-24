import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import CharAvatar from '../Cards/CharAvatar';
import PaymentMethodCard from '../Cards/PaymentMethodCard';
import { LuPencil, LuPlus } from 'react-icons/lu';

const ProfileView = ({ onEditProfile }) => {
  const { user } = useContext(UserContext);
  
  // Dummy payment methods for demo
  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      number: '1234567890123456',
      name: user?.firstName + ' ' + user?.lastName || 'John Doe',
      expiry: '12/26'
    },
    {
      id: 2,
      type: 'upi',
      upiId: `${user?.firstName?.toLowerCase() || 'john'}.${user?.lastName?.toLowerCase() || 'doe'}@paytm`,
      name: user?.firstName + ' ' + user?.lastName || 'John Doe'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <CharAvatar
                fullName={`${user?.firstName || ''} ${user?.lastName || ''}`}
                width="w-20"
                height="h-20"
                style="text-xl"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{user?.phone}</p>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
          >
            <LuPencil size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
            <LuPlus size={16} />
            Add Method
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.id} {...method} />
          ))}
        </div>
      </div>

      {/* Account Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-600">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-600">Income Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">67</div>
            <div className="text-sm text-gray-600">Expense Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Active Goals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;