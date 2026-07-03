import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TransferModal = ({ show, onClose, accounts, onSuccess }) => {
  const { user } = useAuth();
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // For searching receiver
  const [allAccounts, setAllAccounts] = useState([]);

  useEffect(() => {
    if (show) {
      const fetchAllAccounts = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const res = await axios.get('http://localhost:5000/api/accounts', config);
          setAllAccounts(res.data);
        } catch (err) {
          console.error("Failed to fetch accounts");
        }
      };
      fetchAllAccounts();
    }
  }, [show, user.token]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (fromAccount === toAccount) {
      setError('Cannot transfer to the same account.');
      return;
    }

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      await axios.post('http://localhost:5000/api/accounts/transfer', {
        fromAccountNumber: fromAccount,
        toAccountNumber: toAccount,
        amount: Number(amount)
      }, config);
      
      onSuccess();
      onClose();
      setAmount('');
      setFromAccount('');
      setToAccount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-light-blue text-primary border-bottom-0">
            <h5 className="modal-title fw-bold">Transfer Funds</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-dark-blue fw-semibold">From Account (Sender)</label>
                <select className="form-select" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} required>
                  <option value="">-- Choose My Account --</option>
                  {accounts.map(acc => (
                    <option key={acc.id || acc.accountNumber} value={acc.accountNumber}>
                      {acc.accountNumber} (Bal: {acc.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-dark-blue fw-semibold">To Account (Receiver)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter Receiver Account No." 
                  value={toAccount} 
                  onChange={(e) => setToAccount(e.target.value.toUpperCase())} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-dark-blue fw-semibold">Amount (INR)</label>
                <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" required />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary fw-bold py-2" disabled={loading}>
                  {loading ? 'Processing...' : 'Complete Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
