import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import SuperAdminLayout from './layouts/SuperAdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import CompanyList from './pages/admin/Companies';
import CreateCompany from './pages/admin/CreateCompany';
import UserList from './pages/admin/UserList';
import CreateUser from './pages/admin/CreateUser';

import HRLayout from './layouts/HRLayout'; 
import HRDashboard from './pages/hr/Dashboard';
import ResumesList from './pages/hr/ResumesList';
import ResumeUpload from './pages/hr/ResumeUpload';
import JobsList from './pages/hr/JobsList';
import CreateJob from './pages/hr/CreateJob';
import HRAdminDashboard from './pages/hr/AdminDashboard';
import SmartMatch from './pages/hr/SmartMatch';
import MatchHistory from './pages/hr/MatchHistory';
import Profile from './pages/hr/Profile';
import LeaderboardPage from './pages/hr/Leaderboard';
import InterviewsList from './pages/hr/InterviewsList';
import ScheduleInterview from './pages/hr/ScheduleInterview';
import InterviewRoom from './pages/InterviewRoom';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Super Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <SuperAdminLayout />
            </ProtectedRoute>
          }>
              <Route index element={<AdminDashboard />} />
              
              {/* Tenant Management */}
              <Route path="companies" element={<CompanyList />} />
              <Route path="companies/new" element={<CreateCompany />} />
              
              {/* User Management */}
              <Route path="users" element={<UserList />} />
              <Route path="users/new" element={<CreateUser />} />
          </Route>

          {/* HR Admin Routes */}
          <Route path="/hr" element={
            <ProtectedRoute>
              <HRLayout />
            </ProtectedRoute>
          }>
              <Route path="dashboard" element={<HRDashboard />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="talent" element={<ResumesList />} />
              <Route path="upload" element={<ResumeUpload />} />
              <Route path="jobs" element={<JobsList />} />
              <Route path="jobs/new" element={<CreateJob />} />
              <Route path="jobs/create" element={<CreateJob />} />
              <Route path="jobs/edit/:id" element={<CreateJob />} />
              <Route path="match" element={<SmartMatch />} />
              <Route path="history" element={<MatchHistory />} />
              <Route path="interviews" element={<InterviewsList />} />
              <Route path="schedule" element={<ScheduleInterview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<HRAdminDashboard />} />
          </Route>

          {/* Public/Semi-Protected Interview Room */}
          <Route path="/interview/:id" element={<InterviewRoom />} />

          {/* Default/Generic Dashboard Redirect */}
          <Route path="/dashboard" element={<Navigate to="/hr/dashboard" replace />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;