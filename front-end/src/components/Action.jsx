import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { URL } from '../config.js';

function Action() {

    const [waterChecked, setWaterChecked] = useState(false)
    const [nutrientsChecked, setNutrientsChecked] = useState(false)
    const [protectionChecked, setProtectionChecked] = useState(false)
    
    useEffect(() => {

        const getInfo = async () => {
            try {
                const plant = await axios.get(`${URL}/plant/plant-info`) || {};
                setWaterChecked(plant.data.payload.hidration);
                setNutrientsChecked(plant.data.payload.nutrients);
                setProtectionChecked(plant.data.payload.protection);
            } catch (e) {
                console.log(e);
            }
        }
        getInfo();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            //Creating a new account
            const res = await axios.post(`${URL}/plant/action`, {
                hidration: waterChecked,
                nutrients: nutrientsChecked,
                protection: protectionChecked,

            })
            console.log(res.data.payload)
        } catch(e){
            console.log(e);
        }
    }

    return (
        <>
        <h2>ACTION</h2>
        <form className="action" onSubmit={handleSubmit}>
            <div>
            <label >Watering</label>
            <input type="checkbox" name="water" id="water" checked={waterChecked} onChange={() => setWaterChecked(!waterChecked)} />
            </div>
            <div>
            <label >Nutrients</label>
            <input type="checkbox" name="nutrients" id="nutrients" checked={nutrientsChecked} onChange={() => setNutrientsChecked(!nutrientsChecked)} />
            </div>
            <div>
            <label >Protection</label>
            <input type="checkbox" name="protection" id="protection" checked={protectionChecked} onChange={() => setProtectionChecked(!protectionChecked)} />
            </div>
            <button>Do it!</button>
        </form>
        </>
    )
}

export default Action