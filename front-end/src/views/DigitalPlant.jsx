import React from 'react'
import { NavLink } from 'react-router'
import { useState, useEffect } from 'react'
import Weather from '../components/Weather.jsx'
import PlantType from '../components/PlantType.jsx'
import Balance from '../components/Balance.jsx'
import Action from '../components/Action.jsx'
import SelectedGraph from '../components/SelectedGraph.jsx'
import Contentbar from '../components/Contentbar.jsx'
import { URL } from '../config.js';
import axios from 'axios'

function DigitalPlant(props) {

    if (props.loggedIn) {

        const [weather, setWeather] = useState({})
        const [plantInfo, setPlantInfo] = useState({})
        const [screenInfo, setScreenInfo] = useState(0);

        const passData = (info) => {
            setWeather(info);
        }

        const showScreen = (val) => {
            setScreenInfo(val);
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
                <section className="screen">
                    <div className="dataBox">
                        <Contentbar showScreen={showScreen} />
                        <Weather passData={passData} screen={screenInfo} />
                        <PlantType screen={screenInfo} />
                        <Balance weatherData={weather} screen={screenInfo} />
                    </div>
                    <SelectedGraph className="plantGraph" level={plantInfo.level} />
                    <div className="progress">
                        <div className="dataUp">
                            <p><strong>Level : </strong>{plantInfo.level}</p>
                            <p><strong>Progress : </strong>{plantInfo.progress}</p>
                        </div>
                        <progress className="progressBar"value={plantInfo.progress} max={100} />
                    </div>
                    <div className="data1">
                        <p><strong>Watering : </strong>{plantInfo.hidration ? 'ON' : 'OFF'}</p>
                        <p><strong>Nutrients : </strong>{plantInfo.nutrients ? 'ON' : 'OFF'}</p>
                    </div>
                    <div></div>
                    <div className="data2">
                        <p><strong>Protection : </strong>{plantInfo.protection ? 'ON' : 'OFF'}</p>
                        <p><strong>Stress : </strong>{plantInfo.stress}</p>
                    </div>
                </section>
                <section className="actionPart">
                    <Action state={plantInfo} set={setPlantInfo}/>
                </section>
            </>
        )
    } else {
        return (
            <div className="accountSec">
                <section>
                <h2>Log In to check on your Plant</h2>
                <NavLink to="/account"><button>Account</button></NavLink>
                </section>
            </div>
        )
    }
}

export default DigitalPlant