import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Flag,
  Add,
  Edit,
  Delete,
  Schedule,
  CheckCircle,
  Star,
  Home,
  School,
  DirectionsCar,
  Business,
} from "@mui/icons-material";

interface SavingsGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: "home" | "education" | "car" | "business" | "other";
  isCompleted: boolean;
  createdDate: string;
}

interface SmartLifeGoalsProps {
  onBack?: () => void;
}

const SmartLifeGoals: React.FC<SmartLifeGoalsProps> = ({ onBack }) => {
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [goalForm, setGoalForm] = useState<{
    title: string;
    description: string;
    targetAmount: string;
    deadline: string;
    category: "home" | "education" | "car" | "business" | "other";
  }>({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
    category: "other",
  });

  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      title: "Emergency Fund",
      description: "Build a 6-month emergency fund for unexpected expenses",
      targetAmount: 5000000,
      currentAmount: 2850000,
      deadline: "2025-12-31",
      category: "other",
      isCompleted: false,
      createdDate: "2024-01-15",
    },
    {
      id: "2",
      title: "New Car Purchase",
      description: "Save for a reliable vehicle for family transportation",
      targetAmount: 15000000,
      currentAmount: 2850000,
      deadline: "2026-06-30",
      category: "car",
      isCompleted: false,
      createdDate: "2024-02-01",
    },
    {
      id: "3",
      title: "Children's Education",
      description: "University fees for two children",
      targetAmount: 25000000,
      currentAmount: 2850000,
      deadline: "2030-01-01",
      category: "education",
      isCompleted: false,
      createdDate: "2024-01-20",
    },
  ]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-UG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "home":
        return <Home />;
      case "education":
        return <School />;
      case "car":
        return <DirectionsCar />;
      case "business":
        return <Business />;
      default:
        return <Flag />;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "home":
        return "success";
      case "education":
        return "info";
      case "car":
        return "warning";
      case "business":
        return "primary";
      default:
        return "default";
    }
  };

  const getProgress = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysToDeadline = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMonthlyTargetToReachGoal = (goal: SavingsGoal): number => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const daysLeft = getDaysToDeadline(goal.deadline);
    const monthsLeft = Math.max(daysLeft / 30, 1);
    return remaining / monthsLeft;
  };

  const handleCreateGoal = () => {
    if (!goalForm.title || !goalForm.targetAmount || !goalForm.deadline) return;

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      title: goalForm.title,
      description: goalForm.description,
      targetAmount: parseFloat(goalForm.targetAmount),
      currentAmount: 2850000, // Current SmartLife balance
      deadline: goalForm.deadline,
      category: goalForm.category,
      isCompleted: false,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setGoals([...goals, newGoal]);
    setGoalModalOpen(false);
    setGoalForm({
      title: "",
      description: "",
      targetAmount: "",
      deadline: "",
      category: "other",
    });
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline,
      category: goal.category,
    });
    setGoalModalOpen(true);
  };

  const handleUpdateGoal = () => {
    if (
      !editingGoal ||
      !goalForm.title ||
      !goalForm.targetAmount ||
      !goalForm.deadline
    )
      return;

    const updatedGoals = goals.map((goal) =>
      goal.id === editingGoal.id
        ? {
            ...goal,
            title: goalForm.title,
            description: goalForm.description,
            targetAmount: parseFloat(goalForm.targetAmount),
            deadline: goalForm.deadline,
            category: goalForm.category,
          }
        : goal
    );

    setGoals(updatedGoals);
    setGoalModalOpen(false);
    setEditingGoal(null);
    setGoalForm({
      title: "",
      description: "",
      targetAmount: "",
      deadline: "",
      category: "other",
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId));
  };

  const activeGoals = goals.filter((goal) => !goal.isCompleted);
  const completedGoals = goals.filter((goal) => goal.isCompleted);

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
        sx={{
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            SmartLife Flexi Savings Goals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Set and track your financial goals with your voluntary savings
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Box
            display="flex"
            gap={2}
            sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setGoalModalOpen(true)}
              sx={{ whiteSpace: "nowrap" }}
            >
              Add Goal
            </Button>
            {onBack && (
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{ whiteSpace: "nowrap" }}
              >
                Back to Dashboard
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Current Balance Info */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Your SmartLife Flexi Balance:{" "}
          <strong>{formatCurrency(2850000)}</strong>
        </Typography>
        <Typography variant="body2">
          Use the <strong>Deposit</strong> button to add funds and choose how to
          allocate them to your specific goals. You have full control over which
          goals receive funding!
        </Typography>
      </Alert>

      {/* Active Goals */}
      <Typography variant="h5" gutterBottom>
        Active Goals ({activeGoals.length})
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {activeGoals.map((goal) => (
          <Grid item xs={12} md={6} lg={4} key={goal.id}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,56,118,0.15)",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      sx={{
                        background: "linear-gradient(135deg, #003876, #FF6B35)",
                        width: 40,
                        height: 40,
                        boxShadow: "0 4px 12px rgba(0,56,118,0.3)",
                      }}
                    >
                      {getCategoryIcon(goal.category)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {goal.title}
                      </Typography>
                      <Chip
                        label={goal.category}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,107,53,0.1)",
                          color: "#FF6B35",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditGoal(goal)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteGoal(goal.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {goal.description}
                </Typography>

                <Box sx={{ my: 2 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                    sx={{
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 0, flex: 1 }}>
                      Progress
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                    >
                      {getProgress(
                        goal.currentAmount,
                        goal.targetAmount
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getProgress(goal.currentAmount, goal.targetAmount)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current: {formatCurrency(goal.currentAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Target: {formatCurrency(goal.targetAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Remaining:{" "}
                    {formatCurrency(goal.targetAmount - goal.currentAmount)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Schedule fontSize="small" color="action" />
                  <Typography variant="body2">
                    {getDaysToDeadline(goal.deadline)} days to deadline
                  </Typography>
                </Box>

                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Monthly target:</strong>{" "}
                    {formatCurrency(getMonthlyTargetToReachGoal(goal))}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Completed Goals ({completedGoals.length})
          </Typography>
          <Grid container spacing={3}>
            {completedGoals.map((goal) => (
              <Grid item xs={12} md={6} lg={4} key={goal.id}>
                <Card sx={{ opacity: 0.7 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CheckCircle color="success" />
                      <Typography variant="h6" fontWeight="bold">
                        {goal.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Completed: {formatDate(goal.deadline)}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {formatCurrency(goal.targetAmount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Goal Creation/Edit Modal */}
      <Dialog
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <Star />
            </Avatar>
            <Typography variant="h6">
              {editingGoal ? "Edit Savings Goal" : "Create New Savings Goal"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Goal Title"
                value={goalForm.title}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, title: e.target.value })
                }
                placeholder="e.g., Emergency Fund"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={goalForm.category}
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    category: e.target.value as
                      | "home"
                      | "education"
                      | "car"
                      | "business"
                      | "other",
                  })
                }
                SelectProps={{ native: true }}
              >
                <option value="other">Other</option>
                <option value="home">Home & Property</option>
                <option value="education">Education</option>
                <option value="car">Vehicle</option>
                <option value="business">Business</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={goalForm.description}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, description: e.target.value })
                }
                placeholder="Describe your savings goal..."
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Amount"
                value={goalForm.targetAmount}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, targetAmount: e.target.value })
                }
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">UGX</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Date"
                value={goalForm.deadline}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, deadline: e.target.value })
                }
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGoalModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={editingGoal ? handleUpdateGoal : handleCreateGoal}
            disabled={
              !goalForm.title || !goalForm.targetAmount || !goalForm.deadline
            }
          >
            {editingGoal ? "Update Goal" : "Create Goal"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartLifeGoals;
