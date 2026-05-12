import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import './App.css'
import API from "./services/api";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Attendance from "./pages/Attendance";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/MainLayout";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveList from "./pages/LeaveList";
import Announcements from "./pages/Announcements";
import Approvals from "./pages/Approvals";
import Shifts from "./pages/Shifts";
import AttendanceTracking from "./pages/AttendanceTracking";
import Overtime from "./pages/Overtime";
import Leave from "./pages/Leave";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Me from "./pages/Me";
import MyTeam from "./pages/MyTeam";
import MyFinances from "./pages/MyFinances";
import Project from "./pages/Project";
import Payroll from "./pages/Payroll";

// A component to protect routes from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-xnerds-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Securing Connection...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave/apply" 
            element={
              <ProtectedRoute>
                <ApplyLeave />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave/list" 
            element={
              <ProtectedRoute>
                <LeaveList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave/my" 
            element={
              <ProtectedRoute>
                <LeaveList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/announcements" 
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            } 
          />
          <Route path="/approvals" element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
          <Route path="/shifts" element={<ProtectedRoute><Shifts /></ProtectedRoute>} />
          <Route path="/attendance-tracking" element={<ProtectedRoute><AttendanceTracking /></ProtectedRoute>} />
          <Route path="/overtime" element={<ProtectedRoute><Overtime /></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute><Leave /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/me" element={<ProtectedRoute><Me /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><MyTeam /></ProtectedRoute>} />
          <Route path="/finances" element={<ProtectedRoute><MyFinances /></ProtectedRoute>} />
          <Route path="/project" element={<ProtectedRoute><Project /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
