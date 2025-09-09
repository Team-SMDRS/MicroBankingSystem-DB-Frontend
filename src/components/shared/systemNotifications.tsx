// src/components/shared/SystemNotifications.tsx
import React from 'react';
import { mockNotifications } from '../../api/testData';
import { FaBell } from 'react-icons/fa';

const SystemNotifications: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">System Notifications</h3>
      <ul className="space-y-3">
        {mockNotifications.map(n => (
          <li key={n.id} className="flex items-start space-x-3 text-sm">
            <FaBell className="text-blue-500 mt-1 flex-shrink-0"/>
            <span>{n.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemNotifications;