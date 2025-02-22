import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import MainChat from './components/MainChat/MainChat';
import SideChat from './components/SideChat/SideChat';
import Login from './components/Login/Login';

function App() {
  return (
    <Router className='app'>
      {/* <SideChat/> */}
      <AuthHandler />
      <Routes>
        <Route path="/" element={<MainChat />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

function AuthHandler() {
  const location = useLocation();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername);

    if (storedUsername === null && location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, [location.pathname]);

  return null;
}

export default App;
