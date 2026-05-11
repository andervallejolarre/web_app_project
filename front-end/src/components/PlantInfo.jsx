import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { URL } from '../config.js';
import GeoLocation from './GeoLocation.jsx'

function PlantInfo() {

    const [plantInfo, setPlantInfo] = useState({})
    //const [location, setLocation] = useState({})
    const location = GeoLocation();
    //console.log(location);

    useEffect(() => {
        const getInfo = async () => {
            try {
                const plant = await axios.get(`${URL}/plant/plant-info`);
                setPlantInfo(plant.data.payload);
            } catch (e) {
                console.log(e);
            }
        }
        getInfo();
        //setLocation(GeoLocation());
    }, [plantInfo])


    // Render all key/value pairs from info
    return (
        <div>
            <h2>Plant Info</h2>
            <ul>
                {Object.entries(plantInfo).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {String(value)}</li>
                ))}
            </ul>
        </div>
    );
}

export default PlantInfo;