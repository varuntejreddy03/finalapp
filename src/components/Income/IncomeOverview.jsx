import React, { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../Charts/CustomBarChart';
import WeeklyChart from '../Charts/WeeklyChart';
import { prepareIncomeBarChartData } from '../../utils/helper';

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [viewMode, setViewMode] = useState('monthly'); // monthly or weekly
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);
    
    // Prepare weekly data
    const weeklyResult = prepareWeeklyIncomeData(transactions);
    setWeeklyData(weeklyResult);
    
    // Calculate total income
    const total = transactions?.reduce((sum, transaction) => sum + (Number(transaction.amount) || 0), 0) || 0;
    setTotalIncome(total);

    return () => { };
  }, [transactions]);

  const prepareWeeklyIncomeData = (data = []) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayIncome = data.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.toDateString() === date.toDateString();
      });
      
      const totalAmount = dayIncome.reduce((sum, income) => sum + income.amount, 0);
      
      last7Days.push({
        day: dayName,
        amount: totalAmount,
        date: date.toISOString().split('T')[0]
      });
    }
    
    return last7Days;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your Earnings easily • Total: ₹{totalIncome.toLocaleString()}
          </p>
        </div>

        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>

      <div className="flex items-center gap-2 mt-4 mb-2">
        <button
          onClick={() => setViewMode('monthly')}
          className={`px-3 py-1 text-sm rounded-lg ${
            viewMode === 'monthly' 
              ? 'bg-purple-100 text-purple-600' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setViewMode('weekly')}
          className={`px-3 py-1 text-sm rounded-lg ${
            viewMode === 'weekly' 
              ? 'bg-purple-100 text-purple-600' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Weekly
        </button>
      </div>

      <div className="mt-10">
        {viewMode === 'monthly' ? (
          <CustomBarChart data={chartData} />
        ) : (
          <WeeklyChart data={weeklyData} type="income" />
        )}
      </div>
    </div>
  );
};

export default IncomeOverview