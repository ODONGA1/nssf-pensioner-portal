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
  LinearProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  CalendarToday,
  Download,
  ExpandMore,
  CheckCircle,
  Schedule,
  Info,
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
      id={`benefits-tabpanel-${index}`}
      aria-labelledby={`benefits-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const BenefitsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data
  const benefitSummary = {
    totalContributions: 125000000,
    currentBalance: 145750000,
    monthlyPension: 850000,
    projectedPension: 950000,
    contributionPeriod: "1992 - 2024",
    pensionStartDate: "2024-06-01",
  };

  const contributionHistory = [
    {
      year: 2024,
      employee: 2400000,
      employer: 2400000,
      total: 4800000,
      status: "Current",
    },
    {
      year: 2023,
      employee: 2300000,
      employer: 2300000,
      total: 4600000,
      status: "Completed",
    },
    {
      year: 2022,
      employee: 2200000,
      employer: 2200000,
      total: 4400000,
      status: "Completed",
    },
    {
      year: 2021,
      employee: 2100000,
      employer: 2100000,
      total: 4200000,
      status: "Completed",
    },
    {
      year: 2020,
      employee: 2000000,
      employer: 2000000,
      total: 4000000,
      status: "Completed",
    },
  ];

  const pensionCalculation = {
    avgMonthlyIncome: 2500000,
    serviceYears: 32,
    accrualRate: 0.025,
    calculatedPension: 850000,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const downloadContributionHistory = () => {
    const csvContent = [
      "Year,Employee Contribution,Employer Contribution,Total Annual,Status",
      ...contributionHistory.map(
        (row) =>
          `${row.year},${row.employee},${row.employer},${row.total},${row.status}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Contribution_History_${new Date().getFullYear()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadBenefitsSummary = () => {
    const content = `NSSF PENSIONER BENEFITS SUMMARY
Generated: ${new Date().toLocaleDateString()}

MEMBER INFORMATION
Name: John Baptiste Mugisha
Member ID: CM62123456789

CURRENT BENEFITS
Total Balance: ${formatCurrency(benefitSummary.currentBalance)}
Monthly Pension: ${formatCurrency(benefitSummary.monthlyPension)}
Service Period: ${benefitSummary.contributionPeriod}
Years of Service: 32 years

CONTRIBUTION HISTORY
${contributionHistory
  .map(
    (row) =>
      `${row.year}: Employee ${formatCurrency(
        row.employee
      )}, Employer ${formatCurrency(row.employer)}, Total ${formatCurrency(
        row.total
      )}`
  )
  .join("\n")}

PENSION CALCULATION
Average Monthly Income: ${formatCurrency(pensionCalculation.avgMonthlyIncome)}
Years of Service: ${pensionCalculation.serviceYears}
Accrual Rate: ${(pensionCalculation.accrualRate * 100).toFixed(1)}% per year
Monthly Pension: ${formatCurrency(pensionCalculation.calculatedPension)}

---
This document is generated from the NSSF Pensioner Self-Service Portal
For official verification, contact NSSF at +256 312 234 400`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Benefits_Summary_${new Date().getFullYear()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
          Benefits Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detailed information about your pension benefits and contributions
        </Typography>
      </Box>

      {/* Benefits Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <AccountBalance />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="primary">
                    Total Balance
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(benefitSummary.currentBalance)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Including interest and contributions
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
                    Monthly Pension
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(benefitSummary.monthlyPension)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Current monthly benefit
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="info.main">
                    Service Period
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    32 Years
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {benefitSummary.contributionPeriod}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="warning.main">
                    Growth Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    12.5%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Annual interest rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Information Tabs */}
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="benefits tabs"
          >
            <Tab label="Contribution History" />
            <Tab label="Pension Calculation" />
            <Tab label="Benefits Details" />
            <Tab label="Projections" />
          </Tabs>
        </Box>

        {/* Contribution History Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Annual Contribution History
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Your contributions are matched equally by your employer as per
              NSSF regulations.
            </Alert>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Year</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Employee Contribution</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Employer Contribution</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Total Annual</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contributionHistory.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.employee)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.employer)}
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(row.total)}</strong>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === "Current" ? "primary" : "success"}
                        size="small"
                        icon={
                          row.status === "Current" ? (
                            <Schedule />
                          ) : (
                            <CheckCircle />
                          )
                        }
                      />
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
              onClick={downloadContributionHistory}
              sx={{ mr: 2 }}
            >
              Download Full Contribution History
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={downloadBenefitsSummary}
            >
              Download Benefits Summary
            </Button>
          </Box>
        </TabPanel>

        {/* Pension Calculation Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            How Your Pension is Calculated
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Info color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Average Monthly Income"
                    secondary={formatCurrency(
                      pensionCalculation.avgMonthlyIncome
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Years of Service"
                    secondary={`${pensionCalculation.serviceYears} years`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Accrual Rate"
                    secondary={`${(
                      pensionCalculation.accrualRate * 100
                    ).toFixed(1)}% per year of service`}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{ p: 3, bgcolor: "primary.main", color: "white" }}
              >
                <Typography variant="h6" gutterBottom>
                  Monthly Pension Calculation
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {formatCurrency(pensionCalculation.avgMonthlyIncome)} ×{" "}
                  {pensionCalculation.serviceYears} ×{" "}
                  {(pensionCalculation.accrualRate * 100).toFixed(1)}%
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  = {formatCurrency(pensionCalculation.calculatedPension)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Benefits Details Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Available Benefits
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Monthly Pension
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Regular monthly payments based on your contribution history
                    and years of service. Payments are made on the 1st of each
                    month.
                  </Typography>
                  <Typography variant="body2">
                    <strong>Current Amount:</strong>{" "}
                    {formatCurrency(benefitSummary.monthlyPension)}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Medical Benefits
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Access to medical care through NSSF-affiliated healthcare
                    providers. Coverage includes routine checkups and emergency
                    care.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Death Benefits
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Survivor benefits for your designated beneficiaries in case
                    of death. Includes lump sum payment and ongoing support for
                    dependents.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Partial Withdrawals
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    Limited withdrawals may be available under specific
                    circumstances such as emigration or terminal illness.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Projections Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Future Projections
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            These projections are estimates based on current rates and may vary
            with economic conditions.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  5-Year Projection
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Expected balance growth with 12.5% annual interest
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {formatCurrency(
                      benefitSummary.currentBalance * Math.pow(1.125, 5)
                    )}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                    color="success"
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Inflation-Adjusted Pension
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Monthly pension adjusted for 5% annual inflation
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    {formatCurrency(
                      benefitSummary.monthlyPension * Math.pow(1.05, 5)
                    )}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={60}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                    color="warning"
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default BenefitsPage;
