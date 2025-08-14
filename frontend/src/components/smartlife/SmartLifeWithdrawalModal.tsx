import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
  Avatar,
  MenuItem,
  Select,
  InputLabel,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  AccountBalance,
  PhoneAndroid,
  MoneyOff,
  Warning,
  Info,
  Flag,
} from "@mui/icons-material";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  color: string;
}

interface GoalWithdrawal {
  goalId: string;
  amount: number;
}

interface SmartLifeWithdrawalModalProps {
  open: boolean;
  onClose: () => void;
  onWithdraw: (
    amount: number,
    method: string,
    reason: string,
    goalWithdrawals?: GoalWithdrawal[]
  ) => void;
  availableBalance: number;
  availableGoals?: Goal[];
}

const SmartLifeWithdrawalModal: React.FC<SmartLifeWithdrawalModalProps> = ({
  open,
  onClose,
  onWithdraw,
  availableBalance,
  availableGoals = [],
}) => {
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("bank_transfer");
  const [reason, setReason] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [withdrawalSource, setWithdrawalSource] = useState<string>("general");
  const [selectedGoals, setSelectedGoals] = useState<{ [key: string]: number }>(
    {}
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const withdrawalReasons = [
    { value: "emergency", label: "Emergency Expenses" },
    { value: "medical", label: "Medical Expenses" },
    { value: "education", label: "Education Fees" },
    { value: "investment", label: "Investment Opportunity" },
    { value: "debt_payment", label: "Debt Payment" },
    { value: "other", label: "Other" },
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Get total available balance from goals
  const getTotalGoalBalance = (): number => {
    return availableGoals.reduce(
      (total, goal) => total + goal.currentAmount,
      0
    );
  };

  // Get selected goals total withdrawal amount
  const getSelectedGoalsTotal = (): number => {
    return Object.values(selectedGoals).reduce(
      (total, amount) => total + amount,
      0
    );
  };

  // Handle goal withdrawal amount change
  const handleGoalAmountChange = (goalId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSelectedGoals((prev) => ({
      ...prev,
      [goalId]: numValue,
    }));
  };

  // Handle withdrawal source change
  const handleWithdrawalSourceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setWithdrawalSource(value as "general" | "goals");
    if (value === "general") {
      setSelectedGoals({});
    }
    // Clear amount when switching sources
    setAmount("");
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      if (errors.amount) {
        setErrors({ ...errors, amount: "" });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (withdrawalSource === "general") {
      // Validate amount for general withdrawal
      const numAmount = parseFloat(amount);
      if (!amount || numAmount <= 0) {
        newErrors.amount = "Please enter a valid amount";
      } else if (numAmount > availableBalance) {
        newErrors.amount = "Amount exceeds available balance";
      } else if (numAmount < 5000) {
        newErrors.amount = "Minimum withdrawal amount is UGX 5,000";
      }
    } else {
      // Validate goal-based withdrawals
      const selectedGoalsTotal = getSelectedGoalsTotal();
      if (selectedGoalsTotal <= 0) {
        newErrors.goals = "Please select goals and enter withdrawal amounts";
      } else if (selectedGoalsTotal < 5000) {
        newErrors.goals = "Minimum total withdrawal amount is UGX 5,000";
      }

      // Validate individual goal amounts
      Object.entries(selectedGoals).forEach(([goalId, goalAmount]) => {
        const goal = availableGoals.find((g) => g.id === goalId);
        if (goal && goalAmount > goal.currentAmount) {
          newErrors[`goal_${goalId}`] = `Amount exceeds ${goal.title} balance`;
        }
      });
    }

    // Validate reason
    if (!reason) {
      newErrors.reason = "Please select a withdrawal reason";
    }

    // Validate payment method specific fields
    if (method === "bank_transfer" && !accountNumber) {
      newErrors.accountNumber = "Bank account number is required";
    }

    if (method === "mobile_money" && !mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (withdrawalSource === "general") {
        const numAmount = parseFloat(amount);
        onWithdraw(numAmount, method, reason);
      } else {
        // Create goal withdrawals array
        const goalWithdrawals: GoalWithdrawal[] = Object.entries(selectedGoals)
          .filter(([_, amount]) => amount > 0)
          .map(([goalId, amount]) => ({ goalId, amount }));

        const totalAmount = getSelectedGoalsTotal();
        onWithdraw(totalAmount, method, reason, goalWithdrawals);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setAmount("");
    setMethod("bank_transfer");
    setReason("");
    setAccountNumber("");
    setMobileNumber("");
    setWithdrawalSource("general");
    setSelectedGoals({});
    setErrors({});
    onClose();
  };

  const getCurrentWithdrawalAmount = (): number => {
    if (withdrawalSource === "general") {
      return parseFloat(amount) || 0;
    } else {
      return getSelectedGoalsTotal();
    }
  };

  const withdrawalFee = getCurrentWithdrawalAmount() * 0.01; // 1% withdrawal fee
  const netAmount = getCurrentWithdrawalAmount() - withdrawalFee;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
          color: "white",
          textAlign: "center",
          py: 3,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}>
            <MoneyOff />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Withdraw Funds
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              SmartLife Voluntary Savings
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Available Balance Info */}
          <Grid item xs={12}>
            <Card
              sx={{
                bgcolor: "primary.50",
                border: "1px solid",
                borderColor: "primary.200",
              }}
            >
              <CardContent sx={{ py: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Available Balance
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {formatCurrency(availableBalance)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Withdrawal Source and Amount */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Withdrawal Source
            </Typography>
            <RadioGroup
              value={withdrawalSource}
              onChange={handleWithdrawalSourceChange}
              sx={{ mb: 3 }}
            >
              <FormControlLabel
                value="general"
                control={<Radio />}
                label="General Account Balance"
              />
              <FormControlLabel
                value="goals"
                control={<Radio />}
                label="Specific Savings Goals"
              />
            </RadioGroup>

            {withdrawalSource === "general" ? (
              <>
                <TextField
                  fullWidth
                  label="Withdrawal Amount"
                  value={amount}
                  onChange={handleAmountChange}
                  error={!!errors.amount}
                  helperText={errors.amount || "Minimum: UGX 5,000"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">UGX</InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Available Balance: UGX {availableBalance.toLocaleString()}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Select Goals to Withdraw From
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Total Goal Balance: UGX{" "}
                  {getTotalGoalBalance().toLocaleString()}
                </Typography>

                {errors.goals && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.goals}
                  </Alert>
                )}

                <List
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "divider",
                    mb: 2,
                  }}
                >
                  {availableGoals.map((goal, index) => (
                    <React.Fragment key={goal.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Checkbox
                            checked={selectedGoals[goal.id] !== undefined}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGoals((prev) => ({
                                  ...prev,
                                  [goal.id]: 0,
                                }));
                              } else {
                                setSelectedGoals((prev) => {
                                  const updated = { ...prev };
                                  delete updated[goal.id];
                                  return updated;
                                });
                              }
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Flag sx={{ color: goal.color }} />
                              <Typography variant="subtitle1">
                                {goal.title}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Available: UGX{" "}
                                {goal.currentAmount.toLocaleString()}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (goal.currentAmount / goal.targetAmount) * 100
                                }
                                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          }
                        />
                        <Box sx={{ ml: 2, minWidth: 200 }}>
                          {selectedGoals[goal.id] !== undefined && (
                            <TextField
                              size="small"
                              label="Withdrawal Amount"
                              value={selectedGoals[goal.id] || ""}
                              onChange={(e) =>
                                handleGoalAmountChange(goal.id, e.target.value)
                              }
                              error={!!errors[`goal_${goal.id}`]}
                              helperText={errors[`goal_${goal.id}`]}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    UGX
                                  </InputAdornment>
                                ),
                              }}
                              sx={{ width: "100%" }}
                            />
                          )}
                        </Box>
                      </ListItem>
                      {index < availableGoals.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                {getSelectedGoalsTotal() > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "primary.light",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h6" color="primary.contrastText">
                      Total Withdrawal: UGX{" "}
                      {getSelectedGoalsTotal().toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Grid>

          {/* Withdrawal Reason */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.reason}>
              <InputLabel>Withdrawal Reason</InputLabel>
              <Select
                value={reason}
                label="Withdrawal Reason"
                onChange={(e) => setReason(e.target.value)}
              >
                {withdrawalReasons.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.reason && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.reason}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Payment Method Selection */}
          <Grid item xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: "bold" }}>
                Withdrawal Method
              </FormLabel>
              <RadioGroup
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                row
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border: 2,
                        borderColor:
                          method === "bank_transfer"
                            ? "primary.main"
                            : "divider",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                      onClick={() => setMethod("bank_transfer")}
                    >
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <FormControlLabel
                          value="bank_transfer"
                          control={<Radio />}
                          label=""
                          sx={{ display: "none" }}
                        />
                        <Avatar
                          sx={{ bgcolor: "primary.main", mx: "auto", mb: 1 }}
                        >
                          <AccountBalance />
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Bank Transfer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Direct to bank account
                        </Typography>
                        <Chip
                          label="1-2 business days"
                          size="small"
                          sx={{ mt: 1 }}
                          color="primary"
                          variant="outlined"
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border: 2,
                        borderColor:
                          method === "mobile_money"
                            ? "primary.main"
                            : "divider",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                      onClick={() => setMethod("mobile_money")}
                    >
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <FormControlLabel
                          value="mobile_money"
                          control={<Radio />}
                          label=""
                          sx={{ display: "none" }}
                        />
                        <Avatar
                          sx={{ bgcolor: "success.main", mx: "auto", mb: 1 }}
                        >
                          <PhoneAndroid />
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Mobile Money
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          MTN/Airtel Money
                        </Typography>
                        <Chip
                          label="Instant"
                          size="small"
                          sx={{ mt: 1 }}
                          color="success"
                          variant="outlined"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Payment Details */}
          {method === "bank_transfer" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                error={!!errors.accountNumber}
                helperText={
                  errors.accountNumber || "Enter your bank account number"
                }
                variant="outlined"
              />
            </Grid>
          )}

          {method === "mobile_money" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                error={!!errors.mobileNumber}
                helperText={
                  errors.mobileNumber || "Enter your mobile money number"
                }
                placeholder="256XXXXXXXXX"
                variant="outlined"
              />
            </Grid>
          )}

          {/* Transaction Summary */}
          {amount && parseFloat(amount) > 0 && (
            <Grid item xs={12}>
              <Card sx={{ bgcolor: "grey.50" }}>
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Transaction Summary
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Withdrawal Amount:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(parseFloat(amount))}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      Processing Fee (1%):
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(withdrawalFee)}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ borderTop: 1, borderColor: "divider", pt: 1 }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Net Amount:
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      {formatCurrency(netAmount)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Important Notice */}
          <Grid item xs={12}>
            <Alert severity="warning" icon={<Warning />}>
              <Typography variant="body2">
                <strong>Important:</strong> Withdrawals from voluntary savings
                may affect your long-term savings goals. A 1% processing fee
                applies to all withdrawals. Please ensure this withdrawal aligns
                with your financial objectives.
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" icon={<Info />}>
              <Typography variant="body2">
                Processing times: Bank transfers take 1-2 business days, Mobile
                Money transfers are instant. You will receive SMS confirmation
                once the withdrawal is processed.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{ minWidth: 120 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={!amount || parseFloat(amount) <= 0}
          sx={{
            minWidth: 120,
            background: "linear-gradient(135deg, #f57c00 0%, #ff9800 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #ef6c00 0%, #f57c00 100%)",
            },
          }}
        >
          Withdraw Funds
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SmartLifeWithdrawalModal;
