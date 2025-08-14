import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import {
  Download,
  Search,
  FilterList,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Schedule,
} from "@mui/icons-material";

interface SmartLifeTransaction {
  id: string;
  date: string;
  type: "Deposit" | "Interest Credit" | "Withdrawal" | "Fee";
  description: string;
  amount: number;
  balance: number;
  status: "Completed" | "Pending" | "Failed";
  reference: string;
}

interface SmartLifeTransactionsProps {
  onBack: () => void;
}

const SmartLifeTransactions: React.FC<SmartLifeTransactionsProps> = ({
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const transactions: SmartLifeTransaction[] = [
    {
      id: "1",
      date: "2024-08-10",
      type: "Interest Credit",
      description: "Monthly Interest Credit - August 2024",
      amount: 29688,
      balance: 2850000,
      status: "Completed",
      reference: "INT-202408-001234",
    },
    {
      id: "2",
      date: "2024-08-05",
      type: "Deposit",
      description: "Mobile Money Deposit via MTN",
      amount: 150000,
      balance: 2820312,
      status: "Completed",
      reference: "DEP-202408-001233",
    },
    {
      id: "3",
      date: "2024-07-15",
      type: "Deposit",
      description: "Bank Transfer Deposit",
      amount: 300000,
      balance: 2670312,
      status: "Completed",
      reference: "DEP-202407-001232",
    },
    {
      id: "4",
      date: "2024-07-10",
      type: "Interest Credit",
      description: "Monthly Interest Credit - July 2024",
      amount: 27895,
      balance: 2370312,
      status: "Completed",
      reference: "INT-202407-001231",
    },
    {
      id: "5",
      date: "2024-06-20",
      type: "Deposit",
      description: "Salary Deduction Deposit",
      amount: 200000,
      balance: 2342417,
      status: "Completed",
      reference: "DEP-202406-001230",
    },
    {
      id: "6",
      date: "2024-06-10",
      type: "Interest Credit",
      description: "Monthly Interest Credit - June 2024",
      amount: 24521,
      balance: 2142417,
      status: "Completed",
      reference: "INT-202406-001229",
    },
    {
      id: "7",
      date: "2024-05-25",
      type: "Deposit",
      description: "Cash Deposit at NSSF Office",
      amount: 100000,
      balance: 2117896,
      status: "Completed",
      reference: "DEP-202405-001228",
    },
    {
      id: "8",
      date: "2024-05-10",
      type: "Interest Credit",
      description: "Monthly Interest Credit - May 2024",
      amount: 21087,
      balance: 2017896,
      status: "Completed",
      reference: "INT-202405-001227",
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-UG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Deposit":
        return <TrendingUp color="success" />;
      case "Interest Credit":
        return <AccountBalance color="info" />;
      case "Withdrawal":
        return <TrendingDown color="error" />;
      default:
        return <Schedule color="warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "error";
      default:
        return "default";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "All" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalDeposits = transactions
    .filter((t) => t.type === "Deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInterest = transactions
    .filter((t) => t.type === "Interest Credit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
        sx={{
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            SmartLife Flexi Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete transaction history for your voluntary savings account
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ whiteSpace: "nowrap" }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "success.main", mx: "auto", mb: 1 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h6" color="success.main" fontWeight="bold">
                {formatCurrency(totalDeposits)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Deposits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "info.main", mx: "auto", mb: 1 }}>
                <AccountBalance />
              </Avatar>
              <Typography variant="h6" color="info.main" fontWeight="bold">
                {formatCurrency(totalInterest)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interest Earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 1 }}>
                <Schedule />
              </Avatar>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {filteredTransactions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Filter by Type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All Transactions</MenuItem>
                <MenuItem value="Deposit">Deposits</MenuItem>
                <MenuItem value="Interest Credit">Interest Credits</MenuItem>
                <MenuItem value="Withdrawal">Withdrawals</MenuItem>
                <MenuItem value="Fee">Fees</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="outlined" fullWidth startIcon={<Download />}>
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reference</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(transaction.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getTransactionIcon(transaction.type)}
                        <Typography variant="body2">
                          {transaction.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color={
                          transaction.type === "Deposit" ||
                          transaction.type === "Interest Credit"
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {transaction.type === "Withdrawal" ||
                        transaction.type === "Fee"
                          ? "-"
                          : "+"}
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(transaction.balance)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        color={getStatusColor(transaction.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {transaction.reference}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SmartLifeTransactions;
