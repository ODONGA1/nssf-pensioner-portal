import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Close, CheckCircle, Info, Warning, Upload } from "@mui/icons-material";

interface MidtermAccessModalProps {
  open: boolean;
  onClose: () => void;
  memberData: {
    age: number;
    contributionYears: number;
    totalBenefits: number;
    isDisabled: boolean;
    membershipStartDate: string;
  };
}

const MidtermAccessModal: React.FC<MidtermAccessModalProps> = ({
  open,
  onClose,
  memberData,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    requestType: "",
    requestAmount: "",
    bankDetails: {
      accountNumber: "",
      bankName: "",
      accountName: "",
      branchName: "",
    },
    documents: {
      photograph: null as File | null,
      nationalId: null as File | null,
      bankSlip: null as File | null,
      disabilityLetter: null as File | null,
    },
    declaration: false,
    termsAccepted: false,
  });

  const steps = [
    "Eligibility Check",
    "Request Details",
    "Documents",
    "Review & Submit",
  ];

  // Calculate eligibility
  const calculateEligibility = () => {
    const isAgeEligible = memberData.isDisabled
      ? memberData.age >= 40
      : memberData.age >= 45;
    const hasMinContributions = memberData.contributionYears >= 10;
    const maxAccessPercentage = memberData.isDisabled ? 50 : 20;
    const maxAccessAmount =
      (memberData.totalBenefits * maxAccessPercentage) / 100;

    return {
      isEligible: isAgeEligible && hasMinContributions,
      category: memberData.isDisabled
        ? "Person with Disability"
        : "Regular Member",
      maxAccessPercentage,
      maxAccessAmount,
      ageRequirement: memberData.isDisabled ? 40 : 45,
      contributionRequirement: 10,
      reasons: {
        age: isAgeEligible,
        contributions: hasMinContributions,
      },
    };
  };

  const eligibility = calculateEligibility();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => {
        if (parent === "bankDetails") {
          return {
            ...prev,
            bankDetails: {
              ...prev.bankDetails,
              [child]: value,
            },
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFileUpload = (documentType: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file,
      },
    }));
  };

  const handleSubmit = () => {
    // Here you would submit the application to the backend
    console.log("Submitting mid-term access application:", formData);
    alert(
      "Your mid-term access application has been submitted successfully! You will receive a confirmation email shortly."
    );
    onClose();
  };

  const renderEligibilityCheck = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mid-term Access Eligibility Assessment
      </Typography>

      <Card
        sx={{
          mb: 3,
          borderLeft: `4px solid ${
            eligibility.isEligible ? "#4caf50" : "#f44336"
          }`,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            {eligibility.isEligible ? (
              <CheckCircle sx={{ color: "success.main", mr: 1 }} />
            ) : (
              <Warning sx={{ color: "error.main", mr: 1 }} />
            )}
            <Typography variant="h6">
              {eligibility.isEligible
                ? "You are eligible for mid-term access!"
                : "You are not currently eligible"}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Category: <strong>{eligibility.category}</strong>
          </Typography>

          {eligibility.isEligible && (
            <Alert severity="success" sx={{ mt: 2 }}>
              You can access up to{" "}
              <strong>{eligibility.maxAccessPercentage}%</strong> of your
              accrued benefits (UGX{" "}
              {eligibility.maxAccessAmount.toLocaleString()})
            </Alert>
          )}
        </CardContent>
      </Card>

      <Typography variant="subtitle1" gutterBottom>
        Eligibility Requirements:
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <CheckCircle
              color={eligibility.reasons.age ? "success" : "error"}
            />
          </ListItemIcon>
          <ListItemText
            primary={`Age: ${eligibility.ageRequirement}+ years`}
            secondary={`Your age: ${memberData.age} years`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <CheckCircle
              color={eligibility.reasons.contributions ? "success" : "error"}
            />
          </ListItemIcon>
          <ListItemText
            primary={`Contributions: ${eligibility.contributionRequirement}+ years`}
            secondary={`Your contributions: ${memberData.contributionYears} years`}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <Info color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Benefit Processing Time"
            secondary="Applications are processed within 10 business days"
          />
        </ListItem>
      </List>

      {!eligibility.isEligible && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {!eligibility.reasons.age &&
            `You need to be at least ${eligibility.ageRequirement} years old. `}
          {!eligibility.reasons.contributions &&
            `You need at least ${eligibility.contributionRequirement} years of contributions. `}
        </Alert>
      )}
    </Box>
  );

  const renderRequestDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Request Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Request Type</InputLabel>
            <Select
              value={formData.requestType}
              onChange={(e) => handleInputChange("requestType", e.target.value)}
              label="Request Type"
            >
              <MenuItem value="financial_hardship">Financial Hardship</MenuItem>
              <MenuItem value="medical_emergency">Medical Emergency</MenuItem>
              <MenuItem value="education">Education Expenses</MenuItem>
              <MenuItem value="housing">Housing/Property Purchase</MenuItem>
              <MenuItem value="business_investment">
                Business Investment
              </MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Request Amount"
            type="number"
            value={formData.requestAmount}
            onChange={(e) => handleInputChange("requestAmount", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">UGX</InputAdornment>
              ),
            }}
            helperText={`Maximum allowed: UGX ${eligibility.maxAccessAmount.toLocaleString()}`}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Bank Account Details
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Account Number"
            value={formData.bankDetails.accountNumber}
            onChange={(e) =>
              handleInputChange("bankDetails.accountNumber", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bank Name"
            value={formData.bankDetails.bankName}
            onChange={(e) =>
              handleInputChange("bankDetails.bankName", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Account Name"
            value={formData.bankDetails.accountName}
            onChange={(e) =>
              handleInputChange("bankDetails.accountName", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Branch Name"
            value={formData.bankDetails.branchName}
            onChange={(e) =>
              handleInputChange("bankDetails.branchName", e.target.value)
            }
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderDocuments = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Required Documents
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please upload clear, legible copies of the following documents. All
        documents must be current and valid.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                1. Current Passport-size Photograph
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload("photograph", e.target.files?.[0] || null)
                }
                style={{ display: "none" }}
                id="photograph-upload"
              />
              <label htmlFor="photograph-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                >
                  Upload Photograph
                </Button>
              </label>
              {formData.documents.photograph && (
                <Chip
                  label={formData.documents.photograph.name}
                  sx={{ ml: 2 }}
                  color="success"
                  icon={<CheckCircle />}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                2. Valid Personal Identification
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                National ID, Driving Permit, Passport, or Financial Card
              </Typography>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleFileUpload("nationalId", e.target.files?.[0] || null)
                }
                style={{ display: "none" }}
                id="nationalid-upload"
              />
              <label htmlFor="nationalid-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                >
                  Upload ID Document
                </Button>
              </label>
              {formData.documents.nationalId && (
                <Chip
                  label={formData.documents.nationalId.name}
                  sx={{ ml: 2 }}
                  color="success"
                  icon={<CheckCircle />}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                3. Proof of Bank Account Details
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Bank slip, bank statement, or letter from bank confirming
                account details
              </Typography>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleFileUpload("bankSlip", e.target.files?.[0] || null)
                }
                style={{ display: "none" }}
                id="bankslip-upload"
              />
              <label htmlFor="bankslip-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                >
                  Upload Bank Document
                </Button>
              </label>
              {formData.documents.bankSlip && (
                <Chip
                  label={formData.documents.bankSlip.name}
                  sx={{ ml: 2 }}
                  color="success"
                  icon={<CheckCircle />}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {memberData.isDisabled && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  4. Disability Certificate
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Letter from the National Council for Persons with Disabilities
                  Uganda
                </Typography>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    handleFileUpload(
                      "disabilityLetter",
                      e.target.files?.[0] || null
                    )
                  }
                  style={{ display: "none" }}
                  id="disability-upload"
                />
                <label htmlFor="disability-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                  >
                    Upload Disability Certificate
                  </Button>
                </label>
                {formData.documents.disabilityLetter && (
                  <Chip
                    label={formData.documents.disabilityLetter.name}
                    sx={{ ml: 2 }}
                    color="success"
                    icon={<CheckCircle />}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderReviewSubmit = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review & Submit Application
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Application Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Request Type:
              </Typography>
              <Typography variant="body1">
                {formData.requestType.replace("_", " ").toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Request Amount:
              </Typography>
              <Typography variant="body1">
                UGX {parseInt(formData.requestAmount || "0").toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Bank Account:
              </Typography>
              <Typography variant="body1">
                {formData.bankDetails.accountNumber} -{" "}
                {formData.bankDetails.bankName}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Documents Uploaded
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle
                  color={formData.documents.photograph ? "success" : "disabled"}
                />
              </ListItemIcon>
              <ListItemText primary="Passport-size Photograph" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle
                  color={formData.documents.nationalId ? "success" : "disabled"}
                />
              </ListItemIcon>
              <ListItemText primary="Personal Identification" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle
                  color={formData.documents.bankSlip ? "success" : "disabled"}
                />
              </ListItemIcon>
              <ListItemText primary="Bank Account Proof" />
            </ListItem>
            {memberData.isDisabled && (
              <ListItem>
                <ListItemIcon>
                  <CheckCircle
                    color={
                      formData.documents.disabilityLetter
                        ? "success"
                        : "disabled"
                    }
                  />
                </ListItemIcon>
                <ListItemText primary="Disability Certificate" />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.declaration}
              onChange={(e) =>
                handleInputChange("declaration", e.target.checked)
              }
            />
          }
          label="I declare that all information provided is true and accurate to the best of my knowledge."
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.termsAccepted}
              onChange={(e) =>
                handleInputChange("termsAccepted", e.target.checked)
              }
            />
          }
          label="I accept the terms and conditions for mid-term access benefits."
        />
      </Box>

      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Please note: Once submitted, this application cannot be modified.
          Ensure all details are correct before submitting. Processing time is
          typically 10 business days from the date of submission.
        </Typography>
      </Alert>
    </Box>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderEligibilityCheck();
      case 1:
        return renderRequestDetails();
      case 2:
        return renderDocuments();
      case 3:
        return renderReviewSubmit();
      default:
        return "Unknown step";
    }
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 0:
        return eligibility.isEligible;
      case 1:
        return !!(
          formData.requestType &&
          formData.requestAmount &&
          formData.bankDetails.accountNumber &&
          formData.bankDetails.bankName
        );
      case 2:
        const requiredDocs = memberData.isDisabled ? 4 : 3;
        const uploadedDocs = Object.values(formData.documents).filter(
          (doc) => doc !== null
        ).length;
        return uploadedDocs >= requiredDocs;
      case 3:
        return !!(formData.declaration && formData.termsAccepted);
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Mid-term Access Application</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ width: "100%", mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={isStepComplete(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepComplete(activeStep)}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isStepComplete(activeStep)}
            color="primary"
          >
            Submit Application
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MidtermAccessModal;
