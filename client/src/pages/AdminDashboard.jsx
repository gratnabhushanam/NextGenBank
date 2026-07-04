import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If not admin, you shouldn't be here
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [statRes, accRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/admin/analytics`, config),
          axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/accounts`, config) // Assuming admin sees all
        ]);
        setAnalytics(statRes.data);
        // Handle pagination response format
        setAccounts(accRes.data.data ? accRes.data.data : accRes.data);
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user, navigate]);

  const toggleAccountStatus = async (accountNumber, currentStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const endpoint = currentStatus === 'Active' ? 'freeze' : 'activate';
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/admin/accounts/${accountNumber}/${endpoint}`, {}, config);
      
      // Update local state
      setAccounts(accounts.map(acc => 
        acc.accountNumber === accountNumber 
          ? { ...acc, status: currentStatus === 'Active' ? 'Frozen' : 'Active' } 
          : acc
      ));
    } catch (err) {
      alert('Failed to update account status');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h3 className="mb-4 text-primary fw-bold">Admin Portal</h3>
      
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100 bg-light-blue">
            <div className="card-body">
              <h6 className="text-dark-blue fw-semibold">Total Users</h6>
              <h2 className="text-primary fw-bold">{analytics.totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100 bg-light-blue">
            <div className="card-body">
              <h6 className="text-dark-blue fw-semibold">Total Accounts</h6>
              <h2 className="text-primary fw-bold">{analytics.totalAccounts}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100 bg-light-blue">
            <div className="card-body">
              <h6 className="text-dark-blue fw-semibold">Total Deposits</h6>
              <h3 className="text-success fw-bold">{formatCurrency(analytics.totalDeposits)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100 bg-light-blue">
            <div className="card-body">
              <h6 className="text-dark-blue fw-semibold">Total Withdrawals</h6>
              <h3 className="text-danger fw-bold">{formatCurrency(analytics.totalWithdrawals)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white pt-4 pb-0 border-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-dark-blue">Manage Accounts</h5>
        </div>
        <div className="card-body p-0 mt-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Account No.</th>
                  <th>User Email</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id || acc.accountNumber}>
                    <td className="fw-bold">{acc.accountNumber}</td>
                    <td>{acc.email}</td>
                    <td>{acc.accountType}</td>
                    <td className="fw-bold">{formatCurrency(acc.balance)}</td>
                    <td>
                      <span className={`badge ${acc.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                        {acc.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`btn btn-sm fw-bold ${acc.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => toggleAccountStatus(acc.accountNumber, acc.status)}
                      >
                        {acc.status === 'Active' ? 'Freeze' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mt-4">
        <div className="card-header bg-white pt-4 pb-0 border-0">
          <h5 className="fw-bold text-dark-blue">Create Staff Account</h5>
        </div>
        <div className="card-body mt-3">
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const config = { headers: { Authorization: `Bearer ${user.token}` } };
              const payload = {
                name: e.target.name.value,
                email: e.target.email.value,
                phone: e.target.phone.value,
                password: e.target.password.value,
                role: e.target.role.value
              };
              await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/register`, payload, config);
              alert('Staff account created successfully!');
              e.target.reset();
            } catch (err) {
              alert(err.response?.data?.message || 'Error creating staff account');
            }
          }}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Full Name</label>
                <input type="text" name="name" className="form-control" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Email</label>
                <input type="email" name="email" className="form-control" required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted">Phone Number</label>
                <input type="text" name="phone" className="form-control" required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted">Password</label>
                <input type="password" name="password" className="form-control" required minLength="6" />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted">Role</label>
                <select name="role" className="form-select" required>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary fw-bold mt-2 px-4 rounded-pill">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
