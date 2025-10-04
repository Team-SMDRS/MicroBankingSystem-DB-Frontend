import { useState, useEffect } from "react";
import { 
  Paper, 
  Typography, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from "@mui/material";
import { AccountBalanceWallet, Search, FilterList } from "@mui/icons-material";
import Navigation from "../../../components/Navigation";

interface Transaction {
  id: number;
  date: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  accountNumber: string;
}

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Mock data - replace with API call
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        date: "2024-10-04",
        type: "Deposit",
        amount: 1000.00,
        description: "Salary Credit",
        status: "Completed",
        accountNumber: "1234567890"
      },
      {
        id: 2,
        date: "2024-10-03",
        type: "Withdrawal",
        amount: -250.00,
        description: "ATM Withdrawal",
        status: "Completed",
        accountNumber: "1234567890"
      },
      {
        id: 3,
        date: "2024-10-02",
        type: "Transfer",
        amount: -500.00,
        description: "Online Transfer",
        status: "Pending",
        accountNumber: "1234567890"
      }
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.accountNumber.includes(searchTerm)
      );
    }

    if (filterType) {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, filterStatus, transactions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "success";
      case "Pending": return "warning";
      case "Failed": return "error";
      default: return "default";
    }
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
        <Navigation />
      <div className="max-w-6xl mx-auto">
        <Paper elevation={3} className="p-8">
          <Box className="flex items-center mb-6">
            <AccountBalanceWallet className="text-4xl text-purple-600 mr-3" />
            <Typography variant="h4" className="font-bold text-gray-800">
              Transaction History
            </Typography>
          </Box>

          {/* Filters */}
          <Box className="flex flex-wrap gap-4 mb-6">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search className="mr-2 text-gray-400" />
              }}
              className="min-w-[200px]"
            />

            <FormControl size="small" className="min-w-[150px]">
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                startAdornment={<FilterList className="mr-2 text-gray-400" />}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Deposit">Deposit</MenuItem>
                <MenuItem value="Withdrawal">Withdrawal</MenuItem>
                <MenuItem value="Transfer">Transfer</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" className="min-w-[150px]">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm("");
                setFilterType("");
                setFilterStatus("");
              }}
            >
              Clear Filters
            </Button>
          </Box>

          {/* Transaction Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Account</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.type} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className={getAmountColor(transaction.amount)}>
                      <strong>
                        {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </strong>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status} 
                        size="small"
                        color={getStatusColor(transaction.status) as any}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.accountNumber}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredTransactions.length === 0 && (
            <Box className="text-center py-8">
              <Typography variant="h6" className="text-gray-500">
                No transactions found
              </Typography>
            </Box>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default TransactionPage;
