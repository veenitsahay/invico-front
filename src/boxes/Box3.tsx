// src/components/Box1.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StockData {
  date: string;
  close: number;
}

const Box3: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          `https://api.tiingo.com/tiingo/daily/aapl/prices?startDate=2023-01-01&endDate=2023-12-31&token=9fc1998eb0a20b3245f742ab387c310e1e87f6e7`
        );
        const data = response.data.map((item: any) => ({
          date: item.date,
          close: item.close,
        }));
        setStockData(data);
      } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
          }
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  return (
    <div className="App">
      <h4>Stock Chart</h4>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Box3;
