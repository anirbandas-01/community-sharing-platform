// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

function ProtectedRoute({ children }) {
  const location = useLocation();
  
  if (!authService.isAuthenticated()) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;