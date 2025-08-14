import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Import pages (will be created)
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/profile/ProfilePage";
import BenefitsPage from "./pages/benefits/BenefitsPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import MessagesPage from "./pages/messages/MessagesPage";
import NotFoundPage from "./pages/NotFoundPage";

// Import components
import { AuthGuard } from "./components/auth/AuthGuard";
import { Layout } from "./components/layout/Layout";
import { useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>NSSF Pensioner Portal</title>
        <meta
          name="description"
          content="Secure access to pension services for NSSF retirees in Uganda"
        />
      </Helmet>

      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="benefits" element={<BenefitsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
