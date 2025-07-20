import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute, LoadingSpinner } from "./components";
import GroupsPage from "./pages/GroupsPage";
import AuthPage from "./pages/AuthPage";

function App() {
  const { user, loading } = useAuth();

  // Show loading while checking authentication status
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route - Only show if not authenticated */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/groups" replace /> : <AuthPage />}
        />

        {/* Protected Routes - Require authentication */}
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupsPage />
            </ProtectedRoute>
          }
        />

        {/* Root redirect - Send to appropriate page based on auth status */}
        <Route
          path="/"
          element={<Navigate to={user ? "/groups" : "/auth"} replace />}
        />

        {/* Catch all - Redirect to appropriate page */}
        <Route
          path="*"
          element={<Navigate to={user ? "/groups" : "/auth"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
