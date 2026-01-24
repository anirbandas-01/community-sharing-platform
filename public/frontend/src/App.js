import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


import './App.css';
//import ToolList from './ToolList';
import Home from './Home';
import Register from './components/Register';
import Login from './Login';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoutes';


function App() {

  const isLoggedIn = localStorage.getItem('auth_token');

  return (
    
    <Router>
      <div className='App'>
        <header className='App-header'>
            <h1>Community Sharing Platform</h1>
            <nav>
              <a href='/'>Home</a>
              {!isLoggedIn ? (
                <>
                  <a href='/register'>Register</a>
                  <a href='/login'>Login</a>
                </>
              ): (
                <>
                  <a href='/dashboard'>Dashboard</a>
                  <a href='/tools'>Tools</a>
                  <a href='/logout'>Logout</a>
                </>
              )}
            </nav>
        </header>

        <main className='container'>
          <Routes>
             <Route path='/' element={<Home />}/>
             <Route path='/register' element={<Register />}/>
             <Route path='/login' element={<Login />}/>

             <Route path='/dashboard' element={
                <ProtectedRoute>
                   <Dashboard />
                </ProtectedRoute>   
              }  />
          </Routes>
        </main>

        <footer>
          <p>Build strong community together</p>
        </footer>
      </div>
    </Router>
    
    
    /* 
    <div className="App">
      <header className="App-header">
        <h1>Community Sharing Platform</h1>
      </header>
      <main>
        <ToolList />
      </main>
    </div> */
  );
}

export default App;
