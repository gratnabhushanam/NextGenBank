import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OpenAccount from './pages/OpenAccount';
import Statements from './pages/Statements';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

import { ThemeProvider } from './context/ThemeContext';

import Loans from './pages/Loans';
import LoansManager from './pages/LoansManager';
import KycVerification from './pages/KycVerification';
import EmployeeCreateCustomer from './pages/EmployeeCreateCustomer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <div className="d-flex" style={{ minHeight: 'calc(100vh - 70px)' }}>
          {user && <Sidebar />}
          <div className="container-fluid p-4" style={{ backgroundColor: 'var(--light-gray)', flexGrow: 1, overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/open-account" element={<ProtectedRoute><OpenAccount /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/statements" element={<ProtectedRoute><Statements /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
              <Route path="/loans-manager" element={<ProtectedRoute><LoansManager /></ProtectedRoute>} />
              <Route path="/kyc-verification" element={<ProtectedRoute><KycVerification /></ProtectedRoute>} />
              <Route path="/employee/create-customer" element={<ProtectedRoute><EmployeeCreateCustomer /></ProtectedRoute>} />
              <Route path="*" element={<h2 className="text-center mt-5 text-dark-blue">404 - Page Not Found</h2>} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
