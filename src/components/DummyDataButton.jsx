import React, { useState } from 'react';
import { addAllDummyData, addDummyIncomeData, addDummyExpenseData } from '../utils/addDummyData';
import { LuDatabase, LuTrendingUp, LuTrendingDown } from 'react-icons/lu';

const DummyDataButton = ({ onDataAdded }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAllData = async () => {
    setIsLoading(true);
    try {
      await addAllDummyData();
      if (onDataAdded) {
        onDataAdded();
      }
    } catch (error) {
      console.error('Error adding dummy data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIncomeData = async () => {
    setIsLoading(true);
    try {
      await addDummyIncomeData();
      if (onDataAdded) {
        onDataAdded();
      }
    } catch (error) {
      console.error('Error adding income data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpenseData = async () => {
    setIsLoading(true);
    try {
      await addDummyExpenseData();
      if (onDataAdded) {
        onDataAdded();
      }
    } catch (error) {
      console.error('Error adding expense data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🧪 Testing Mode
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add dummy data to test the application features
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleAddAllData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuDatabase size={16} />
            {isLoading ? 'Adding...' : 'Add All Dummy Data'}
          </button>
          
          <button
            onClick={handleAddIncomeData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuTrendingUp size={16} />
            Income Only
          </button>
          
          <button
            onClick={handleAddExpenseData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuTrendingDown size={16} />
            Expenses Only
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          ⚠️ This will add real data to your account. Use only for testing purposes.
        </p>
      </div>
    </div>
  );
};

export default DummyDataButton;