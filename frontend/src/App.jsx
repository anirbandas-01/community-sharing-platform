import { Routes, Route } from "react-router-dom";


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



function App() {

  return (
      <Routes>
        <Route path='/' element={<Landing/>}/>
        
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        
        <Route path="/resident/dashboard"
          element={
               <ProtectedRoute>
                    <ResidentDashboard />
                </ProtectedRoute>
            }
          />

          <Route
            path="/resident/services"
              element={
                <ProtectedRoute>    
                    <ResidentServices />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/resident/bookings"
                element={
                  <ProtectedRoute>   
                    <ResidentBookings />
                  </ProtectedRoute>
                }
            />

            <Route
              path="/resident/message"
                element={
                  <ProtectedRoute>
                    <ResidentMessages />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/resident/profile"
                element={
                  <ProtectedRoute>    
                    <ResidentProfile />
                  </ProtectedRoute>
                }
            />

            
            <Route
               path="/professional/dashboard"
                element={
                  <ProtectedRoute>    
                    <ProfessionalDashboard />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/professional/services"
                element={
                  <ProtectedRoute>    
                    <ProfessionalServices />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/professional/appointments"
                element={
                  <ProtectedRoute>    
                    <ProfessionalAppointments />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/Professional/earnings"
                element={
                  <ProtectedRoute>    
                    <ProfessionalEarnings />
                  </ProtectedRoute>
                }
            />
          
           <Route
               path="/professional/reviews"
                element={
                  <ProtectedRoute>    
                    <ProfessionalReviews />
                  </ProtectedRoute>
                }
            />

           <Route
               path="/professional/messages"
                element={
                  <ProtectedRoute>    
                    <ProfessionalMessages />
                  </ProtectedRoute>
                }
            />

            <Route
               path="/professional/settings"
                element={
                  <ProtectedRoute>    
                    <ProfessionalSettings />
                  </ProtectedRoute>
                }
            />
      </Routes>
  )
}

export default App
