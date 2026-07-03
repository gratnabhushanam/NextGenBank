import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark text-light' : 'navbar-light bg-white'} sticky-top shadow-sm`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-bank me-2"></i>
          NextGen Bank
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item me-3">
                  <button className="btn btn-link nav-link text-decoration-none" onClick={toggleTheme}>
                    {isDarkMode ? <i className="bi bi-sun-fill text-warning fs-5"></i> : <i className="bi bi-moon-fill text-secondary fs-5"></i>}
                  </button>
                </li>
                <li className="nav-item me-3">
                  <a className="nav-link position-relative cursor-pointer" href="#" title="Notifications">
                    <i className="bi bi-bell fs-5"></i>
                    <span className="position-absolute top-25 start-75 translate-middle p-1 bg-danger border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px'}}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-semibold">{user.name}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                    <li><Link className="dropdown-item" to="/profile">Profile Settings</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-primary fw-bold" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary text-white px-4 ms-2 fw-bold rounded-pill" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
