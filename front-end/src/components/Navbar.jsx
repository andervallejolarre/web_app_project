import React from 'react'
import { NavLink } from 'react-router'

function Navbar(){
    return(
        <div className='navbar'>
            <h1>W... P... S</h1>
            <div className="centerNav">
            <NavLink to= '/' className="navlink">DIGITALPLANT</NavLink>
            <NavLink to= '/about' className="navlink">ABOUT</NavLink>
            <NavLink to= '/contact' className="navlink">CONTACT</NavLink>
            </div>
            <NavLink to= '/account' className="navlink">ACCOUNT</NavLink>
            </div>
    )
}

export default Navbar