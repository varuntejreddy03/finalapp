import React, { useEffect, useState } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpense = ({ data }) => {
  console.log('Last30DaysExpense received data:', data);
  
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Ensure data is an array
    const expenseData = Array.isArray(data) ? data : [];
    console.log('Processing expense data:', expenseData);
    
    const result = prepareExpenseBarChartData(expenseData);
    console.log('Chart data result:', result);
    setChartData(result);
  }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>

      {Array.isArray(chartData) && chartData.length > 0 ? (
        <CustomBarChart data={chartData} />
      ) : (
        <div className="text-center py-8 mt-6">
          <p className="text-gray-500 text-sm">No expense data available</p>
          <p className="text-gray-400 text-xs mt-1">Add some expenses to see the chart</p>
        </div>
      )}
    </div>
  )
}

export default Last30DaysExpense