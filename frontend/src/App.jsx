import { Routes, Route, Navigate } from "react-router-dom";


import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ResidentDashboard from './pages/resident/ResidentDashboard';
import ResidentServices from './pages/resident/ResidentServices';
import ResidentBookings from './pages/resident/ResidentBookings';
import ResidentMessages from './pages/resident/ResidentMessages';
import ResidentProfile from './pages/resident/ResidentProfile';
import ProtectedRoute from "./utils/ProtectedRoute";
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import ProfessionalServices from "./pages/professional/ProfessionalServices";
import ProfessionalAppointments from "./pages/professional/ProfessionalAppointments";
import ProfessionalEarnings from "./pages/professional/ProfessionalEarnings";
import ProfessionalReviews from "./pages/professional/ProfessionalReviews";
import ProfessionalMessages from "./pages/professional/ProfessionalMessages";
import ProfessionalSettings from "./pages/professional/ProfessionalSettings";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessOrders from "./pages/business/BusinessOrders";
import BusinessInventory from "./pages/business/BusinessInventory";
import BusinessProfile from "./pages/business/BusinessProfile";
import BusinessEnterprise from "./pages/business/BusinessEnterprise";
import BusinessRevenue from "./pages/business/BusinessRevenue";
import BusinessContact from "./pages/business/BusinessContact";
import { useEffect, useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function App() {

  const [user, setUser] = useState(null);
  const[loading, setLoading] = useState(true);

  useEffect(()=> {
    checkAuth();
  }, []);

  /* const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if(!token){
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        headers:{
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if(response.ok){
         const data = await response.json();
        setUser(data.user || data);
      } else {
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  }; */


   const checkAuth = async () => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");

  if (!token) {
    setLoading(false);
    return;
  }

  try {
    let endpoint = "/user/profile";

    if (userType === "admin") {
      endpoint = "/admin/profile";
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user || data);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user_type");
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  } finally {
    setLoading(false);
  }
};  
    const ProtectedRoute = ({ children, allowedType }) => {
    if (loading) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <div className="spinner"></div>
        </div>
      );
    }

    /* if (!user) {
      return <Navigate to="/login" />;
    } */

      if (!user) {
  const type = localStorage.getItem("user_type");

  if (type === "admin") {
    return <Navigate to="/admin/login" />;
  }

  return <Navigate to="/login" />;
}

    if (allowedType && user.user_type !== allowedType) {
      return <Navigate to={`/${user.user_type}/dashboard`} />;
    }

    return children;
  };

  return (
      <Routes>
        <Route path='/' element={<Landing/>}/>
        
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        
        <Route path="/resident/dashboard"
          element={
               <ProtectedRoute allowedType="resident">
                    <ResidentDashboard />
                </ProtectedRoute>
            }
          />

          <Route
            path="/resident/services"
              element={
                <ProtectedRoute allowedType="resident">    
                    <ResidentServices />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/resident/bookings"
                element={
                  <ProtectedRoute allowedType="resident">   
                    <ResidentBookings />
                  </ProtectedRoute>
                }
            />

            <Route
              path="/resident/message"
                element={
                  <ProtectedRoute allowedType="resident">
                    <ResidentMessages />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/resident/profile"
                element={
                  <ProtectedRoute allowedType="resident">    
                    <ResidentProfile />
                  </ProtectedRoute>
                }
            />

            
            <Route
               path="/professional/dashboard"
                element={
                  <ProtectedRoute allowedType="professional">    
                    <ProfessionalDashboard />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/professional/services"
                element={
                  <ProtectedRoute allowedType="professional">    
                    <ProfessionalServices />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/professional/appointments"
                element={
                  <ProtectedRoute allowedType="professional">    
                    <ProfessionalAppointments />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/Professional/earnings"
                element={
                  <ProtectedRoute allowedType="professional">    
                    <ProfessionalEarnings />
                  </ProtectedRoute>
                }
            />
          
           <Route
               path="/professional/reviews"
                element={
                  <ProtectedRoute allowedType="professional">    
                    <ProfessionalReviews />
                  </ProtectedRoute>
                }
            />

           <Route
               path="/professional/messages"
                element={
                  <ProtectedRoute allowedType="professional">    
                    <ProfessionalMessages />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/professional/settings"
                element={
                  <ProtectedRoute allowedType="professional">    
                    <ProfessionalSettings />
                  </ProtectedRoute>
                }
            />

           <Route
               path="/business/dashboard"
                element={
                  <ProtectedRoute allowedType="business">    
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/business/orders"
                element={
                  <ProtectedRoute allowedType="business">    
                    <BusinessOrders />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/business/inventory"
                element={
                  <ProtectedRoute allowedType="business">    
                    <BusinessInventory />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/business/profile"
                element={
                  <ProtectedRoute allowedType="business">    
                    <BusinessProfile />
                  </ProtectedRoute>
                }
            />


            <Route
               path="/business/enterprise"
                element={
                  <ProtectedRoute allowedType="business">    
                    <BusinessEnterprise />
                  </ProtectedRoute>
                }
            />


            <Route
               path="/business/revenue"
                element={
                  <ProtectedRoute allowedType="business">    
                    <BusinessRevenue />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/business/contact"
                element={
                  <ProtectedRoute allowedType="business">    
                    <BusinessContact />
                  </ProtectedRoute>
                }
            />


          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
          />
          
          <Route path="*" element={<Navigate to="/" />} />

      </Routes>
  )
}

export default App
