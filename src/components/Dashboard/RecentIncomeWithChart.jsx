import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4F39F6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
    console.log('RecentIncomeWithChart received data:', data);
    console.log('RecentIncomeWithChart received totalIncome:', totalIncome);
    
    const [chartData, setChartData] = useState([]);

    const prepareChartData = () => {
        // Ensure data is an array
        const incomeData = Array.isArray(data) ? data : [];
        console.log('Processing income chart data:', incomeData);
        
        const dataArr = incomeData.map((item) => ({
            name: item?.source || 'Unknown Source',
            amount: Number(item?.amount) || 0
        }));

        console.log('Prepared chart data:', dataArr);
        setChartData(dataArr);
    };

    useEffect(() => {
        prepareChartData();
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
                    totalAmount={`₹${Number(totalIncome || 0).toLocaleString()}`}
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