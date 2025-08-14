import React, { useState } from "react";
import { Box, Alert, Snackbar } from "@mui/material";
import SmartLifeFlexiDashboard from "./SmartLifeFlexiDashboard";
import SmartLifeTransactions from "./SmartLifeTransactions";
import SmartLifeGoals from "./SmartLifeGoals";
import SmartLifeDepositModal from "./SmartLifeDepositModal";

type ViewType = "dashboard" | "transactions" | "goals";

interface SavingsGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  isCompleted: boolean;
  createdDate: string;
}

interface GoalAllocation {
  goalId: string;
  amount: number;
  goalTitle: string;
}

const SmartLifeFlexiContainer: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Shared goals state
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

  const handleMakeDeposit = () => {
    setDepositModalOpen(true);
  };

  const handleDepositSuccess = (
    amount: number,
    method: string,
    goalAllocations?: GoalAllocation[]
  ) => {
    // Update goal amounts if allocations were made
    if (goalAllocations && goalAllocations.length > 0) {
      setGoals((prevGoals) =>
        prevGoals.map((goal) => {
          const allocation = goalAllocations.find((a) => a.goalId === goal.id);
          if (allocation) {
            return {
              ...goal,
              currentAmount: goal.currentAmount + allocation.amount,
            };
          }
          return goal;
        })
      );

      const totalAllocated = goalAllocations.reduce(
        (sum, a) => sum + a.amount,
        0
      );
      const unallocated = amount - totalAllocated;

      let message = `Successfully deposited UGX ${amount.toLocaleString()} via ${method}`;
      if (totalAllocated > 0) {
        message += `. UGX ${totalAllocated.toLocaleString()} allocated to ${
          goalAllocations.length
        } goal(s)`;
        if (unallocated > 0) {
          message += `, UGX ${unallocated.toLocaleString()} added to general balance`;
        }
      }
      setSnackbarMessage(message);
    } else {
      setSnackbarMessage(
        `Successfully deposited UGX ${amount.toLocaleString()} via ${method} to general balance`
      );
    }

    setSnackbarOpen(true);
    setDepositModalOpen(false);
  };

  const handleViewTransactions = () => {
    setCurrentView("transactions");
  };

  const handleSetGoal = () => {
    setCurrentView("goals");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "transactions":
        return <SmartLifeTransactions onBack={handleBackToDashboard} />;
      case "goals":
        return <SmartLifeGoals onBack={handleBackToDashboard} />;
      default:
        return (
          <SmartLifeFlexiDashboard
            onMakeDeposit={handleMakeDeposit}
            onViewTransactions={handleViewTransactions}
            onSetGoal={handleSetGoal}
          />
        );
    }
  };

  return (
    <Box>
      {renderCurrentView()}

      {/* Deposit Modal */}
      <SmartLifeDepositModal
        open={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onDeposit={handleDepositSuccess}
        availableGoals={goals
          .filter((g) => !g.isCompleted)
          .map((g) => ({
            id: g.id,
            title: g.title,
            targetAmount: g.targetAmount,
            currentAmount: g.currentAmount,
            description: g.description,
            deadline: g.deadline,
            priority:
              g.targetAmount > 20000000
                ? ("High" as const)
                : g.targetAmount > 10000000
                ? ("Medium" as const)
                : ("Low" as const),
          }))}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SmartLifeFlexiContainer;
