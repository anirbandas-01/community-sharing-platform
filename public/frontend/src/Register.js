import React, {useState} from "react";

function Register(){
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://community-sharing-platform.test/api/register',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });


            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error', error);
        }
    };

    return(
        <div className="register-form">
            <h2>Join Community</h2>
            <form onSubmit={handleSubmit}>
               <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="submit">Register</button> 
            </form>
        </div>
    )
}

export default Register;