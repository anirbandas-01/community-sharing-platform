<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Learn about LocalHub - Your community connection platform">
    <title>About - LocalHub</title>
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
            color: #0f172a;
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
            position: relative;
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            transition: width 0.3s;
        }

        .nav-links a:hover::after,
        .nav-links a.active::after {
            width: 100%;
        }

        .nav-links a:hover,
        .nav-links a.active {
            color: #4f46e5;
        }

        /* Animated Background Blobs */
        .blob-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            z-index: -1;
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

        /* Hero Section */
        .hero {
            padding-top: 8rem;
            padding-bottom: 3rem;
            padding-left: 2rem;
            padding-right: 2rem;
            text-align: center;
        }

        .hero h1 {
            font-size: 4rem;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            animation: slideInUp 0.8s ease;
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .title-gradient {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p {
            font-size: 1.25rem;
            color: #475569;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.8;
            animation: slideInUp 0.8s ease 0.2s backwards;
        }

        /* Container */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem 5rem;
        }

        /* Mission Section */
        .mission-section {
            margin-bottom: 5rem;
        }

        .mission-card {
            background: white;
            border-radius: 24px;
            padding: 3.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .mission-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            transform: scaleX(0);
            transition: transform 0.4s;
        }

        .mission-card:hover::before {
            transform: scaleX(1);
        }

        .mission-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
        }

        .mission-card h2 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            color: #0f172a;
        }

        .mission-card p {
            font-size: 1.15rem;
            color: #475569;
            line-height: 1.9;
            margin-bottom: 1.5rem;
        }

        /* Section Title */
        .section-title {
            text-align: center;
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 3rem;
            color: #0f172a;
        }

        /* Features Grid */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-bottom: 5rem;
        }

        .feature-card {
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
            width: 70px;
            height: 70px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            transition: transform 0.3s;
        }

        .feature-card:nth-child(1) .feature-icon {
            background: linear-gradient(135deg, #f59e0b, #ea580c);
            box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .feature-card:nth-child(2) .feature-icon {
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .feature-card:nth-child(3) .feature-icon {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
        }

        .feature-card:nth-child(4) .feature-icon {
            background: linear-gradient(135deg, #10b981, #059669);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .feature-card:nth-child(5) .feature-icon {
            background: linear-gradient(135deg, #ec4899, #be185d);
            box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
        }

        .feature-card:nth-child(6) .feature-icon {
            background: linear-gradient(135deg, #06b6d4, #0891b2);
            box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
        }

        .feature-card:hover .feature-icon {
            transform: scale(1.1) rotate(5deg);
        }

        .feature-card h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #0f172a;
        }

        .feature-card p {
            color: #475569;
            line-height: 1.7;
        }

        /* Stats Section */
        .stats-section {
            margin-bottom: 5rem;
            padding: 4rem;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(79, 70, 229, 0.3);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 3rem;
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
            font-size: 3.5rem;
            font-weight: 900;
            color: white;
            margin-bottom: 0.5rem;
            display: block;
        }

        .stat-label {
            color: #c7d2fe;
            font-size: 1.1rem;
            font-weight: 600;
        }



        /* CTA Section */
        .cta-section {
            text-align: center;
            padding: 4rem;
            background: linear-gradient(135deg, #0f172a, #312e81);
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .cta-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2));
        }

        .cta-section h2 {
            font-size: 3rem;
            font-weight: 900;
            color: white;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
        }

        .cta-section p {
            font-size: 1.25rem;
            color: #c7d2fe;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            z-index: 1;
        }

        .cta-button {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: white;
            color: #4f46e5;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.1rem;
            box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
            transition: all 0.3s;
            position: relative;
            z-index: 1;
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(255, 255, 255, 0.3);
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 3rem 2rem;
            color: #64748b;
        }

        footer p {
            margin-bottom: 1rem;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .social-links a {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 1.25rem;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .social-links a:hover {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .features-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .team-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .hero h1 {
                font-size: 2.5rem;
            }

            .hero p {
                font-size: 1.1rem;
            }

            .section-title {
                font-size: 2rem;
            }

            .features-grid,
            .team-grid {
                grid-template-columns: 1fr;
            }

            .mission-card {
                padding: 2rem;
            }

            .stats-section {
                padding: 2.5rem;
            }

            .stat-number {
                font-size: 2.5rem;
            }

            .cta-section h2 {
                font-size: 2rem;
            }

            .team-bio {
                min-height: auto;
            }
        }
    </style>
</head>
<body>
    <!-- Animated Background -->
    <div class="blob-container">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
    </div>

    <!-- Navigation -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="/" class="logo-container">
                <div class="logo-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
                <span class="logo-text">LocalHub</span>
            </a>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about" class="active">About</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#team">Team</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <h1>About <span class="title-gradient">LocalHub</span></h1>
        <p>Connecting communities, empowering local businesses, and bringing neighbors together in the digital age.</p>
    </section>

    <!-- Main Content -->
    <div class="container">
        <!-- Mission Section -->
        <section class="mission-section">
            <div class="mission-card">
                <h2>Our Mission</h2>
                <p>LocalHub was created with a simple yet powerful vision: to strengthen local communities by providing a platform where neighbors can connect, local businesses can thrive, and everyone can discover the hidden gems in their neighborhood. We believe that strong communities are built on meaningful connections, and technology should serve to bring people together, not apart.</p>
                <p>In an increasingly digital world, we're committed to keeping the local spirit alive. Whether you're looking for a trusted service provider, want to support local businesses, or simply connect with your neighbors, LocalHub is your gateway to a more connected community.</p>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features">
            <h2 class="section-title">What We Offer</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🏘️</div>
                    <h3>Community Connection</h3>
                    <p>Build meaningful relationships with your neighbors and stay informed about local events, news, and activities happening in your area.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🛍️</div>
                    <h3>Local Business Directory</h3>
                    <p>Discover and support local businesses, from restaurants and cafes to services and retail shops, all in one convenient platform.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🤝</div>
                    <h3>Trusted Network</h3>
                    <p>Connect with verified local service providers, read authentic reviews, and make informed decisions about who to trust in your community.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Easy to Use</h3>
                    <p>Our intuitive platform makes it simple to find what you need, when you need it. Access everything from your phone, tablet, or computer.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Safe & Secure</h3>
                    <p>Your privacy and security are our top priorities. We use industry-leading security measures to protect your personal information.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌱</div>
                    <h3>Community Growth</h3>
                    <p>Help your local economy thrive by supporting neighborhood businesses and fostering a culture of community engagement.</p>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="stats-section">
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
                    <span class="stat-number" data-target="50">0</span>
                    <span class="stat-label">Communities</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" data-target="25000">0</span>
                    <span class="stat-label">Connections Made</span>
                </div>
            </div>
        </section>


        <!-- CTA Section -->
        <section class="cta-section" id="contact">
            <h2>Ready to Join Your <span style="color: #c7d2fe;">Local Community</span>?</h2>
            <p>Start connecting with your neighbors and discovering amazing local businesses today.</p>
            <a href="/" class="cta-button">Get Started Now</a>
        </section>
    </div>

    <!-- Footer -->
    <footer>
        <p>&copy; 2026 LocalHub. All rights reserved.</p>
        <p>Built with ❤️ for local communities</p>
        <div class="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
        </div>
    </footer>

    <script>
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
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

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    if (target >= 1000) {
                        element.textContent = (target / 1000).toFixed(0) + 'K+';
                    } else {
                        element.textContent = target + '+';
                    }
                    clearInterval(timer);
                } else {
                    if (target >= 1000) {
                        element.textContent = (Math.floor(current / 1000)) + 'K';
                    } else {
                        element.textContent = Math.floor(current);
                    }
                }
            }, 30);
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
    </script>
</body>
</html>
