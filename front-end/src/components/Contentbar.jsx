import React from 'react'
import { NavLink } from 'react-router'

function Contentbar (props) {

    return(
        <div className='contentbar'>
            <p onClick={() => props.showScreen(0)}>PERIOD BALANCE</p>
            <p onClick={() => props.showScreen(1)}>PLANT INFO</p>
            <p onClick={() => props.showScreen(2)}>WEATHER</p>
            </div>
    )
}

export default Contentbar