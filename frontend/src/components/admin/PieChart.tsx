import  { useEffect, useState } from 'react';
import { Pie} from 'react-chartjs-2';
import { fetchCourseStatusCounts } from '@/api/adminApi';
import { ChartData } from 'chart.js';


const PieChart = () => {
    // Initialize with a structure matching ChartData<'pie'>
    const [data, setData] = useState<ChartData<'pie'>>({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#4caf50', '#ff9800', '#f44336'], // Colors for approved, pending, rejected
        },
      ],
    });
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetchCourseStatusCounts();
        const statusCounts = response.result;
  
        setData({
          labels: Object.keys(statusCounts),
          datasets: [
            {
              data: Object.values(statusCounts),
              backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            },
          ],
        });
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <h3>Course Status Distribution</h3>
        <Pie data={data} />
      </div>
    );
  };
  
  export default PieChart;