import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Security,
  CheckCircle,
  VpnKey,
} from "@mui/icons-material";

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

interface ResetData {
  nssfNumber: string;
  contactMethod: "email" | "sms";
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [resetData, setResetData] = useState<ResetData>({
    nssfNumber: "",
    contactMethod: "email",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Security: Track reset attempts to prevent abuse
  const [attemptCount, setAttemptCount] = useState(0);
  const maxAttempts = 3;
  const [lastAttemptTime, setLastAttemptTime] = useState<Date | null>(null);

  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const steps = [
    "Verify Identity",
    "Choose Verification Method",
    "Enter Verification Code",
    "Set New Password",
  ];

  const handleClose = () => {
    // Reset all state when closing
    setActiveStep(0);
    setLoading(false);
    setError("");
    setSuccess("");
    setResetData({
      nssfNumber: "",
      contactMethod: "email",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    });
    setAttemptCount(0);
    setLastAttemptTime(null);
    onClose();
  };

  const checkRateLimit = (): boolean => {
    if (attemptCount >= maxAttempts) {
      const timeDiff = lastAttemptTime
        ? (new Date().getTime() - lastAttemptTime.getTime()) / 1000 / 60
        : 0;
      if (timeDiff < 15) {
        // 15 minute lockout
        setError(
          `Too many attempts. Please wait ${Math.ceil(
            15 - timeDiff
          )} minutes before trying again.`
        );
        return false;
      } else {
        // Reset attempts after lockout period
        setAttemptCount(0);
        setLastAttemptTime(null);
      }
    }
    return true;
  };

  const validateNSSFNumber = (nssfNumber: string): boolean => {
    // NSSF number validation (example format: NSS-12345678)
    const nssfRegex = /^(NSS-?)?\d{8,12}$/i;
    return nssfRegex.test(nssfNumber.replace(/\s/g, ""));
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    if (!/\d/.test(password)) errors.push("At least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("At least one special character");
    return errors;
  };

  const handleStepOne = async () => {
    if (!checkRateLimit()) return;

    setError("");
    setLoading(true);

    try {
      if (!resetData.nssfNumber.trim()) {
        throw new Error("Please enter your NSSF number");
      }

      if (!validateNSSFNumber(resetData.nssfNumber)) {
        throw new Error(
          "Invalid NSSF number format. Please enter a valid NSSF number."
        );
      }

      // Real API call to verify NSSF number
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/forgot-password/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nssfNumber: resetData.nssfNumber }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSessionToken(data.sessionToken);
        setSuccess("NSSF number verified successfully");
        setActiveStep(1);
      } else {
        throw new Error(data.message || "Failed to verify NSSF number");
      }
    } catch (err: any) {
      setAttemptCount((prev) => prev + 1);
      setLastAttemptTime(new Date());
      setError(err.message || "Failed to verify NSSF number");
    } finally {
      setLoading(false);
    }
  };

  const handleStepTwo = async () => {
    setError("");
    setLoading(true);

    try {
      // Real API call to send verification code
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/forgot-password/send-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionToken,
            method: resetData.contactMethod,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const method = resetData.contactMethod === "email" ? "email" : "SMS";
        setSuccess(`Verification code sent to your registered ${method}`);
        setActiveStep(2);
      } else {
        throw new Error(data.message || "Failed to send verification code");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleStepThree = async () => {
    setError("");
    setLoading(true);

    try {
      if (!resetData.verificationCode.trim()) {
        throw new Error("Please enter the verification code");
      }

      if (resetData.verificationCode.length !== 6) {
        throw new Error("Verification code must be 6 digits");
      }

      // Real API call to verify code
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/forgot-password/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionToken,
            verificationCode: resetData.verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Verification code confirmed");
        setActiveStep(3);
      } else {
        throw new Error(data.message || "Invalid verification code");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleStepFour = async () => {
    setError("");
    setLoading(true);

    try {
      const passwordErrors = validatePassword(resetData.newPassword);
      if (passwordErrors.length > 0) {
        throw new Error(`Password requirements: ${passwordErrors.join(", ")}`);
      }

      if (resetData.newPassword !== resetData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Real API call to reset password
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/forgot-password/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionToken,
            newPassword: resetData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Password reset successfully! You can now login with your new password."
        );

        // Auto-close after success
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    switch (activeStep) {
      case 0:
        handleStepOne();
        break;
      case 1:
        handleStepTwo();
        break;
      case 2:
        handleStepThree();
        break;
      case 3:
        handleStepFour();
        break;
    }
  };

  const handleBack = () => {
    setError("");
    setSuccess("");
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your NSSF number to begin the password reset process.
            </Typography>
            <TextField
              fullWidth
              label="NSSF Number"
              placeholder="Enter your NSSF number"
              value={resetData.nssfNumber}
              onChange={(e) =>
                setResetData((prev) => ({
                  ...prev,
                  nssfNumber: e.target.value,
                }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="Format: NSS-12345678 or 12345678"
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how you'd like to receive your verification code:
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <Button
                variant={
                  resetData.contactMethod === "email" ? "contained" : "outlined"
                }
                startIcon={<Email />}
                onClick={() =>
                  setResetData((prev) => ({ ...prev, contactMethod: "email" }))
                }
                sx={{
                  justifyContent: "flex-start",
                  p: 2,
                  background:
                    resetData.contactMethod === "email"
                      ? "linear-gradient(45deg, #003876, #FF6B35)"
                      : undefined,
                }}
              >
                Send to registered email address
              </Button>
              <Button
                variant={
                  resetData.contactMethod === "sms" ? "contained" : "outlined"
                }
                startIcon={<Phone />}
                onClick={() =>
                  setResetData((prev) => ({ ...prev, contactMethod: "sms" }))
                }
                sx={{
                  justifyContent: "flex-start",
                  p: 2,
                  background:
                    resetData.contactMethod === "sms"
                      ? "linear-gradient(45deg, #003876, #FF6B35)"
                      : undefined,
                }}
              >
                Send SMS to registered phone number
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the 6-digit verification code sent to your{" "}
              {resetData.contactMethod === "email" ? "email" : "phone"}.
            </Typography>
            <TextField
              fullWidth
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={resetData.verificationCode}
              onChange={(e) =>
                setResetData((prev) => ({
                  ...prev,
                  verificationCode: e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6),
                }))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="For demo purposes, use: 123456"
            />
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a strong new password for your account.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={resetData.newPassword}
                onChange={(e) =>
                  setResetData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={resetData.confirmPassword}
                onChange={(e) =>
                  setResetData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Password Requirements:
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}
                >
                  {[
                    "8+ characters",
                    "Uppercase letter",
                    "Lowercase letter",
                    "Number",
                    "Special character",
                  ].map((req) => (
                    <Chip
                      key={req}
                      label={req}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #003876 0%, #FF6B35 100%)",
          color: "white",
          textAlign: "center",
          py: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Security />
          <Typography variant="h6" fontWeight="bold">
            Reset Password
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircle />}>
            {success}
          </Alert>
        )}

        {renderStepContent()}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
        <Button
          onClick={activeStep === 0 ? handleClose : handleBack}
          disabled={loading}
        >
          {activeStep === 0 ? "Cancel" : "Back"}
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          sx={{
            background: "linear-gradient(45deg, #003876, #FF6B35)",
            "&:hover": {
              background: "linear-gradient(45deg, #001f3f, #E5522F)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : activeStep === steps.length - 1 ? (
            "Reset Password"
          ) : (
            "Next"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword;
