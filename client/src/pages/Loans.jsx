import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

const Loans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const [loanType, setLoanType] = useState('');
  const [panCard, setPanCard] = useState(null);
  const [aadhaarCard, setAadhaarCard] = useState(null);
  const [propertyDoc, setPropertyDoc] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLoans = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/loans/my`, config);
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }
    if (!panCard || !aadhaarCard) {
      setError('PAN Card and Aadhaar Card are mandatory.');
      return;
    }
    if ((loanType === 'Earth/Agriculture Loan' || loanType === 'Property/Home Loan') && !propertyDoc) {
      setError('Property Documents are required for this loan type.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('durationMonths', durationMonths);
      formData.append('loanType', loanType);
      formData.append('termsAccepted', termsAccepted);
      formData.append('panCard', panCard);
      formData.append('aadhaarCard', aadhaarCard);
      if (propertyDoc) formData.append('propertyDoc', propertyDoc);

      const config = { 
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };
      
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/loans`, formData, config);
      
      setMessage('Loan application submitted successfully.');
      setAmount('');
      setDurationMonths('');
      setLoanType('');
      setPanCard(null);
      setAadhaarCard(null);
      setPropertyDoc(null);
      setTermsAccepted(false);
      // reset file inputs manually
      document.getElementById('panCardInput').value = '';
      document.getElementById('aadhaarCardInput').value = '';
      const propInput = document.getElementById('propertyDocInput');
      if(propInput) propInput.value = '';
      
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || 'Error applying for loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-primary fw-bold">My Loans</h3>

      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold text-dark-blue mb-4">Apply for a Loan</h5>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleApply}>
                <div className="mb-3">
                  <label className="form-label text-muted">Loan Type</label>
                  <select className="form-select" value={loanType} onChange={(e) => setLoanType(e.target.value)} required>
                    <option value="">Select Loan Type</option>
                    <option value="Personal Loan">Personal Loan (10.5% Interest)</option>
                    <option value="Education Loan">Education Loan (2.5% Interest)</option>
                    <option value="Earth/Agriculture Loan">Earth/Agriculture Loan (1.5% Interest)</option>
                    <option value="Property/Home Loan">Property/Home Loan (8.5% Interest)</option>
                    <option value="Vehicle Loan">Vehicle Loan (9.0% Interest)</option>
                  </select>
                </div>
                
                {loanType && (
                  <div className="alert alert-info py-2">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    <strong>Interest Rate: </strong> 
                    {loanType === 'Education Loan' ? '2.5%' : 
                     loanType === 'Earth/Agriculture Loan' ? '1.5%' : 
                     loanType === 'Property/Home Loan' ? '8.5%' : 
                     loanType === 'Vehicle Loan' ? '9.0%' : '10.5%'} 
                    p.a.
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label text-muted">Amount</label>
                  <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Duration (Months)</label>
                  <select className="form-select" value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} required>
                    <option value="">Select duration</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                    <option value="36">36 Months</option>
                  </select>
                </div>

                <hr className="my-4" />
                <h6 className="fw-bold mb-3">Required Documents</h6>
                <div className="mb-3">
                  <label className="form-label text-muted">PAN Card</label>
                  <input type="file" id="panCardInput" className="form-control" onChange={(e) => setPanCard(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" required />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Aadhaar Card</label>
                  <input type="file" id="aadhaarCardInput" className="form-control" onChange={(e) => setAadhaarCard(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" required />
                </div>
                
                {(loanType === 'Earth/Agriculture Loan' || loanType === 'Property/Home Loan') && (
                  <div className="mb-3">
                    <label className="form-label text-muted">Property Document</label>
                    <input type="file" id="propertyDocInput" className="form-control" onChange={(e) => setPropertyDoc(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" required />
                  </div>
                )}

                <hr className="my-4" />
                <div className="mb-3 p-3 border rounded bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  <h6 className="fw-bold">Terms and Conditions</h6>
                  <small className="text-muted">
                    1. The bank reserves the right to reject any loan application based on credit history.<br/>
                    2. Interest rates are subject to change as per RBI guidelines.<br/>
                    3. Uploaded documents must be valid and clearly visible.<br/>
                    4. In case of default, the bank holds the right to initiate legal proceedings.<br/>
                    5. For Property/Earth loans, the collateral will be verified by the bank's legal team.
                  </small>
                </div>
                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="termsCheck" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                  <label className="form-check-label text-muted" htmlFor="termsCheck">
                    I agree to the Terms and Conditions
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Apply Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <h5 className="fw-bold text-dark-blue mb-3">Loan History</h5>
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Interest Rate</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td className="text-muted">#{loan.id}</td>
                    <td>{loan.loanType || 'Personal Loan'}</td>
                    <td className="fw-bold">{formatCurrency(loan.amount)}</td>
                    <td>{loan.durationMonths} months</td>
                    <td>{loan.interestRate}%</td>
                    <td>
                      <span className={`badge ${loan.status === 'Approved' ? 'bg-success' : loan.status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No loan history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans;
