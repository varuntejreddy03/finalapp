import React, { useState, useEffect } from 'react';
import { LuPlus, LuCreditCard, LuSmartphone, LuTrash2, LuEdit } from 'react-icons/lu';
import Modal from '../Modal';
import Input from '../Inputs/Input';
import toast from 'react-hot-toast';

const PaymentMethodManager = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodType, setMethodType] = useState('card');
  const [selectedEmoji, setSelectedEmoji] = useState('1f4b3'); // Default credit card emoji
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });

  // Popular emoji codes for payment methods
  const emojiOptions = [
    { code: '1f4b3', name: 'Credit Card' },
    { code: '1f4b0', name: 'Money Bag' },
    { code: '1f4b1', name: 'Currency Exchange' },
    { code: '1f4b5', name: 'Dollar Banknote' },
    { code: '1f4b8', name: 'Money with Wings' },
    { code: '1f4bc', name: 'Briefcase' },
    { code: '1f3e6', name: 'Bank' },
    { code: '1f4f1', name: 'Mobile Phone' },
    { code: '2728', name: 'Sparkles' },
    { code: '1f31f', name: 'Glowing Star' }
  ];

  // Load payment methods from localStorage on component mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = () => {
    setLoading(true);
    try {
      const savedMethods = localStorage.getItem('paymentMethods');
      if (savedMethods) {
        const methods = JSON.parse(savedMethods);
        setPaymentMethods(methods);
      } else {
        // Initialize with empty array
        setPaymentMethods([]);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setPaymentMethods([]);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (methods) => {
    try {
      localStorage.setItem('paymentMethods', JSON.stringify(methods));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast.error('Failed to save payment methods');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      expiry: '',
      cvv: '',
      upiId: ''
    });
    setMethodType('card');
    setSelectedEmoji('1f4b3');
    setEditingMethod(null);
  };

  const handleAddMethod = () => {
    setShowAddModal(true);
    resetForm();
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setMethodType(method.type);
    setSelectedEmoji(method.emoji || '1f4b3');
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
    try {
      const updatedMethods = paymentMethods.filter(method => method.id !== id);
      setPaymentMethods(updatedMethods);
      saveToLocalStorage(updatedMethods);
      toast.success('Payment method deleted successfully');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }

    if (methodType === 'card') {
      if (!formData.number || formData.number.replace(/\s/g, '').length < 16) {
        toast.error('Valid 16-digit card number is required');
        return false;
      }
      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        toast.error('Valid expiry date (MM/YY) is required');
        return false;
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        toast.error('Valid CVV is required');
        return false;
      }
    } else {
      if (!formData.upiId || !formData.upiId.includes('@')) {
        toast.error('Valid UPI ID is required');
        return false;
      }
    }
    return true;
  };

  const handleSaveMethod = () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newMethod = {
        id: editingMethod ? editingMethod.id : Date.now().toString(),
        type: methodType,
        name: formData.name.trim(),
        emoji: selectedEmoji,
        ...(methodType === 'card' ? {
          number: formData.number.replace(/\s/g, ''),
          expiry: formData.expiry,
          cvv: formData.cvv
        } : {
          upiId: formData.upiId.toLowerCase()
        }),
        createdAt: editingMethod ? editingMethod.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedMethods;
      if (editingMethod) {
        updatedMethods = paymentMethods.map(method => 
          method.id === editingMethod.id ? newMethod : method
        );
        toast.success('Payment method updated successfully');
      } else {
        updatedMethods = [...paymentMethods, newMethod];
        toast.success('Payment method added successfully');
      }

      setPaymentMethods(updatedMethods);
      saveToLocalStorage(updatedMethods);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Failed to save payment method');
    } finally {
      setLoading(false);
    }
  };

  const maskCardNumber = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  const maskUpiId = (upiId) => {
    if (!upiId) return '';
    const [username, domain] = upiId.split('@');
    if (!username || !domain) return upiId;
    return `${username.slice(0, 2)}***@${domain}`;
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const getEmojiUrl = (emojiCode) => {
    return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emojiCode}.png`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <p className="text-sm text-gray-500">Manage your cards and UPI accounts (stored locally)</p>
        </div>
        <button 
          onClick={handleAddMethod}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <LuPlus size={16} />
          Add Method
        </button>
      </div>
      
      {loading && paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500">Loading payment methods...</p>
        </div>
      ) : paymentMethods.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <LuCreditCard className="mx-auto text-4xl text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Payment Methods</h4>
          <p className="text-gray-500 mb-4">Add your first payment method to get started</p>
          <button 
            onClick={handleAddMethod}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Payment Method
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl text-white shadow-lg relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={getEmojiUrl(method.emoji || '1f4b3')} 
                    alt="Payment method icon"
                    className="w-8 h-8"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  {method.type === 'card' ? <LuCreditCard size={24} style={{display: 'none'}} /> : <LuSmartphone size={24} style={{display: 'none'}} />}
                  <div>
                    <span className="text-sm font-medium">
                      {method.type === 'card' ? 'Card' : 'UPI'}
                    </span>
                    <div className="text-xs opacity-75">
                      {method.type === 'card' ? 'VISA/MASTERCARD' : 'UPI Payment'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditMethod(method)}
                    className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                    title="Edit"
                  >
                    <LuEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                    title="Delete"
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
      )}

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
          {/* Emoji Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Choose Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji.code}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji.code)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    selectedEmoji === emoji.code 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={emoji.name}
                >
                  <img 
                    src={getEmojiUrl(emoji.code)} 
                    alt={emoji.name}
                    className="w-8 h-8 mx-auto"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Method Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMethodType('card')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  methodType === 'card' 
                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LuCreditCard size={16} />
                Card
              </button>
              <button
                type="button"
                onClick={() => setMethodType('upi')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  methodType === 'upi' 
                    ? 'bg-purple-50 border-purple-200 text-purple-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
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
            label="Account Holder Name *"
            placeholder="John Doe"
            type="text"
          />

          {methodType === 'card' ? (
            <>
              <Input
                value={formData.number}
                onChange={({ target }) => {
                  const formatted = formatCardNumber(target.value);
                  setFormData(prev => ({ ...prev, number: formatted }));
                }}
                label="Card Number *"
                placeholder="1234 5678 9012 3456"
                type="text"
                maxLength="19"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={formData.expiry}
                  onChange={({ target }) => {
                    let value = target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setFormData(prev => ({ ...prev, expiry: value }));
                  }}
                  label="Expiry Date *"
                  placeholder="MM/YY"
                  type="text"
                  maxLength="5"
                />
                <Input
                  value={formData.cvv}
                  onChange={({ target }) => {
                    const value = target.value.replace(/\D/g, '').slice(0, 3);
                    setFormData(prev => ({ ...prev, cvv: value }));
                  }}
                  label="CVV *"
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
              label="UPI ID *"
              placeholder="username@paytm"
              type="text"
            />
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              disabled={loading}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveMethod}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                `${editingMethod ? 'Update' : 'Add'} Method`
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Local Storage Note:</p>
            <p>Your payment information is stored locally in your browser and masked for display. Data persists until you clear browser data.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentMethodManager;