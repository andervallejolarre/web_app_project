import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../config.js';

function Action(props) {

    const handleChange = async (event) => {
        try {
            const nextState = { ...props.state, [event.target.name]: !props.state[event.target.name] };
            props.set(nextState);
            const res = await axios.post(`${SERVER_URL}/plant/action`, nextState, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log(res.data.payload)
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <h2>ACTION</h2>
            <div className="action">
                <label >Watering</label>
                <div className="switch">
                    <input type="checkbox" name="hidration" id="hidration" checked={props.state.hidration} onChange={handleChange} />
                </div>
                <label >Nutrients</label>
                <div className="switch">
                    <input type="checkbox" name="nutrients" id="nutrients" checked={props.state.nutrients} onChange={handleChange} />
                </div>
                <label >Protection</label>
                <div className="switch">
                    <input type="checkbox" name="protection" id="protection" checked={props.state.protection} onChange={handleChange} />
                </div>
            </div>
        </>
    )
}

export default Action