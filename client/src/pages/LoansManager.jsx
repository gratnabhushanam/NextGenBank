import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

const LoansManager = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);

  const fetchPendingLoans = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/loans/pending', config);
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/loans/${id}`, { status }, config);
      fetchPendingLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating loan');
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-primary fw-bold">Pending Loan Applications</h3>
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Customer ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Documents</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td className="text-muted">#{loan.id}</td>
                    <td className="fw-bold">{loan.customerId}</td>
                    <td>{loan.loanType || 'Personal Loan'}</td>
                    <td className="fw-bold">{formatCurrency(loan.amount)}</td>
                    <td>{loan.durationMonths} months</td>
                    <td>
                      {loan.panCardUrl && <a href={`http://localhost:5000${loan.panCardUrl}`} target="_blank" rel="noreferrer" className="d-block badge bg-info text-decoration-none mb-1">PAN Card</a>}
                      {loan.aadhaarCardUrl && <a href={`http://localhost:5000${loan.aadhaarCardUrl}`} target="_blank" rel="noreferrer" className="d-block badge bg-info text-decoration-none mb-1">Aadhaar</a>}
                      {loan.propertyDocUrl && <a href={`http://localhost:5000${loan.propertyDocUrl}`} target="_blank" rel="noreferrer" className="d-block badge bg-secondary text-decoration-none">Property Doc</a>}
                      {!loan.panCardUrl && !loan.aadhaarCardUrl && <span className="text-muted small">No docs</span>}
                    </td>
                    <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-success me-2 fw-bold" onClick={() => handleStatusUpdate(loan.id, 'Approved')}>Approve</button>
                      <button className="btn btn-sm btn-danger fw-bold" onClick={() => handleStatusUpdate(loan.id, 'Rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No pending loans found.</td>
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

export default LoansManager;
