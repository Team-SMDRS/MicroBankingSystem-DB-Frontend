import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../features/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
