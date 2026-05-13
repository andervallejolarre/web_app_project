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
            <p>Your plant is a : <strong>{plantTypeInfo.type}</strong></p>
            <p>This are the weather conditions ranges that your plant likes :</p>
            <ul>
                <li><strong>Temperatures (ºC) :</strong> {plantTypeInfo.min_temp} - {plantTypeInfo.max_temp}</li>
                <li><strong>Humidity (%) :</strong> {plantTypeInfo.min_humidity} - {plantTypeInfo.max_humidity}</li>
                <li><strong>UV Index :</strong> {plantTypeInfo.min_radiation} - {plantTypeInfo.max_radiation}</li>
            </ul>
            <p>Remember : </p>
            <ul>
                <li>Fluctuations in this ranges will increase plants stress</li>
                <li>Stress is not always bad, but you have to be careful</li>
                <li>Weather precipitation will increase humidity</li>
            </ul>
            <p>Whith this in mind, go and take care of your plant</p>
        </div>
    );
}

export default PlantType;