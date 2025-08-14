import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Person,
  AccountBalance,
  Payment,
  Description,
  Message,
  Logout,
  Settings,
  Notifications,
  Security,
  CheckCircle,
  Warning,
  Info,
  Close,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 280;

const navigationItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Profile", icon: <Person />, path: "/profile" },
  { text: "Benefits", icon: <AccountBalance />, path: "/benefits" },
  { text: "Payments", icon: <Payment />, path: "/payments" },
  { text: "Documents", icon: <Description />, path: "/documents" },
  { text: "Messages", icon: <Message />, path: "/messages" },
];

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  // Mock notification data
  const notifications = [
    {
      id: "notif-001",
      title: "Payment Processed",
      message: "Your pension payment has been successfully processed",
      date: "2025-08-14",
      type: "success",
      read: false,
    },
    {
      id: "notif-002",
      title: "Profile Update Required",
      message: "Please update your contact information",
      date: "2025-08-13",
      type: "warning",
      read: false,
    },
    {
      id: "notif-003",
      title: "System Maintenance",
      message: "Scheduled maintenance on August 20th from 2:00 AM to 6:00 AM",
      date: "2025-08-12",
      type: "info",
      read: true,
    },
    {
      id: "notif-004",
      title: "New Feature Available",
      message: "Voluntary savings feature is now available",
      date: "2025-08-11",
      type: "feature",
      read: true,
    },
  ];

  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleViewAllNotifications = () => {
    navigate("/messages");
    handleNotificationMenuClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle color="success" />;
      case "warning":
        return <Warning color="warning" />;
      case "info":
        return <Info color="primary" />;
      case "feature":
        return <Notifications color="primary" />;
      default:
        return <Info color="primary" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleProfileMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box>
      {/* Logo and Brand */}
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            N
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold">
          NSSF Portal
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Pensioner Services
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2, bgcolor: "grey.50" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar
            sx={{ bgcolor: "primary.main", mr: 2, width: 40, height: 40 }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {user?.username}
            </Typography>
            <Chip
              label={user?.role || "PENSIONER"}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ px: 1, py: 2 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "white" : "text.primary",
                  "&:hover": {
                    bgcolor: isActive ? "primary.dark" : "primary.light",
                    color: isActive ? "white" : "primary.main",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "primary.main",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "medium",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Footer Links */}
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ borderRadius: 2, mx: 1 }}
            onClick={() => handleNavigation("/profile")}
          >
            <ListItemIcon sx={{ color: "text.secondary", minWidth: 40 }}>
              <Settings />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="h1"
              color="primary.main"
              fontWeight="bold"
            >
              {navigationItems.find((item) => item.path === location.pathname)
                ?.text || "NSSF Portal"}
            </Typography>
          </Box>

          {/* Notifications */}
          <IconButton 
            color="inherit" 
            sx={{ mr: 1 }}
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={unreadNotifications} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => handleNavigation("/profile")}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <Security fontSize="small" />
              </ListItemIcon>
              Security
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: { 
                width: 380, 
                maxHeight: 500, 
                mt: 1,
                boxShadow: 3,
              }
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={handleNotificationMenuClose}
                  sx={{ color: "text.secondary" }}
                >
                  <Close />
                </IconButton>
              </Box>
              {unreadNotifications > 0 && (
                <Typography variant="body2" color="text.secondary">
                  You have {unreadNotifications} unread notification{unreadNotifications !== 1 ? 's' : ''}
                </Typography>
              )}
            </Box>

            <Box sx={{ maxHeight: 350, overflow: "auto" }}>
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification, index) => (
                  <MenuItem 
                    key={notification.id}
                    onClick={handleNotificationMenuClose}
                    sx={{ 
                      whiteSpace: "normal",
                      py: 2,
                      px: 2,
                      backgroundColor: !notification.read ? "action.hover" : "transparent",
                      "&:hover": {
                        backgroundColor: "action.selected"
                      }
                    }}
                  >
                    <ListItemIcon sx={{ mr: 1 }}>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={!notification.read ? "bold" : "medium"}
                          sx={{ mb: 0.5 }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Badge 
                            color="primary" 
                            variant="dot" 
                            sx={{ mt: 0.5, ml: 1 }}
                          />
                        )}
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 1 }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {notification.date}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Notifications sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No notifications yet
                  </Typography>
                </Box>
              )}
            </Box>

            {notifications.length > 0 && (
              <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
                <MenuItem 
                  onClick={handleViewAllNotifications}
                  sx={{ 
                    justifyContent: "center",
                    fontWeight: "medium",
                    color: "primary.main"
                  }}
                >
                  View All Notifications
                </MenuItem>
              </Box>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "grey.50",
        }}
      >
        {/* Spacer for AppBar */}
        <Toolbar />

        {/* Page Content */}
        <Outlet />

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: "auto",
            py: 3,
            px: 3,
            bgcolor: "white",
            borderTop: 1,
            borderColor: "grey.200",
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 National Social Security Fund (NSSF) Uganda. All rights
            reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
