import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Register(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors ] = useState({});
    const [loading, setLoading] = useState(false);


   const handleChange = (e) => {
    setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
        
        //clear error for this field when user types
        if(errors[e.target.name]){
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
   };

    const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     setErrors({});   
        
      
        try {
            const response = await fetch('http://community-sharing-platform.test/api/register',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });


            const data = await response.json();

            if(!response.ok){
                //laravel validation errors
                if(data.errors){
                    setErrors(data.errors);
                }else{
                  alert(data.message || 'Registration failed');        
                }
            }else{
                alert('Registration successful! Please login.');
                navigate('/login');
            }
            
        } catch (error) {
            console.error('Error', error);
            alert('Network error. Please try again.');
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="register-form">
            <h2>Join Community</h2>
            <br></br>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                    <input
                            type="text"
                            name="name"
                            placeholder="Naredra Modi"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <span className="error">{errors.name[0]}</span>}
                </div>


                <div className="form-group">
                  <label>Enter Your mail</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="join@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required  
                    />
                    {errors.email && <span className="error">{errors.email[0]}</span>}
                </div>

                <div className="form-group">
                  <label>Enter Password</label>  
                    <input
                        type="password"
                        name="password"
                        placeholder="At least 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <span className="error">{errors.password[0]}</span>}
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>  
                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Repeat your same password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                    />
                </div>


                <button 
                   type="submit"
                   disabled={loading}
                   className="btn btn-primary"
                   >
                    {loading ? 'Creating Account...' : 'Register'}
                </button> 

                <p className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </form>
        </div>
    )
}

export default Register;