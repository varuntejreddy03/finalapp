import moment from 'moment'
import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const ExpenseList = ({ transactions, onDelete, onDownload}) => {
  console.log('ExpenseList transactions:', transactions);
  
  const totalExpense = Array.isArray(transactions) 
    ? transactions.reduce((sum, transaction) => {
        const amount = Number(transaction?.amount) || 0;
        return sum + amount;
      }, 0)
    : 0;
  
  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <div>
                <h5 className="text-lg">All Expenses</h5>
                <p className="text-sm text-gray-500">Total: ₹{totalExpense.toLocaleString()} • {Array.isArray(transactions) ? transactions.length : 0} entries</p>
            </div>

            <button className="card-btn" onClick={onDownload}>
                <LuDownload className="text-base" /> Download
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((expense) => (
                <TransactionInfoCard
                    key={expense._id}
                    title={expense.category}
                    icon={expense.icon}
                    date={moment(expense.date).format("Do MMM YYYY")}
                    amount={expense.amount}
                    type="expense"
                    onDelete={() => onDelete(expense._id)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500 text-sm">No expense entries found</p>
                <p className="text-gray-400 text-xs mt-1">Add some expenses to see them here</p>
              </div>
            )}
        </div>
    </div>
  )
}

export default ExpenseList