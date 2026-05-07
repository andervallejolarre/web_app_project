import React from 'react'
import { NavLink } from 'react-router'

function DigitalPlant(props) {
    if (props.loggedIn) {
        return (
            <div>
                <h1>YOU CAN SEE THE PLANT</h1>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Log In to check on your Plant</h1>
                <NavLink to ="/account"><button>ACCOUNT</button></NavLink>
            </div>
        )
    }
}

export default DigitalPlant