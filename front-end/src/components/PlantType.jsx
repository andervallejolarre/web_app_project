import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { URL } from '../config.js';

function PlantType() {

    const [plantTypeInfo, setPlantTypeInfo] = useState({})

    useEffect(() => {
        const getInfo = async () => {
            try {
                const plantType = await axios.get(`${URL}/plant/plant-type-info`) || {};
                setPlantTypeInfo(plantType.data.payload);
            } catch (e) {
                console.log(e);
            }
        }
        getInfo();
    }, [])


    // Render all key/value pairs from info
    return (
        <div>
            <h2>Plant Type Info</h2>
            <ul>
                {Object.entries(plantTypeInfo).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
            </ul>
        </div>
    );
}

export default PlantType;