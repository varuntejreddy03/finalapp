import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomeLineChart from '../Charts/CustomeLineChart';
import WeeklyChart from '../Charts/WeeklyChart';

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
    const [chartData, setChartData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [viewMode, setViewMode] = useState('monthly'); // monthly or weekly
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);
        
        // Prepare weekly data
        const weeklyResult = prepareWeeklyExpenseData(transactions);
        setWeeklyData(weeklyResult);
        
        // Calculate total expense
        const total = transactions?.reduce((sum, transaction) => sum + (Number(transaction.amount) || 0), 0) || 0;
        setTotalExpense(total);

        return () => { };
    }, [transactions]);

    const prepareWeeklyExpenseData = (data = []) => {
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const dayExpenses = data.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.toDateString() === date.toDateString();
            });
            
            const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            
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
                    <h5 className="text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">

                        Track your Expenses easily and effectively • Total: ₹{totalExpense.toLocaleString()}
                    </p>
                </div>

                <button className="add-btn" onClick={onExpenseIncome}>
                    <LuPlus className="text-lg" />
                    Add Expense
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
                    <CustomeLineChart data={chartData} />
                ) : (
                    <WeeklyChart data={weeklyData} type="expense" />
                )}
            </div>
        </div>
    )
}

export default ExpenseOverview