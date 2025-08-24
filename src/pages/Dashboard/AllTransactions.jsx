import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { dummyIncome, dummyExpenses } from '../../utils/dummyData';
import TransactionInfoCard from '../../components/Cards/TransactionInfoCard';
import { LuDownload, LuFilter } from 'react-icons/lu';
import moment from 'moment';
// import axiosInstance from '../../utils/axiosInstance';
// import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';

const AllTransactions = () => {
  useUserAuth();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
    type: null
  });

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const incomeData = dummyIncome.map(item => ({
        ...item,
        type: 'income',
        title: item.source
      }));

      const expenseData = dummyExpenses.map(item => ({
        ...item,
        type: 'expense',
        title: item.category
      }));

      const allTransactions = [...incomeData, ...expenseData]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
      setFilteredTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.type === newFilter));
    }
  };

  const handleDeleteTransaction = async (id, type) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from local state
      const updatedTransactions = transactions.filter(t => t._id !== id);
      setTransactions(updatedTransactions);
      
      // Update filtered transactions
      handleFilterChange(filter);
      
      setOpenDeleteAlert({ show: false, data: null, type: null });
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} deleted successfully`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const handleDownloadTransactions = async () => {
    try {
      // For demo purposes, create a simple CSV download
      const csvContent = [
        ['Date', 'Type', 'Title', 'Amount'],
        ...filteredTransactions.map(t => [
          moment(t.date).format('DD/MM/YYYY'),
          t.type,
          t.title,
          t.amount
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all_transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Transactions downloaded successfully');
    } catch (error) {
      console.error('Error downloading transactions:', error);
      toast.error('Failed to download transactions');
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  return (
    <DashboardLayout activeMenu="Transactions">
      <div className="my-5 mx-auto">
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
              <p className="text-gray-600">
                {filteredTransactions.length} transactions found
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    filter === 'all' 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('income')}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    filter === 'income' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => handleFilterChange('expense')}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    filter === 'expense' 
                      ? 'bg-white text-red-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Expenses
                </button>
              </div>

              <button 
                onClick={handleDownloadTransactions}
                className="card-btn"
              >
                <LuDownload className="text-base" /> Download
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading transactions...</div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No transactions found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredTransactions.map((transaction) => (
                <TransactionInfoCard
                  key={`${transaction._id}-${transaction.type}`}
                  title={transaction.title}
                  icon={transaction.icon}
                  date={moment(transaction.date).format("Do MMM YYYY")}
                  amount={transaction.amount}
                  type={transaction.type}
                  onDelete={() => setOpenDeleteAlert({ 
                    show: true, 
                    data: transaction._id, 
                    type: transaction.type 
                  })}
                />
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null, type: null })}
          title="Delete Transaction"
        >
          <DeleteAlert
            content="Are you sure you want to delete this transaction? This action cannot be undone."
            onDelete={() => handleDeleteTransaction(openDeleteAlert.data, openDeleteAlert.type)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AllTransactions;