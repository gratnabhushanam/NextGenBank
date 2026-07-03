import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null; // Don't show sidebar if not logged in

  let navItems = [];

  if (user.role === 'customer') {
    navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: 'bi-grid' },
      { name: 'Open Account', path: '/open-account', icon: 'bi-plus-circle' },
      { name: 'Apply Loan', path: '/loans', icon: 'bi-cash-coin' },
      { name: 'Statements', path: '/statements', icon: 'bi-file-earmark-text' },
      { name: 'Profile', path: '/profile', icon: 'bi-person' },
    ];
  } else if (user.role === 'employee') {
    navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: 'bi-grid' },
      { name: 'Verify KYC', path: '/kyc-verification', icon: 'bi-person-badge' },
      { name: 'Register Customer', path: '/employee/create-customer', icon: 'bi-person-plus' },
      { name: 'Profile', path: '/profile', icon: 'bi-person' },
    ];
  } else if (user.role === 'manager') {
    navItems = [
      { name: 'Dashboard', path: '/dashboard', icon: 'bi-grid' },
      { name: 'Approve Loans', path: '/loans-manager', icon: 'bi-cash-stack' },
      { name: 'Approve KYC', path: '/kyc-verification', icon: 'bi-person-badge' },
      { name: 'Profile', path: '/profile', icon: 'bi-person' },
    ];
  } else if (user.role === 'admin') {
    navItems = [
      { name: 'Admin Dashboard', path: '/admin', icon: 'bi-shield-lock' },
      { name: 'Profile', path: '/profile', icon: 'bi-person' },
    ];
  }

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm" style={{ width: '250px' }}>
      <ul className="nav nav-pills flex-column mb-auto mt-3">
        {navItems.map(item => (
          <li className="nav-item mb-2" key={item.name}>
            <Link 
              to={item.path} 
              className={`nav-link fw-semibold ${location.pathname === item.path ? 'active text-white' : 'text-dark-blue'}`}
              style={{
                backgroundColor: location.pathname === item.path ? 'var(--primary-blue)' : 'transparent',
                borderRadius: '8px'
              }}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <hr />
      <div>
        <button 
          className="btn btn-outline-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
