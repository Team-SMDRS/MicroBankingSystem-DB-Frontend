// src/components/shared/WeeklyVolumeChart.tsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../store/authContex';
import { mockTransactions } from '../../api/testData';

const WeeklyVolumeChart: React.FC = () => {
  const { agent } = useAuth();

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    return last7Days.map(date => {
      const transactionsOnDate = mockTransactions.filter(t => 
        t.agentId === agent?.agentId && new Date(t.timestamp).toDateString() === date.toDateString()
      );
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        transactions: transactionsOnDate.length
      };
    });
  }, [agent]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Weekly Transaction Volume</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="transactions" stroke="#3B82F6" strokeWidth={2} name="Transactions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyVolumeChart;