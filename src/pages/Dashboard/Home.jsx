import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpense from "../../components/Dashboard/Last30DaysExpense";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

// ✅ Import Chatbot
import SpendWiseBot from "../../components/Chatbot/SpendWiseBot";

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      console.log('Dashboard API Response:', response.data);
      
      // Handle different API response structures
      const data = response.data?.data || response.data;
      console.log('Processed dashboard data:', data);
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      
      // Fallback: Fetch income and expense data separately
      try {
        console.log('Fetching income and expense data separately...');
        const [incomeResponse, expenseResponse] = await Promise.all([
          axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
          axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSES)
        ]);
        
        console.log('Income Response:', incomeResponse.data);
        console.log('Expense Response:', expenseResponse.data);
        
        const incomeData = incomeResponse.data?.incomes || incomeResponse.data?.data || incomeResponse.data || [];
        const expenseData = expenseResponse.data?.expenses || expenseResponse.data?.data || expenseResponse.data || [];
        
        console.log('Processed Income Data:', incomeData);
        console.log('Processed Expense Data:', expenseData);
        
        const totalIncome = incomeData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const totalExpense = expenseData.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const totalBalance = totalIncome - totalExpense;
        
        // Create combined transactions for recent transactions
        const combinedTransactions = [
          ...incomeData.map(item => ({ ...item, type: 'income', title: item.source })),
          ...expenseData.map(item => ({ ...item, type: 'expense', title: item.category }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setDashboardData({
          totalBalance,
          totalIncome,
          totalExpense,
          recentTransactions: combinedTransactions,
          last30DaysExpense: { transactions: expenseData },
          last60DaysIncome: { transactions: incomeData },
          recentIncome: incomeData,
          recentExpenses: expenseData
        });
        
        console.log('Fallback dashboard data created successfully');
      } catch (fallbackError) {
        console.error('Fallback data fetch also failed:', fallbackError);
        setDashboardData({
          totalBalance: 0,
          totalIncome: 0,
          totalExpense: 0,
          recentTransactions: [],
          last30DaysExpense: { transactions: [] },
          last60DaysIncome: { transactions: [] },
          recentIncome: [],
          recentExpenses: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-green-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/transactions")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpense?.transactions || dashboardData?.recentExpenses || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpense
            data={dashboardData?.last30DaysExpense?.transactions || dashboardData?.recentExpenses || []}
          />

          <RecentIncomeWithChart
            data={
              dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || 
              dashboardData?.recentIncome?.slice(0, 4) || []
            }
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || dashboardData?.recentIncome || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>

        {/* ✅ Chatbot Section */}
        <div className="fixed bottom-6 right-6 w-80 z-50 shadow-xl rounded-xl border bg-white">
          <SpendWiseBot />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
