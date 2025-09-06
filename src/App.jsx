// src/App.jsx
// Refined and simplified routing logic.

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import AdminDashboard from "./Admin/Admin.jsx";
import LoginPage from "./Auth/LoginPage.jsx";
import RegisterPage from "./Auth/RegisterPage.jsx";
import { AuthProvider, useAuth } from "./Context/AuthContext.jsx";
import RegistrarDashboard from "./Registrar/Registrar.jsx";
import StudentDashboard from "./Student/Student.jsx";
import TeacherDashboard from "./Teacher/Teacher.jsx";

// A reusable component for a consistent loading screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

/**
 * A component to protect routes that require authentication and authorization.
 * @param {{ children: JSX.Element, allowedRoles: string[] }} props
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // 1. While checking auth state, show a loading screen.
  if (loading) {
    return <LoadingScreen />;
  }

  // 2. If not authenticated, redirect to the login page.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated but the role is not allowed, redirect.
  //    (Consider an "Unauthorized" page for a better user experience).
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />; // Or an unauthorized page
  }

  // 4. If authenticated and authorized, render the component.
  return children;
};

// Main component to define all application routes
const AppRoutes = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show a loading screen on the very first load until auth status is determined.
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* This is the key route for redirection.
        - If the user is logged in, it redirects them from the root path "/"
          to their specific dashboard, e.g., "/admin".
        - If not logged in, it sends them to the "/login" page.
      */}
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <Navigate to={`/${user.role}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registrar"
        element={
          <ProtectedRoute allowedRoles={["registrar"]}>
            <RegistrarDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback route to handle any undefined paths */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;