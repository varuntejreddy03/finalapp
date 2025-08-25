import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import moment from "moment"
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Transactions</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All Transactions <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions && transactions.length > 0 ? (
          transactions.slice(0, 5).map((item) => (
            <TransactionInfoCard
              key={item._id}
              title={item.type == "expense" ? item.category : item.source}
              icon={item.icon}
              date={moment(item.date).format("DD MMM YYYY")}
              amount={item.amount}
              type={item.type}
              hideDeleteBtn
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No recent transactions</p>
            <p className="text-gray-400 text-xs mt-1">Add some income or expenses to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;