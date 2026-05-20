import React from 'react'
import useMetaData from '../hooks/useMetaData.jsx';

function Contact (){
    useMetaData({
        title: 'Contact | W... P... S',
        description: 'Get in touch with the DigitalPlant team for any questions or support.'
    });

    return(
        <section className="contact">
            <div className="contactGrid">
            <h3>Support</h3>
            <p>For any problem you might have using this app or any question
                about your account/info you can contact us via email.
            </p>
            <a id="emailUs" href="mailto:when.plants.sing@gmail.com">email</a>
            <h3>When... Plants... Sing</h3>
            <p>A project that explores the vegetal realm through both ecological 
                and artistic lenses, using technology as a tool to engage with 
                these organisms and what they can reveal to us.</p>
            <a id="wpsURL" target="_blank" href="https://www.andervallejolarre.com/when-plants-sing.html">website</a>
            <h3>Social Media</h3>
            <p>We have some of the work we have released or exposed in different 
                digital platforms. You can find some sound experiments, podcasts and 
                documentation about some of the installations we have developed as well.  </p>
            <div>
            <a id="instagramLink" target="_blank" href="https://www.instagram.com/when.plants.sing/" >instagram</a>
            <a id="soundcloudLink" target="_blank" href="https://soundcloud.com/anderground/sets/when-plants-sing?si=e2387011c2ce47729ba9a40bd0d6d180&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" >sound cloud</a>
            </div>
            </div>
            </section>
    )
}

export default Contact