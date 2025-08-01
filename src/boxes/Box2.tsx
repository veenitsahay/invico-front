import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, ChartData, ChartOptions, PointElement, LineElement } from 'chart.js';
Chart.register(PointElement, LineElement);

interface StockDataPoint {
  time: string;
  price: number;
}

const Box2: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Meta Stock Price',
        data: [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const apiKey = 'HKT9FQJ8QU0FYVFT';
        const symbol = 'IBM'; // Meta Platforms Inc. (formerly Facebook)
        const functionType = 'TIME_SERIES_INTRADAY';
        const interval = '5min';

        const response = await axios.get(`https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`);
        const timeSeries = response.data['Time Series (5min)'];

        if (!timeSeries) {
          throw new Error('Failed to fetch stock data');
        }

        const dataPoints: StockDataPoint[] = Object.keys(timeSeries).map((time) => ({
          time,
          price: parseFloat(timeSeries[time]['1. open']),
        })).reverse();

        setChartData({
          labels: dataPoints.map((point) => point.time),
          datasets: [
            {
              label: 'IBM Stock Price',
              data: dataPoints.map((point) => point.price),
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
          }
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
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
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h2>IBM Stock Price (Intraday)</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Box2;
