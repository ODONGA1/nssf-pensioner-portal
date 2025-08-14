import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  Alert,
  Divider,
} from "@mui/material";
import {
  Close,
  Savings,
  PhoneIphone,
  AccountBalance,
  CreditCard,
  Lock,
} from "@mui/icons-material";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  currentBalance: number;
}

interface DepositForm {
  amount: string;
  frequency: string;
  description: string;
  phoneNumber: string;
  bankAccount: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  open,
  onClose,
  currentBalance,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [depositForm, setDepositForm] = useState<DepositForm>({
    amount: "",
    frequency: "one-time",
    description: "",
    phoneNumber: "",
    bankAccount: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedPaymentMethod("");
    setDepositForm({
      amount: "",
      frequency: "one-time",
      description: "",
      phoneNumber: "",
      bankAccount: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
    onClose();
  };

  const handleSubmit = () => {
    // Handle deposit submission here
    alert("Deposit submitted successfully!");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, minHeight: "600px" },
      }}
    >
      <DialogTitle
        sx={{ pb: 1, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Savings sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              Make Deposit to Voluntary Savings
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Amount & Frequency</StepLabel>
          </Step>
          <Step>
            <StepLabel>Payment Method</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirmation</StepLabel>
          </Step>
        </Stepper>

        {/* Step 1: Amount and Frequency */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Deposit Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Deposit Amount"
                  value={depositForm.amount}
                  onChange={(e) =>
                    setDepositForm({ ...depositForm, amount: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">UGX</InputAdornment>
                    ),
                  }}
                  helperText="Minimum deposit: UGX 10,000"
                  type="number"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Deposit Frequency</InputLabel>
                  <Select
                    value={depositForm.frequency}
                    label="Deposit Frequency"
                    onChange={(e) =>
                      setDepositForm({
                        ...depositForm,
                        frequency: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="one-time">One-time Deposit</MenuItem>
                    <MenuItem value="monthly">Monthly Recurring</MenuItem>
                    <MenuItem value="quarterly">Quarterly Recurring</MenuItem>
                    <MenuItem value="annual">Annual Recurring</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  value={depositForm.description}
                  onChange={(e) =>
                    setDepositForm({
                      ...depositForm,
                      description: e.target.value,
                    })
                  }
                  multiline
                  rows={3}
                  placeholder="Add a note about this deposit..."
                />
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Current savings balance:{" "}
                    <strong>{formatCurrency(currentBalance)}</strong>
                  </Typography>
                  <Typography variant="body2">
                    After this deposit:{" "}
                    <strong>
                      {formatCurrency(
                        currentBalance + (parseInt(depositForm.amount) || 0)
                      )}
                    </strong>
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 2: Payment Method */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose Payment Method
            </Typography>

            <RadioGroup
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              {/* Mobile Money */}
              <FormControlLabel
                value="mobile-money"
                control={<Radio />}
                label={
                  <Card variant="outlined" sx={{ p: 2, mb: 2, width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PhoneIphone
                        sx={{ mr: 2, color: "success.main", fontSize: 32 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Mobile Money
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          MTN Mobile Money, Airtel Money
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight="bold"
                      >
                        Instant
                      </Typography>
                    </Box>
                  </Card>
                }
              />

              {/* Bank Transfer */}
              <FormControlLabel
                value="bank-transfer"
                control={<Radio />}
                label={
                  <Card variant="outlined" sx={{ p: 2, mb: 2, width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccountBalance
                        sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Bank Transfer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Direct bank account transfer
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="warning.main"
                        fontWeight="bold"
                      >
                        1-2 days
                      </Typography>
                    </Box>
                  </Card>
                }
              />

              {/* Credit/Debit Card */}
              <FormControlLabel
                value="card"
                control={<Radio />}
                label={
                  <Card variant="outlined" sx={{ p: 2, mb: 2, width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CreditCard
                        sx={{ mr: 2, color: "info.main", fontSize: 32 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Credit/Debit Card
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Visa, Mastercard accepted
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight="bold"
                      >
                        Instant
                      </Typography>
                    </Box>
                  </Card>
                }
              />
            </RadioGroup>

            {/* Payment Method Specific Fields */}
            {selectedPaymentMethod === "mobile-money" && (
              <Card variant="outlined" sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Mobile Money Details
                </Typography>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={depositForm.phoneNumber}
                  onChange={(e) =>
                    setDepositForm({
                      ...depositForm,
                      phoneNumber: e.target.value,
                    })
                  }
                  placeholder="256700000000"
                  helperText="Enter your registered mobile money number"
                />
              </Card>
            )}

            {selectedPaymentMethod === "bank-transfer" && (
              <Card variant="outlined" sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Bank Account Details
                </Typography>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={depositForm.bankAccount}
                  onChange={(e) =>
                    setDepositForm({
                      ...depositForm,
                      bankAccount: e.target.value,
                    })
                  }
                  placeholder="Enter your bank account number"
                />
              </Card>
            )}

            {selectedPaymentMethod === "card" && (
              <Card variant="outlined" sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Card Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      value={depositForm.cardNumber}
                      onChange={(e) =>
                        setDepositForm({
                          ...depositForm,
                          cardNumber: e.target.value,
                        })
                      }
                      placeholder="1234 5678 9012 3456"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      value={depositForm.expiryDate}
                      onChange={(e) =>
                        setDepositForm({
                          ...depositForm,
                          expiryDate: e.target.value,
                        })
                      }
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      value={depositForm.cvv}
                      onChange={(e) =>
                        setDepositForm({ ...depositForm, cvv: e.target.value })
                      }
                      placeholder="123"
                      type="password"
                    />
                  </Grid>
                </Grid>
              </Card>
            )}
          </Box>
        )}

        {/* Step 3: Confirmation */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Your Deposit
            </Typography>

            <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Deposit Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(parseInt(depositForm.amount) || 0)}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Frequency:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {depositForm.frequency.charAt(0).toUpperCase() +
                      depositForm.frequency.slice(1).replace("-", " ")}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {selectedPaymentMethod.charAt(0).toUpperCase() +
                      selectedPaymentMethod.slice(1).replace("-", " ")}
                  </Typography>
                </Grid>

                {depositForm.description && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Description:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {depositForm.description}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Card>

            <Alert severity="success" icon={<Lock />}>
              <Typography variant="body2">
                <strong>Secure Transaction:</strong> Your payment information is
                encrypted and secure. This deposit will be processed immediately
                and added to your voluntary savings account.
              </Typography>
            </Alert>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Once confirmed, this transaction cannot
                be reversed. Please review all details carefully before
                proceeding.
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{ p: 3, borderTop: "1px solid", borderColor: "divider" }}
      >
        {activeStep > 0 && (
          <Button onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
        )}

        <Box sx={{ flex: 1 }} />

        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>

        {activeStep < 2 ? (
          <Button
            variant="contained"
            onClick={() => setActiveStep(activeStep + 1)}
            disabled={
              (activeStep === 0 &&
                (!depositForm.amount ||
                  parseInt(depositForm.amount) < 10000)) ||
              (activeStep === 1 && !selectedPaymentMethod)
            }
            sx={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              "&:hover": {
                background: "linear-gradient(135deg, #5B21B6, #7C3AED)",
              },
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10B981, #059669)",
              "&:hover": {
                background: "linear-gradient(135deg, #047857, #065F46)",
              },
            }}
            onClick={handleSubmit}
          >
            Confirm Deposit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DepositModal;
