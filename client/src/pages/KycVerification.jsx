import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const KycVerification = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/upload/kyc/pending', config);
      setDocuments(res.data);
    } catch (err) {
      setError('Failed to fetch pending KYC documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleVerify = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/upload/kyc/${id}/verify`, { status }, config);
      
      // Remove from list
      setDocuments(documents.filter(doc => doc.id !== id));
      alert(`Document successfully ${status.toLowerCase()}`);
    } catch (err) {
      alert('Failed to verify document');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h3 className="mb-4 text-primary fw-bold">Employee Portal: KYC Verification</h3>
      
      {documents.length === 0 ? (
        <div className="alert alert-info">No pending KYC documents to verify.</div>
      ) : (
        <div className="row">
          {documents.map(doc => (
            <div className="col-md-6 mb-4" key={doc.id}>
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="card-subtitle mb-3 text-muted">User ID: {doc.userId}</h6>
                  
                  {/* Since it's a static file server on /uploads, we can show image or link */}
                  <div className="mb-3 text-center">
                    {doc.filePath.endsWith('.pdf') ? (
                      <a href={`http://localhost:5000${doc.filePath}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                        View PDF Document
                      </a>
                    ) : (
                      <img 
                        src={`http://localhost:5000${doc.filePath}`} 
                        alt="KYC Document" 
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '250px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/250?text=Document+Not+Found'; }}
                      />
                    )}
                  </div>
                  
                  <div className="d-flex justify-content-between mt-4">
                    <button 
                      className="btn btn-danger fw-bold px-4 rounded-pill"
                      onClick={() => handleVerify(doc.id, 'Rejected')}
                    >
                      Reject
                    </button>
                    <button 
                      className="btn btn-success fw-bold px-4 rounded-pill"
                      onClick={() => handleVerify(doc.id, 'Verified')}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KycVerification;
