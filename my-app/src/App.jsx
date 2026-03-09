import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import ResidentDashboard from './pages/resident/ResidentDashboard';
import ProfessionalDashboard from './pages/professional/ProfessionalDashboard';
import BusinessDashboard from './pages/business/BusinessDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ResidentCommunities from './pages/resident/ResidentCommunities';
import ResidentProfessionals from './pages/resident/ResidentProfessionals';
import ResidentBookings from './pages/resident/ResidentBookings';
import ResidentMessages from './pages/resident/ResidentMessages';
import ResidentProfile from './pages/resident/ResidentProfile';
import ProfessionalServices from './pages/professional/ProfessionalServices';
import BusinessInventory from './pages/business/BusinessInventory';
import CommunityDetail from './pages/resident/CommunityDetail';
import ProfessionalDetail from './pages/resident/ProfessionalDetail';
import ResidentSettings from './pages/resident/ResidentSettings';
import ProfessionalBookings from './pages/professional/ProfessionalBookings';
import ProfessionalProfile from './pages/professional/ProfessionalProfile';
import ProfessionalSettings from './pages/professional/ProfessionalSettings';
import ProfessionalMessages from './pages/professional/Professionalmessages';
import ProfessionalGroups from './pages/professional/Professionalgroups';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Resident Routes */}
          <Route
            path="/resident/dashboard"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resident/communities"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <ResidentCommunities />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/resident/communities/:id"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <CommunityDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resident/professionals"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <ResidentProfessionals />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/resident/professionals/:id"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <ProfessionalDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resident/bookings"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <ResidentBookings />
              </ProtectedRoute>
            }
          />
          

          <Route
            path="/resident/messages"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <ResidentMessages />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/resident/profile"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <ResidentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resident/settings"
            element={
              <ProtectedRoute allowedTypes={['resident']}>
                <ResidentSettings />
              </ProtectedRoute>
            }
          />


          {/* Professional Routes */}
          <Route
            path="/professional/dashboard"
            element={
              <ProtectedRoute allowedTypes={['professional']}>
                <ProfessionalDashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/professional/services"
            element={
              <ProtectedRoute allowedTypes={['professional']}>
                <ProfessionalServices />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/bookings"
            element={
              <ProtectedRoute allowedTypes={['professional']}>
                <ProfessionalBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/professional/profile"
            element={
              <ProtectedRoute allowedTypes={['professional']}>
                <ProfessionalProfile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/settings"
            element={
              <ProtectedRoute allowedTypes={['professional']}>
                <ProfessionalSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/professional/messages"
            element={
              <ProtectedRoute allowedTypes={['professional']}>
                <ProfessionalMessages />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professional/groups"
            element={
              <ProtectedRoute allowedTypes={['professional']}>
                <ProfessionalGroups />
              </ProtectedRoute>
            }
          />

          {/* Business Routes */}
          <Route
            path="/business/dashboard"
            element={
              <ProtectedRoute allowedTypes={['business']}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/inventory"
            element={
              <ProtectedRoute allowedTypes={['business']}>
                <BusinessInventory />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;