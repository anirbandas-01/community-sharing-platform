import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './EnhancedRegister.css';


function Register(){
    const navigate = useNavigate();
     const [userType, setUserType] = useState('resident');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        profile_image: null,
    });

     // Professional-specific fields
    const [professionalData, setProfessionalData] = useState({
        profession: '',
        specialization: '',
        qualification: '',
        experience_years: '',
        license_number: '',
    });

     // Business-specific fields
    const [businessData, setBusinessData] = useState({
        business_name: '',
        business_type: '',
        business_category: '',
        registration_number: '',
        opening_time: '09:00',
        closing_time: '17:00',
    });


    const [errors, setErrors ] = useState({});
    const [loading, setLoading] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);


   // Profession options
    const professions = [
        { value: '', label: 'Select your profession' },
        { value: 'doctor', label: '👨‍⚕️ Doctor/Physician' },
        { value: 'lawyer', label: '⚖️ Lawyer/Attorney' },
        { value: 'engineer', label: '👷 Engineer' },
        { value: 'teacher', label: '👨‍🏫 Teacher/Educator' },
        { value: 'accountant', label: '💰 Accountant' },
        { value: 'architect', label: '🏛️ Architect' },
        { value: 'consultant', label: '💼 Consultant' },
        { value: 'developer', label: '💻 Software Developer' },
        { value: 'designer', label: '🎨 Designer' },
        { value: 'plumber', label: '🔧 Plumber' },
        { value: 'electrician', label: '⚡ Electrician' },
        { value: 'carpenter', label: '🪚 Carpenter' },
        { value: 'mechanic', label: '🔩 Mechanic' },
        { value: 'chef', label: '👨‍🍳 Chef' },
        { value: 'trainer', label: '🏋️ Fitness Trainer' },
        { value: 'artist', label: '🎭 Artist' },
        { value: 'writer', label: '✍️ Writer' },
        { value: 'other', label: '📋 Other Profession' },
    ]; 
  
    // Business categories
    const businessCategories = [
        { value: '', label: 'Select business category' },
        { value: 'retail', label: '🛍️ Retail Store' },
        { value: 'restaurant', label: '🍽️ Restaurant/Cafe' },
        { value: 'service', label: '🔧 Service Provider' },
        { value: 'manufacturing', label: '🏭 Manufacturing' },
        { value: 'wholesale', label: '📦 Wholesale' },
        { value: 'healthcare', label: '🏥 Healthcare' },
        { value: 'education', label: '📚 Education' },
        { value: 'technology', label: '💻 Technology' },
        { value: 'real_estate', label: '🏠 Real Estate' },
        { value: 'transport', label: '🚚 Transport/Logistics' },
        { value: 'construction', label: '🏗️ Construction' },
        { value: 'beauty', label: '💄 Beauty/Salon' },
        { value: 'automotive', label: '🚗 Automotive' },
        { value: 'agriculture', label: '🌾 Agriculture' },
        { value: 'other', label: '📋 Other Business' },
    ];


     const handleUserTypeChange = (type) => {
        setUserType(type);
        setErrors({});
    };

    const handleCommonChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleProfessionalChange = (e) => {
        const { name, value } = e.target;
        setProfessionalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBusinessChange = (e) => {
        const { name, value } = e.target;
        setBusinessData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profile_image: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        
        try {
            // Prepare form data
            const formDataToSend = new FormData();
            
            // Add common fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            // Add user type
            formDataToSend.append('user_type', userType);
            
            // Add professional fields if applicable
            if (userType === 'professional') {
                Object.keys(professionalData).forEach(key => {
                    if (professionalData[key]) {
                        formDataToSend.append(key, professionalData[key]);
                    }
                });
            }
            
            // Add business fields if applicable
            if (userType === 'business') {
                Object.keys(businessData).forEach(key => {
                    if (businessData[key]) {
                        formDataToSend.append(key, businessData[key]);
                    }
                });
            }
            
            // Send registration request
            const response = await fetch('http://community-sharing-platform.test/api/register', {
                method: 'POST',
                body: formDataToSend,
                // Note: Don't set Content-Type header for FormData
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    alert(data.message || 'Registration failed');
                }
            } else {
                // Save token and user data
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                alert(`✅ Welcome to LocalConnect! Your ${userType} account has been created.`);
                
                // Redirect based on user type
                if (userType === 'professional') {
                    navigate('/professional/setup');
                } else if (userType === 'business') {
                    navigate('/business/setup');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

     return (
        <div className="enhanced-register">
            <div className="register-container">
                <h2>Join LocalConnect</h2>
                <p className="subtitle">Connect with your local community</p>
                
                {/* User Type Selection */}
                <div className="user-type-selection">
                    <h3>I am a...</h3>
                    <div className="user-type-cards">
                        <div 
                            className={`type-card ${userType === 'resident' ? 'active' : ''}`}
                            onClick={() => handleUserTypeChange('resident')}
                        >
                            <div className="type-icon">🏠</div>
                            <h4>Resident</h4>
                            <p>Looking for local services & connections</p>
                            <ul>
                                <li>Find trusted professionals</li>
                                <li>Access local businesses</li>
                                <li>Join community events</li>
                            </ul>
                        </div>
                        
                        <div 
                            className={`type-card ${userType === 'professional' ? 'active' : ''}`}
                            onClick={() => handleUserTypeChange('professional')}
                        >
                            <div className="type-icon">👨‍⚕️</div>
                            <h4>Professional</h4>
                            <p>Offer services & network with peers</p>
                            <ul>
                                <li>Connect with clients</li>
                                <li>Join professional community</li>
                                <li>Build your reputation</li>
                            </ul>
                        </div>
                        
                        <div 
                            className={`type-card ${userType === 'business' ? 'active' : ''}`}
                            onClick={() => handleUserTypeChange('business')}
                        >
                            <div className="type-icon">🏪</div>
                            <h4>Business</h4>
                            <p>Grow your business locally</p>
                            <ul>
                                <li>Reach local customers</li>
                                <li>Collaborate with other businesses</li>
                                <li>Share inventory & resources</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        
                        {/* Profile Image */}
                        <div className="profile-image-upload">
                            <div className="image-preview-container">
                                {profilePreview ? (
                                    <img src={profilePreview} alt="Profile preview" className="profile-preview" />
                                ) : (
                                    <div className="default-avatar">
                                        {userType === 'professional' ? '👨‍⚕️' : 
                                         userType === 'business' ? '🏪' : '🏠'}
                                    </div>
                                )}
                            </div>
                            <div className="upload-controls">
                                <label className="upload-btn">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                    📷 Upload Photo
                                </label>
                                <small>Optional. JPG, PNG up to 2MB</small>
                            </div>
                        </div>
                        
                        {/* Common Fields */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                    {userType === 'business' ? 'Contact Person Name *' : 'Full Name *'}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder={userType === 'business' ? 'John Smith' : 'Your full name'}
                                    value={formData.name}
                                    onChange={handleCommonChange}
                                    required
                                />
                                {errors.name && <span className="error">{errors.name[0]}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleCommonChange}
                                    required
                                />
                                {errors.email && <span className="error">{errors.email[0]}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+1 (555) 123-4567"
                                    value={formData.phone}
                                    onChange={handleCommonChange}
                                    required
                                />
                                {errors.phone && <span className="error">{errors.phone[0]}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={handleCommonChange}
                                    required
                                />
                                {errors.password && <span className="error">{errors.password[0]}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Confirm Password *</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    placeholder="Repeat your password"
                                    value={formData.password_confirmation}
                                    onChange={handleCommonChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Address Section */}
                    <div className="form-section">
                        <h3>Location Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Street Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="123 Main Street"
                                    value={formData.address}
                                    onChange={handleCommonChange}
                                    required
                                />
                                {errors.address && <span className="error">{errors.address[0]}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="New York"
                                    value={formData.city}
                                    onChange={handleCommonChange}
                                    required
                                />
                                {errors.city && <span className="error">{errors.city[0]}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>State/Province *</label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="NY"
                                    value={formData.state}
                                    onChange={handleCommonChange}
                                    required
                                />
                                {errors.state && <span className="error">{errors.state[0]}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>ZIP/Postal Code *</label>
                                <input
                                    type="text"
                                    name="zip_code"
                                    placeholder="10001"
                                    value={formData.zip_code}
                                    onChange={handleCommonChange}
                                    required
                                />
                                {errors.zip_code && <span className="error">{errors.zip_code[0]}</span>}
                            </div>
                        </div>
                    </div>
                    
                    {/* Professional-Specific Fields */}
                    {userType === 'professional' && (
                        <div className="form-section">
                            <h3>Professional Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Profession *</label>
                                    <select
                                        name="profession"
                                        value={professionalData.profession}
                                        onChange={handleProfessionalChange}
                                        required
                                    >
                                        {professions.map(prof => (
                                            <option key={prof.value} value={prof.value}>
                                                {prof.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.profession && <span className="error">{errors.profession[0]}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Specialization</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        placeholder="e.g., Family Law, Pediatrics, Web Development"
                                        value={professionalData.specialization}
                                        onChange={handleProfessionalChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Qualification</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        placeholder="e.g., MD, JD, PhD, B.Tech"
                                        value={professionalData.qualification}
                                        onChange={handleProfessionalChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Years of Experience</label>
                                    <input
                                        type="number"
                                        name="experience_years"
                                        placeholder="5"
                                        min="0"
                                        max="50"
                                        value={professionalData.experience_years}
                                        onChange={handleProfessionalChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>License Number (if applicable)</label>
                                    <input
                                        type="text"
                                        name="license_number"
                                        placeholder="e.g., BAR-12345, MED-98765"
                                        value={professionalData.license_number}
                                        onChange={handleProfessionalChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Business-Specific Fields */}
                    {userType === 'business' && (
                        <div className="form-section">
                            <h3>Business Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Business Name *</label>
                                    <input
                                        type="text"
                                        name="business_name"
                                        placeholder="e.g., Smith & Co., City Cafe"
                                        value={businessData.business_name}
                                        onChange={handleBusinessChange}
                                        required
                                    />
                                    {errors.business_name && <span className="error">{errors.business_name[0]}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Business Type</label>
                                    <input
                                        type="text"
                                        name="business_type"
                                        placeholder="e.g., LLC, Partnership, Sole Proprietorship"
                                        value={businessData.business_type}
                                        onChange={handleBusinessChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Business Category</label>
                                    <select
                                        name="business_category"
                                        value={businessData.business_category}
                                        onChange={handleBusinessChange}
                                    >
                                        {businessCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Registration Number</label>
                                    <input
                                        type="text"
                                        name="registration_number"
                                        placeholder="e.g., EIN, GST, VAT number"
                                        value={businessData.registration_number}
                                        onChange={handleBusinessChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Opening Time</label>
                                    <input
                                        type="time"
                                        name="opening_time"
                                        value={businessData.opening_time}
                                        onChange={handleBusinessChange}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Closing Time</label>
                                    <input
                                        type="time"
                                        name="closing_time"
                                        value={businessData.closing_time}
                                        onChange={handleBusinessChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Submit Section */}
                    <div className="form-actions">
                        <p className="terms-note">
                            By creating an account, you agree to our 
                            <a href="/terms"> Terms of Service</a> and 
                            <a href="/privacy"> Privacy Policy</a>.
                        </p>
                        
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                `Create ${userType.charAt(0).toUpperCase() + userType.slice(1)} Account`
                            )}
                        </button>
                        
                        <p className="login-link">
                            Already have an account? <a href="/login">Sign in here</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );

/*    const handleChange = (e) => {
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
    ) */
}

export default Register;