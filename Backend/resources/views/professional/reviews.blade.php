<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Reviews & Ratings - LocalHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    @include('components.styles')

    <style>
        /* Reviews Specific Styles */
        .rating-overview {
            background: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 32px;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 32px;
        }

        .overall-rating {
            text-align: center;
            padding: 24px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            border-radius: 12px;
            color: white;
        }

        .rating-number {
            font-size: 64px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .rating-stars {
            font-size: 24px;
            color: #fbbf24;
            margin-bottom: 8px;
        }

        .rating-count {
            font-size: 14px;
            opacity: 0.9;
        }

        .rating-breakdown {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .rating-bar {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .rating-label {
            font-size: 14px;
            color: #64748b;
            width: 60px;
        }

        .bar-container {
            flex: 1;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }

        .bar-fill {
            height: 100%;
            background: #fbbf24;
            border-radius: 4px;
            transition: width 0.3s;
        }

        .rating-percentage {
            font-size: 14px;
            color: #64748b;
            width: 50px;
            text-align: right;
        }

        .reviews-grid {
            display: grid;
            gap: 16px;
        }

        .review-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
        }

        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 12px;
        }

        .reviewer-info {
            display: flex;
            gap: 12px;
        }

        .reviewer-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 18px;
        }

        .reviewer-details h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .review-stars {
            color: #fbbf24;
            font-size: 14px;
        }

        .review-date {
            font-size: 13px;
            color: #94a3b8;
        }

        .review-text {
            color: #475569;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 12px;
        }

        .review-service {
            display: inline-block;
            padding: 4px 12px;
            background: #f1f5f9;
            border-radius: 12px;
            font-size: 12px;
            color: #64748b;
            margin-bottom: 12px;
        }

        .review-actions {
            display: flex;
            gap: 8px;
        }

        .filter-buttons {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
        }

        .filter-btn {
            padding: 8px 16px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }

        .filter-btn:hover {
            background: #f1f5f9;
        }

        .filter-btn.active {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
        }
    </style>
</head>

<body>
    @include('components.navbar', [
    'title' => 'Reviews & Ratings',
    'searchPlaceholder' => 'Search reviews...',
    'userInitials' => 'JD'
    ])

    @include('components.professional-sidebar')

    <main class="main-content">
        <div>
            <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Reviews & Ratings</h1>
            <p style="color: #64748b; margin-bottom: 32px;">See what your clients are saying about you</p>

            <!-- Rating Overview -->
            <div class="rating-overview">
                <div class="overall-rating">
                    <div class="rating-number" id="avg-rating">0.0</div>
                    <div class="rating-stars" id="rating-stars">★★★★★</div>
                    <div class="rating-count" id="review-count">0 reviews</div>
                </div>

                <div class="rating-breakdown">
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Rating Breakdown</h3>
                    <div class="rating-bar">
                        <div class="rating-label">5 stars</div>
                        <div class="bar-container">
                            <div class="bar-fill" id="bar-5" style="width: 0%"></div>
                        </div>
                        <div class="rating-percentage" id="percent-5">0%</div>
                    </div>
                    <div class="rating-bar">
                        <div class="rating-label">4 stars</div>
                        <div class="bar-container">
                            <div class="bar-fill" id="bar-4" style="width: 0%"></div>
                        </div>
                        <div class="rating-percentage" id="percent-4">0%</div>
                    </div>
                    <div class="rating-bar">
                        <div class="rating-label">3 stars</div>
                        <div class="bar-container">
                            <div class="bar-fill" id="bar-3" style="width: 0%"></div>
                        </div>
                        <div class="rating-percentage" id="percent-3">0%</div>
                    </div>
                    <div class="rating-bar">
                        <div class="rating-label">2 stars</div>
                        <div class="bar-container">
                            <div class="bar-fill" id="bar-2" style="width: 0%"></div>
                        </div>
                        <div class="rating-percentage" id="percent-2">0%</div>
                    </div>
                    <div class="rating-bar">
                        <div class="rating-label">1 star</div>
                        <div class="bar-container">
                            <div class="bar-fill" id="bar-1" style="width: 0%"></div>
                        </div>
                        <div class="rating-percentage" id="percent-1">0%</div>
                    </div>
                </div>
            </div>

            <!-- Filter Buttons -->
            <div class="filter-buttons">
                <button class="filter-btn active" onclick="filterReviews('all')">All Reviews</button>
                <button class="filter-btn" onclick="filterReviews(5)">5 Stars</button>
                <button class="filter-btn" onclick="filterReviews(4)">4 Stars</button>
                <button class="filter-btn" onclick="filterReviews(3)">3 Stars</button>
                <button class="filter-btn" onclick="filterReviews(2)">2 Stars</button>
                <button class="filter-btn" onclick="filterReviews(1)">1 Star</button>
            </div>

            <!-- Reviews Grid -->
            <div class="reviews-grid" id="reviews-container">
                <div style="text-align: center; padding: 48px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #cbd5e1;"></i>
                    <p style="color: #94a3b8; margin-top: 16px;">Loading reviews...</p>
                </div>
            </div>
        </div>
    </main>

    @include('components.profile-modal')

    @include('components.scripts')

    <script>
        let allReviews = [];

        document.addEventListener('DOMContentLoaded', function() {
            loadReviews();
        });

        // Load reviews from API
        async function loadReviews() {
            try {
                const response = await fetch(`${API_BASE}/professional/dashboard`, {
                    method: 'GET',
                    headers: authHeaders
                });

                if (!response.ok) throw new Error('Failed to load reviews');

                const data = await response.json();
                allReviews = data.reviews || [];

                updateRatingOverview(data.rating || {});
                renderReviews(allReviews);
            } catch (error) {
                console.error('Error loading reviews:', error);
                showEmptyState();
            }
        }

        // Update rating overview
        function updateRatingOverview(ratingData) {
            const avgRating = ratingData.average || 0;
            const totalReviews = ratingData.total || 0;

            document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
            document.getElementById('review-count').textContent = `${totalReviews} review${totalReviews !== 1 ? 's' : ''}`;

            // Update star display
            const stars = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
            document.getElementById('rating-stars').textContent = stars;

            // Update rating breakdown
            const breakdown = ratingData.breakdown || {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            };
            for (let i = 1; i <= 5; i++) {
                const count = breakdown[i] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews * 100) : 0;
                document.getElementById(`bar-${i}`).style.width = `${percentage}%`;
                document.getElementById(`percent-${i}`).textContent = `${Math.round(percentage)}%`;
            }
        }

        // Render reviews
        function renderReviews(reviews) {
            const container = document.getElementById('reviews-container');

            if (reviews.length === 0) {
                showEmptyState();
                return;
            }

            container.innerHTML = reviews.map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">${review.client_name ? review.client_name.charAt(0).toUpperCase() : 'C'}</div>
                            <div class="reviewer-details">
                                <h3>${review.client_name || 'Client'}</h3>
                                <div class="review-stars">${'★'.repeat(review.rating || 0)}${'☆'.repeat(5 - (review.rating || 0))}</div>
                            </div>
                        </div>
                        <div class="review-date">${review.date || 'Recently'}</div>
                    </div>

                    <div class="review-service">
                        <i class="fas fa-briefcase"></i> ${review.service_name || 'Service'}
                    </div>

                    <div class="review-text">${review.comment || 'No comment provided'}</div>

                    <div class="review-actions">
                        <button class="btn btn-outline" onclick="replyToReview(${review.id})">
                            <i class="fas fa-reply"></i> Reply
                        </button>
                        <button class="btn btn-outline" onclick="reportReview(${review.id})">
                            <i class="fas fa-flag"></i> Report
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Filter reviews
        function filterReviews(rating) {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            // Filter and render
            const filtered = rating === 'all' ?
                allReviews :
                allReviews.filter(review => review.rating === rating);

            renderReviews(filtered);
        }

        // Reply to review
        function replyToReview(id) {
            const reply = prompt('Enter your reply:');
            if (reply) {
                alert('Reply posted successfully! (API integration pending)');
            }
        }

        // Report review
        function reportReview(id) {
            if (confirm('Are you sure you want to report this review?')) {
                alert('Review reported successfully! (API integration pending)');
            }
        }

        // Show empty state
        function showEmptyState() {
            const container = document.getElementById('reviews-container');
            container.innerHTML = `
                <div style="text-align: center; padding: 64px 32px; background: white; border-radius: 12px;">
                    <i class="fas fa-star" style="font-size: 64px; color: #cbd5e1; margin-bottom: 16px;"></i>
                    <h3 style="font-size: 20px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">No Reviews Yet</h3>
                    <p style="color: #64748b;">Your client reviews will appear here</p>
                </div>
            `;
        }
    </script>
</body>

</html>