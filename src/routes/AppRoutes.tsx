import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../features/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";

// Banking Operations
import WithdrawalPage from "../features/banking/withdrawal/WithdrawalPage";
import DepositPage from "../features/banking/deposit/DepositPage";
import AccountOpenPage from "../features/banking/account-management/AccountOpenPage";
import AccountClosePage from "../features/banking/account-management/AccountClosePage";
import TransactionPage from "../features/banking/transactions/TransactionPage";
import FDCreatePage from "../features/banking/fixed-deposit/FDCreatePage";
import FDClosePage from "../features/banking/fixed-deposit/FDClosePage";
import CustomerCreatePage from "../features/customer-management/CustomerCreatePage";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
        
        {/* Banking Operations */}
        <Route path="/withdrawal" element={<WithdrawalPage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/account/open" element={<AccountOpenPage />} />
        <Route path="/account/close" element={<AccountClosePage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/fd/create" element={<FDCreatePage />} />
        <Route path="/fd/close" element={<FDClosePage />} />
        <Route path="/customer/create" element={<CustomerCreatePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
