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
import { TrendingUp } from "@mui/icons-material";
import Navigation from "../../../components/Navigation";
const DepositPage = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    amount: "",
    depositType: "",
    remarks: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Deposit data:", formData);
    setSuccess("Deposit processed successfully!");
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
            <TrendingUp className="text-4xl text-green-600 mr-3" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Money Deposit
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
              label="Amount"
              variant="outlined"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
              inputProps={{ min: 1, step: 0.01 }}
            />

            <FormControl fullWidth>
              <InputLabel>Deposit Type</InputLabel>
              <Select
                value={formData.depositType}
                onChange={(e) => handleChange("depositType", e.target.value)}
                required
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="check">Check</MenuItem>
                <MenuItem value="transfer">Bank Transfer</MenuItem>
                <MenuItem value="online">Online Transfer</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Remarks (Optional)"
              variant="outlined"
              multiline
              rows={3}
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="bg-green-600 hover:bg-green-700"
              sx={{ bgcolor: 'green.600', '&:hover': { bgcolor: 'green.700' } }}
            >
              Process Deposit
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default DepositPage;
