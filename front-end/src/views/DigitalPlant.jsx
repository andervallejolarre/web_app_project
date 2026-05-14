import React from 'react'
import { NavLink } from 'react-router'
import { useState, useEffect } from 'react'
import Weather from '../components/Weather.jsx'
import PlantType from '../components/PlantType.jsx'
import Balance from '../components/Balance.jsx'
import Action from '../components/Action.jsx'
import SelectedGraph from '../components/SelectedGraph.jsx'
import { URL } from '../config.js';
import axios from 'axios'

function DigitalPlant(props) {

    if (props.loggedIn) {

        const [weather, setWeather] = useState({})
        const [plantInfo, setPlantInfo] = useState({})

        const passData = (info) => {
            setWeather(info);
        }

        useEffect(() => {
            const getInfo = async () => {
                try {
                    const plant = await axios.get(`${URL}/plant/plant-info`) || {};
                    setPlantInfo(plant.data.payload);
                } catch (e) {
                    console.log(e);
                }
            }
            getInfo();
        }, [])

        return (
            <>
                <section>
                    <div>
                        <Weather passData={passData} />
                        <PlantType />
                        <Balance weatherData={weather} />
                    </div>
                    <SelectedGraph level={plantInfo.level} />
                    <p><strong>Level : </strong>{plantInfo.level}</p>
                    <p><strong>Progress : </strong>{plantInfo.progress}</p>
                    <div>
                        <p><strong>Watering : </strong>{plantInfo.hidration ? 'ON' : 'OFF'}</p>
                        <p><strong>Nutrients : </strong>{plantInfo.nutrients ? 'ON' : 'OFF'}</p>
                    </div>
                    <div>
                        <p><strong>Protection : </strong>{plantInfo.protection ? 'ON' : 'OFF'}</p>
                        <p><strong>Stress : </strong>{plantInfo.stress}</p>
                    </div>
                </section>
                <section>
                    <Action />
                </section>
            </>
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