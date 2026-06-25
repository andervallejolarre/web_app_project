import React from 'react'
import { NavLink } from 'react-router'

function Contentbar (props) {

    return(
        <div className='contentbar'>
            {props.screenInfo == 0 ? <p className="selected" onClick={() => props.showScreen(0)}>PERIOD BALANCE</p> : <p className="not-selected" onClick={() => props.showScreen(0)}>PERIOD BALANCE</p>}
            {props.screenInfo == 1 ? <p className="selected" onClick={() => props.showScreen(1)}>PLANT INFO</p> : <p className="not-selected" onClick={() => props.showScreen(1)}>PLANT INFO</p>}
            {props.screenInfo == 2 ? <p className="selected" onClick={() => props.showScreen(2)}>WEATHER</p> : <p className="not-selected" onClick={() => props.showScreen(2)}>WEATHER</p>}
            </div>
    )
}

export default Contentbar