import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { URL } from '../config.js';

function Account(props) {

    const [message, setMessage] = useState('');
    const [newClientInfo, setNewClientInfo] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        plantNotif: false,
        newsNotif: false,
    });
    const [oldClient, setOldClient] = useState({
        email: '',
        password: '',
    })

    const handleChange = (event) => {
        if (event.target.name.includes('Notif')) {
            setNewClientInfo({ ...newClientInfo, [event.target.name]: event.target.checked });
        } else {
            setNewClientInfo({ ...newClientInfo, [event.target.name]: event.target.value });
        }
    }

    const handleChange2 = (event) => {
        setOldClient({ ...oldClient, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${URL}/client/new`, {
                name: newClientInfo.name,
                email: newClientInfo.email,
                password: newClientInfo.password,
                password2: newClientInfo.password2,
                plantNotif: newClientInfo.plantNotif,
                newsNotif: newClientInfo.newsNotif,
            })
            setMessage(res.data.payload)
            if (res.data.ok) {
                setTimeout(() => {
                    props.login(res.data.token);
                }, 1500);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleSubmit2 = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${URL}/client/login`, {
                email: oldClient.email,
                password: oldClient.password,
            })
            setMessage(res.data.payload)
            if (res.data.ok) {
                setTimeout(() => {
                    props.login(res.data.token);
                }, 1500);
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (!props.loggedIn) {
        return (
            <>
                <div className='accountSec'>
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
                    </form>
                    <form className='createAccount' onChange={handleChange2} onSubmit={handleSubmit2}>
                        <h2>Log In</h2>
                        <label>Email</label>
                        <input type='email' name='email' />
                        <label>password</label>
                        <input type='text' name='password' />
                        <button>Enter</button>
                    </form>
                </div>
               <h4>{message}</h4>
            </>

        )
    } else {
        return (
            <div>
            <h2> Here you would see al the info in your account</h2>
            <h3>And you can also log out if you want</h3>
            <button onClick={props.logout}>Log Out</button>
            </div>
        )
    }
}

export default Account 