// TrendChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface TrendChartProps {
  data: number[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((_, i) => `Dia ${i + 1}`),
    datasets: [
      {
        label: 'Entregas',
        data,
        borderColor: '#FF5F6D', // utilizando a cor primary
        backgroundColor: 'rgba(255, 95, 109, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#FFFFFF' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        beginAtZero: true,
        ticks: { color: '#FFFFFF' },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#FFFFFF' },
      },
    },
  };

  return (
    <div style={{ height: '200px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;
