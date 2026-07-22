import Graphic from '../assets/Plant_Graphic_1.svg?react'
import MetaData from '../components/MetaData.jsx';
import React from 'react'
import panelImg from '../assets/about_graphics/panel.png'
import dataScreenImg from '../assets/about_graphics/data-screen.png'
import metersImg from '../assets/about_graphics/meters.png'
import actionSectionImg from '../assets/about_graphics/action-section.png'

function About() {

    return (
        <>
            <MetaData
                title="About | DigitalPlant"
                description="Learn more about DigitalPlant and how to take care of your digital plants."
            />
            <section className="about">
                <h2>ABOUT THIS APP</h2>
    
                <p>Welcome to DigitalPlant a space designed by
                    <strong> When… Plants… Sing</strong> to host your own digital plants
                    and take care of them. Once you log-in you'll find a panel in the DigitalPlant screen
                     where you will see your plant and all the info you need to start taking care of it.</p>

                <img src={panelImg} alt="panel view screen shot" />

                <p>You will be able to choose between different types
                    of plants, where each one has it's own preferences
                    of weather conditions such as real life plants and,
                    as in real life situations, the goal is to help our
                    plants adapt to our environmental changes. </p>

                <p>Plants available (Pilot phase):</p>

                <div>
                    <h3>Rubyceae Byttea</h3>
                    <Graphic className="available" />
                </div>

                <p>This app will replicate your weather conditions based on your current location and with
                     the assistance of our tech-tools, you will be able to have strong and healthy plants. 
                     Check the screen data you have available in your panel so you can be aware of all the 
                     variables involved.</p>

                <img src={dataScreenImg} alt="data screen screenshot" />

                <p>Here you will find <strong>Weather</strong> data and <strong>Plant Type</strong> information
                    together with a <strong>Period Balance</strong> section that tells you how your plant is doing.
                    This information is very important so you can see what your plant needs and help it by taking 
                    some action with the <strong>Action</strong> controls.</p>

                <img src={actionSectionImg} alt="action section screen shot" />

                <p>You will see how your plant progress or struggles through the progress and stress indicators. 
                    You also have a progress meter that whenevere reaches a value of 100 your plant will grow and go 
                    up a level. It aslso works the other way around, if your plant is struggling and progress reaches 
                    value 0, your plant will recede and go a level down.</p>

                <img src={metersImg} alt="meters screen shot" />

                <p>Go ahead and try it out! If you have any question, if you are having some difficulties or you want 
                    to know more about W… P… S check out the Contact screen.</p>

                <p><strong>P.D.:.</strong> As in real life, changes in plants are not visible
                    right away. Here in DigitalPlant, progress is measured
                    in periods of 12h so you will have to be aware of your
                    plant in a regular basis. Go ahead and enjoy taking care
                    of your DigitalPlant.</p>
            </section>
        </>
    )
}

export default About