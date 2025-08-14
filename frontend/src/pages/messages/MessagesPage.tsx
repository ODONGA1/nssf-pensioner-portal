import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
  Alert,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Menu,
} from "@mui/material";
import {
  Message,
  Send,
  Inbox,
  Archive,
  Delete,
  Reply,
  Forward,
  MoreVert,
  Add,
  Notifications,
  Warning,
  Info,
  CheckCircle,
  Schedule,
  AttachFile,
  Download,
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
      id={`messages-tabpanel-${index}`}
      aria-labelledby={`messages-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MessagesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessageForMenu, setSelectedMessageForMenu] =
    useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    setMessageDialogOpen(true);
    // Mark as read
    message.read = true;
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    message: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessageForMenu(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessageForMenu(null);
  };

  // Mock messages data
  const messages = {
    inbox: [
      {
        id: "msg-001",
        from: "NSSF System",
        subject: "Pension Payment Processed Successfully",
        content:
          "Your pension payment for December 2023 has been processed successfully. Amount: UGX 850,000. The payment has been credited to your registered bank account ending in 1234.",
        date: "2023-12-01",
        read: false,
        priority: "normal",
        type: "payment",
        hasAttachment: true,
      },
      {
        id: "msg-002",
        from: "NSSF Customer Service",
        subject: "Important: Update Your Contact Information",
        content:
          "Dear member, we notice that your contact information may need updating. Please log into your account and verify your phone number and email address to ensure you receive important notifications.",
        date: "2023-11-28",
        read: true,
        priority: "high",
        type: "alert",
        hasAttachment: false,
      },
      {
        id: "msg-003",
        from: "NSSF Administration",
        subject: "Annual Pension Statement Available",
        content:
          "Your annual pension statement for 2023 is now available for download. This statement contains detailed information about your pension payments and benefits.",
        date: "2023-11-25",
        read: false,
        priority: "normal",
        type: "document",
        hasAttachment: true,
      },
      {
        id: "msg-004",
        from: "NSSF Security",
        subject: "Account Security Alert",
        content:
          "We noticed a login to your account from a new device. If this was not you, please contact our security team immediately at +256 312 234 400.",
        date: "2023-11-20",
        read: true,
        priority: "high",
        type: "security",
        hasAttachment: false,
      },
      {
        id: "msg-005",
        from: "NSSF System",
        subject: "Beneficiary Information Updated",
        content:
          "Your beneficiary information has been successfully updated. If you did not make this change, please contact us immediately.",
        date: "2023-11-15",
        read: true,
        priority: "normal",
        type: "update",
        hasAttachment: false,
      },
    ],
    sent: [
      {
        id: "sent-001",
        to: "NSSF Customer Service",
        subject: "Request for Account Statement",
        content:
          "I would like to request my complete account statement for the year 2023. Please send it to my registered email address.",
        date: "2023-11-10",
        status: "delivered",
      },
      {
        id: "sent-002",
        to: "NSSF Administration",
        subject: "Change of Address Request",
        content:
          "I have recently moved and need to update my address in your records. My new address is Plot 456, Kololo Road, Kampala.",
        date: "2023-10-15",
        status: "read",
      },
    ],
    notifications: [
      {
        id: "notif-001",
        title: "Payment Due Reminder",
        message: "Your next pension payment is due on January 1, 2024",
        date: "2023-12-25",
        type: "reminder",
        read: false,
      },
      {
        id: "notif-002",
        title: "System Maintenance",
        message:
          "The NSSF portal will be under maintenance on December 31st from 2:00 AM to 6:00 AM",
        date: "2023-12-20",
        type: "maintenance",
        read: true,
      },
      {
        id: "notif-003",
        title: "New Feature Available",
        message:
          "You can now download your payment receipts directly from the payments section",
        date: "2023-12-15",
        type: "feature",
        read: true,
      },
    ],
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CheckCircle color="success" />;
      case "alert":
        return <Warning color="warning" />;
      case "document":
        return <AttachFile color="primary" />;
      case "security":
        return <Warning color="error" />;
      case "update":
        return <Info color="info" />;
      default:
        return <Message color="primary" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Schedule color="warning" />;
      case "maintenance":
        return <Warning color="info" />;
      case "feature":
        return <Notifications color="success" />;
      default:
        return <Info color="primary" />;
    }
  };

  const messageStats = {
    unread: messages.inbox.filter((msg) => !msg.read).length,
    total: messages.inbox.length,
    highPriority: messages.inbox.filter((msg) => msg.priority === "high")
      .length,
    notifications: messages.notifications.filter((notif) => !notif.read).length,
  };

  const downloadMessageAttachment = (message: any) => {
    const content = `NSSF Message Attachment
Message: ${message.subject}
From: ${message.from}
Date: ${message.date}

Content: ${message.content}

---
Downloaded from NSSF Pensioner Portal`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NSSF_Message_${message.id}_Attachment.txt`;
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
          Messages & Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stay updated with important messages and notifications from NSSF
        </Typography>
      </Box>

      {/* Message Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <Inbox />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="primary">
                    Inbox
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {messageStats.total}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <Badge badgeContent={messageStats.unread} color="error">
                    <Message />
                  </Badge>
                </Avatar>
                <Box>
                  <Typography variant="h6" color="warning.main">
                    Unread
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {messageStats.unread}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="error.main">
                    High Priority
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {messageStats.highPriority}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <Notifications />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="info.main">
                    Notifications
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {messageStats.notifications}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Quick Actions</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setComposeDialogOpen(true)}
            >
              Compose Message
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Messages Tabs */}
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="messages tabs"
          >
            <Tab
              label={
                <Badge badgeContent={messageStats.unread} color="error">
                  Inbox
                </Badge>
              }
            />
            <Tab label="Sent Messages" />
            <Tab
              label={
                <Badge
                  badgeContent={messageStats.notifications}
                  color="warning"
                >
                  Notifications
                </Badge>
              }
            />
          </Tabs>
        </Box>

        {/* Inbox Tab */}
        <TabPanel value={tabValue} index={0}>
          <List>
            {messages.inbox.map((message, index) => (
              <React.Fragment key={message.id}>
                <ListItem
                  button
                  onClick={() => handleMessageClick(message)}
                  sx={{
                    bgcolor: message.read ? "transparent" : "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  <ListItemIcon>{getMessageIcon(message.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={message.read ? "normal" : "bold"}
                        >
                          {message.subject}
                        </Typography>
                        {message.priority === "high" && (
                          <Chip
                            label="High Priority"
                            color="error"
                            size="small"
                          />
                        )}
                        {message.hasAttachment && (
                          <AttachFile fontSize="small" color="action" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          From: {message.from}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {message.content.substring(0, 100)}...
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(e, message);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < messages.inbox.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Sent Messages Tab */}
        <TabPanel value={tabValue} index={1}>
          <List>
            {messages.sent.map((message, index) => (
              <React.Fragment key={message.id}>
                <ListItem>
                  <ListItemIcon>
                    <Send color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={message.subject}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          To: {message.to}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {message.content.substring(0, 100)}...
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {new Date(message.date).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={message.status}
                            color={
                              message.status === "read" ? "success" : "info"
                            }
                            size="small"
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < messages.sent.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <List>
            {messages.notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? "transparent" : "action.hover",
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        fontWeight={notification.read ? "normal" : "bold"}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  {!notification.read && (
                    <ListItemSecondaryAction>
                      <Chip label="New" color="primary" size="small" />
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                {index < messages.notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Card>

      {/* Message Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Reply sx={{ mr: 1 }} />
          Reply
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Forward sx={{ mr: 1 }} />
          Forward
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Archive sx={{ mr: 1 }} />
          Archive
        </MenuItem>
        {selectedMessageForMenu?.hasAttachment && (
          <MenuItem
            onClick={() => {
              downloadMessageAttachment(selectedMessageForMenu);
              handleMenuClose();
            }}
          >
            <Download sx={{ mr: 1 }} />
            Download Attachment
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Message Details Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {selectedMessage && getMessageIcon(selectedMessage.type)}
            <Box>
              <Typography variant="h6">{selectedMessage?.subject}</Typography>
              <Typography variant="caption" color="text.secondary">
                From: {selectedMessage?.from} |{" "}
                {selectedMessage &&
                  new Date(selectedMessage.date).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedMessage?.content}
          </Typography>
          {selectedMessage?.hasAttachment && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This message has an attachment. Click the download button to
              access it.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<Reply />}>
            Reply
          </Button>
          {selectedMessage?.hasAttachment && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => downloadMessageAttachment(selectedMessage)}
            >
              Download Attachment
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Compose Message Dialog */}
      <Dialog
        open={composeDialogOpen}
        onClose={() => setComposeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Compose New Message</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>To</InputLabel>
              <Select label="To">
                <MenuItem value="customer-service">Customer Service</MenuItem>
                <MenuItem value="administration">Administration</MenuItem>
                <MenuItem value="technical-support">Technical Support</MenuItem>
                <MenuItem value="benefits">Benefits Department</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Subject" margin="normal" />
            <TextField
              fullWidth
              label="Message"
              margin="normal"
              multiline
              rows={6}
              placeholder="Type your message here..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />}>
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessagesPage;
