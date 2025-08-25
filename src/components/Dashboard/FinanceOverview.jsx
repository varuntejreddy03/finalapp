import React from 'react';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6400"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
    console.log('FinanceOverview received:', { totalBalance, totalIncome, totalExpense });
    
    // Ensure all values are numbers
    const balance = Number(totalBalance) || 0;
    const income = Number(totalIncome) || 0;
    const expense = Number(totalExpense) || 0;
    
    const balanceData = [
        { name: "Total Balance", amount: balance },
        { name: "Total Expense", amount: expense },
        { name: "Total Income", amount: income },
    ];

    console.log('FinanceOverview chart data:', balanceData);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>

            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                totalAmount={`₹${balance.toLocaleString()}`}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    );
};

export default FinanceOverview;