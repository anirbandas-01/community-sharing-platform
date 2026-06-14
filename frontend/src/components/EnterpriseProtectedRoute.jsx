import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

export default function EnterpriseProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const checkEnterprise = async () => {
      try {
        const res = await api.get('/business/profile');
        const enterprise = res.data.enterprise;
        setApproved(enterprise?.status === 'approved');
      } catch {
        setApproved(false);
      } finally {
        setLoading(false);
      }
    };

    checkEnterprise();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!approved) {
    return <Navigate to="/business/dashboard" replace />;
  }

  return children;
}