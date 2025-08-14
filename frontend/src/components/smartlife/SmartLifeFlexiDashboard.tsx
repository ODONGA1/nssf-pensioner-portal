import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  Add,
  Info,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Schedule,
  Star,
} from "@mui/icons-material";

interface SmartLifeFlexiAccount {
  accountNumber: string;
  currentBalance: number;
  totalDeposits: number;
  totalInterestEarned: number;
  monthlyInterest: number;
  accountOpenDate: string;
  lockInEndDate: string;
  isActive: boolean;
  interestRate: number;
}

interface SmartLifeFlexiDashboardProps {
  onMakeDeposit: () => void;
  onViewTransactions: () => void;
  onSetGoal: () => void;
}

const SmartLifeFlexiDashboard: React.FC<SmartLifeFlexiDashboardProps> = ({
  onMakeDeposit,
  onViewTransactions,
  onSetGoal,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [account] = useState<SmartLifeFlexiAccount>({
    accountNumber: "SLF-2024-001234",
    currentBalance: 2850000,
    totalDeposits: 2750000,
    totalInterestEarned: 100000,
    monthlyInterest: 29688,
    accountOpenDate: "2024-01-15",
    lockInEndDate: "2025-01-14",
    isActive: true,
    interestRate: 12.5,
  });

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

  const getDaysToMaturity = (): number => {
    const today = new Date();
    const maturityDate = new Date(account.lockInEndDate);
    const diffTime = maturityDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMaturityProgress = (): number => {
    const startDate = new Date(account.accountOpenDate);
    const endDate = new Date(account.lockInEndDate);
    const today = new Date();

    const totalDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed =
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    return Math.min((daysPassed / totalDays) * 100, 100);
  };

  const isMatured = getDaysToMaturity() <= 0;

  return (
    <Box>
      {/* SmartLife Flexi Header */}
      <Card
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  width: 60,
                  height: 60,
                }}
              >
                <Star sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  SmartLife Flexi
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Voluntary Savings Account
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Account: {account.accountNumber}
                </Typography>
              </Box>
            </Box>
            <Box textAlign="right">
              <Chip
                label={account.isActive ? "Active" : "Inactive"}
                color={account.isActive ? "success" : "error"}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {account.interestRate}% Annual Interest
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Account Balance & Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Current Balance */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <AccountBalance color="primary" />
                  <Typography variant="h6">Current Balance</Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                {showBalance ? formatCurrency(account.currentBalance) : "****"}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="body2" color="success.main">
                  +{formatCurrency(account.monthlyInterest)} this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Maturity Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Schedule color="primary" />
                <Typography variant="h6">Maturity Status</Typography>
              </Box>
              {isMatured ? (
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CheckCircle color="success" />
                    <Typography variant="h6" color="success.main">
                      Matured
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Account matured on {formatDate(account.lockInEndDate)}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {getDaysToMaturity()} days remaining
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getMaturityProgress()}
                    sx={{ mb: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Matures on {formatDate(account.lockInEndDate)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {formatCurrency(account.totalDeposits)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Deposits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="success.main" fontWeight="bold">
                {formatCurrency(account.totalInterestEarned)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interest Earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="info.main" fontWeight="bold">
                {account.interestRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Annual Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="warning.main" fontWeight="bold">
                12 months
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lock-in Period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={onMakeDeposit}
                size="large"
              >
                Make Deposit
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TrendingUp />}
                onClick={onViewTransactions}
                size="large"
              >
                View Transactions
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CheckCircle />}
                onClick={onSetGoal}
                size="large"
              >
                Set Savings Goal
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Info />}
                size="large"
              >
                Account Details
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          SmartLife Flexi Benefits:
        </Typography>
        <Typography variant="body2">
          • Minimum deposit: UGX 5,000 • Daily interest accrual, monthly
          crediting • 12.5% annual interest rate • 12-month lock-in period •
          Access after maturity • Secure NSSF management
        </Typography>
      </Alert>
    </Box>
  );
};

export default SmartLifeFlexiDashboard;
