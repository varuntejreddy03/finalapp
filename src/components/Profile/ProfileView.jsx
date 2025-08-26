import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import CharAvatar from '../Cards/CharAvatar';
import PaymentMethodCard from '../Cards/PaymentMethodCard';
import { LuPencil, LuPlus, LuTrendingUp, LuTrendingDown, LuTarget, LuCalendar } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const ProfileView = ({ onEditProfile }) => {
  const { user } = useContext(UserContext);
  const [profileStats, setProfileStats] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    activeGoals: 0,
    incomeEntries: 0,
    expenseEntries: 0,
    currentMonthIncome: 0,
    currentMonthExpenses: 0,
    savingsRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Dummy payment methods for demo (in real app, fetch from API)
  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      number: '1234567890123456',
      name: `${user?.firstName || 'John'} ${user?.lastName || 'Doe'}`,
      expiry: '12/26'
    },
    {
      id: 2,
      type: 'upi',
      upiId: `${user?.firstName?.toLowerCase() || 'john'}.${user?.lastName?.toLowerCase() || 'doe'}@paytm`,
      name: `${user?.firstName || 'John'} ${user?.lastName || 'Doe'}`
    }
  ]);

  // Fetch profile statistics from API
  const fetchProfileStats = async () => {
    setLoading(true);
    try {
      // Fetch income and expense data to calculate stats
      const [incomeResponse, expenseResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSES)
      ]);

      const incomeData = incomeResponse.data?.incomes || incomeResponse.data?.data || incomeResponse.data || [];
      const expenseData = expenseResponse.data?.expenses || expenseResponse.data?.data || expenseResponse.data || [];

      // Calculate statistics
      const totalIncome = incomeData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const totalExpenses = expenseData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const totalTransactions = incomeData.length + expenseData.length;

      // Calculate current month data
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthIncome = incomeData
        .filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        })
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      const currentMonthExpenses = expenseData
        .filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        })
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

      setProfileStats({
        totalTransactions,
        totalIncome,
        totalExpenses,
        activeGoals: 3, // This would come from goals API
        incomeEntries: incomeData.length,
        expenseEntries: expenseData.length,
        currentMonthIncome,
        currentMonthExpenses,
        savingsRate: Math.max(0, savingsRate)
      });

    } catch (error) {
      console.error('Error fetching profile stats:', error);
      toast.error('Failed to load profile statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileStats();
  }, []);

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.profileImageUrl && !imageError ? (
              <div className="relative">
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
                {loading && (
                  <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                )}
              </div>
            ) : (
              <CharAvatar
                fullName={`${user?.firstName || ''} ${user?.lastName || ''}`}
                width="w-20"
                height="h-20"
                style="text-xl border-2 border-purple-200"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{user?.phone}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Active Member
                </span>
                <span className="text-xs text-gray-500">
                  Joined {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <LuPencil size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <LuTrendingUp className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Total Income</p>
              <p className="text-xl font-bold text-green-700">₹{profileStats.totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-red-50 to-red-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <LuTrendingDown className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Total Expenses</p>
              <p className="text-xl font-bold text-red-700">₹{profileStats.totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <LuTarget className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Savings Rate</p>
              <p className="text-xl font-bold text-blue-700">{profileStats.savingsRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <LuCalendar className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">This Month</p>
              <p className="text-xl font-bold text-purple-700">
                ₹{(profileStats.currentMonthIncome - profileStats.currentMonthExpenses).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
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

      {/* Account Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profileStats.totalTransactions}</div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profileStats.incomeEntries}</div>
              <div className="text-sm text-gray-600">Income Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{profileStats.expenseEntries}</div>
              <div className="text-sm text-gray-600">Expense Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profileStats.activeGoals}</div>
              <div className="text-sm text-gray-600">Active Goals</div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">This Month's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-green-700 font-medium mb-2">Income This Month</h4>
            <p className="text-2xl font-bold text-green-600">₹{profileStats.currentMonthIncome.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-red-700 font-medium mb-2">Expenses This Month</h4>
            <p className="text-2xl font-bold text-red-600">₹{profileStats.currentMonthExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;