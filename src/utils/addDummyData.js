import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';
import toast from 'react-hot-toast';

// Dummy Income Data
const dummyIncomeData = [
  { source: "Salary", amount: 65000, date: "2025-01-01" },
  { source: "Freelance Project", amount: 15000, date: "2025-01-12" },
  { source: "Stocks Dividends", amount: 5000, date: "2025-01-18" },
  { source: "Rental Income", amount: 12000, date: "2025-01-25" },
  { source: "Side Business", amount: 8000, date: "2025-01-28" },
  { source: "Bonus", amount: 20000, date: "2024-12-30" },
  { source: "Consulting", amount: 18000, date: "2024-12-15" },
  { source: "Investment Returns", amount: 7500, date: "2024-12-10" },
  { source: "Part-time Teaching", amount: 12000, date: "2024-12-05" },
  { source: "Online Course Sales", amount: 9500, date: "2024-11-28" },
  { source: "Affiliate Marketing", amount: 3200, date: "2024-11-20" },
  { source: "YouTube Ad Revenue", amount: 4500, date: "2024-11-15" },
  { source: "Freelance Web Design", amount: 22000, date: "2024-10-25" },
  { source: "Stock Trading Profit", amount: 8900, date: "2024-10-18" },
  { source: "Photography Gig", amount: 6000, date: "2024-10-08" },
];

// Dummy Expense Data
const dummyExpenseData = [
  { category: "Rent", amount: 18000, date: "2025-01-05" },
  { category: "Groceries", amount: 8500, date: "2025-01-07" },
  { category: "Transportation", amount: 4000, date: "2025-01-09" },
  { category: "Dining Out", amount: 3200, date: "2025-01-14" },
  { category: "Streaming & Subscriptions", amount: 1200, date: "2025-01-16" },
  { category: "Electricity Bill", amount: 2800, date: "2025-01-18" },
  { category: "Gym Membership", amount: 2000, date: "2025-01-20" },
  { category: "Mobile Bill", amount: 800, date: "2025-01-22" },
  { category: "Internet Bill", amount: 1500, date: "2025-01-24" },
  { category: "Medical", amount: 3500, date: "2025-01-26" },
  { category: "Shopping", amount: 5200, date: "2025-01-28" },
  { category: "Entertainment", amount: 2500, date: "2024-12-28" },
  { category: "Coffee & Snacks", amount: 1800, date: "2024-12-25" },
  { category: "Fuel", amount: 3000, date: "2024-12-20" },
  { category: "Insurance", amount: 4500, date: "2024-12-15" },
  { category: "Utilities", amount: 3200, date: "2024-12-10" },
  { category: "Clothing", amount: 4800, date: "2024-11-28" },
  { category: "Books & Education", amount: 2200, date: "2024-11-25" },
  { category: "Home Maintenance", amount: 6500, date: "2024-11-22" },
  { category: "Travel", amount: 12000, date: "2024-11-18" },
];

// Function to add dummy income data
export const addDummyIncomeData = async () => {
  let successCount = 0;
  let errorCount = 0;

  toast.loading('Adding sample income data...', { id: 'income-loading' });

  for (const income of dummyIncomeData) {
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source: income.source,
        amount: income.amount,
        date: income.date,
        icon: "", // Empty icon for dummy data
      });
      successCount++;
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to add income: ${income.source}`, error);
      errorCount++;
    }
  }

  toast.dismiss('income-loading');
  
  if (successCount > 0) {
    toast.success(`Successfully added ${successCount} income entries!`);
  }
  if (errorCount > 0) {
    toast.error(`Failed to add ${errorCount} income entries`);
  }

  return { successCount, errorCount };
};

// Function to add dummy expense data
export const addDummyExpenseData = async () => {
  let successCount = 0;
  let errorCount = 0;

  toast.loading('Adding sample expense data...', { id: 'expense-loading' });

  for (const expense of dummyExpenseData) {
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        icon: "", // Empty icon for dummy data
      });
      successCount++;
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to add expense: ${expense.category}`, error);
      errorCount++;
    }
  }

  toast.dismiss('expense-loading');
  
  if (successCount > 0) {
    toast.success(`Successfully added ${successCount} expense entries!`);
  }
  if (errorCount > 0) {
    toast.error(`Failed to add ${errorCount} expense entries`);
  }

  return { successCount, errorCount };
};

// Function to add all dummy data
export const addAllDummyData = async () => {
  toast.loading('Adding sample data...', { id: 'all-loading' });
  
  try {
    const incomeResult = await addDummyIncomeData();
    const expenseResult = await addDummyExpenseData();
    
    toast.dismiss('all-loading');
    
    const totalSuccess = incomeResult.successCount + expenseResult.successCount;
    const totalErrors = incomeResult.errorCount + expenseResult.errorCount;
    
    if (totalSuccess > 0) {
      toast.success(`🎉 Successfully added ${totalSuccess} sample entries! Your dashboard is ready.`);
    }
    if (totalErrors > 0) {
      toast.error(`⚠️ ${totalErrors} entries failed to add`);
    }
    
    return { totalSuccess, totalErrors };
  } catch (error) {
    toast.dismiss('all-loading');
    toast.error('Failed to add sample data');
    console.error('Error adding dummy data:', error);
  }
};