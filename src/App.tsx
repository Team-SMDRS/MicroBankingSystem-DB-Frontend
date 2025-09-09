import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/authContex'; // CORRECTED: Casing
import { Toaster } from 'react-hot-toast';

// CORRECTED: All component names and file paths are now standardized
import AgentDashboardPage from './pages/agentDashboardPage';
import CustomerDetailPage from './pages/customerDetails';
import TransactionPage from './pages/transactionsPage';
import CreateFDPage from './pages/createFDPage';
import RegisterCustomerPage from './pages/cretaeAccountPage';
import TransferPage from './pages/transferPage';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<AgentDashboardPage />} />
          <Route path="/register-customer" element={<RegisterCustomerPage />} /> 

          {/* Customer-Specific Routes */}
          {/* This is the main route to view a customer's details */}
          <Route path="/customer/:customerId" element={<CustomerDetailPage />} />

          
          {/* This route is for creating an FD, which is linked to the customer */}
          <Route path="/customer/:customerId/create-fd/" element={<CreateFDPage />} />

          {/* Account-Specific Action Routes */}
          {/* These routes are for actions on a specific account belonging to a customer */}
          <Route path="/customer/:customerId/transaction/" element={<TransactionPage />} />
          <Route path="/customer/:customerId/transfer/" element={<TransferPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;