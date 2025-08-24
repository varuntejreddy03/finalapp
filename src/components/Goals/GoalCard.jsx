import React from 'react';
import { LuTarget, LuCalendar, LuTrendingUp } from 'react-icons/lu';

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const progressPercentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <LuTarget className="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
            <p className="text-sm text-gray-500">{goal.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500 mb-1">Current</div>
          <div className="font-semibold">₹{goal.currentAmount.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500 mb-1">Target</div>
          <div className="font-semibold">₹{goal.targetAmount.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500 mb-1">Remaining</div>
          <div className="font-semibold text-orange-600">₹{remainingAmount.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500 mb-1">Days Left</div>
          <div className={`font-semibold ${daysLeft < 30 ? 'text-red-600' : 'text-green-600'}`}>
            {daysLeft > 0 ? daysLeft : 'Overdue'}
          </div>
        </div>
      </div>

      {daysLeft > 0 && remainingAmount > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <LuTrendingUp size={16} />
            <span className="text-sm font-medium">
              Save ₹{Math.ceil(remainingAmount / daysLeft)} per day to reach your goal
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;