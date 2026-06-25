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
                const plantType = await axios.post(`${URL}/plant/balance`, dataToSend, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }, props.weatherData);
                if (plantType.data && plantType.data.payload) {
                    setBalanceInfo(plantType.data.payload.final);
                    props.set({ ...props.state, progress: plantType.data.payload.update.progress, level: plantType.data.payload.update.level, stress: plantType.data.payload.update.stress, firstVisit: plantType.data.payload.update.firstVisit });
                } else {
                    setBalanceInfo({});
                }
            } catch (e) {
                console.log(e);
                setBalanceInfo({});
            }
        }
        getInfo();
    }, [props.weatherData])

    return (
        <>
            {props.screen == 0 && (
                //If it's the first time the user is logginIn we have some default content
                props.state.firstVisit ? (
                    <div className="screenInfo">
                        <h2>Period Balance</h2>
                        <p>Welcome to DigitalPlant!.</p>
                        <p>You will see some changes when the first 24h period finishes. </p>
                        <p>After that, weather conditions will have some direct inpact on your plant
                            and you will be able to help it progress!</p>
                        <p>In the mean time, go ahead and inspect the interface so you get familiar with it.</p>

                        <p><strong>Remember</strong> that your plant will show some progress each 24h.</p>

                        <p>With that said, Enjoy and have a nice day.</p>
                    </div>
                ) : (
                    // If it's not the first time we'll render balance messages fetched from our back-end
                    <div className="screenInfo">
                        <h2>Period Balance</h2>
                        <p>Since last time you were here {balanceInfo.message1}</p>
                        <p>Take a look on how weather has a direct impact on it:</p>
                        <ul>
                            <li>{balanceInfo.message2?.sentence1 || ""}</li>
                            <li>{balanceInfo.message2?.sentence2 || ""}</li>
                            <li>{balanceInfo.message2?.sentence3 || ""}</li>
                        </ul>
                        <p>Also, your actions have a direct impact too! : </p>
                        <ul>
                            {balanceInfo.message3?.sentence1 && <li>{balanceInfo.message3.sentence1}</li>}
                            {balanceInfo.message3?.sentence2 && <li>{balanceInfo.message3.sentence2}</li>}
                            {(!balanceInfo.message3?.sentence1 && !balanceInfo.message3?.sentence2) && <li>Keep things like this till you see some changes</li>}
                        </ul>
                    </div>
                )
            )}
        </>
    );
}

export default Balance;
