import Graphic from '../assets/Plant_Graphic_1.svg?react'
import React from 'react'

function About() {
    return (
        <section className="about">
            <h2>ABOUT THIS APP</h2>
            <p>Welcome to DigitalPlant a space designed by
                <strong> When… Plants… Sing</strong> to host your own digital plants
                and take care of them. This space will replicate
                your weather conditions based on your location and
                with the assistance of our tech-tools, you will be
                able to have strong and healthy plants.</p>

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

            <p>You will find <strong>Weather</strong> and <strong>Plant Type</strong> information
                always available in your DigitalPlant Screen
                together with a <strong>Period Balance</strong> section. Here you
                will have some feedback on how your plant is doing
                and some advice on what actions to take to help your
                digital plant. </p>

            <p><strong>P.D.:.</strong> As in real life, changes in plants are not visible 
                right away. Here in DigitalPlant, progress is measured 
                in periods of 24h so you will have to be aware of your 
                plant in a daily basis. Go ahead and enjoy taking care 
                of your DigitalPlant.</p>
        </section>
    )
}

export default About