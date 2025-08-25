import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';

const RecentIncome = ({ transactions, onSeeMore }) => {
  console.log('RecentIncome received transactions:', transactions);
  
  // Ensure transactions is an array
  const incomeTransactions = Array.isArray(transactions) ? transactions : [];
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Income</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {incomeTransactions.length > 0 ? (
          incomeTransactions.slice(0, 5).map((item) => (
            <TransactionInfoCard
              key={item._id}
              title={item.source}
              icon={item.icon}
              date={moment(item.date).format("Do MMM YYYY")}
              amount={item.amount}
              type="income"
              hideDeleteBtn
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No recent income</p>
            <p className="text-gray-400 text-xs mt-1">Add some income entries to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentIncome;