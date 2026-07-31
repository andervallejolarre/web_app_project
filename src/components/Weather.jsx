import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../config.js';
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
                const weather = await axios.get(`${SERVER_URL}/plant/weather?latitude=${location.latitude}&longitude=${location.longitude}`, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
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
        <>
            {props.screen == 2 &&
                <div className="screenInfo">
                    <h2>Weather Info</h2>
                    <p>This is an average of the upcoming conditions for the next 7 days:</p>
                    <ul>
                        <li><strong>Avg. Temp (ºC) :</strong> {weatherInfo.Avg_Min_Temperature} - {weatherInfo.Avg_Max_Temperature}</li>
                        <li><strong>Humidity (%) :</strong> {weatherInfo.Avg_Humidity}</li>
                        <li><strong>UV Index :</strong> {weatherInfo.Avg_UV_Index}</li>
                        <li><strong>Precipitation (mm) :</strong> {weatherInfo.Avg_Precipitation}</li>
                    </ul>
                    <p>With this information you can now take care of your plant.</p>
                </div>
            }
        </>
    );
}

export default Weather;