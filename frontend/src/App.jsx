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



function App() {

  return (
      <Routes>
        <Route path='/' element={<Landing/>}/>
        
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        
        <Route path="/resident" element={
               <ProtectedRoute>
                    <ResidentDashboard />
                    <ResidentServices />
                    <ResidentBookings />
                    <ResidentMessages />
                    <ResidentProfile />
                </ProtectedRoute>
        }
        />
      </Routes>
  )
}

export default App
