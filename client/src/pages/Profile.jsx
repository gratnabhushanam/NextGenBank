import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || ''
  });

  const [kycFile, setKycFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUploadKYC = async (e) => {
    e.preventDefault();
    if (!kycFile) return;

    const data = new FormData();
    data.append('document', kycFile);

    try {
      setUploading(true);
      setMessage(null);
      setError(null);
      const config = { 
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/upload/kyc`, data, config);
      setMessage('KYC Document uploaded successfully. Verification is pending.');
      setKycFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white pt-4 pb-0 border-0">
            <h4 className="text-primary fw-bold">My Profile</h4>
          </div>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div 
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-1" 
                style={{ width: '80px', height: '80px' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ms-4">
                <h5 className="mb-1 fw-bold">{user.name}</h5>
                <p className="text-muted mb-0">{user.email}</p>
                <span className="badge bg-light-blue text-primary mt-2">Status: Active</span>
              </div>
            </div>

            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-dark-blue fw-semibold">Full Name</label>
                  <input type="text" className="form-control" value={formData.name} disabled />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-dark-blue fw-semibold">Email Address</label>
                  <input type="email" className="form-control" value={formData.email} disabled />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-dark-blue fw-semibold">Phone Number</label>
                  <input type="text" className="form-control" value={formData.phone} placeholder="Update Phone..." />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-dark-blue fw-semibold">Address</label>
                  <input type="text" className="form-control" value={formData.address} placeholder="Update Address..." />
                </div>
              </div>
              <button type="button" className="btn btn-primary mt-3 px-4 rounded-pill fw-bold">Update Profile</button>
            </form>

            <hr className="my-5" />

            <h5 className="fw-bold text-dark-blue mb-4">KYC Documents</h5>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleUploadKYC} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-muted">Upload PAN/Aadhaar (PDF or Image)</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept=".jpg,.jpeg,.png,.pdf" 
                  onChange={(e) => setKycFile(e.target.files[0])} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-outline-primary align-self-start fw-bold" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload KYC Document'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
