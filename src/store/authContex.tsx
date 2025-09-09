// src/store/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the agent data
interface Agent {
  agentId: string;
  name: string;
  permissions: string[];
}

// Define the shape of the context
interface AuthContextType {
  agent: Agent | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // For this example, we'll hardcode an agent.
  // In a real app, you would set this after a successful login.
  const [agent] = useState<Agent>({
    agentId: 'AGENT01',
    name: 'Anusha Kumari',
    // ⬇️ CHANGE THIS ARRAY TO TEST DIFFERENT PERMISSIONS ⬇️
    permissions: ['CAN_REGISTER_CUSTOMER','CAN_PROCESS_TRANSACTION', 'CAN_CREATE_FD'],
  });

  return (
    <AuthContext.Provider value={{ agent }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};