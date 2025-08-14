import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Payment,
  AccountBalance,
  Download,
  Visibility,
  MoreVert,
  Print,
  CheckCircle,
  Schedule,
  Error,
  CalendarMonth,
  TrendingUp,
  Receipt,
  NotificationsActive,
} from "@mui/icons-material";

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
      id={`payments-tabpanel-${index}`}
      aria-labelledby={`payments-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PaymentsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [bankUpdateOpen, setBankUpdateOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    payment: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const handleViewDetails = () => {
    setPaymentDetailsOpen(true);
    handleMenuClose();
  };

  const handleBankUpdate = () => {
    setBankUpdateOpen(true);
    handleMenuClose();
  };

  // Mock data
  const paymentSummary = {
    nextPaymentDate: "2024-01-01",
    nextPaymentAmount: 850000,
    totalPaidThisYear: 10200000,
    averageMonthlyPayment: 850000,
    paymentMethod: "Bank Transfer",
    bankAccount: "****-****-1234",
  };

  const recentPayments = [
    {
      id: "PAY-2023-12",
      date: "2023-12-01",
      amount: 850000,
      status: "Completed",
      method: "Bank Transfer",
      reference: "NSSF-231201-001",
      tax: 0,
      net: 850000,
    },
    {
      id: "PAY-2023-11",
      date: "2023-11-01",
      amount: 850000,
      status: "Completed",
      method: "Bank Transfer",
      reference: "NSSF-231101-001",
      tax: 0,
      net: 850000,
    },
    {
      id: "PAY-2023-10",
      date: "2023-10-01",
      amount: 850000,
      status: "Completed",
      method: "Bank Transfer",
      reference: "NSSF-231001-001",
      tax: 0,
      net: 850000,
    },
    {
      id: "PAY-2023-09",
      date: "2023-09-01",
      amount: 850000,
      status: "Completed",
      method: "Bank Transfer",
      reference: "NSSF-230901-001",
      tax: 0,
      net: 850000,
    },
    {
      id: "PAY-2023-08",
      date: "2023-08-01",
      amount: 850000,
      status: "Processing",
      method: "Bank Transfer",
      reference: "NSSF-230801-001",
      tax: 0,
      net: 850000,
    },
  ];

  const paymentStats = [
    { label: "Total Payments Received", value: 102000000, period: "Lifetime" },
    { label: "This Year Total", value: 10200000, period: "2023" },
    { label: "Average Monthly", value: 850000, period: "Last 12 months" },
    { label: "Tax Deducted", value: 0, period: "This year" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-UG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const downloadPaymentHistory = () => {
    const csvContent = [
      "Payment Date,Reference,Gross Amount,Tax,Net Amount,Status,Method",
      ...recentPayments.map(
        (payment) =>
          `${formatDate(payment.date)},${payment.reference},${payment.amount},${
            payment.tax
          },${payment.net},${payment.status},${payment.method}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Payment_History_${new Date().getFullYear()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadAnnualStatement = () => {
    const content = `NSSF PENSIONER ANNUAL STATEMENT
Generated: ${new Date().toLocaleDateString()}
Year: ${new Date().getFullYear()}

MEMBER INFORMATION
Name: John Baptiste Mugisha
Member ID: CM62123456789
Payment Method: ${paymentSummary.paymentMethod}
Bank Account: ${paymentSummary.bankAccount}

PAYMENT SUMMARY
Total Paid This Year: ${formatCurrency(paymentSummary.totalPaidThisYear)}
Average Monthly Payment: ${formatCurrency(paymentSummary.averageMonthlyPayment)}
Next Payment Date: ${formatDate(paymentSummary.nextPaymentDate)}
Next Payment Amount: ${formatCurrency(paymentSummary.nextPaymentAmount)}

PAYMENT HISTORY
${recentPayments
  .map(
    (payment) =>
      `${formatDate(payment.date)} | ${payment.reference} | ${formatCurrency(
        payment.net
      )} | ${payment.status}`
  )
  .join("\n")}

TAX INFORMATION
Tax Deducted This Year: ${formatCurrency(0)}
Tax Status: Exempt (Pension payments are tax-exempt under URA regulations)

---
This is an official statement from NSSF Uganda
For inquiries, contact us at +256 312 234 400
Plot 101, Jinja Road, Kampala`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Annual_Statement_${new Date().getFullYear()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadPaymentReceipt = (payment: any) => {
    const content = `NSSF PENSION PAYMENT RECEIPT
Receipt Generated: ${new Date().toLocaleDateString()}

MEMBER INFORMATION
Name: John Baptiste Mugisha
Member ID: CM62123456789

PAYMENT DETAILS
Payment Reference: ${payment.reference}
Payment Date: ${formatDate(payment.date)}
Gross Amount: ${formatCurrency(payment.amount)}
Tax Deducted: ${formatCurrency(payment.tax)}
Net Amount: ${formatCurrency(payment.net)}
Payment Method: ${payment.method}
Status: ${payment.status}

BANK DETAILS
Account: ${paymentSummary.bankAccount}
Payment Method: ${paymentSummary.paymentMethod}

---
This is an official receipt from NSSF Uganda
Keep this receipt for your records
For inquiries, contact us at +256 312 234 400`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Payment_Receipt_${payment.reference}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadTaxCertificate = () => {
    const content = `NSSF TAX CERTIFICATE
Certificate Generated: ${new Date().toLocaleDateString()}

MEMBER INFORMATION
Name: John Baptiste Mugisha
Member ID: CM62123456789
Tax Year: 2023

PENSION TAX INFORMATION
Total Pension Payments: ${formatCurrency(paymentSummary.totalPaidThisYear)}
Tax Deducted: ${formatCurrency(0)}
Tax Rate Applied: 0% (Tax Exempt)

CERTIFICATION
This is to certify that the above-named person received pension payments
from the National Social Security Fund (NSSF) Uganda during the tax year 2023.

Under the Income Tax Act of Uganda, pension payments from NSSF are exempt
from taxation as per Section 21(1)(r) of the Act.

---
NSSF Uganda
Plot 101, Jinja Road, Kampala
Tel: +256 312 234 400
This is an official document for tax purposes.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Tax_Certificate_2023.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadTaxExemptionLetter = () => {
    const content = `NSSF TAX EXEMPTION LETTER
Letter Generated: ${new Date().toLocaleDateString()}

TO WHOM IT MAY CONCERN

SUBJECT: TAX EXEMPTION CERTIFICATE FOR PENSION PAYMENTS

This is to certify that Mr./Mrs. John Baptiste Mugisha, Member ID: CM62123456789,
is a registered pensioner with the National Social Security Fund (NSSF) Uganda.

EXEMPTION DETAILS:
- Member Status: Active Pensioner
- Pension Start Date: June 1, 2024
- Monthly Pension Amount: ${formatCurrency(850000)}
- Legal Basis: Income Tax Act of Uganda, Section 21(1)(r)

LEGAL FRAMEWORK:
Under the Income Tax Act of Uganda, specifically Section 21(1)(r), payments
received from pension schemes established under the National Social Security
Fund Act are exempt from income tax.

This exemption applies to all pension payments received by the above-named
member from NSSF Uganda.

This letter serves as official documentation for tax exemption purposes and
may be presented to Uganda Revenue Authority or other relevant tax authorities.

For verification of this exemption, please contact:
NSSF Uganda
Plot 101, Jinja Road, Kampala
Tel: +256 312 234 400
Email: info@nssfug.org

---
Issued by: NSSF Uganda
Date: ${new Date().toLocaleDateString()}
This is an official document.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Tax_Exemption_Letter.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Processing":
        return "warning";
      case "Failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle />;
      case "Processing":
        return <Schedule />;
      case "Failed":
        return <Error />;
      default:
        return <Schedule />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight="bold"
          color="primary"
        >
          Payment History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your pension payments and manage payment preferences
        </Typography>
      </Box>

      {/* Payment Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <CalendarMonth />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="primary">
                    Next Payment
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(paymentSummary.nextPaymentAmount)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Due: {formatDate(paymentSummary.nextPaymentDate)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="success.main">
                    Year Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(paymentSummary.totalPaidThisYear)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Received in 2023
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <Payment />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="info.main">
                    Payment Method
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {paymentSummary.paymentMethod}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Account: {paymentSummary.bankAccount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <AccountBalance />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="warning.main">
                    Monthly Average
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(paymentSummary.averageMonthlyPayment)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last 12 months
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Information Tabs */}
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="payment tabs"
          >
            <Tab label="Recent Payments" />
            <Tab label="Payment Statistics" />
            <Tab label="Payment Settings" />
            <Tab label="Tax Information" />
          </Tabs>
        </Box>

        {/* Recent Payments Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment History
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Payments are processed on the 1st business day of each month. View
              individual payment details by clicking the menu.
            </Alert>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Payment Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Reference</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Gross Amount</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Tax</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Net Amount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>{payment.reference}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(payment.tax)}
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(payment.net)}</strong>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={getStatusColor(payment.status) as any}
                        size="small"
                        icon={getStatusIcon(payment.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, payment)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ mr: 2 }}
              onClick={downloadPaymentHistory}
            >
              Download Payment History
            </Button>
            <Button
              variant="outlined"
              startIcon={<Receipt />}
              onClick={downloadAnnualStatement}
            >
              Download Annual Statement
            </Button>
          </Box>
        </TabPanel>

        {/* Payment Statistics Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Payment Statistics
          </Typography>

          <Grid container spacing={3}>
            {paymentStats.map((stat, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {formatCurrency(stat.value)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.period}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Alert severity="success">
              Your payments are up to date and processed regularly. No missed
              payments detected.
            </Alert>
          </Box>
        </TabPanel>

        {/* Payment Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Payment Preferences
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Bank Account Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Bank Name"
                      secondary="Stanbic Bank Uganda"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Payment color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Account Number"
                      secondary="****-****-1234"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Account Status"
                      secondary="Verified"
                    />
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  startIcon={<AccountBalance />}
                  onClick={handleBankUpdate}
                  sx={{ mt: 2 }}
                >
                  Update Bank Details
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Notification Preferences
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsActive color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Notifications"
                      secondary="Email and SMS alerts enabled"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Receipt color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Receipts"
                      secondary="Automatic email delivery"
                    />
                  </ListItem>
                </List>
                <Button
                  variant="outlined"
                  startIcon={<NotificationsActive />}
                  sx={{ mt: 2 }}
                >
                  Update Notifications
                </Button>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tax Information Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Tax Information
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Pension payments from NSSF are currently tax-exempt under Uganda
            Revenue Authority regulations.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  2023 Tax Summary
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Total Gross Payments"
                      secondary={formatCurrency(
                        paymentSummary.totalPaidThisYear
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Tax Deducted"
                      secondary={formatCurrency(0)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Net Payments"
                      secondary={formatCurrency(
                        paymentSummary.totalPaidThisYear
                      )}
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Tax Documents
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Download your annual tax statements and certificates.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                  sx={{ mb: 2 }}
                  onClick={downloadTaxCertificate}
                >
                  Download 2023 Tax Certificate
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                  onClick={downloadTaxExemptionLetter}
                >
                  Download Tax Exemption Letter
                </Button>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Payment Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            downloadPaymentReceipt(selectedPayment);
            handleMenuClose();
          }}
        >
          <Download sx={{ mr: 1 }} />
          Download Receipt
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <Print sx={{ mr: 1 }} />
          Print Receipt
        </MenuItem>
      </Menu>

      {/* Payment Details Dialog */}
      <Dialog
        open={paymentDetailsOpen}
        onClose={() => setPaymentDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment Reference: {selectedPayment.reference}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedPayment.date)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(selectedPayment.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Method
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.method}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedPayment.status}
                    color={getStatusColor(selectedPayment.status) as any}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDetailsOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              downloadPaymentReceipt(selectedPayment);
              setPaymentDetailsOpen(false);
            }}
          >
            Download Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bank Update Dialog */}
      <Dialog
        open={bankUpdateOpen}
        onClose={() => setBankUpdateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Bank Details</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Bank Name"
              defaultValue="Stanbic Bank Uganda"
              margin="normal"
            />
            <TextField fullWidth label="Account Number" margin="normal" />
            <TextField fullWidth label="Account Name" margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>Account Type</InputLabel>
              <Select defaultValue="savings">
                <MenuItem value="savings">Savings Account</MenuItem>
                <MenuItem value="current">Current Account</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBankUpdateOpen(false)}>Cancel</Button>
          <Button variant="contained">Update Details</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsPage;
