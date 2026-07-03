import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EmployeeCreateCustomer = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    // User Info
    name: '',
    email: '',
    phone: '',
    password: '',
    
    // Account Info
    accountType: 'Savings',
    initialBalance: '',
    branch: '',
    ifsc: '',
    nominee: '',
    panNumber: '',
    aadhaarNumber: '',
    businessName: ''
  });
  
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessData(null);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post('http://localhost:5000/api/accounts/employee-create', formData, config);
      setSuccessData(res.data);
      setFormData({
        name: '', email: '', phone: '', password: '',
        accountType: 'Savings', initialBalance: '', branch: '', ifsc: '', nominee: '', panNumber: '', aadhaarNumber: '', businessName: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating customer account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-10">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white text-center py-4">
            <h4 className="text-primary fw-bold mb-0">Employee Portal: Register Customer & Open Account</h4>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            
            {successData && (
              <div className="alert alert-success p-4 mb-4">
                <h5 className="alert-heading fw-bold mb-3"><i className="bi bi-check-circle-fill me-2"></i>Account Successfully Created!</h5>
                <p className="mb-0">Please hand these credentials to the customer. They can use the Account Number to log in.</p>
                <hr />
                <div className="fs-5">
                  <strong>Account Number:</strong> <span className="text-primary">{successData.accountNumber}</span><br />
                  <strong>Password:</strong> {successData.password}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h5 className="text-muted fw-bold mb-3 border-bottom pb-2">1. Customer Details</h5>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Set Temporary Password</label>
                  <input type="text" className="form-control" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
                </div>
              </div>

              <h5 className="text-muted fw-bold mb-3 border-bottom pb-2">2. Bank Account Details</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Account Type</label>
                  <select className="form-select" name="accountType" value={formData.accountType} onChange={handleChange}>
                    <option value="Savings">Savings Account</option>
                    <option value="Current">Current Account</option>
                    <option value="FixedDeposit">Fixed Deposit</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Initial Deposit (INR)</label>
                  <input type="number" className="form-control" name="initialBalance" value={formData.initialBalance} onChange={handleChange} min="500" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Branch Name</label>
                  <input type="text" className="form-control" name="branch" value={formData.branch} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">IFSC Code</label>
                  <input type="text" className="form-control" name="ifsc" value={formData.ifsc} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">PAN Number</label>
                  <input type="text" className="form-control" name="panNumber" value={formData.panNumber} onChange={handleChange} required={formData.accountType !== 'FixedDeposit'} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Aadhaar Number</label>
                  <input type="text" className="form-control" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required={formData.accountType !== 'FixedDeposit'} />
                </div>
                
                {formData.accountType === 'Current' && (
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Business Name (Optional)</label>
                    <input type="text" className="form-control" name="businessName" value={formData.businessName} onChange={handleChange} />
                  </div>
                )}
                
                <div className="col-md-12 mb-4">
                  <label className="form-label">Nominee Name</label>
                  <input type="text" className="form-control" name="nominee" value={formData.nominee} onChange={handleChange} required />
                </div>
              </div>

              <div className="d-grid mt-2">
                <button type="submit" className="btn btn-primary py-3 fw-bold fs-5" disabled={loading}>
                  {loading ? 'Processing...' : 'Register & Open Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCreateCustomer;
