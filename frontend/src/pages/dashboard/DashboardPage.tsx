import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import {
  AccountBalance,
  Payment,
  Description,
  Message,
  Person,
  TrendingUp,
  CalendarToday,
  Download,
  Notifications,
  Security,
  Phone,
  Email,
  LocationOn,
  CheckCircle,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for demonstration
  const pensionData = {
    balance: 45750000, // UGX
    monthlyPension: 850000,
    nextPaymentDate: "2025-09-01",
    contributionYears: 32,
    status: "Active",
  };

  const recentTransactions = [
    {
      id: 1,
      date: "2025-08-01",
      amount: 850000,
      type: "Monthly Pension",
      status: "Completed",
      description: "Monthly pension payment",
    },
    {
      id: 2,
      date: "2025-07-01",
      amount: 850000,
      type: "Monthly Pension",
      status: "Completed",
      description: "Monthly pension payment",
    },
    {
      id: 3,
      date: "2025-06-01",
      amount: 850000,
      type: "Monthly Pension",
      status: "Completed",
      description: "Monthly pension payment",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "New Digital Services Available",
      message: "Access more services online through our improved portal",
      date: "2025-08-10",
      priority: "info",
    },
    {
      id: 2,
      title: "Pension Payment Schedule Update",
      message: "September payments will be processed on the 1st of the month",
      date: "2025-08-05",
      priority: "warning",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const downloadDashboardStatement = () => {
    const content = `NSSF PENSIONER DASHBOARD STATEMENT
Generated: ${new Date().toLocaleDateString()}

MEMBER INFORMATION
Name: John Baptiste Mugisha
Member ID: CM62123456789

ACCOUNT OVERVIEW
Total Balance: ${formatCurrency(145750000)}
Monthly Pension: ${formatCurrency(850000)}
Last Payment: ${formatCurrency(850000)} (Dec 1, 2023)
Next Payment: ${formatCurrency(850000)} (Jan 1, 2024)

RECENT TRANSACTIONS
${recentTransactions
  .map(
    (transaction) =>
      `${transaction.date} | ${transaction.description} | ${formatCurrency(
        transaction.amount
      )} | ${transaction.status}`
  )
  .join("\n")}

CURRENT ANNOUNCEMENTS
${announcements
  .map(
    (announcement) =>
      `${announcement.date}: ${announcement.title} - ${announcement.message}`
  )
  .join("\n")}

---
This statement is generated from your NSSF Pensioner Dashboard
For official records, download detailed statements from the Payments section
NSSF Uganda - Plot 101, Jinja Road, Kampala - Tel: +256 312 234 400`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Dashboard_Statement_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handler functions for Quick Actions
  const handleUpdateProfile = () => {
    navigate("/profile");
  };

  const handleContactSupport = () => {
    navigate("/messages");
  };

  const handleSecuritySettings = () => {
    navigate("/profile");
  };

  const handleViewAllTransactions = () => {
    navigate("/payments");
  };

  const handleDownloadAnnouncement = (announcementId: number) => {
    const announcement = announcements.find((a) => a.id === announcementId);
    if (!announcement) return;

    const content = `NSSF ANNOUNCEMENT
Date: ${announcement.date}
Priority: ${announcement.priority.toUpperCase()}

${announcement.title}

${announcement.message}

---
NSSF Uganda - Plot 101, Jinja Road, Kampala
Tel: +256 312 234 400 | Email: info@nssfug.org`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Announcement_${announcementId}_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight="bold"
          color="primary"
        >
          Welcome back, {user?.username || "Pensioner"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your pension account and recent activities.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Account Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            elevation={3}
            sx={{
              background: "linear-gradient(135deg, #1B5E20, #4CAF50)",
              color: "white",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccountBalance sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Balance</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrency(pensionData.balance)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={pensionData.status}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Payment sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
                <Box>
                  <Typography variant="h6" color="text.primary">
                    Monthly Pension
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {formatCurrency(pensionData.monthlyPension)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Next payment: {pensionData.nextPaymentDate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarToday
                  sx={{ fontSize: 40, mr: 2, color: "info.main" }}
                />
                <Box>
                  <Typography variant="h6" color="text.primary">
                    Service Years
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {pensionData.contributionYears}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Years of contributions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUp
                  sx={{ fontSize: 40, mr: 2, color: "success.main" }}
                />
                <Box>
                  <Typography variant="h6" color="text.primary">
                    Growth Rate
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.main"
                  >
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

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Description />}
                  sx={{ py: 1.5 }}
                  onClick={downloadDashboardStatement}
                >
                  Download Statement
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Person />}
                  sx={{ py: 1.5 }}
                  onClick={handleUpdateProfile}
                >
                  Update Profile
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Message />}
                  sx={{ py: 1.5 }}
                  onClick={handleContactSupport}
                >
                  Contact Support
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Security />}
                  sx={{ py: 1.5 }}
                  onClick={handleSecuritySettings}
                >
                  Security Settings
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <List>
                {recentTransactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <Payment />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.type}
                        secondary={`${transaction.date} • ${formatCurrency(
                          transaction.amount
                        )}`}
                      />
                      <Chip
                        label={transaction.status}
                        color="success"
                        size="small"
                        icon={<CheckCircle />}
                      />
                    </ListItem>
                    {index < recentTransactions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleViewAllTransactions}
                >
                  View All Transactions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements & Notifications */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Announcements</Typography>
              </Box>
              {announcements.map((announcement) => (
                <Alert
                  key={announcement.id}
                  severity={announcement.priority as any}
                  sx={{ mb: 2 }}
                  action={
                    <IconButton
                      color="inherit"
                      size="small"
                      onClick={() =>
                        handleDownloadAnnouncement(announcement.id)
                      }
                    >
                      <Download />
                    </IconButton>
                  }
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {announcement.title}
                  </Typography>
                  <Typography variant="body2">
                    {announcement.message}
                  </Typography>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom>
              Need Assistance?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle2">
                      Customer Service
                    </Typography>
                    <Typography variant="body2">+256 414 342 891</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Email sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle2">Email Support</Typography>
                    <Typography variant="body2">
                      customerservice@nssfug.org
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn sx={{ mr: 2, color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle2">Visit Us</Typography>
                    <Typography variant="body2">NSSF House, Kampala</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
