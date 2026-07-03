import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div 
      className="d-flex align-items-center justify-content-center" 
      style={{ 
        minHeight: 'calc(100vh - 70px)', 
        margin: '-1.5rem', // Offset the p-4 from App.jsx container-fluid
        padding: '2rem',
        backgroundImage: "linear-gradient(rgba(0, 0, 50, 0.6), rgba(0, 0, 50, 0.6)), url('https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat' 
      }}
    >
      <div className="p-5 text-center bg-white rounded-4 shadow-lg" style={{ maxWidth: '800px', opacity: 0.95 }}>
        <h1 className="display-4 fw-bold text-primary mb-4">Welcome to NextGen Bank</h1>
        <p className="lead mt-3 text-secondary">
          Experience the future of banking with our Advanced Object-Oriented System.
          Manage your Savings, Current, and Fixed Deposit accounts seamlessly.
        </p>
        <hr className="my-4" />
        <p className="text-muted">
          Secure, fast, and reliable. Built with MERN Stack and Clean Architecture.
        </p>
        <div className="mt-4 pt-2">
          <Link to="/register" className="btn btn-primary btn-lg me-3 fw-bold px-4 rounded-pill">
            Open an Account
          </Link>
          <Link to="/login" className="btn btn-outline-primary btn-lg fw-bold px-5 rounded-pill">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
