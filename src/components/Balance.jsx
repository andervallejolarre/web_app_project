import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../config.js';

function Balance(props) {
    const [balanceInfo, setBalanceInfo] = useState({});

    useEffect(() => {
        if (!props.weatherData || Object.keys(props.weatherData).length === 0) return;
        const getInfo = async () => {
            try {
                const plantType = await axios.post(`${SERVER_URL}/plant/balance`, props.weatherData, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
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
    }, [props.weatherData,
        //props.state.hidration,
        //props.state.nutrients,
        //props.state.protection,
        props.state.updated,
    ]);

    return (
        <>
            {props.screen == 0 && (
                //If it's the first time the user is logginIn we have some default content
                props.state.firstVisit ? (
                    <div className="screenInfo">
                        <h2>Period Balance</h2>
                        <p>Welcome to DigitalPlant!</p>
                        <p>You will see some changes when the first 12h period finishes. </p>
                        <p>After that, weather conditions will directly impact your plant
                            and you will be able to help it through!</p>
                        <p>In the mean time, check out all the features you have available.</p>

                        <p><strong>Remember,</strong>  you will see changes every 12 hours.</p>

                        <p>With that said, enjoy and have a nice day.</p>
                    </div>
                ) : (
                    // If it's not the first time we'll render balance messages fetched from our back-end
                    <div className="screenInfo">
                        <h2>Period Balance</h2>
                        <p>{balanceInfo.message1}</p>
                        <p>Take a look on how weather directly impacts it:</p>
                        <ul>
                            <li>{balanceInfo.message2?.sentence1 || ""}</li>
                            <li>{balanceInfo.message2?.sentence2 || ""}</li>
                            <li>{balanceInfo.message2?.sentence3 || ""}</li>
                        </ul>
                        <p>Your actions have a direct impact too! : </p>
                        <ul>
                            {balanceInfo.message3?.sentence1 && <li>{balanceInfo.message3.sentence1}</li>}
                            {balanceInfo.message3?.sentence2 && <li>{balanceInfo.message3.sentence2}</li>}
                            {(!balanceInfo.message3?.sentence1 && !balanceInfo.message3?.sentence2) && <li>Keep things the same until you see some changes.</li>}
                        </ul>
                    </div>
                )
            )}
        </>
    );
}

export default Balance;
