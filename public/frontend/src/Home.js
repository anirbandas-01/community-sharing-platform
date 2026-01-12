import React, { useEffect, useState } from "react";
import { data } from "react-router-dom";

function Home(){

   const [apiStatus, setApiStatus] = useState('checking....');

   useEffect(()=> {
    fetch('http://community-sharing-platform.test/api/test')
     .then(response => response.json())
     .then(data=> {
        setApiStatus(`API Connected: ${data.message}`);
     })
     .catch(error =>{
        setApiStatus('API connection Failed');
        console.error('API Error', error);
     });
   }, []);

    return(
        <div className="home">

           <div className="status">
              <p><strong>Backend status:</strong>{apiStatus}</p>
           </div>

            <h2>Share tools, exchange skills, and build Community.</h2>

            <div className="features">
                <div className="features-card">
                    <h3>Tool Sharing</h3>
                    <p>Borrow tools from neighbors instead of buying</p>
                </div>

                <div className="feature-card">
                    <h3>Skill Exchange</h3>
                    <p>Teach and learn skills with your Community</p>
                </div>

                <div className="feature-card">
                    <h3>Local Events</h3>
                    <p>Join neighborhood gatherings and activities</p>
                </div>
            </div>

            <div className="cta">
                <h3>Ready to Join</h3>
                <div className="buttons">
                    <a href="/register" className="btn primary">Sign Up Free</a>
                    <br />
                    <a href="/login" className="btn secondary">Login</a>
                </div>
            </div>
        </div>
    )
}

export default Home;