import React from 'react'
import { NavLink } from 'react-router'

function Contentbar (props) {

    return(
        <div className='contentbar'>
            <p onClick={() => props.showScreen(0)}>Period Balance</p>
            <p onClick={() => props.showScreen(1)}>Plant Info</p>
            <p onClick={() => props.showScreen(2)}>Weather</p>
            </div>
    )
}

export default Contentbar