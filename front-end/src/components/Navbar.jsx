import React from 'react'
import { NavLink } from 'react-router'

function Navbar(){
    return(
        <div className='navbar'>
            <NavLink to= '/'>DigitalPlant</NavLink>
            <NavLink to= '/about'>About</NavLink>
            <NavLink to= '/account'>Account</NavLink>
            <NavLink to= '/contact'>Contact</NavLink>
            </div>
    )
}

export default Navbar