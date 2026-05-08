import './App.css'
import React from 'react';
import About from './views/About.jsx'
import Account from './views/Account.jsx'
import Contact from './views/Contact.jsx'
import DigitalPlant from './views/DigitalPlant.jsx'
import Navbar from './components/Navbar.jsx'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router'
import { URL } from './config.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const verify_token = async () => {
      if (token === null) setIsLoggedIn(false);
      try {
        axios.defaults.headers.common['Authorization'] = token;
        const res = await axios.post(`${URL}/client/verify_token`)
        return res.data.ok ? login(token) : logout()
      } catch (e) {
        console.log(e);
      }
    }
    verify_token();
  }, [])


  const login = (token) => {
    localStorage.setItem('token', JSON.stringify(token));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<DigitalPlant loggedIn={isLoggedIn} />} />'
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/account' element={<Account login={login} loggedIn={isLoggedIn} logout={logout}/>} />
      </Routes>
    </Router>
  )
}

export default App
