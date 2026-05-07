import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { URL } from '../config.js'

function Account(props) {

    const [message, setMessage] = useState('');
    const [clientInfo, setClientInfo] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        plantNotif: false,
        newsNotif: false,
    });

    const handleChange = (event) => {
        setClientInfo({ ...clientInfo, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${URL}/client/new`, { clientInfo })
            setMessage(res.data.message)
            if (res.data.ok) {
                setTimeout(() => {
                    props.login();
                }, 1500);
            }
        } catch (e) {
            console.log(e);
        }
    }
    if (!props.loggedIn) {
        return (
            <form className='createAccount' onChange={handleChange} onSubmit={handleSubmit}>
                <h2>CREATE YOUR ACCOUNT</h2>
                <label>Name</label>
                <input type='text' name='name' />
                <label>Email</label>
                <input type='email' name='email' />
                <label>password</label>
                <input type='text' name='password' />
                <label>confirm password</label>
                <input type='text' name='password2' />
                <input type="checkbox" name='plantNotif' />
                <input type="checkbox" name='newsNotif' />
                <button>Submit</button>
                <h4>{message}</h4>
            </form>
        )
    } else {
        return (
            <h2> Here you would see al the info in your account</h2>
        )
    }
}

export default Account 