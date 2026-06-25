import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { URL } from '../config.js';

function ClientInfo() {

    const [info, setInfo] = useState({})
    useEffect(() => {

        const getInfo = async () => {
            try {
                const client = await axios.get(`${URL}/client/client-info`, dataToSend, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                setInfo(client.data.payload);
            } catch (e) {
                console.log(e);
            }
        }
        getInfo();
    }, [])

    let { name, email, last_log, createdAt, plant_notif, news_notif } = info;

    const dateObject = new Date(Number(last_log));

    return (
        <div className='yourInfo'>
            <section>
                <h2> USER'S INFO</h2>
                <div>
                    <p>Name:</p>
                    <p>{name}</p>
                </div>
                <div>
                    <p>Email:</p>
                    <p>{email}</p>
                </div>
                <div>
                    <p>Registered on:</p>
                    <p>{createdAt
                        ? createdAt.slice(0, 10)
                        : 'loading..'}</p>
                </div>
                <div>
                    <p>Last Log In:</p>
                    <p>{last_log
                        ? dateObject.toISOString().slice(0, 10)
                        : 'loading..'}</p>
                </div>
            </section>
            <section>
                <h2>ACTIVE NOTIFICATIONS</h2>
                <div>
                    <p>My plant's progress</p>
                    <span>{plant_notif ? '✅' : '❌'}</span>
                </div>
                <div>
                    <p>W... P... S News</p>
                    <span>{news_notif ? '✅' : '❌'}</span>
                </div>
            </section>
        </div>
    )
}

export default ClientInfo