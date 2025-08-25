import React, { useEffect, useState } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpense = ({data}) => {

  const [charData, setCharData] = useState([]);

  useEffect(() => {
    console.log('Last30DaysExpense data:', data);
    const result = prepareExpenseBarChartData(Array.isArray(data) ? data : []);
    setCharData(result);

    return () => {};
  }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>

      {Array.isArray(charData) && charData.length > 0 ? (
        <CustomBarChart data={charData} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No expense data available</p>
          <p className="text-gray-400 text-xs mt-1">Add some expenses to see the chart</p>
        </div>
      )}
    </div>
  )
}

export default Last30DaysExpense