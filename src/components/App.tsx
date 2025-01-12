import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext'; // Import AuthProvider
import Logout from './Logout';
import AttendancePage from './Attendance';
import NotificationForm from './NotificationForm';
import ErrorBoundary from './ErrorBoundary';
import ProfilePage from './Profile';

function App() {
  return (
    <Router>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-out" element={<Logout />} />
          {/* Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
              <ErrorBoundary>
                <UserDashboard />
              </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/attendance"
            element={
              // <ProtectedRoute>
                <AttendancePage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/user/notification-form"
            element={
              // <ProtectedRoute>
              <NotificationForm />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              // <ProtectedRoute>
              <ProfilePage />
              // </ProtectedRoute>
            }
          />
        </Routes>
    </AuthProvider>
      </Router>
  );
}

export default App;
