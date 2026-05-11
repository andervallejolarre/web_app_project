import React from 'react'
import { NavLink } from 'react-router'
import PlantInfo from '../components/PlantInfo.jsx'

function DigitalPlant(props) {
    if (props.loggedIn) {
        return (
            <section>
                <PlantInfo />
            </section>
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