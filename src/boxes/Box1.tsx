import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, Chart, ChartData, ChartOptions, LinearScale, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement);

interface BarChartProps {
    data: ChartData<'bar'>;
    options?: ChartOptions<'bar'>;
  }
  
  const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
    return (
      <>
        <Bar data={data} options={options} />
      </>
    );
  };
  
const Box1: React.FC = () => {
    const data: ChartData<'bar'> = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Statistics',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.6)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: [75, 59, 80, 81, 56, 55, 40],
          },
        ],
      };
    
      const options: ChartOptions<'bar'> = {
        responsive: false,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      };
    
      return (
        <><div style={{ width: '100%', margin: '10' }}>
              <BarChart data={data} options={options} />
          </div></>        
      );
    };
    
export default Box1;
