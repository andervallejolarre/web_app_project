import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { URL } from '../config.js';
import GeoLocation from './GeoLocation.jsx'

function Weather(props) {

    const [weatherInfo, setWeatherInfo] = useState({})
    const location = GeoLocation();

    /*if (location) {
        console.log(location);
    }
     */

    useEffect(() => {
        if (!location) return;
        const getInfo = async () => {
            try {
                const weather = await axios.get(`${URL}/plant/weather?latitude=${location.latitude}&longitude=${location.longitude}`);
                setWeatherInfo(weather.data.payload);
                props.passData(weather.data.payload);
            } catch (e) {
                console.log(e);
            }
        }
        getInfo();
    }, [location])

    // Render all key/value pairs from info
    return (
        <div>
            <h2>WeatherInfo</h2>
            <ul>
                {Object.entries(weatherInfo).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
            </ul>
        </div>
    );
}

export default Weather;