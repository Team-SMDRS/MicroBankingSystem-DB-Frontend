// src/components/shared/DailyPerformanceChart.tsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../store/authContex';
import { mockTransactions } from '../../api/testData';

const DailyPerformanceChart: React.FC = () => {
  const { agent } = useAuth();

  const chartData = useMemo(() => {
    const today = new Date().toDateString();
    const agentTransactionsToday = mockTransactions.filter(t => 
        t.agentId === agent?.agentId && new Date(t.timestamp).toDateString() === today
    );

    const performance = agentTransactionsToday.reduce((acc, t) => {
        if (t.type === 'Deposit') acc.deposits += t.amount;
        if (t.type === 'Withdrawal') acc.withdrawals += t.amount;
        return acc;
    }, { deposits: 0, withdrawals: 0 });

    return [performance];
  }, [agent]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Today's Performance</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis dataKey="name" tick={false} />
          <YAxis tickFormatter={(value) => `LKR ${value/1000}k`} />
          <Tooltip formatter={(value: number) => `LKR ${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="deposits" fill="#10B981" name="Deposits" />
          <Bar dataKey="withdrawals" fill="#EF4444" name="Withdrawals" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyPerformanceChart;