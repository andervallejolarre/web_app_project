import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { URL } from '../config.js';
import ClientInfo from '../components/ClientInfo.jsx'

function Account(props) {

    //State Variables used for Registration and Log in
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

    const handleChangeForm1 = (event) => {
        if (event.target.name.includes('Notif')) {
            setNewClientInfo({ ...newClientInfo, [event.target.name]: event.target.checked });
        } else {
            setNewClientInfo({ ...newClientInfo, [event.target.name]: event.target.value });
        }
    }

    const handleChangeForm2 = (event) => {
        setOldClient({ ...oldClient, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            //Creating a new account
            const res = await axios.post(`${URL}/client/new`, {
                name: newClientInfo.name,
                email: newClientInfo.email,
                password: newClientInfo.password,
                password2: newClientInfo.password2,
                plantNotif: newClientInfo.plantNotif,
                newsNotif: newClientInfo.newsNotif,
            })
            //If creating new account succesful we create a new plant
            if (res.data.ok) {
                const secondRes = await axios.post(`${URL}/plant/new`, {
                    email: newClientInfo.email,
                    type: 'Rubyceae Byttea',
                })
                if (secondRes.data.ok) {
                    setTimeout(() => {
                        props.login(res.data.token);
                    }, 1500);
                }
            }
            setMessage(`${res.data.payload}`)
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
                    <form className='createAccount' onChange={handleChangeForm1} onSubmit={handleSubmit}>
                        <h2>CREATE YOUR ACCOUNT</h2>
                        <label>Name</label>
                        <input className="textInput" type='text' name='name' />
                        <label>Email</label>
                        <input className="textInput" type='email' name='email' />
                        <label>password</label>
                        <input className="textInput" type='text' name='password' />
                        <label>confirm password</label>
                        <input className="textInput" type='text' name='password2' />
                        <div className="checkInput">
                            <label>Notifications about your plant</label>
                            <input type="checkbox" name='plantNotif' />
                        </div>
                        <div className="checkInput">
                            <label>Notifications about W... P... S </label>
                            <input type="checkbox" name='newsNotif' />
                        </div>
                        <button>Submit</button>
                    </form>
                    <form className='login' onChange={handleChangeForm2} onSubmit={handleSubmit2}>
                        <h2>LOG IN</h2>
                        <label>Email</label>
                        <input className="textInput" type='email' name='email' />
                        <label>password</label>
                        <input className="textInput" type='text' name='password' />
                        <button>Enter</button>
                    </form>
                </div>
                <h4>{message}</h4>
            </>

        )
    } else {
        return (
            <section>
                <ClientInfo />
                <section className="logout">
                    <h2>HERE YOU CAN</h2>
                    <button onClick={props.logout}>Log Out</button>
                </section>
            </section>
        )
    }
}

export default Account 