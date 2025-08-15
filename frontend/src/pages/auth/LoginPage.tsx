import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Phone,
  Email,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ForgotPassword from "../../components/auth/ForgotPassword";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🎯 Login form submitted");
    console.log(
      "📝 Form data - Username:",
      username,
      "Password length:",
      password.length
    );

    setLoading(true);
    setError("");

    try {
      console.log("🚀 Calling login function...");
      await login(username, password);
      console.log("✅ Login successful, navigating to dashboard...");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #003876 0%, #1976d2 50%, #FF6B35 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: "white", pr: { md: 4 } }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  mb: 1,
                }}
              >
                NSSF Uganda
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  color: "#FFE0B2",
                  fontWeight: 500,
                }}
              >
                Pensioner Self-Service Portal
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  color: "#E3F2FD",
                }}
              >
                Secure digital access to your pension benefits and services
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, fontSize: "1.1rem", fontWeight: 500 }}
                >
                  🏛️ <strong>Enhanced Pension Services:</strong>
                </Typography>
                <ul
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.8",
                    paddingLeft: "20px",
                  }}
                >
                  <li>📊 Real-time pension balance and statements</li>
                  <li>
                    💰 SmartLife Voluntary Savings with goal-based planning
                  </li>
                  <li>📅 Payment history and upcoming schedules</li>
                  <li>👤 Secure profile and beneficiary management</li>
                  <li>📄 Instant certificate downloads and documentation</li>
                  <li>💬 Direct communication with NSSF support team</li>
                  <li>🎯 Personalized financial planning tools</li>
                  <li>📱 Mobile-optimized responsive design</li>
                </ul>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, fontSize: "1.1rem", fontWeight: 500 }}
                >
                  🌟 <strong>New Features Available:</strong>
                </Typography>
                <ul
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.8",
                    paddingLeft: "20px",
                  }}
                >
                  <li>
                    🎯 Goal-based voluntary savings deposits and withdrawals
                  </li>
                  <li>📈 Advanced savings analytics and progress tracking</li>
                  <li>🔔 Real-time notifications and alerts</li>
                  <li>🛡️ Enhanced security with multi-factor authentication</li>
                  <li>📊 Comprehensive financial dashboards</li>
                </ul>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 3,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                  📞 <strong>Need Support?</strong>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: "1rem" }} />
                  <Typography variant="body2">
                    Toll Free: 0800 286 773
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: "1rem" }} />
                  <Typography variant="body2">
                    Direct: +256 312 234 400
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Email sx={{ mr: 1, fontSize: "1rem" }} />
                  <Typography variant="body2">
                    customerservice@nssfug.org
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={12}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* NSSF Logo */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #003876 0%, #FF6B35 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    boxShadow: "0 8px 24px rgba(0,56,118,0.3)",
                  }}
                >
                  <Typography
                    variant="h4"
                    color="white"
                    fontWeight="bold"
                    sx={{ fontSize: "1.5rem" }}
                  >
                    NSSF
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  fontWeight="600"
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to access your NSSF pension portal
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username or NSSF Number"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    fontSize: "1.1rem",
                    background: "linear-gradient(45deg, #003876, #FF6B35)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #001f3f, #E5522F)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,56,118,0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Link
                    component="button"
                    variant="body2"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setForgotPasswordOpen(true);
                    }}
                    sx={{
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#FF6B35",
                      },
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>
              </form>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  🚀 Demo Accounts for Testing:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setUsername("NSS12345678");
                      setPassword("password123");
                    }}
                    sx={{
                      borderColor: "secondary.main",
                      color: "secondary.main",
                      "&:hover": {
                        bgcolor: "secondary.main",
                        color: "white",
                      },
                    }}
                  >
                    John Mukasa Demo
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setUsername("NSS87654321");
                      setPassword("password123");
                    }}
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    Mary Nakato Demo
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Forgot Password Modal */}
      <ForgotPassword
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </Box>
  );
};

export default LoginPage;
