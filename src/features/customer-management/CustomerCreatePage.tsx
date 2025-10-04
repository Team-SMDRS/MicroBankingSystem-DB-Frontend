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
import { PersonAdd } from "@mui/icons-material";

const CustomerCreatePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    idType: "",
    idNumber: "",
    occupation: "",
    income: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Customer Create data:", formData);
    setSuccess("Customer created successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Paper elevation={3} className="p-8">
          <Box className="flex items-center mb-6">
            <PersonAdd className="text-4xl text-indigo-600 mr-3" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Create New Customer
            </Typography>
          </Box>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
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

              <TextField
                fullWidth
                label="Date of Birth"
                variant="outlined"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
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
                  <MenuItem value="ssn">Social Security Number</MenuItem>
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

              <TextField
                fullWidth
                label="Occupation"
                variant="outlined"
                value={formData.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Annual Income"
                variant="outlined"
                type="number"
                value={formData.income}
                onChange={(e) => handleChange("income", e.target.value)}
                required
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                label="City"
                variant="outlined"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="State"
                variant="outlined"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="ZIP Code"
                variant="outlined"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
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
              className="bg-indigo-600 hover:bg-indigo-700"
              sx={{ bgcolor: 'indigo.600', '&:hover': { bgcolor: 'indigo.700' } }}
            >
              Create Customer
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default CustomerCreatePage;
