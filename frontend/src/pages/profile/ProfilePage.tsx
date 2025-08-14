import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  Work,
  Security,
  Edit,
  Save,
  Cancel,
  Verified,
  CameraAlt,
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock user data
  const [userProfile] = useState({
    personalInfo: {
      firstName: "John",
      lastName: "Mugisha",
      middleName: "Baptiste",
      dateOfBirth: "1962-03-15",
      gender: "Male",
      maritalStatus: "Married",
      nationality: "Ugandan",
      nin: "CM62*****23456",
      profilePhoto: null,
    },
    contactInfo: {
      email: "john.mugisha@example.com",
      phone: "+256 701 234567",
      alternatePhone: "+256 772 345678",
      address: "Plot 123, Nakasero Road",
      city: "Kampala",
      district: "Kampala",
      postalCode: "P.O. Box 12345",
    },
    employmentInfo: {
      lastEmployer: "Ministry of Finance",
      position: "Senior Accountant",
      employmentStartDate: "1992-06-01",
      employmentEndDate: "2024-05-31",
      yearsOfService: 32,
      sector: "Government",
    },
    emergencyContact: {
      name: "Mary Mugisha",
      relationship: "Spouse",
      phone: "+256 701 876543",
      email: "mary.mugisha@example.com",
      address: "Plot 123, Nakasero Road, Kampala",
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      language: "English",
      currency: "UGX",
      twoFactorAuth: false,
    },
  });

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // Save logic here
    setEditMode(false);
  };

  const handleCancel = () => {
    // Reset form logic here
    setEditMode(false);
  };

  const getVerificationStatus = (field: string) => {
    // Mock verification status
    const verified = ["email", "phone", "nin"];
    return verified.includes(field);
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
          Profile Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information and account preferences
        </Typography>
      </Box>

      {/* Profile Overview Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.main",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {userProfile.personalInfo.firstName[0]}
                  {userProfile.personalInfo.lastName[0]}
                </Avatar>
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                  onClick={() => setPhotoDialogOpen(true)}
                >
                  <CameraAlt />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {userProfile.personalInfo.firstName}{" "}
                {userProfile.personalInfo.middleName}{" "}
                {userProfile.personalInfo.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                NSSF Member ID: CM62123456789
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item>
                  <Chip
                    icon={<Verified />}
                    label="Verified Account"
                    color="success"
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    icon={<Person />}
                    label={`${userProfile.employmentInfo.yearsOfService} Years Service`}
                    color="primary"
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    icon={<CalendarToday />}
                    label="Active Pensioner"
                    color="info"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Button
                variant={editMode ? "outlined" : "contained"}
                startIcon={editMode ? <Cancel /> : <Edit />}
                onClick={editMode ? handleCancel : handleEditToggle}
                sx={{ mr: 1 }}
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
              {editMode && (
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  color="success"
                >
                  Save Changes
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Profile Information Tabs */}
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab label="Personal Information" />
            <Tab label="Contact Details" />
            <Tab label="Employment History" />
            <Tab label="Emergency Contact" />
            <Tab label="Account Settings" />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={userProfile.personalInfo.firstName}
                disabled={!editMode}
                margin="normal"
                InputProps={{
                  endAdornment: getVerificationStatus("name") && (
                    <Verified color="success" fontSize="small" />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={userProfile.personalInfo.lastName}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Middle Name"
                value={userProfile.personalInfo.middleName}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={userProfile.personalInfo.dateOfBirth}
                disabled={!editMode}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={userProfile.personalInfo.gender}
                  label="Gender"
                  disabled={!editMode}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Marital Status</InputLabel>
                <Select
                  value={userProfile.personalInfo.maritalStatus}
                  label="Marital Status"
                  disabled={!editMode}
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nationality"
                value={userProfile.personalInfo.nationality}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="National ID Number"
                value={userProfile.personalInfo.nin}
                disabled={!editMode}
                margin="normal"
                InputProps={{
                  endAdornment: getVerificationStatus("nin") && (
                    <Verified color="success" fontSize="small" />
                  ),
                }}
              />
            </Grid>
          </Grid>

          {!editMode && (
            <Alert severity="info" sx={{ mt: 3 }}>
              Personal information is verified against official records. Contact
              NSSF support for any discrepancies.
            </Alert>
          )}
        </TabPanel>

        {/* Contact Details Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={userProfile.contactInfo.email}
                disabled={!editMode}
                margin="normal"
                InputProps={{
                  endAdornment: getVerificationStatus("email") && (
                    <Verified color="success" fontSize="small" />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Primary Phone"
                value={userProfile.contactInfo.phone}
                disabled={!editMode}
                margin="normal"
                InputProps={{
                  endAdornment: getVerificationStatus("phone") && (
                    <Verified color="success" fontSize="small" />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alternate Phone"
                value={userProfile.contactInfo.alternatePhone}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={userProfile.contactInfo.postalCode}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Physical Address"
                value={userProfile.contactInfo.address}
                disabled={!editMode}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={userProfile.contactInfo.city}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="District"
                value={userProfile.contactInfo.district}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
          </Grid>

          {editMode && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              Changes to email and phone number will require verification before
              taking effect.
            </Alert>
          )}
        </TabPanel>

        {/* Employment History Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Employment Information
          </Typography>

          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Last Employment
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Work color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Employer"
                      secondary={userProfile.employmentInfo.lastEmployer}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Person color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Position"
                      secondary={userProfile.employmentInfo.position}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Service Period"
                      secondary={`${userProfile.employmentInfo.employmentStartDate} to ${userProfile.employmentInfo.employmentEndDate}`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Years of Service"
                      secondary={`${userProfile.employmentInfo.yearsOfService} years`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Work color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Sector"
                      secondary={userProfile.employmentInfo.sector}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Verified color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Status"
                      secondary="Verified Employment Record"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>

          <Alert severity="info">
            Employment history is maintained by NSSF and verified with employer
            records. Contact NSSF if you believe there are errors in your
            employment history.
          </Alert>
        </TabPanel>

        {/* Emergency Contact Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Emergency Contact
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Name"
                value={userProfile.emergencyContact.name}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Relationship</InputLabel>
                <Select
                  value={userProfile.emergencyContact.relationship}
                  label="Relationship"
                  disabled={!editMode}
                >
                  <MenuItem value="Spouse">Spouse</MenuItem>
                  <MenuItem value="Child">Child</MenuItem>
                  <MenuItem value="Parent">Parent</MenuItem>
                  <MenuItem value="Sibling">Sibling</MenuItem>
                  <MenuItem value="Friend">Friend</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={userProfile.emergencyContact.phone}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={userProfile.emergencyContact.email}
                disabled={!editMode}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={userProfile.emergencyContact.address}
                disabled={!editMode}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            Emergency contact information is used for urgent notifications and
            benefit processing.
          </Alert>
        </TabPanel>

        {/* Account Settings Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Account Preferences
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Notification Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Email Notifications" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.preferences.emailNotifications}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="SMS Notifications" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.preferences.smsNotifications}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Security Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Two-Factor Authentication" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.preferences.twoFactorAuth}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Change Password" />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPasswordDialogOpen(true)}
                    >
                      Update
                    </Button>
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Display Preferences
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={userProfile.preferences.language}
                        label="Language"
                      >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Luganda">Luganda</MenuItem>
                        <MenuItem value="Runyankole">Runyankole</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={userProfile.preferences.currency}
                        label="Currency"
                      >
                        <MenuItem value="UGX">Uganda Shillings (UGX)</MenuItem>
                        <MenuItem value="USD">US Dollars (USD)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              margin="normal"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Update Password</Button>
        </DialogActions>
      </Dialog>

      {/* Photo Upload Dialog */}
      <Dialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Profile Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Avatar
              sx={{
                width: 150,
                height: 150,
                bgcolor: "primary.main",
                fontSize: "3rem",
                fontWeight: "bold",
                mx: "auto",
                mb: 3,
              }}
            >
              {userProfile.personalInfo.firstName[0]}
              {userProfile.personalInfo.lastName[0]}
            </Avatar>
            <Button
              variant="contained"
              component="label"
              startIcon={<CameraAlt />}
            >
              Choose Photo
              <input type="file" hidden accept="image/*" />
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Upload a clear photo (JPG, PNG) max 2MB
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Upload Photo</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
