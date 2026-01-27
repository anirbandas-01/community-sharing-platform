import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'

import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {
  

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <main className='flex-grow pt-16'> 
          <Routes>
            <Route path='/' element={<Home />}/> 
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login />}/>


          </Routes>
         </main> 
    <Footer />
    </div>
  )
}

export default App;