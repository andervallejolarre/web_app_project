import React from 'react'
import { NavLink } from 'react-router'
import { useState, useEffect } from 'react'
import PlantInfo from '../components/PlantInfo.jsx'
import Weather from '../components/Weather.jsx'
import PlantType from '../components/PlantType.jsx'
import Balance from '../components/Balance.jsx'

function DigitalPlant(props) {

    if (props.loggedIn) {

        const [weather,setWeather]=useState({})
        
        const passData =(info)=>{
            setWeather(info);
        }

        return (
            <section>
                <div>
                <Weather passData={passData}/>
                <PlantType />
                <Balance weatherData={weather} />
                </div>
                <PlantInfo />
            </section>
        )
    } else {
        return (
            <div>
                <h1>Log In to check on your Plant</h1>
                <NavLink to="/account"><button>ACCOUNT</button></NavLink>
            </div>
        )
    }
}

export default DigitalPlant