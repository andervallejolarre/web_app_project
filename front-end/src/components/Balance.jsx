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
                if (plantType.data && plantType.data.payload) {
                    setBalanceInfo(plantType.data.payload);
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

    console.log(balanceInfo)

    // Render all key/value pairs from info
    return (
        <>
            {props.screen == 0 &&
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
                    {balanceInfo.message3?.sentence1 && <p>{balanceInfo.message3.sentence1}</p>}
                    {balanceInfo.message3?.sentence2 && <p>{balanceInfo.message3.sentence2}</p>}
                    {(!balanceInfo.message3?.sentence1 && !balanceInfo.message3?.sentence2) && <p>Keep things like this till you see some changes</p>}
                </div>
            }
        </>
    );
}

export default Balance;