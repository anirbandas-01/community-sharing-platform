import { useState, useEffect } from "react";
import ProfessionalLayout from "../../components/professional/ProfessionalLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const ProfessionalReviews = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/professional/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load reviews");

      const data = await response.json();
      const reviews = data.reviews || [];
      setAllReviews(reviews);

      // Calculate rating statistics
      if (reviews.length > 0) {
        const avgRating =
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
        
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => {
          if (r.rating >= 1 && r.rating <= 5) {
            breakdown[r.rating]++;
          }
        });

        setRatingStats({
          average: avgRating,
          total: reviews.length,
          breakdown,
        });
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      setAllReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = (rating) => {
    setCurrentFilter(rating);
  };

  const getFilteredReviews = () => {
    if (currentFilter === "all") {
      return allReviews;
    }
    return allReviews.filter((review) => review.rating === currentFilter);
  };

  const replyToReview = (id) => {
    const reply = prompt("Enter your reply:");
    if (reply) {
      alert("Reply posted successfully! (API integration pending)");
    }
  };

  const reportReview = (id) => {
    if (confirm("Are you sure you want to report this review?")) {
      alert("Review reported successfully! (API integration pending)");
    }
  };

  const getStarDisplay = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getPercentage = (count) => {
    if (ratingStats.total === 0) return 0;
    return Math.round((count / ratingStats.total) * 100);
  };

  const getInitials = (name) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredReviews = getFilteredReviews();

  return (
    <ProfessionalLayout>
      <div className="page-header">
        <h1 className="page-title">Reviews & Ratings</h1>
        <p className="page-subtitle">See what your clients are saying about you</p>
      </div>

      {/* Rating Overview */}
      <div className="rating-overview">
        <div className="overall-rating">
          <div className="rating-number">{ratingStats.average.toFixed(1)}</div>
          <div className="rating-stars">{getStarDisplay(Math.round(ratingStats.average))}</div>
          <div className="rating-count">
            {ratingStats.total} review{ratingStats.total !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="rating-breakdown">
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
            Rating Breakdown
          </h3>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="rating-bar">
              <div className="rating-label">{star} stars</div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ width: `${getPercentage(ratingStats.breakdown[star])}%` }}
                ></div>
              </div>
              <div className="rating-percentage">
                {getPercentage(ratingStats.breakdown[star])}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${currentFilter === "all" ? "active" : ""}`}
          onClick={() => filterReviews("all")}
        >
          All Reviews
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            className={`filter-btn ${currentFilter === star ? "active" : ""}`}
            onClick={() => filterReviews(star)}
          >
            {star} Stars
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-star"></i>
          <h3>No Reviews Yet</h3>
          <p>
            {currentFilter === "all"
              ? "Your client reviews will appear here"
              : `No ${currentFilter}-star reviews found`}
          </p>
        </div>
      ) : (
        <div className="reviews-grid">
          {filteredReviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {getInitials(review.client_name)}
                  </div>
                  <div className="reviewer-details">
                    <h3>{review.client_name || "Client"}</h3>
                    <div className="review-stars">
                      {getStarDisplay(review.rating || 0)}
                    </div>
                  </div>
                </div>
                <div className="review-date">{review.date || "Recently"}</div>
              </div>

              <div className="review-service">
                <i className="fas fa-briefcase"></i> {review.service_name || "Service"}
              </div>

              <div className="review-text">{review.comment || "No comment provided"}</div>

              <div className="review-actions">
                <button
                  onClick={() => replyToReview(review.id || index)}
                  className="btn btn-outline btn-sm"
                >
                  <i className="fas fa-reply"></i> Reply
                </button>
                <button
                  onClick={() => reportReview(review.id || index)}
                  className="btn btn-outline btn-sm"
                >
                  <i className="fas fa-flag"></i> Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfessionalLayout>
  );
};

export default ProfessionalReviews;