<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LocalHub - Your Local Marketplace</title>
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
            background: linear-gradient(to bottom right, #f8fafc, #dbeafe, #e0e7ff);
            min-height: 100vh;
        }

        /* Navigation */
        .navbar {
            position: fixed;
            width: 100%;
            z-index: 1000;
            transition: all 0.5s ease;
        }

        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(12deg);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }

        .logo-icon svg {
            width: 24px;
            height: 24px;
            color: white;
            transform: rotate(-12deg);
        }

        .logo-text {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
            align-items: center;
        }

        .nav-links a {
            color: #1e293b;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: #4f46e5;
        }

        .nav-buttons {
            display: flex;
            gap: 1rem;
        }

        .btn {
            padding: 0.625rem 1.5rem;
            border-radius: 9999px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
            font-size: 1rem;
        }

        .btn-login {
            color: #1e293b;
            background: transparent;
        }

        .btn-login:hover {
            color: #4f46e5;
        }

        .btn-primary {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
        }

        .btn-primary:hover {
            box-shadow: 0 6px 25px rgba(79, 70, 229, 0.4);
            transform: translateY(-2px);
        }

        /* Hero Section */
        .hero {
            padding-top: 8rem;
            padding-bottom: 5rem;
            padding-left: 2rem;
            padding-right: 2rem;
            position: relative;
            overflow: hidden;
        }

        .blob-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            z-index: 0;
        }

        .blob {
            position: absolute;
            border-radius: 50%;
            mix-blend-mode: multiply;
            filter: blur(64px);
            opacity: 0.3;
            animation: blob 7s infinite;
        }

        .blob-1 {
            top: 5rem;
            right: 2.5rem;
            width: 18rem;
            height: 18rem;
            background: #a78bfa;
            animation-delay: 0s;
        }

        .blob-2 {
            top: 10rem;
            left: 2.5rem;
            width: 18rem;
            height: 18rem;
            background: #818cf8;
            animation-delay: 2s;
        }

        .blob-3 {
            bottom: -2rem;
            left: 50%;
            width: 18rem;
            height: 18rem;
            background: #60a5fa;
            animation-delay: 4s;
        }

        @keyframes blob {
            0%, 100% {
                transform: translate(0, 0) scale(1);
            }
            33% {
                transform: translate(30px, -50px) scale(1.1);
            }
            66% {
                transform: translate(-20px, 20px) scale(0.9);
            }
        }

        .hero-content {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .hero-text {
            animation: slideInLeft 0.8s ease-out;
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(4px);
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
        }

        .badge svg {
            width: 16px;
            height: 16px;
            color: #4f46e5;
        }

        .badge-text {
            font-size: 0.875rem;
            font-weight: 700;
            color: #1e293b;
        }

        .hero-title {
            font-size: 4rem;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 1.5rem;
        }

        .title-dark {
            background: linear-gradient(135deg, #0f172a, #312e81, #581c87);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .title-gradient {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-description {
            font-size: 1.25rem;
            color: #475569;
            line-height: 1.8;
            margin-bottom: 2rem;
        }

        .hero-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .btn-large {
            padding: 1rem 2rem;
            font-size: 1.125rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-outline {
            background: white;
            color: #4f46e5;
            border: 2px solid #4f46e5;
        }

        .btn-outline:hover {
            background: #f1f5f9;
        }

        .hero-image {
            position: relative;
            height: 600px;
            animation: slideInRight 0.8s ease-out;
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .hero-img {
            position: relative;
            z-index: 10;
            border-radius: 1.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
        }

        .hero-img:hover {
            transform: scale(1.05);
        }

        .hero-img-decoration {
            position: absolute;
            bottom: -1.5rem;
            right: -1.5rem;
            width: 16rem;
            height: 16rem;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            border-radius: 1.5rem;
            z-index: -1;
            opacity: 0.2;
        }

        /* Features Section */
        .features {
            padding: 5rem 2rem;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(4px);
        }

        .features-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .section-title {
            font-size: 3rem;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 1rem;
            text-align: center;
        }

        .section-description {
            font-size: 1.25rem;
            color: #475569;
            max-width: 40rem;
            margin: 0 auto;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        .feature-card {
            position: relative;
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            overflow: hidden;
            transition: all 0.3s;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(135deg, #f59e0b, #ea580c);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .feature-card:nth-child(2)::before {
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
        }

        .feature-card:nth-child(3)::before {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .feature-card:hover::before {
            opacity: 1;
        }

        .feature-icon {
            width: 4rem;
            height: 4rem;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            transition: transform 0.3s;
        }

        .feature-card:hover .feature-icon {
            transform: scale(1.1) rotate(6deg);
        }

        .feature-card:nth-child(1) .feature-icon {
            background: linear-gradient(135deg, #f59e0b, #ea580c);
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .feature-card:nth-child(2) .feature-icon {
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .feature-card:nth-child(3) .feature-icon {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .feature-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.75rem;
        }

        .feature-description {
            color: #475569;
            line-height: 1.7;
        }

        .feature-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #4f46e5;
            font-weight: 600;
            margin-top: 1rem;
            transition: transform 0.3s;
        }

        .feature-card:hover .feature-link {
            transform: translateX(0.5rem);
        }

        /* Stats Section */
        .stats {
            padding: 5rem 2rem;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
        }

        .stats-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            text-align: center;
        }

        .stat-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s;
        }

        .stat-item.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .stat-number {
            font-size: 3rem;
            font-weight: 900;
            color: white;
            margin-bottom: 0.5rem;
            display: block;
        }

        .stat-label {
            color: #c7d2fe;
            font-size: 1.125rem;
            font-weight: 600;
        }

        /* How It Works */
        .how-it-works {
            padding: 5rem 2rem;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(4px);
        }

        .steps-grid {
            max-width: 1400px;
            margin: 4rem auto 0;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 3rem;
        }

        .step {
            position: relative;
        }

        .step-number {
            font-size: 6rem;
            font-weight: 900;
            color: #e0e7ff;
            position: absolute;
            top: -1.5rem;
            left: -1rem;
            z-index: 0;
        }

        .step-content {
            position: relative;
            z-index: 1;
            padding-top: 2rem;
        }

        .step-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.75rem;
        }

        .step-description {
            color: #475569;
            font-size: 1.125rem;
            line-height: 1.7;
        }

        /* CTA Section */
        .cta {
            padding: 5rem 2rem;
        }

        .cta-container {
            max-width: 64rem;
            margin: 0 auto;
            text-align: center;
        }

        .cta-box {
            background: linear-gradient(135deg, #0f172a, #312e81);
            border-radius: 1.5rem;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        .cta-box::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2));
        }

        .cta-content {
            position: relative;
            z-index: 1;
        }

        .cta-title {
            font-size: 3rem;
            font-weight: 900;
            color: white;
            margin-bottom: 1.5rem;
        }

        .cta-description {
            font-size: 1.25rem;
            color: #c7d2fe;
            margin-bottom: 2rem;
            max-width: 36rem;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn-white {
            background: white;
            color: #4f46e5;
        }

        .btn-white:hover {
            background: #f8fafc;
            transform: translateY(-2px);
        }

        /* Footer */
        .footer {
            background: #0f172a;
            color: white;
            padding: 3rem 2rem;
        }

        .footer-container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 3rem;
            margin-bottom: 3rem;
        }

        .footer-brand h3 {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
        }

        .footer-brand p {
            color: #94a3b8;
        }

        .footer-section h4 {
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .footer-links {
            list-style: none;
        }

        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            display: block;
            margin-bottom: 0.5rem;
            transition: color 0.3s;
        }

        .footer-links a:hover {
            color: white;
        }

        .footer-bottom {
            border-top: 1px solid #1e293b;
            padding-top: 2rem;
            text-align: center;
            color: #64748b;
        }

        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
        }

        .mobile-menu-toggle span {
            display: block;
            width: 25px;
            height: 3px;
            background: #1e293b;
            margin: 5px 0;
            transition: 0.3s;
        }
        .admin-btn {
            display: inline-block;
            padding: 12px 28px;
            background-color: #0f172a;
            color: #fff;
            font-weight: 600;
            border-radius: 8px;
            text-decoration: none;
            transition: background-color 0.2s, transform 0.2s;
        }

        .admin-btn:hover {
            background-color: #09249b;
            transform: scale(1.05);
        }


        /* Team Section */
        .team-intro {
            text-align: center;
            max-width: 700px;
            margin: 0 auto 3rem;
            color: #475569;
            font-size: 1.15rem;
            line-height: 1.8;
        }

        .team-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 2rem;
            margin-bottom: 5rem;
        }

        .team-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
        }

        .team-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .team-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
            overflow: hidden;
            border: 3px solid #e0e7ff;
        }

        .team-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .team-name {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #0f172a;
        }

        .team-role {
            color: #7c3aed;
            font-size: 0.95rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .team-bio {
            color: #64748b;
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            min-height: 80px;
        }

        .team-social {
            display: flex;
            justify-content: center;
            gap: 0.75rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
        }

        .social-link {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            text-decoration: none;
            transition: all 0.3s;
        }

        .social-link:hover {
            transform: translateY(-3px);
        }

        .social-link.linkedin:hover {
            background: #0077b5;
            color: white;
        }

        .social-link.github:hover {
            background: #24292e;
            color: white;
        }

        .social-icon {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        /* Responsive */
        @media (max-width: 968px) {
            .nav-links {
                display: none;
            }

            .mobile-menu-toggle {
                display: block;
            }

            .hero-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .hero-title {
                font-size: 2.5rem;
            }

            .hero-image {
                height: 400px;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .steps-grid {
                grid-template-columns: 1fr;
            }

            .footer-grid {
                grid-template-columns: 1fr;
            }

            .team-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .team-bio {
                min-height: auto;
            }

            .cta-title {
                font-size: 2rem;
            }
        }

        @media (max-width: 640px) {
            .team-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="#" class="logo-container">
                <div class="logo-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
                <span class="logo-text">LocalHub</span>
            </a>
            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="{{ url('/about') }}">About</a></li>
            </ul>
            <div class="nav-buttons">
                <a href="/login" class="btn btn-login">Login</a>
                <a href="/register" class="btn btn-primary">Get Started</a>
            </div>
            <button class="mobile-menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="blob-container">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
        </div>
        <div class="hero-content">
            <div class="hero-text">
                <div class="badge">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    <span class="badge-text">Your Local Marketplace</span>
                </div>
                <h1 class="hero-title">
                    <span class="title-dark">Connect with</span><br>
                    <span class="title-gradient">Your Community</span>
                </h1>
                <p class="hero-description">
                    Discover local news, shop from nearby businesses, and grow your enterprise—all in one vibrant marketplace tailored to your neighborhood.
                </p>
                <div class="hero-buttons">
                    <a href="#signup" class="btn btn-primary btn-large">
                        <span>Start Exploring</span>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </a>
                    <a href="#business" class="btn btn-outline btn-large">
                        List Your Business
                    </a>
                </div>
            </div>
            <div class="hero-image">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop" 
                     alt="Local marketplace" 
                     class="hero-img">
                <div class="hero-img-decoration"></div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
        <section id="team">
            <h2 class="section-title">Meet Our Team</h2>
            <p class="team-intro">
                Our passionate team is dedicated to building connections and empowering local communities.
                Get to know the people behind LocalHub.
            </p>
            <div class="team-grid">
                <!-- Team Member 1 -->
                <div class="team-card">
                    <div class="team-avatar">KP</div>
                    <h3 class="team-name">Kaushik Pal</h3>
                    <p class="team-role">Founder & CEO</p>
                    <p class="team-bio">Passionate about building technology that brings communities together and empowers local businesses.</p>
                    <div class="team-social">
                        <a href="#" class="social-link linkedin" aria-label="LinkedIn">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="https://github.com/project90029-sketch/Community_Sharing.git" class="social-link github" aria-label="GitHub">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Team Member 2 -->
                <div class="team-card">
                    <div class="team-avatar">AD</div>
                    <h3 class="team-name">Anirban Das</h3>
                    <p class="team-role">Head of Product</p>
                    <p class="team-bio">Dedicated to creating user experiences that make community engagement effortless and enjoyable.</p>
                    <div class="team-social">
                        <a href="#" class="social-link linkedin" aria-label="LinkedIn">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="https://github.com/anirbandas-01" class="social-link github" aria-label="GitHub">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Team Member 3 -->
                <div class="team-card">
                    <div class="team-avatar">RD</div>
                    <h3 class="team-name">Rup Das</h3>
                    <p class="team-role">Product Manager</p>
                    <p class="team-bio">Building bridges between neighbors and ensuring every voice in our community is heard.</p>
                    <div class="team-social">
                        <a href="#" class="social-link linkedin" aria-label="LinkedIn">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="https://github.com/Rupx003" class="social-link github" aria-label="GitHub">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Team Member 4 -->
                <div class="team-card">
                    <div class="team-avatar">AG</div>
                    <h3 class="team-name">Ayan Ghosh</h3>
                    <p class="team-role">Developer</p>
                    <p class="team-bio">Crafting robust and scalable solutions to power seamless community connections.</p>
                    <div class="team-social">
                        <a href="#" class="social-link linkedin" aria-label="LinkedIn">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="https://github.com/iamayanghosh2003-byte" class="social-link github" aria-label="GitHub">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Team Member 5 -->
                <div class="team-card">
                    <div class="team-avatar">SG</div>
                    <h3 class="team-name">Subhadip Ghosh</h3>
                    <p class="team-role">CEO</p>
                    <p class="team-bio">Spreading the word about LocalHub and helping communities discover the power of connection.</p>
                    <div class="team-social">
                        <a href="#" class="social-link linkedin" aria-label="LinkedIn">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="https://github.com/subhadip2510" class="social-link github" aria-label="GitHub">
                            <svg class="social-icon" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="features-container">
            <div class="section-header">
                <h2 class="section-title">Everything Your Community Needs</h2>
                <p class="section-description">
                    A comprehensive platform designed to bring your neighborhood together
                </p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📰</div>
                    <h3 class="feature-title">Local News Feed</h3>
                    <p class="feature-description">
                        Stay updated with what's happening in your neighborhood
                    </p>
                    <a href="#" class="feature-link">
                        Learn more
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🛍️</div>
                    <h3 class="feature-title">Buy Local Products</h3>
                    <p class="feature-description">
                        Discover and purchase products from nearby sellers
                    </p>
                    <a href="#" class="feature-link">
                        Learn more
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏪</div>
                    <h3 class="feature-title">List Your Business</h3>
                    <p class="feature-description">
                        Showcase your products and services to the community
                    </p>
                    <a href="#" class="feature-link">
                        Learn more
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats" id="stats">
        <div class="stats-container">
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number" data-target="10000">0</span>
                    <span class="stat-label">Active Users</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-target="500">0</span>
                    <span class="stat-label">Local Businesses</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-target="5000">0</span>
                    <span class="stat-label">Products Listed</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-target="25">0</span>
                    <span class="stat-label">Cities Covered</span>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works" id="how-it-works">
        <div class="features-container">
            <div class="section-header">
                <h2 class="section-title">Get Started in 3 Simple Steps</h2>
            </div>
            <div class="steps-grid">
                <div class="step">
                    <div class="step-number">01</div>
                    <div class="step-content">
                        <h3 class="step-title">Create Your Account</h3>
                        <p class="step-description">
                            Sign up in seconds and set your location
                        </p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">02</div>
                    <div class="step-content">
                        <h3 class="step-title">Explore & Connect</h3>
                        <p class="step-description">
                            Browse local news, products, and services
                        </p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">03</div>
                    <div class="step-content">
                        <h3 class="step-title">Shop or Sell</h3>
                        <p class="step-description">
                            Buy what you need or list your own offerings
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
        <div class="cta-container">
            <div class="cta-box">
                <div class="cta-content">
                    <h2 class="cta-title">Ready to Join Your Local Community?</h2>
                    <p class="cta-description">
                        Start discovering, shopping, and connecting with your neighbors today.
                    </p>
                    <div class="cta-buttons">
                        <a href="#signup" class="btn btn-white btn-large">
                            Create Free Account
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>LocalHub</h3>
                    <p>Connecting communities, one neighborhood at a time.</p><br><br>
                    <a href="{{ url('/admin_login') }}" class="admin-btn">
                       Admin Login
                    </a>
                </div>
                <div class="footer-section">
                    <h4>Product</h4>
                    <ul class="footer-links">
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">For Business</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Company</h4>
                    <ul class="footer-links">
                        <li><a href="{{ url('/about') }}">About</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Legal</h4>
                    <ul class="footer-links">
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Terms</a></li>
                        <li><a href="#">Security</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 LocalHub. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Stats counter animation
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stats = entry.target.querySelectorAll('.stat-item');
                    stats.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.classList.add('visible');
                            const numberElement = stat.querySelector('.stat-number');
                            const target = parseInt(numberElement.getAttribute('data-target'));
                            animateCounter(numberElement, target);
                        }, index * 100);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target.toLocaleString() + '+';
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }, 30);
        }
    </script>
</body>
</html>
