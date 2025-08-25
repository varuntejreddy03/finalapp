import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4F39F6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {

    const [chartData, setChartData] = useState([]);

    const prepareChartData = () => {
        console.log('RecentIncomeWithChart data:', data);
        const dataArr = Array.isArray(data) ? data.map((item) => ({
            name: item?.source,
            amount: item?.amount
        })) : [];

        setChartData(dataArr);
    };

    useEffect(() => {
        prepareChartData();

        return () => {};
    }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Income</h5>
      </div>

      {Array.isArray(chartData) && chartData.length > 0 ? (
        <CustomPieChart
          data={chartData}
          label="Total Income"
          totalAmount={`₹${totalIncome || 0}`}
          colors={COLORS}
          showTextAnchor
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No income data available</p>
          <p className="text-gray-400 text-xs mt-1">Add some income to see the chart</p>
        </div>
      )}
    </div>
  )
}

export default RecentIncomeWithChart