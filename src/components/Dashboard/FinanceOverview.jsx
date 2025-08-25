import React from 'react';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6400"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
    console.log('FinanceOverview received:', { totalBalance, totalIncome, totalExpense });
    
    // Ensure all values are numbers
    const balance = Number(totalBalance) || 0;
    const income = Number(totalIncome) || 0;
    const expense = Number(totalExpense) || 0;
    
    // Only show chart if we have meaningful data
    const hasData = income > 0 || expense > 0;
    
    const balanceData = [
        { name: "Total Income", amount: income },
        { name: "Total Expense", amount: expense },
        { name: "Net Balance", amount: Math.abs(balance) },
    ];
    
    // Filter out zero values for better chart display
    const filteredData = balanceData.filter(item => item.amount > 0);

    console.log('FinanceOverview chart data:', filteredData);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>

            {hasData && filteredData.length > 0 ? (
                <CustomPieChart
                    data={filteredData}
                    label="Net Balance"
                    totalAmount={`₹${balance.toLocaleString()}`}
                    colors={COLORS}
                    showTextAnchor
                />
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No financial data available</p>
                    <p className="text-gray-400 text-xs mt-1">Add some income or expenses to see the overview</p>
                </div>
            )}
        </div>
    );
};

export default FinanceOverview;