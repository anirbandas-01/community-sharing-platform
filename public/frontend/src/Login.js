import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handelChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://community-sharing-platform.test/api/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });    

            const data = await response.json();

            if(data.success){
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user',JSON.stringify(data.user));

                alert('Login successful!');
                navigate('/dashboard');
            }else{
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Network error. please try again.');
        }finally{
            setLoading(false);
        }
    };
    return(
        <div className="login-form">
            <h2>Welcome Back!</h2>

            <p className="subtitle">Login to access community features</p>

           {error && (
              <div className="alert alert-error"> 
                {error}
              </div>
           )}


            <form  onSubmit={handleSubmit}>
                {error && <div className="alert error">{error}</div>}

                <div className="form-group">
                    <label>Email Address</label>
                    <input 
                       type="email"
                       name="email"
                       placeholder="your@gmail.com"
                       value={formData.email}
                       onChange={handelChange}
                       required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handelChange}
                        required
                    />
                </div>


                <button type="submit" disabled={loading}>
                    {loading? 'Logging in....' : 'Login'}
                </button>


               <div>
                    <p className="register-link">
                        Don't have an account? <a href="/register">Register here</a>
                    </p>
                    <p>
                       <a href="/forgot-password">Forgot password</a>
                    </p>
                </div>
            </form>

            <div className="test-credentials">
                <small>Test: test@example.com / password</small>
            </div>
        </div>
    );
}

export default Login;