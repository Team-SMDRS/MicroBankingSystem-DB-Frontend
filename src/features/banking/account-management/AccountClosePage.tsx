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
import { Lock } from "@mui/icons-material";
import Navigation from "../../../components/Navigation";
const AccountClosePage = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    reason: "",
    confirmationCode: "",
    remarks: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Account close data:", formData);
    setSuccess("Account closure initiated successfully!");
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
            <Lock className="text-4xl text-orange-600 mr-3" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Close Account
            </Typography>
          </Box>

          <Alert severity="warning" className="mb-6">
            Account closure is irreversible. Please ensure all pending transactions are completed.
          </Alert>

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

            <FormControl fullWidth>
              <InputLabel>Reason for Closure</InputLabel>
              <Select
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                required
              >
                <MenuItem value="no_longer_needed">No Longer Needed</MenuItem>
                <MenuItem value="switching_bank">Switching Bank</MenuItem>
                <MenuItem value="duplicate_account">Duplicate Account</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Confirmation Code"
              variant="outlined"
              value={formData.confirmationCode}
              onChange={(e) => handleChange("confirmationCode", e.target.value)}
              required
              helperText="Enter the confirmation code sent to your registered email"
            />

            <TextField
              fullWidth
              label="Additional Remarks"
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
              className="bg-orange-600 hover:bg-orange-700"
              sx={{ bgcolor: 'orange.600', '&:hover': { bgcolor: 'orange.700' } }}
            >
              Close Account
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default AccountClosePage;
