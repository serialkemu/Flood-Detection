import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

const WaterChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/water-data');
      const result = await response.json();
      const data = result.data;

      const labels = data.map(item => new Date(item.createdAt));
      const volumes = data.map(item => item.volume);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Water Volume',
            data: volumes,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
          }
        ]
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Water Data Chart</h1>
      <Line
        data={chartData}
        options={{
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute'
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }}
      />
    </div>
  );
};

export default WaterChart;
