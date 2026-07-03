import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OpenAccount = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('');
  const [formData, setFormData] = useState({
    initialDeposit: '',
    nominee: '',
    branch: '',
    ifsc: '',
    panNumber: '',
    aadhaarNumber: '',
    businessName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  const branches = [
    { name: 'Mumbai Main Branch', ifsc: 'BANK000MUM1' },
    { name: 'Delhi Central Branch', ifsc: 'BANK000DEL1' },
    { name: 'Bangalore Tech Park', ifsc: 'BANK000BLR1' },
    { name: 'Chennai South Branch', ifsc: 'BANK000CHN1' },
    { name: 'Hyderabad Cyber Hub', ifsc: 'BANK000HYD1' },
    { name: 'Pune City Branch', ifsc: 'BANK000PUN1' }
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBranchChange = (e) => {
    const selectedBranch = branches.find(b => b.name === e.target.value);
    if (selectedBranch) {
      setFormData({ ...formData, branch: selectedBranch.name, ifsc: selectedBranch.ifsc });
    } else {
      setFormData({ ...formData, branch: '', ifsc: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post('http://localhost:5000/api/accounts', {
        holderName: user.name,
        email: user.email,
        phone: formData.phone,
        accountType,
        initialBalance: formData.initialDeposit,
        branch: formData.branch,
        ifsc: formData.ifsc,
        nominee: formData.nominee,
        panNumber: formData.panNumber,
        aadhaarNumber: formData.aadhaarNumber,
        businessName: formData.businessName
      }, config);
      
      setSuccessMsg(`Account created successfully! Your new Account Number is ${res.data.accountNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white text-center py-4">
            <h4 className="text-primary fw-bold mb-0">Open a New Bank Account</h4>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            
            {successMsg ? (
              <div className="alert alert-success p-4 mb-4 text-center">
                <h5 className="alert-heading fw-bold mb-3"><i className="bi bi-check-circle-fill me-2"></i>Account Successfully Created!</h5>
                <p className="mb-0 fs-5">{successMsg}</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-3">Go to Dashboard</button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="form-label text-primary fw-semibold">Select Account Type</label>
                  <select className="form-select" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                    <option value="">-- Choose Account Type --</option>
                    <option value="Savings">Savings Account (Earns Interest)</option>
                    <option value="Current">Current Account (Overdraft Allowed)</option>
                    <option value="FixedDeposit">Fixed Deposit (High Yield)</option>
                  </select>
                </div>

                {accountType && (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Mobile Number</label>
                        <input type="text" className="form-control" name="phone" onChange={handleChange} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Near Locations / Branch Name</label>
                        <select className="form-select" name="branch" onChange={handleBranchChange} required>
                          <option value="">-- Select Nearest Branch --</option>
                          {branches.map(b => (
                            <option key={b.ifsc} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">IFSC Code (Auto-suggested)</label>
                        <input type="text" className="form-control bg-light" name="ifsc" value={formData.ifsc} readOnly required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">PAN Number</label>
                        <input type="text" className="form-control" name="panNumber" onChange={handleChange} required={accountType !== 'FixedDeposit'} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Aadhaar Number</label>
                        <input type="text" className="form-control" name="aadhaarNumber" onChange={handleChange} required={accountType !== 'FixedDeposit'} />
                      </div>

                      {accountType === 'Current' && (
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Business Name (Optional)</label>
                          <input type="text" className="form-control" name="businessName" onChange={handleChange} />
                        </div>
                      )}

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Nominee Name</label>
                        <input type="text" className="form-control" name="nominee" onChange={handleChange} required />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="form-label">Initial Deposit (INR)</label>
                        <input type="number" className="form-control" name="initialDeposit" onChange={handleChange} min="500" required />
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary py-2 fw-bold">Submit Application</button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAccount;
