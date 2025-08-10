import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./routes/ScrollToTop";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute, LoadingSpinner, Layout } from "./components";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailsPage from "./pages/GroupDetailsPage";
import AuthPage from "./pages/AuthPage";

function App() {
  const { user, loading } = useAuth();

  // Show loading while checking authentication status
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
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
              <Layout title="GroupExpense">
                <GroupsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <Layout showBackButton={true}>
                <GroupDetailsPage />
              </Layout>
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
