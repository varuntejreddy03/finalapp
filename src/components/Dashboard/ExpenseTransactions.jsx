import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
    console.log('ExpenseTransactions received transactions:', transactions);
    
    // Ensure transactions is an array and has valid data
    let expenseTransactions = [];
    
    if (Array.isArray(transactions)) {
        expenseTransactions = transactions;
    } else if (transactions && typeof transactions === 'object') {
        // Handle case where transactions might be an object with a transactions property
        expenseTransactions = Array.isArray(transactions.transactions) ? transactions.transactions : [];
    }
    
    console.log('Processed expense transactions:', expenseTransactions);
    
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Expenses</h5>

                <button className="card-btn" onClick={onSeeMore}>
                    See All <LuArrowRight className="text-base" />
                </button>
            </div>

            <div className="mt-6">
                {expenseTransactions.length > 0 ? (
                    expenseTransactions.slice(0, 4).map((expense) => (
                        <TransactionInfoCard
                            key={expense._id}
                            title={expense.category}
                            icon={expense.icon}
                            date={moment(expense.date).format("Do MMM YYYY")}
                            amount={Number(expense.amount) || 0}
                            type="expense"
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No recent expenses</p>
                        <p className="text-gray-400 text-xs mt-1">Add some expense entries to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseTransactions