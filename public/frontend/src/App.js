import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


import './App.css';
//import ToolList from './ToolList';
import Home from './Home';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    
    <Router>
      <div className='App-header'>
        <header>
            <h1>Community Sharing Platform</h1>
            <nav>
              <a href='/'>Home</a>
              <br />
              <a href='/register'>Register</a>
              <br />
              <a href='/login'>Login</a>
            </nav>
        </header>

        <main className='container'>
          <Routes>
             <Route path='/' element={<Home />}/>
             <Route path='/register' element={<Register />}/>
             <Route path='/login' element={<Login />}/>
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
