import { useState } from "react";
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import Navigation from "../../../components/Navigation";
const AccountOpenPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    accountType: "",
    initialDeposit: "",
    idType: "",
    idNumber: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Account open data:", formData);
    setSuccess("Account opened successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
        <Navigation />
      <div className="max-w-3xl mx-auto">
        <Paper elevation={3} className="p-8">
          <Box className="flex items-center mb-6">
            <LockOpen className="text-4xl text-blue-600 mr-3" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Open New Account
            </Typography>
          </Box>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                label="Customer Name"
                variant="outlined"
                value={formData.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />

              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.accountType}
                  onChange={(e) => handleChange("accountType", e.target.value)}
                  required
                >
                  <MenuItem value="savings">Savings Account</MenuItem>
                  <MenuItem value="current">Current Account</MenuItem>
                  <MenuItem value="business">Business Account</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Initial Deposit"
                variant="outlined"
                type="number"
                value={formData.initialDeposit}
                onChange={(e) => handleChange("initialDeposit", e.target.value)}
                required
                inputProps={{ min: 100, step: 0.01 }}
              />

              <FormControl fullWidth>
                <InputLabel>ID Type</InputLabel>
                <Select
                  value={formData.idType}
                  onChange={(e) => handleChange("idType", e.target.value)}
                  required
                >
                  <MenuItem value="passport">Passport</MenuItem>
                  <MenuItem value="license">Driver's License</MenuItem>
                  <MenuItem value="national_id">National ID</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="ID Number"
                variant="outlined"
                value={formData.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                required
              />
            </div>

            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              multiline
              rows={3}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
              sx={{ bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
            >
              Open Account
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default AccountOpenPage;
