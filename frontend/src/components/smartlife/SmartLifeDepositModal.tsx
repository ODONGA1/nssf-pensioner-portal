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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  AccountBalance,
  PhoneAndroid,
  MonetizationOn,
  CheckCircle,
  Star,
  Info,
} from "@mui/icons-material";

interface SmartLifeDepositModalProps {
  open: boolean;
  onClose: () => void;
  onDeposit: (
    amount: number,
    method: string,
    goalAllocations?: GoalAllocation[]
  ) => void;
  availableGoals?: Goal[];
}

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
}

interface GoalAllocation {
  goalId: string;
  amount: number;
  goalTitle: string;
}

const SmartLifeDepositModal: React.FC<SmartLifeDepositModalProps> = ({
  open,
  onClose,
  onDeposit,
  availableGoals = [],
}) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [allocationType, setAllocationType] = useState<"general" | "specific">(
    "general"
  );
  const [goalAllocations, setGoalAllocations] = useState<GoalAllocation[]>([]);
  const [unallocatedAmount, setUnallocatedAmount] = useState(0);

  const minDeposit = 5000;
  const maxDeposit = 50000000; // 50 million UGX

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    return numAmount >= minDeposit && numAmount <= maxDeposit;
  };

  const handleSubmit = async () => {
    if (!isValidAmount()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Pass goal allocations if specific allocation is chosen
      const allocations =
        allocationType === "specific" ? goalAllocations : undefined;
      onDeposit(parseFloat(amount), paymentMethod, allocations);

      onClose();
      // Reset form
      setAmount("");
      setPaymentMethod("mobile");
      setPhoneNumber("");
      setBankAccount("");
      setAllocationType("general");
      setGoalAllocations([]);
      setUnallocatedAmount(0);
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [5000, 10000, 25000, 50000, 100000, 250000];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <Star />
          </Avatar>
          <Box>
            <Typography variant="h6">SmartLife Flexi Deposit</Typography>
            <Typography variant="body2" color="text.secondary">
              Add funds to your voluntary savings account
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Product Info */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            SmartLife Flexi Benefits:
          </Typography>
          <Typography variant="body2">
            12.5% annual interest • Daily accrual, monthly crediting • Minimum
            UGX 5,000 deposit
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          {/* Amount Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Deposit Amount
                </Typography>

                {/* Quick Amount Buttons */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Quick amounts:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {quickAmounts.map((quickAmount) => (
                      <Chip
                        key={quickAmount}
                        label={formatCurrency(quickAmount)}
                        variant={
                          amount === quickAmount.toString()
                            ? "filled"
                            : "outlined"
                        }
                        color="primary"
                        clickable
                        onClick={() => setAmount(quickAmount.toString())}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Amount Input */}
                <TextField
                  fullWidth
                  label="Deposit Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">UGX</InputAdornment>
                    ),
                  }}
                  helperText={`Minimum: ${formatCurrency(
                    minDeposit
                  )} | Maximum: ${formatCurrency(maxDeposit)}`}
                  error={amount !== "" && !isValidAmount()}
                />

                {/* Projected Interest */}
                {amount && isValidAmount() && (
                  <Card sx={{ mt: 2, bgcolor: "success.50" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        color="success.main"
                        gutterBottom
                      >
                        Projected Monthly Interest
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {formatCurrency((parseFloat(amount) * 0.125) / 12)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Based on 12.5% annual interest rate
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Goal Allocation Section */}
          {availableGoals.length > 0 && amount && isValidAmount() && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Allocation to Goals
                  </Typography>

                  <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                    <RadioGroup
                      value={allocationType}
                      onChange={(e) =>
                        setAllocationType(
                          e.target.value as "general" | "specific"
                        )
                      }
                    >
                      <FormControlLabel
                        value="general"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1">
                              General Savings
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Add to general balance, allocate to goals later
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="specific"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1">
                              Allocate to Specific Goals
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Choose which goals to fund with this deposit
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  {allocationType === "specific" && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Select Goals to Fund:
                      </Typography>

                      {availableGoals.map((goal) => {
                        const allocation = goalAllocations.find(
                          (a) => a.goalId === goal.id
                        );
                        const remaining =
                          goal.targetAmount - goal.currentAmount;

                        return (
                          <Card key={goal.id} sx={{ mb: 2, p: 2 }}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              mb={1}
                            >
                              <Box flex={1}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  {goal.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {goal.description}
                                </Typography>
                                <Box display="flex" gap={2} mt={1}>
                                  <Typography variant="body2">
                                    <strong>Target:</strong>{" "}
                                    {formatCurrency(goal.targetAmount)}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Current:</strong>{" "}
                                    {formatCurrency(goal.currentAmount)}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="primary.main"
                                  >
                                    <strong>Remaining:</strong>{" "}
                                    {formatCurrency(remaining)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Chip
                                label={goal.priority}
                                size="small"
                                color={
                                  goal.priority === "High"
                                    ? "error"
                                    : goal.priority === "Medium"
                                    ? "warning"
                                    : "default"
                                }
                              />
                            </Box>

                            <TextField
                              fullWidth
                              size="small"
                              label="Amount to allocate"
                              type="number"
                              value={allocation?.amount || ""}
                              onChange={(e) => {
                                const newAmount =
                                  parseFloat(e.target.value) || 0;
                                const currentAllocations =
                                  goalAllocations.filter(
                                    (a) => a.goalId !== goal.id
                                  );
                                if (newAmount > 0) {
                                  currentAllocations.push({
                                    goalId: goal.id,
                                    amount: newAmount,
                                    goalTitle: goal.title,
                                  });
                                }
                                setGoalAllocations(currentAllocations);

                                // Calculate unallocated amount
                                const totalAllocated =
                                  currentAllocations.reduce(
                                    (sum, a) => sum + a.amount,
                                    0
                                  );
                                setUnallocatedAmount(
                                  parseFloat(amount) - totalAllocated
                                );
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    UGX
                                  </InputAdornment>
                                ),
                              }}
                              helperText={`Max: ${formatCurrency(
                                Math.min(remaining, parseFloat(amount) || 0)
                              )}`}
                              inputProps={{
                                max: Math.min(
                                  remaining,
                                  parseFloat(amount) || 0
                                ),
                              }}
                            />
                          </Card>
                        );
                      })}

                      {goalAllocations.length > 0 && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>Total Allocated:</strong>{" "}
                            {formatCurrency(
                              goalAllocations.reduce(
                                (sum, a) => sum + a.amount,
                                0
                              )
                            )}{" "}
                            |<strong> Unallocated:</strong>{" "}
                            {formatCurrency(unallocatedAmount)}
                          </Typography>
                          {unallocatedAmount > 0 && (
                            <Typography variant="body2" color="text.secondary">
                              Unallocated funds will be added to your general
                              SmartLife Flexi balance
                            </Typography>
                          )}
                        </Alert>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Payment Method Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">
                    <Typography variant="h6">Payment Method</Typography>
                  </FormLabel>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {/* Mobile Money */}
                    <Card
                      sx={{
                        mb: 2,
                        border: paymentMethod === "mobile" ? 2 : 1,
                        borderColor:
                          paymentMethod === "mobile"
                            ? "primary.main"
                            : "divider",
                      }}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="mobile"
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center" gap={2}>
                              <PhoneAndroid color="primary" />
                              <Box>
                                <Typography variant="subtitle1">
                                  Mobile Money
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  MTN Mobile Money, Airtel Money
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        {paymentMethod === "mobile" && (
                          <Box sx={{ ml: 4, mt: 2 }}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="07XXXXXXXX"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    +256
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* Bank Transfer */}
                    <Card
                      sx={{
                        mb: 2,
                        border: paymentMethod === "bank" ? 2 : 1,
                        borderColor:
                          paymentMethod === "bank" ? "primary.main" : "divider",
                      }}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="bank"
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center" gap={2}>
                              <AccountBalance color="primary" />
                              <Box>
                                <Typography variant="subtitle1">
                                  Bank Transfer
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Direct bank transfer to NSSF account
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        {paymentMethod === "bank" && (
                          <Box sx={{ ml: 4, mt: 2 }}>
                            <TextField
                              fullWidth
                              label="Bank Account Number"
                              value={bankAccount}
                              onChange={(e) => setBankAccount(e.target.value)}
                              placeholder="Enter your account number"
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* Salary Deduction */}
                    <Card
                      sx={{
                        border: paymentMethod === "salary" ? 2 : 1,
                        borderColor:
                          paymentMethod === "salary"
                            ? "primary.main"
                            : "divider",
                      }}
                    >
                      <CardContent>
                        <FormControlLabel
                          value="salary"
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center" gap={2}>
                              <MonetizationOn color="primary" />
                              <Box>
                                <Typography variant="subtitle1">
                                  Salary Deduction
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Automatic deduction from monthly salary
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Important Information */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: "grey.50" }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Info color="primary" />
                  <Typography variant="h6">Important Information</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="12-month lock-in period applies"
                      secondary="Funds cannot be withdrawn before maturity"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Interest paid monthly"
                      secondary="12.5% annual rate, credited monthly to your account"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Secure and guaranteed"
                      secondary="Managed by NSSF with government backing"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValidAmount() || loading}
          sx={{ minWidth: 120 }}
        >
          {loading
            ? "Processing..."
            : `Deposit ${amount ? formatCurrency(parseFloat(amount)) : ""}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SmartLifeDepositModal;
