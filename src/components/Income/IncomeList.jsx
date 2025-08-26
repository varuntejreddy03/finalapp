import moment from 'moment'
import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  console.log('IncomeList transactions:', transactions);
  
  const totalIncome = Array.isArray(transactions) 
    ? transactions.reduce((sum, transaction) => {
        const amountf = Number(transaction?.amount) || 0;
        return sum + amountf;   // ✅ fixed here
      }, 0)
    : 0;
  
  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <div>
                <h5 className="text-lg">Income Source</h5>
                <p className="text-sm text-gray-500">
                  Total: ₹{totalIncome.toLocaleString()} • {Array.isArray(transactions) ? transactions.length : 0} entries
                </p>
            </div>

            <button className="card-btn" onClick={onDownload}>
                <LuDownload className="text-base" /> Download
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((income) => (
                <TransactionInfoCard
                    key={income._id}
                    title={income.source}
                    icon={income.icon}
                    date={moment(income.date).format("Do MMM YYYY")}
                    amount={income.amount}
                    type="income"
                    onDelete={() => onDelete(income._id)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500 text-sm">No income entries found</p>
                <p className="text-gray-400 text-xs mt-1">Add some income to see them here</p>
              </div>
            )}
        </div>
    </div>
  )
}

export default IncomeList
