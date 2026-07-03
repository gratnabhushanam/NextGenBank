import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import TransactionModal from '../components/modals/TransactionModal';
import TransferModal from '../components/modals/TransferModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState('Deposit');
  const [showTransferModal, setShowTransferModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [accRes, txnRes] = await Promise.all([
        axios.get('http://localhost:5000/api/accounts', config),
        axios.get('http://localhost:5000/api/transactions', config)
      ]);
      
      // Filter accounts for current user
      const userAccounts = accRes.data.filter(a => a.email === user.email);
      setAccounts(userAccounts);

      // If no accounts exist, redirect to Open Account flow
      if (userAccounts.length === 0) {
        navigate('/open-account');
      }

      // Filter transactions
      const accountNumbers = userAccounts.map(a => a.accountNumber);
      const userTxns = txnRes.data.filter(t => accountNumbers.includes(t.accountNumber));
      
      // Sort transactions by date descending
      userTxns.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(userTxns);

    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenTxModal = (type) => {
    setTxType(type);
    setShowTxModal(true);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

  // Chart Data - Strictly Blue
  const chartData = {
    labels: accounts.map(a => a.accountType),
    datasets: [
      {
        label: 'Balance (INR)',
        data: accounts.map(a => a.balance),
        backgroundColor: '#0052CC', // Primary Blue
      },
    ],
  };

  return (
    <div>
      <h2 className="mb-4 text-primary fw-bold">Welcome, {user.name}</h2>
      
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card bg-primary text-white h-100 border-0">
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title opacity-75">Total Balance</h5>
              <h2 className="card-text fw-bold">{formatCurrency(totalBalance)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card h-100 border-0" style={{ backgroundColor: 'var(--light-blue)' }}>
            <div className="card-body">
              <h5 className="card-title text-primary">Quick Actions</h5>
              <div className="d-flex gap-2 flex-wrap mt-3">
                <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={() => handleOpenTxModal('Deposit')}>Deposit</button>
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={() => handleOpenTxModal('Withdrawal')}>Withdraw</button>
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={() => setShowTransferModal(true)}>Transfer</button>
                <Link to="/open-account" className="btn btn-primary btn-sm rounded-pill px-3">Open New Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="mb-0 fw-bold text-dark-blue">My Accounts</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Account No.</th>
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
                        <td><span className="badge">{acc.accountType}</span></td>
                        <td className="fw-bold text-primary">{formatCurrency(acc.balance)}</td>
                        <td><span className={`badge ${acc.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>{acc.status}</span></td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => handleOpenTxModal('Deposit')}>Deposit</button>
                            <button className="btn btn-outline-primary" onClick={() => handleOpenTxModal('Withdrawal')}>Withdraw</button>
                            <button className="btn btn-outline-primary" onClick={() => setShowTransferModal(true)}>Transfer</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="mb-0 fw-bold text-dark-blue">Balance Distribution</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
               <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-5 shadow-sm border-0">
        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark-blue">Recent Transactions</h5>
          <Link to="/statements" className="btn btn-outline-primary btn-sm rounded-pill">View Statement</Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map(txn => (
                  <tr key={txn.id || txn._id}>
                    <td>{new Date(txn.createdAt || txn.date).toLocaleString('en-IN')}</td>
                    <td>{txn.accountNumber}</td>
                    <td><span className={`fw-semibold ${['Deposit', 'Interest Credit'].includes(txn.transactionType) ? 'text-success' : 'text-danger'}`}>{txn.transactionType}</span></td>
                    <td className="text-muted">{txn.description || '-'}</td>
                    <td className="fw-bold">{formatCurrency(txn.amount)}</td>
                    <td className="text-muted">{formatCurrency(txn.balanceAfterTransaction)}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No recent transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <TransactionModal 
        show={showTxModal} 
        onClose={() => setShowTxModal(false)} 
        type={txType} 
        accounts={accounts} 
        onSuccess={fetchData} 
      />
      
      <TransferModal 
        show={showTransferModal} 
        onClose={() => setShowTransferModal(false)} 
        accounts={accounts} 
        onSuccess={fetchData} 
      />
    </div>
  );
};

export default Dashboard;
