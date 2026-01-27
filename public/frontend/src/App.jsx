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
        <main className='flex-grow'> 
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

export default App
