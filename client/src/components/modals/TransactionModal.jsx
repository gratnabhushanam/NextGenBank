import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TransactionModal = ({ show, onClose, type, accounts, onSuccess }) => {
  const { user } = useAuth();
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const endpoint = type === 'Deposit' ? '/api/accounts/deposit' : '/api/accounts/withdraw';
      
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${endpoint}`, {
        accountNumber,
        amount: Number(amount)
      }, config);
      
      onSuccess();
      onClose();
      setAmount('');
      setAccountNumber('');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-light-blue text-primary border-bottom-0">
            <h5 className="modal-title fw-bold">{type} Funds</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-dark-blue fw-semibold">Select Account</label>
                <select className="form-select" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required>
                  <option value="">-- Choose Account --</option>
                  {accounts.map(acc => (
                    <option key={acc.id || acc.accountNumber} value={acc.accountNumber}>
                      {acc.accountNumber} ({acc.accountType} - {acc.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label text-dark-blue fw-semibold">Amount (INR)</label>
                <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" required />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary fw-bold py-2" disabled={loading}>
                  {loading ? 'Processing...' : `Confirm ${type}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
