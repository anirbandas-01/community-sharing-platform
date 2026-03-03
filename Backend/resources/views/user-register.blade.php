<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - LocalHub</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow-x: hidden;
            padding: 2rem 0;
        }

        /* Animated Background */
        .background-animation {
            position: fixed;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }

        .circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            animation: float 20s infinite;
        }

        .circle:nth-child(1) {
            width: 300px;
            height: 300px;
            top: -150px;
            left: -150px;
            animation-delay: 0s;
        }

        .circle:nth-child(2) {
            width: 200px;
            height: 200px;
            top: 50%;
            right: -100px;
            animation-delay: 4s;
        }

        .circle:nth-child(3) {
            width: 250px;
            height: 250px;
            bottom: -125px;
            left: 30%;
            animation-delay: 8s;
        }

        @keyframes float {
            0%, 100% {
                transform: translate(0, 0) scale(1);
            }
            25% {
                transform: translate(50px, -50px) scale(1.1);
            }
            50% {
                transform: translate(-30px, 30px) scale(0.9);
            }
            75% {
                transform: translate(30px, 50px) scale(1.05);
            }
        }

        /* Back to Home */
        .back-home {
            position: absolute;
            top: 2rem;
            left: 2rem;
            z-index: 100;
        }

        .back-home-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
            text-decoration: none;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 50px;
            transition: all 0.3s;
        }

        .back-home-link:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateX(-5px);
        }

        .back-home-link svg {
            width: 20px;
            height: 20px;
        }

        /* Registration Container */
        .register-container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 900px;
            padding: 2rem;
            animation: slideIn 0.6s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .register-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* Logo Section */
        .logo-section {
            text-align: center;
            margin-bottom: 2rem;
        }

        .logo-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            transform: rotate(-5deg);
            box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4);
        }

        .logo-icon svg {
            width: 36px;
            height: 36px;
            color: white;
            transform: rotate(5deg);
        }

        .logo-text {
            font-size: 1.75rem;
            font-weight: 900;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
        }

        /* Header */
        .register-header {
            text-align: center;
            margin-bottom: 2.5rem;
        }

        .register-title {
            font-size: 2rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 0.5rem;
        }

        .register-subtitle {
            color: #64748b;
            font-size: 1rem;
        }

        /* Progress Steps */
        .progress-steps {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3rem;
            position: relative;
        }

        .progress-steps::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 2px;
            background: #e2e8f0;
            z-index: 0;
        }

        .progress-line {
            position: absolute;
            top: 20px;
            left: 0;
            height: 2px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            transition: width 0.3s;
            z-index: 1;
        }

        .step {
            position: relative;
            z-index: 2;
            text-align: center;
            flex: 1;
        }

        .step-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: white;
            border: 3px solid #e2e8f0;
            margin: 0 auto 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #94a3b8;
            transition: all 0.3s;
        }

        .step.active .step-circle {
            border-color: #4f46e5;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
        }

        .step.completed .step-circle {
            border-color: #10b981;
            background: #10b981;
            color: white;
        }

        .step-label {
            font-size: 0.85rem;
            color: #94a3b8;
            font-weight: 600;
        }

        .step.active .step-label {
            color: #4f46e5;
        }

        /* Form */
        .register-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .form-step {
            display: none;
        }

        .form-step.active {
            display: block;
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }

        .form-group {
            position: relative;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        .form-label {
            display: block;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
        }

        .required {
            color: #ef4444;
        }

        .form-input-wrapper {
            position: relative;
        }

        .form-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            width: 20px;
            height: 20px;
        }

        .form-input,
        .form-select {
            width: 100%;
            padding: 0.875rem 1rem 0.875rem 3rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            font-family: 'Plus Jakarta Sans', sans-serif;
            transition: all 0.3s;
            background: white;
        }

        .form-input:focus,
        .form-select:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .form-input::placeholder {
            color: #cbd5e1;
        }

        .form-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%2394a3b8' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            padding-right: 3rem;
        }

        /* Radio Buttons for Gender */
        .radio-group {
            display: flex;
            gap: 1.5rem;
            margin-top: 0.5rem;
        }

        .radio-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            padding: 0.75rem 1.5rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            transition: all 0.3s;
            flex: 1;
            justify-content: center;
        }

        .radio-label:hover {
            border-color: #4f46e5;
            background: #f8fafc;
        }

        .radio-input {
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: #4f46e5;
        }

        .radio-input:checked + .radio-text {
            color: #4f46e5;
            font-weight: 700;
        }

        .radio-label:has(.radio-input:checked) {
            border-color: #4f46e5;
            background: rgba(79, 70, 229, 0.05);
        }

        /* Photo Upload */
        .photo-upload {
            text-align: center;
            padding: 2rem;
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            transition: all 0.3s;
            cursor: pointer;
            position: relative;
        }

        .photo-upload:hover {
            border-color: #4f46e5;
            background: rgba(79, 70, 229, 0.02);
        }

        .photo-upload.has-image {
            border-style: solid;
            border-color: #10b981;
        }

        .upload-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            color: #94a3b8;
        }

        .upload-text {
            color: #64748b;
            margin-bottom: 0.5rem;
        }

        .upload-hint {
            font-size: 0.85rem;
            color: #94a3b8;
        }

        .file-input {
            display: none;
        }

        .image-preview {
            max-width: 200px;
            max-height: 200px;
            border-radius: 12px;
            margin: 0 auto;
            display: none;
        }

        .photo-upload.has-image .image-preview {
            display: block;
        }

        .photo-upload.has-image .upload-icon,
        .photo-upload.has-image .upload-text,
        .photo-upload.has-image .upload-hint {
            display: none;
        }

        .remove-image {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            display: none;
        }

        .photo-upload.has-image .remove-image {
            display: inline-block;
        }

        /* Error Messages */
        .error-message {
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            display: none;
        }

        .form-group.error .form-input,
        .form-group.error .form-select {
            border-color: #ef4444;
        }

        .form-group.error .error-message {
            display: block;
        }

        /* Alert */
        .alert {
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            display: none;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .alert.show {
            display: block;
        }

        .alert-error {
            background: #fef2f2;
            border: 2px solid #fecaca;
            color: #991b1b;
        }

        .alert-success {
            background: #f0fdf4;
            border: 2px solid #bbf7d0;
            color: #166534;
        }

        /* Buttons */
        .form-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .btn {
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-back {
            flex: 1;
            background: white;
            color: #64748b;
            border: 2px solid #e2e8f0;
        }

        .btn-back:hover {
            border-color: #cbd5e1;
            background: #f8fafc;
        }

        .btn-next,
        .btn-submit {
            flex: 2;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
        }

        .btn-next:hover,
        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(79, 70, 229, 0.4);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            display: none;
        }

        .btn.loading .spinner {
            display: block;
        }

        .btn.loading .btn-text {
            display: none;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Footer Links */
        .register-footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
        }

        .footer-text {
            color: #64748b;
            font-size: 0.9rem;
        }

        .footer-link {
            color: #4f46e5;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
        }

        .footer-link:hover {
            color: #7c3aed;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .register-container {
                padding: 1rem;
            }

            .register-card {
                padding: 2rem 1.5rem;
            }

            .logo-text {
                font-size: 1.5rem;
            }

            .register-title {
                font-size: 1.5rem;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .form-group {
                grid-column: 1 !important;
            }

            .progress-steps {
                flex-wrap: wrap;
            }

            .step {
                flex-basis: 50%;
                margin-bottom: 1rem;
            }

            .radio-group {
                flex-direction: column;
            }

            .back-home {
                top: 1rem;
                left: 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Animated Background -->
    <div class="background-animation">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
    </div>

    <!-- Back to Home -->
    <div class="back-home">
        <a href="/" class="back-home-link">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
        </a>
    </div>

    <!-- Registration Container -->
    <div class="register-container">
        <div class="register-card">
            <!-- Logo -->
            <div class="logo-section">
                <div class="logo-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
                <h1 class="logo-text">LocalHub</h1>
            </div>

            <!-- Header -->
            <div class="register-header">
                <h2 class="register-title">Create Your Account</h2>
                <p class="register-subtitle">Join your local community in just a few steps</p>
            </div>

            <!-- Progress Steps -->
            <div class="progress-steps">
                <div class="progress-line" id="progressLine"></div>
                <div class="step active" data-step="1">
                    <div class="step-circle">1</div>
                    <div class="step-label">Personal Info</div>
                </div>
                <div class="step" data-step="2">
                    <div class="step-circle">2</div>
                    <div class="step-label">Contact Details</div>
                </div>
                <div class="step" data-step="3">
                    <div class="step-circle">3</div>
                    <div class="step-label">Verification</div>
                </div>
            </div>

            <!-- Alert Message -->
            <div id="alert" class="alert">
                <span id="alertMessage"></span>
            </div>

            <!-- Registration Form -->
            <form  class="register-form" id="registerForm" enctype="multipart/form-data" novalidate>
                
                <!-- Step 1: Personal Info -->
                <div class="form-step active" data-step="1">
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label class="form-label">Full Name <span class="required">*</span></label>
                            <div class="form-input-wrapper">
                                <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                <input 
                                    type="text" 
                                    name="name"
                                    class="form-input" 
                                    placeholder="Enter your full name"
                                    required
                                >
                            </div>
                            <div class="error-message">Please enter your full name</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Profile <span class="required">*</span></label>
                            <div class="radio-group">

                                <label class="radio-label">
                                    <input type="radio"
                                        name="profile"
                                        value="resident"
                                        class="radio-input"
                                        required>
                                    <span class="radio-text">Resident</span>
                                </label>

                                <label class="radio-label">
                                    <input type="radio"
                                        name="profile"
                                        value="professional"
                                        class="radio-input">
                                    <span class="radio-text">Professional</span>
                                </label>

                                <label class="radio-label">
                                    <input type="radio"
                                        name="profile"
                                        value="business"
                                        class="radio-input">
                                    <span class="radio-text">Business</span>
                                </label>

                            </div>
                            <div class="error-message">Please select a profile</div>
                        </div>


                        <div class="form-group">
                            <label class="form-label">City <span class="required">*</span></label>
                            <div class="form-input-wrapper">
                                <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <input 
                                    type="text" 
                                    name="city"
                                    class="form-input" 
                                    placeholder="Enter your city"
                                    required
                                >
                            </div>
                            <div class="error-message">Please enter your city</div>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Contact Details -->
                <div class="form-step" data-step="2">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Email Address <span class="required">*</span></label>
                            <div class="form-input-wrapper">
                                <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                <input 
                                    type="email" 
                                    name="email"
                                    class="form-input" 
                                    placeholder="your.email@example.com"
                                    required
                                >
                            </div>
                            <div class="error-message">Please enter a valid email address</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Phone Number <span class="required">*</span></label>
                            <div class="form-input-wrapper">
                                <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    class="form-input" 
                                    placeholder="10-digit mobile number"
                                    pattern="[0-9]{10}"
                                    maxlength="10"
                                    required
                                >
                            </div>
                            <div class="error-message">Please enter a valid 10-digit phone number</div>
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">Password <span class="required">*</span></label>
                            <div class="form-input-wrapper">
                                <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                                <input 
                                    type="password" 
                                    name="password"
                                    class="form-input" 
                                    placeholder="Create a strong password"
                                    minlength="8"
                                    required
                                >

                            </div>
                            <div class="error-message">Password must be at least 8 characters</div>
                        </div>

                        <div class="form-group full-width">
                            <label class="form-label">Confirm Password <span class="required">*</span></label>
                            <div class="form-input-wrapper">
                                <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    class="form-input"
                                    placeholder="Re-enter your password"
                                    required
                                >

                            </div>
                            <div class="error-message">Passwords do not match</div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Verification -->
                <div class="form-step" data-step="3">
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label class="form-label">Aadhaar Number <span class="required">*</span></label>
                            <div class="form-input-wrapper">
                                <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                                </svg>
                                <input 
                                    type="text" 
                                    name="aadhaar"
                                    class="form-input" 
                                    placeholder="12-digit Aadhaar number"
                                    pattern="[0-9]{12}"
                                    maxlength="12"
                                    required
                                >
                            </div>
                            <div class="error-message">Please enter a valid 12-digit Aadhaar number</div>
                        </div>
                        
                        <div class="form-group full-width">
                            <label class="form-label">Profile Photo <span class="required">*</span></label>
                            <div class="photo-upload" id="photoUpload" onclick="document.getElementById('photoInput').click()">
                                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <p class="upload-text">Click to upload your photo</p>
                                <p class="upload-hint">JPG, PNG or JPEG (MAX. 2MB)</p>
                                <img id="imagePreview" class="image-preview" alt="Preview">
                                <button type="button" class="remove-image" onclick="removeImage(event)">Remove Photo</button>
                            </div>
                            <input 
                                type="file" 
                                id="photoInput"
                                name="profile_image"
                                class="file-input" 
                                accept="image/jpeg,image/png,image/jpg"
                                onchange="handlePhotoUpload(event)"
                                required
                            >

                            <div class="error-message">Please upload your photo</div>
                        </div>

                        <div class="form-group full-width">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" name="terms" required style="width: 20px; height: 20px; accent-color: #4f46e5; cursor: pointer;">
                                <span style="color: #64748b; font-size: 0.9rem;">
                                    I agree to the <a href="#" class="footer-link">Terms & Conditions</a> and <a href="#" class="footer-link">Privacy Policy</a>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Form Buttons -->
                <div class="form-buttons">
                    <button type="button" class="btn btn-back" id="btnBack" style="display: none;">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Back
                    </button>
                    <button type="button" class="btn btn-next" id="btnNext">
                        <span class="btn-text">
                            Next
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </span>
                    </button>
                    <button type="submit" class="btn btn-submit" id="btnSubmit">
                        <div class="spinner"></div>
                        <span class="btn-text">Create Account</span>
                    </button>
                </div>
            </form>

            <!-- Footer -->
            <div class="register-footer">
                <p class="footer-text">
                    Already have an account? <a href="/login" class="footer-link">Sign in here</a>
                </p>
            </div>
        </div>
    </div>

   <script>
    let currentStep = 1;
    const totalSteps = 3;

    /* const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
 */
    /* ---------------- PHOTO PREVIEW ---------------- */

    function handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showAlert('File size must be less than 2MB', 'error');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('photoUpload').classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }

    function removeImage(event) {
        event.stopPropagation();
        document.getElementById('photoInput').value = '';
        document.getElementById('photoUpload').classList.remove('has-image');
        document.getElementById('imagePreview').src = '';
    }

    /* ---------------- STEP NAVIGATION ---------------- */

    document.getElementById('btnNext').addEventListener('click', () => {
        if (validateStep(currentStep) && currentStep < totalSteps) {
            currentStep++;
            updateSteps();
        }
    });

    document.getElementById('btnBack').addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    function updateSteps() {
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

        document.querySelectorAll('.step').forEach((step, i) => {
            step.classList.remove('active', 'completed');
            if (i + 1 < currentStep) step.classList.add('completed');
            if (i + 1 === currentStep) step.classList.add('active');
        });

        document.getElementById('progressLine').style.width =
            ((currentStep - 1) / (totalSteps - 1)) * 100 + '%';

        document.getElementById('btnBack').style.display = currentStep > 1 ? 'flex' : 'none';
        document.getElementById('btnNext').style.display = currentStep < totalSteps ? 'flex' : 'none';
        document.getElementById('btnSubmit').style.display = currentStep === totalSteps ? 'flex' : 'none';
    }

    /* ---------------- VALIDATION ---------------- */

    function validateStep(step) {
        const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = stepEl.querySelectorAll('input[required]');
        let valid = true;

        inputs.forEach(input => {
            const group = input.closest('.form-group');
            group?.classList.remove('error');

            if (input.type === 'radio') {
                const radios = stepEl.querySelectorAll(`input[name="${input.name}"]`);
                if (![...radios].some(r => r.checked)) {
                    group?.classList.add('error');
                    valid = false;
                }
                return;
            }

            if (!input.value.trim()) {
                group?.classList.add('error');
                valid = false;
                return;
            }

            if (input.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                group?.classList.add('error');
                valid = false;
            }

            if (input.name === 'phone' && !/^[0-9]{10}$/.test(input.value)) {
                group?.classList.add('error');
                valid = false;
            }

            if (input.name === 'aadhaar' && !/^[0-9]{12}$/.test(input.value)) {
                group?.classList.add('error');
                valid = false;
            }

            if (input.name === 'password_confirmation') {
                const password = stepEl.querySelector('input[name="password"]').value;
                if (input.value !== password) {
                    group?.classList.add('error');
                    valid = false;
                }
            }
        });

        return valid;
    }

    /* ---------------- REAL FORM SUBMIT ---------------- */

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const submitBtn = document.getElementById('btnSubmit');
        submitBtn.classList.add('loading');

        const fd = new FormData(e.target);

        const profile = document.querySelector('input[name="profile"]:checked');
        if (!profile) {
            showAlert('Please select profile', 'error');
            submitBtn.classList.remove('loading');
            return;
        }

        fd.append('user_type', profile.value);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: fd
            });

            const data = await res.json();
            submitBtn.classList.remove('loading');

            if (!res.ok) {
                /* 
                 */
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0][0];
                    showAlert(firstError, 'error');
                } else if (data.message) {
                    showAlert(data.message, 'error');
                } else {
                    showAlert('Registration failed', 'error');
                }
                return;
            }

            showAlert('Registration successful!', 'success');
            setTimeout(() => window.location.href = '/login', 1500);

        } catch (err) {
            submitBtn.classList.remove('loading');
            console.error(err);
            showAlert('Server error. Try again.', 'error');
        }
    });

    /* ---------------- UI HELPERS ---------------- */

    function showAlert(message, type) {
        const alert = document.getElementById('alert');
        const alertMessage = document.getElementById('alertMessage');
        alert.className = `alert alert-${type} show`;
        alertMessage.textContent = message;
        setTimeout(() => alert.classList.remove('show'), 5000);
    }

    document.querySelector('input[name="phone"]').addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    document.querySelector('input[name="aadhaar"]').addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

   // 🔥 ADD THIS LINE
    updateSteps();

</script>


</body>
</html>
