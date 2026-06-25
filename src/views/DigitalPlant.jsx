import React from 'react'
import { NavLink } from 'react-router'
import { useState, useEffect } from 'react'
import Weather from '../components/Weather.jsx'
import PlantType from '../components/PlantType.jsx'
import Balance from '../components/Balance.jsx'
import Action from '../components/Action.jsx'
import SelectedGraph from '../components/SelectedGraph.jsx'
import Contentbar from '../components/Contentbar.jsx'
import MetaData from '../components/MetaData.jsx'
import Timer from '../components/Timer.jsx';
import { URL } from '../config.js';
import axios from 'axios'

function DigitalPlant(props) {

    const [weather, setWeather] = useState({})
    const [plantInfo, setPlantInfo] = useState({
        hidration: false,
        nutrients: false,
        protection: false,
        stress: 0,
        level: 0,
        progress: 0,
        firstVisit: true,
        updated: null,
    })
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
                const plant = await axios.get(`${URL}/plant/plant-info`, dataToSend, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }) || {};
                setPlantInfo(plant.data.payload);
            } catch (e) {
                console.log(e);
            }
        }
        if (props.loggedIn) {
            getInfo();
        }
    }, [props.loggedIn])

    const handleTimerReady = () => {
        // Timer reached 0 - add logic here later
        getInfo();
        console.log('Timer ready - balance update available');
    }

    return (
        props.loggedIn ?
            <>
                <MetaData
                    title="DigitalPlant Screen"
                    description="Manage your digital plant and track its growth"
                />
                <section className="digitalPlant">
                    <Timer updated={plantInfo.updated} timer={handleTimerReady} />
                    <section className="screen">
                        <div className="dataBox">
                            <Contentbar showScreen={showScreen} screenInfo={screenInfo} />
                            <Weather passData={passData} screen={screenInfo} />
                            <PlantType screen={screenInfo} />
                            <Balance weatherData={weather} screen={screenInfo} state={plantInfo} set={setPlantInfo} />
                        </div>
                        <SelectedGraph className="plantGraph" level={plantInfo.level} />
                        <div className="progress">
                            <div className="dataUp">
                                <p><strong>Level : </strong>{plantInfo.level}</p>
                                <p><strong>Progress : </strong>{plantInfo.progress}</p>
                            </div>
                            <progress className="progressBar" value={plantInfo.progress} max={100} />
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
                        <Action state={plantInfo} set={setPlantInfo} />
                    </section>
                </section>
            </>
            :
            <>
                <MetaData
                    title="DigitalPlant | W... P... S"
                    description="Log In to unable the DigitalPlant Screen"
                />
                <section className="notDigitalPlant">
                    <div className="home">
                        <section>
                            <h2>Register or Log In to check on your Plant</h2>
                            <NavLink to="/account"><button>Account</button></NavLink>
                            <h3>Or if you want to know how DigitalPlant works first go to</h3>
                            <NavLink to="/about"><button>About</button></NavLink>
                        </section>
                    </div>
                </section>
            </>
    )
}

export default DigitalPlant