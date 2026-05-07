import './App.css'
import React from 'react';
import About from './views/About.jsx'
import Account from './views/Account.jsx'
import Contact from './views/Contact.jsx'
import DigitalPlant from './views/DigitalPlant.jsx'
import Navbar from './components/Navbar.jsx'
import { useState } from 'react' 
import { BrowserRouter as Router,Route, Routes } from 'react-router'

function App() {
  const [count, setCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path='/' element= {<DigitalPlant loggedIn={isLoggedIn}/>}/>'
      <Route path='/about' element= {<About/>}/>
      <Route path='/contact' element= {<Contact/>}/>
      <Route path='/account' element= {<Account login={login} loggedIn={isLoggedIn}/>}/>
    </Routes>
    </Router>
  )
}

export default App
