import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { URL } from '../config.js';

function Balance(props) {
    const [balanceInfo, setBalanceInfo] = useState({});

    useEffect(() => {
        if (!props.weatherData || Object.keys(props.weatherData).length === 0) return;
        const getInfo = async () => {
            try {
                const plantType = await axios.post(`${URL}/plant/balance`, props.weatherData);
                setBalanceInfo(plantType.data.payload);
            } catch (e) {
                console.log(e);
            }
        }
        getInfo();
    }, [props.weatherData])

    console.log(balanceInfo)

    // Render all key/value pairs from info
    return (
        <div>
            <h2>Balance Info</h2>
            <ul>
                {/*Object.entries(balanceInfo).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                ))*/}
            </ul>
        </div>
    );
}

export default Balance;