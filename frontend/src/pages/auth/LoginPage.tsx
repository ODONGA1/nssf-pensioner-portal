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

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err: any) {
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
        background: "linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)",
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
              >
                NSSF Pensioner
              </Typography>
              <Typography variant="h4" component="h1" gutterBottom>
                Self-Service Portal
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Secure access to your pension information and services
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2, fontSize: "1.1rem" }}>
                  <strong>Access your pension services:</strong>
                </Typography>
                <ul style={{ fontSize: "1rem", lineHeight: "1.8" }}>
                  <li>View pension statements and balances</li>
                  <li>Check payment history and schedules</li>
                  <li>Update personal information</li>
                  <li>Download pension certificates</li>
                  <li>Communicate with NSSF staff</li>
                </ul>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Need Help?</strong>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: "1rem" }} />
                  <Typography variant="body2">+256 414 342 891</Typography>
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
              {/* NSSF Logo placeholder */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Typography variant="h4" color="white" fontWeight="bold">
                    N
                  </Typography>
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to access your pension portal
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
                    background: "linear-gradient(45deg, #1B5E20, #4CAF50)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #0D4214, #388E3C)",
                    },
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
                      // Handle forgot password
                    }}
                    sx={{ textDecoration: "none" }}
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
                  Demo Accounts for Testing:
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
                      setUsername("admin");
                      setPassword("admin123");
                    }}
                  >
                    Admin Demo
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setUsername("john.mukasa");
                      setPassword("pensioner123");
                    }}
                  >
                    Pensioner Demo
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
