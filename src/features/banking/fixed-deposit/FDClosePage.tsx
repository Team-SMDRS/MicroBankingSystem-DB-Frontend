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

const FDClosePage = () => {
  const [formData, setFormData] = useState({
    fdNumber: "",
    reason: "",
    prematureClosureReason: "",
    transferAccount: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FD Close data:", formData);
    setSuccess("Fixed Deposit closure initiated successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Paper elevation={3} className="p-8">
          <Box className="flex items-center mb-6">
            <AccountBalance className="text-4xl text-yellow-600 mr-3" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Close Fixed Deposit
            </Typography>
          </Box>

          <Alert severity="info" className="mb-6">
            Premature closure may result in penalty charges. Please review terms and conditions.
          </Alert>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              label="FD Number"
              variant="outlined"
              value={formData.fdNumber}
              onChange={(e) => handleChange("fdNumber", e.target.value)}
              required
            />

            <FormControl fullWidth>
              <InputLabel>Closure Type</InputLabel>
              <Select
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                required
              >
                <MenuItem value="maturity">Maturity Closure</MenuItem>
                <MenuItem value="premature">Premature Closure</MenuItem>
              </Select>
            </FormControl>

            {formData.reason === "premature" && (
              <FormControl fullWidth>
                <InputLabel>Premature Closure Reason</InputLabel>
                <Select
                  value={formData.prematureClosureReason}
                  onChange={(e) => handleChange("prematureClosureReason", e.target.value)}
                  required
                >
                  <MenuItem value="emergency">Medical Emergency</MenuItem>
                  <MenuItem value="education">Education Expenses</MenuItem>
                  <MenuItem value="investment">Investment Opportunity</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              label="Transfer to Account Number"
              variant="outlined"
              value={formData.transferAccount}
              onChange={(e) => handleChange("transferAccount", e.target.value)}
              required
              helperText="Account where FD amount should be transferred"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              className="bg-yellow-600 hover:bg-yellow-700"
              sx={{ bgcolor: 'yellow.600', '&:hover': { bgcolor: 'yellow.700' } }}
            >
              Close Fixed Deposit
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default FDClosePage;
