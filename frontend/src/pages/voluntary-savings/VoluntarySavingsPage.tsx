import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Alert,
  Chip,
  Avatar,
  Button,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Star,
  TrendingUp,
  Savings,
  Add,
  CheckCircle,
  History,
  Analytics,
  Settings,
  Search,
  Download,
  Flag,
  MoneyOff,
} from "@mui/icons-material";
import SmartLifeGoals from "../../components/smartlife/SmartLifeGoals";
import SmartLifeDepositModal from "../../components/smartlife/SmartLifeDepositModal";
import SmartLifeWithdrawalModal from "../../components/smartlife/SmartLifeWithdrawalModal";

interface GoalWithdrawal {
  goalId: string;
  amount: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`voluntary-savings-tabpanel-${index}`}
      aria-labelledby={`voluntary-savings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const VoluntarySavingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // Sample goals data for the deposit modal
  const availableGoals = [
    {
      id: "1",
      title: "Emergency Fund",
      targetAmount: 5000000,
      currentAmount: 2850000,
      description: "Emergency fund for unexpected expenses",
      deadline: "2026-12-31",
      priority: "High" as const,
      color: "#f44336",
    },
    {
      id: "2",
      title: "House Down Payment",
      targetAmount: 15000000,
      currentAmount: 3200000,
      description: "Down payment for new family home",
      deadline: "2027-06-30",
      priority: "Medium" as const,
      color: "#2196f3",
    },
    {
      id: "3",
      title: "Children's Education",
      targetAmount: 8000000,
      currentAmount: 1500000,
      description: "University education fund for children",
      deadline: "2030-01-01",
      priority: "High" as const,
      color: "#4caf50",
    },
    {
      id: "4",
      title: "Vacation Fund",
      targetAmount: 2000000,
      currentAmount: 400000,
      description: "Annual family vacation fund",
      deadline: "2025-12-31",
      priority: "Low" as const,
      color: "#ff9800",
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeposit = (
    amount: number,
    method: string,
    goalAllocations?: any[]
  ) => {
    // Handle successful deposit
    console.log(`Deposit successful: ${amount} via ${method}`, goalAllocations);
    setDepositModalOpen(false);
  };

  const handleWithdrawal = (
    amount: number,
    method: string,
    reason: string,
    goalWithdrawals?: GoalWithdrawal[]
  ) => {
    // Handle successful withdrawal
    if (goalWithdrawals && goalWithdrawals.length > 0) {
      console.log(
        `Goal-based withdrawal successful: ${amount} via ${method}, reason: ${reason}`,
        goalWithdrawals
      );
    } else {
      console.log(
        `General withdrawal successful: ${amount} via ${method}, reason: ${reason}`
      );
    }
    setWithdrawalModalOpen(false);
  };

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
      month: "long",
      day: "numeric",
    });
  };

  // Mock data
  const accountData = {
    balance: 2850000,
    currentBalance: 2850000,
    monthlyInterest: 29687,
    activeGoals: 3,
    monthlyDeposits: 250000,
    totalDeposits: 2500000,
    interestEarned: 350000,
    maturityDate: "2025-12-31",
    accountNumber: "SLF-2024-001587",
    openingDate: "2024-01-15",
  };

  // Mock transaction data
  const transactions = [
    {
      id: "TXN-001",
      date: "2025-08-12",
      type: "Deposit",
      description: "Mobile Money Deposit",
      amount: 50000,
      status: "Completed",
      balance: 2850000,
    },
    {
      id: "TXN-002",
      date: "2025-08-01",
      type: "Interest",
      description: "Monthly Interest Credit",
      amount: 29687,
      status: "Completed",
      balance: 2800000,
    },
    {
      id: "TXN-003",
      date: "2025-07-28",
      type: "Deposit",
      description: "Bank Transfer Deposit",
      amount: 100000,
      status: "Completed",
      balance: 2770313,
    },
    {
      id: "TXN-004",
      date: "2025-07-15",
      type: "Deposit",
      description: "Mobile Money Deposit",
      amount: 75000,
      status: "Completed",
      balance: 2670313,
    },
    {
      id: "TXN-005",
      date: "2025-07-01",
      type: "Interest",
      description: "Monthly Interest Credit",
      amount: 28125,
      status: "Completed",
      balance: 2595313,
    },
    {
      id: "TXN-006",
      date: "2025-06-20",
      type: "Deposit",
      description: "Goal Allocation - Emergency Fund",
      amount: 200000,
      status: "Completed",
      balance: 2567188,
    },
  ];

  const getDaysToMaturity = () => {
    const today = new Date();
    const maturity = new Date(accountData.maturityDate);
    const diffTime = maturity.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMaturityProgress = () => {
    const openingDate = new Date(accountData.openingDate);
    const maturityDate = new Date(accountData.maturityDate);
    const today = new Date();

    const totalDuration = maturityDate.getTime() - openingDate.getTime();
    const elapsed = today.getTime() - openingDate.getTime();

    return Math.min((elapsed / totalDuration) * 100, 100);
  };

  return (
    <>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Enhanced Header */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white",
            mb: 3,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "100px",
              height: "100px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              transform: "translate(50%, -50%)",
            },
          }}
        >
          <CardContent sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center" gap={3}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      width: 80,
                      height: 80,
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <Star sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                      SmartLife Flexi
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                      Voluntary Savings Account
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      Account: {accountData.accountNumber} • Opened:{" "}
                      {formatDate(accountData.openingDate)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign={{ xs: "left", md: "right" }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {formatCurrency(accountData.balance)}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                    mb={2}
                  >
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      sx={{ bgcolor: "rgba(76, 175, 80, 0.2)", color: "white" }}
                    />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      12.5% Annual Interest
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      Maturity Progress ({getDaysToMaturity()} days remaining)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getMaturityProgress()}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Quick Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Grid container spacing={3} sx={{ maxWidth: 600 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Add />}
                onClick={() => setDepositModalOpen(true)}
                sx={{
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Make Deposit
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<MoneyOff />}
                onClick={() => setWithdrawalModalOpen(true)}
                sx={{
                  borderColor: "#f57c00",
                  color: "#f57c00",
                  borderWidth: 2,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  "&:hover": {
                    borderColor: "#ef6c00",
                    color: "#ef6c00",
                    bgcolor: "rgba(245, 124, 0, 0.08)",
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Withdraw Funds
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Key Metrics Dashboard */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 1 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {formatCurrency(accountData.monthlyInterest)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly Interest
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Avatar sx={{ bgcolor: "success.main", mx: "auto", mb: 1 }}>
                <Savings />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {accountData.activeGoals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Goals
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Avatar sx={{ bgcolor: "info.main", mx: "auto", mb: 1 }}>
                <Add />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="info.main">
                {formatCurrency(accountData.monthlyDeposits)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Month
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Avatar sx={{ bgcolor: "warning.main", mx: "auto", mb: 1 }}>
                <CheckCircle />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {formatCurrency(accountData.interestEarned)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interest Earned
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Enhanced Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": {
                minHeight: 64,
                fontSize: "1rem",
                fontWeight: 500,
              },
            }}
          >
            <Tab
              label="Account Overview"
              icon={<Star />}
              iconPosition="start"
            />
            <Tab
              label="Savings Goals"
              icon={<CheckCircle />}
              iconPosition="start"
            />
            <Tab label="Transactions" icon={<History />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Enhanced Tab Content */}
        {/* Tab 1: Comprehensive Account Overview */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Account Summary Section */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Account Overview
              </Typography>
            </Grid>

            {/* Spacer */}
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Divider />
            </Grid>

            {/* Account Details Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Settings color="primary" />
                    Account Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Account Number
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {accountData.accountNumber}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Product Type
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          SmartLife Flexi
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Interest Rate
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="success.main"
                        >
                          12.5% p.a.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Opening Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(accountData.openingDate)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Maturity Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(accountData.maturityDate)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          <Chip label="Active" color="success" size="small" />
                          <Typography variant="body2">
                            Account in good standing
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Analytics Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Analytics color="primary" />
                    Performance Analytics
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Growth
                        </Typography>
                        <Typography
                          variant="h6"
                          color="success.main"
                          fontWeight="bold"
                        >
                          {(
                            (accountData.interestEarned /
                              accountData.totalDeposits) *
                            100
                          ).toFixed(1)}
                          %
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Avg Monthly Growth
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          1.04%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Best Month
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          July 2025
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Monthly Interest
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="success.main"
                        >
                          {formatCurrency(accountData.monthlyInterest)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          This Month Deposits
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="info.main"
                        >
                          {formatCurrency(accountData.monthlyDeposits)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <History color="primary" />
                    Recent Activity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {transactions.slice(0, 4).map((transaction, index) => (
                    <Box key={transaction.id} sx={{ mb: 2 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {transaction.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(transaction.date)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={
                            transaction.type === "Interest"
                              ? "success.main"
                              : "primary.main"
                          }
                        >
                          +{formatCurrency(transaction.amount)}
                        </Typography>
                      </Box>
                      {index < 3 && <Divider sx={{ mt: 1 }} />}
                    </Box>
                  ))}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setTabValue(2)}
                    sx={{ mt: 1 }}
                    fullWidth
                  >
                    View All Transactions →
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Goal Progress Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Flag color="primary" />
                    Goals Progress
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Overall Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      65% Complete
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Goals Completed
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          0 of {accountData.activeGoals}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          On Track
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="success.main"
                        >
                          {accountData.activeGoals - 1}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setTabValue(1)}
                    sx={{ mt: 1 }}
                    fullWidth
                  >
                    Manage Goals →
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Product Benefits Section */}
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🌟 SmartLife Flexi Benefits
                </Typography>
                <Typography variant="body2">
                  <strong>Daily Interest Accrual</strong> •{" "}
                  <strong>Monthly Crediting</strong> •{" "}
                  <strong>Goal-Based Allocation</strong> •{" "}
                  <strong>Flexible Deposits</strong> •{" "}
                  <strong>NSSF Security</strong>
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Savings Goals */}
        <TabPanel value={tabValue} index={1}>
          <SmartLifeGoals />
        </TabPanel>

        {/* Tab 3: Transactions */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Action Header */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold">
                Transaction History
              </Typography>
            </Grid>

            {/* Filters and Search */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <Search sx={{ mr: 1, color: "text.secondary" }} />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Filter by Type</InputLabel>
                        <Select
                          value={filterType}
                          label="Filter by Type"
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <MenuItem value="">All Types</MenuItem>
                          <MenuItem value="Deposit">Deposits</MenuItem>
                          <MenuItem value="Interest">Interest</MenuItem>
                          <MenuItem value="Goal Allocation">
                            Goal Allocations
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Download />}
                        size="small"
                      >
                        Export
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Transaction Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Description</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Type</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Amount (UGX)</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Balance (UGX)</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions
                        .filter((transaction) => {
                          const matchesSearch =
                            transaction.description
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            transaction.type
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase());
                          const matchesFilter =
                            filterType === "" ||
                            transaction.type === filterType;
                          return matchesSearch && matchesFilter;
                        })
                        .map((transaction) => (
                          <TableRow key={transaction.id} hover>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDate(transaction.date)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {transaction.description}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={transaction.type}
                                size="small"
                                color={
                                  transaction.type === "Interest"
                                    ? "success"
                                    : transaction.type === "Deposit"
                                    ? "primary"
                                    : "default"
                                }
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color={
                                  transaction.type === "Interest"
                                    ? "success.main"
                                    : "primary.main"
                                }
                              >
                                +{formatCurrency(transaction.amount)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {formatCurrency(transaction.balance)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={transaction.status}
                                size="small"
                                color="success"
                                variant="filled"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  {transactions.filter((transaction) => {
                    const matchesSearch =
                      transaction.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      transaction.type
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    const matchesFilter =
                      filterType === "" || transaction.type === filterType;
                    return matchesSearch && matchesFilter;
                  }).length === 0 && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No transactions found matching your criteria
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Transaction Summary */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{ textAlign: "center", p: 2, bgcolor: "primary.50" }}
                  >
                    <Typography
                      variant="h6"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {transactions.filter((t) => t.type === "Deposit").length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Deposits
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{ textAlign: "center", p: 2, bgcolor: "success.50" }}
                  >
                    <Typography
                      variant="h6"
                      color="success.main"
                      fontWeight="bold"
                    >
                      {formatCurrency(
                        transactions
                          .filter((t) => t.type === "Interest")
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interest Earned
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ textAlign: "center", p: 2, bgcolor: "info.50" }}>
                    <Typography
                      variant="h6"
                      color="info.main"
                      fontWeight="bold"
                    >
                      {formatCurrency(
                        transactions
                          .filter((t) => t.type === "Deposit")
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deposit Total
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{ textAlign: "center", p: 2, bgcolor: "warning.50" }}
                  >
                    <Typography
                      variant="h6"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      {formatDate(transactions[0]?.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Activity
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>

      {/* Deposit Modal */}
      <SmartLifeDepositModal
        open={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onDeposit={handleDeposit}
        availableGoals={availableGoals}
      />

      {/* Withdrawal Modal */}
      <SmartLifeWithdrawalModal
        open={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
        onWithdraw={handleWithdrawal}
        availableBalance={accountData.balance}
        availableGoals={availableGoals}
      />
    </>
  );
};

export default VoluntarySavingsPage;
