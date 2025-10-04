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
import { AccountBalance } from "@mui/icons-material";
import Navigation from "../../../components/Navigation";

const FDCreatePage = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    amount: "",
    tenure: "",
    interestRate: "",
    maturityInstructions: "",
    nomineeDetails: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FD Create data:", formData);
    setSuccess("Fixed Deposit created successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
        <Navigation />
      <div className="max-w-2xl mx-auto">
        <Paper elevation={3} className="p-8">
          <Box className="flex items-center mb-6">
            <AccountBalance className="text-4xl text-teal-600 mr-3" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Create Fixed Deposit
            </Typography>
          </Box>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              label="Account Number"
              variant="outlined"
              value={formData.accountNumber}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="FD Amount"
              variant="outlined"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
              inputProps={{ min: 1000, step: 0.01 }}
              helperText="Minimum amount: $1,000"
            />

            <FormControl fullWidth>
              <InputLabel>Tenure</InputLabel>
              <Select
                value={formData.tenure}
                onChange={(e) => handleChange("tenure", e.target.value)}
                required
              >
                <MenuItem value="6months">6 Months</MenuItem>
                <MenuItem value="1year">1 Year</MenuItem>
                <MenuItem value="2years">2 Years</MenuItem>
                <MenuItem value="3years">3 Years</MenuItem>
                <MenuItem value="5years">5 Years</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Interest Rate (%)"
              variant="outlined"
              type="number"
              value={formData.interestRate}
              onChange={(e) => handleChange("interestRate", e.target.value)}
              required
              inputProps={{ min: 0, max: 20, step: 0.1 }}
              helperText="Current rates: 6 months - 4.5%, 1 year - 5.2%, 2+ years - 6.1%"
            />

            <FormControl fullWidth>
              <InputLabel>Maturity Instructions</InputLabel>
              <Select
                value={formData.maturityInstructions}
                onChange={(e) => handleChange("maturityInstructions", e.target.value)}
                required
              >
                <MenuItem value="auto_renew">Auto Renew</MenuItem>
                <MenuItem value="transfer_savings">Transfer to Savings</MenuItem>
                <MenuItem value="transfer_current">Transfer to Current</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Nominee Details"
              variant="outlined"
              multiline
              rows={3}
              value={formData.nomineeDetails}
              onChange={(e) => handleChange("nomineeDetails", e.target.value)}
              helperText="Enter nominee name and relationship"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="bg-teal-600 hover:bg-teal-700"
              sx={{ bgcolor: 'teal.600', '&:hover': { bgcolor: 'teal.700' } }}
            >
              Create Fixed Deposit
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default FDCreatePage;
