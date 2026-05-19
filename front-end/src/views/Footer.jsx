import Logo from '../assets/WPS.svg?react'
import {useNavigate} from "react-router"
import React from 'react'

function Footer (props){
    let navigate = useNavigate();
    return (
        <section className="footer">
            <Logo className="logo"/>
            <p>© 2026 When... Plants... Sing. All Rights Reserved</p>
            <div>
                <h4>ACCOUNT</h4>
                {!props.loggedIn 
                ? <p onClick ={() => navigate("/account")}>Log In</p> 
                : <p onClick ={() => navigate("/account")}>Your Info</p>}
                {props.loggedIn && <p onClick={props.logout}>Log Out</p>}
            </div>
        </section>
    )
}

export default Footer;