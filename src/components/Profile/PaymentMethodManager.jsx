import React, { useState } from 'react';
import { LuPlus, LuCreditCard, LuSmartphone, LuTrash2, LuPencil } from 'react-icons/lu';
import Modal from '../Modal';
import Input from '../Inputs/Input';
import toast from 'react-hot-toast';

const PaymentMethodManager = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      number: '1234567890123456',
      name: 'John Doe',
      expiry: '12/26',
      cvv: '123'
    },
    {
      id: 2,
      type: 'upi',
      upiId: 'john.doe@paytm',
      name: 'John Doe'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodType, setMethodType] = useState('card');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      expiry: '',
      cvv: '',
      upiId: ''
    });
    setMethodType('card');
    setEditingMethod(null);
  };

  const handleAddMethod = () => {
    setShowAddModal(true);
    resetForm();
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setMethodType(method.type);
    setFormData({
      name: method.name || '',
      number: method.number || '',
      expiry: method.expiry || '',
      cvv: method.cvv || '',
      upiId: method.upiId || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteMethod = (id) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    toast.success('Payment method deleted successfully');
  };

  const handleSaveMethod = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (methodType === 'card') {
      if (!formData.number || formData.number.length < 16) {
        toast.error('Valid card number is required');
        return;
      }
      if (!formData.expiry || !formData.cvv) {
        toast.error('Expiry date and CVV are required');
        return;
      }
    } else {
      if (!formData.upiId || !formData.upiId.includes('@')) {
        toast.error('Valid UPI ID is required');
        return;
      }
    }

    const newMethod = {
      id: editingMethod ? editingMethod.id : Date.now(),
      type: methodType,
      name: formData.name,
      ...(methodType === 'card' ? {
        number: formData.number,
        expiry: formData.expiry,
        cvv: formData.cvv
      } : {
        upiId: formData.upiId
      })
    };

    if (editingMethod) {
      setPaymentMethods(prev => 
        prev.map(method => method.id === editingMethod.id ? newMethod : method)
      );
      toast.success('Payment method updated successfully');
    } else {
      setPaymentMethods(prev => [...prev, newMethod]);
      toast.success('Payment method added successfully');
    }

    setShowAddModal(false);
    resetForm();
  };

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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        <button 
          onClick={handleAddMethod}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <LuPlus size={16} />
          Add Method
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl text-white shadow-lg relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                {method.type === 'card' ? <LuCreditCard size={24} /> : <LuSmartphone size={24} />}
                <span className="text-sm font-medium">
                  {method.type === 'card' ? 'Debit Card' : 'UPI'}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditMethod(method)}
                  className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30"
                >
                  <LuPencil size={14} />
                </button>
                <button
                  onClick={() => handleDeleteMethod(method.id)}
                  className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30"
                >
                  <LuTrash2 size={14} />
                </button>
              </div>
            </div>
            
            {method.type === 'card' ? (
              <>
                <div className="text-lg font-mono mb-4 tracking-wider">
                  {maskCardNumber(method.number)}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-75">CARD HOLDER</div>
                    <div className="text-sm font-medium">{method.name}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">EXPIRES</div>
                    <div className="text-sm font-medium">{method.expiry}</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-mono mb-4">
                  {maskUpiId(method.upiId)}
                </div>
                <div className="text-sm font-medium">{method.name}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Payment Method Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
      >
        <div className="space-y-4">
          {/* Method Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMethodType('card')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  methodType === 'card' 
                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <LuCreditCard size={16} />
                Card
              </button>
              <button
                type="button"
                onClick={() => setMethodType('upi')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  methodType === 'upi' 
                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <LuSmartphone size={16} />
                UPI
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <Input
            value={formData.name}
            onChange={({ target }) => setFormData(prev => ({ ...prev, name: target.value }))}
            label="Cardholder/Account Name"
            placeholder="John Doe"
            type="text"
          />

          {methodType === 'card' ? (
            <>
              <Input
                value={formData.number}
                onChange={({ target }) => setFormData(prev => ({ ...prev, number: target.value }))}
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                type="text"
                maxLength="16"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={formData.expiry}
                  onChange={({ target }) => setFormData(prev => ({ ...prev, expiry: target.value }))}
                  label="Expiry Date"
                  placeholder="MM/YY"
                  type="text"
                />
                <Input
                  value={formData.cvv}
                  onChange={({ target }) => setFormData(prev => ({ ...prev, cvv: target.value }))}
                  label="CVV"
                  placeholder="123"
                  type="text"
                  maxLength="3"
                />
              </div>
            </>
          ) : (
            <Input
              value={formData.upiId}
              onChange={({ target }) => setFormData(prev => ({ ...prev, upiId: target.value }))}
              label="UPI ID"
              placeholder="username@paytm"
              type="text"
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveMethod}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {editingMethod ? 'Update' : 'Add'} Method
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentMethodManager;
