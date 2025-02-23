import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');

    if (!token && username && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
}

export default App;
