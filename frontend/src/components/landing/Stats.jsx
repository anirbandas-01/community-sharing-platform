import { useEffect, useRef } from "react";

const Stats = () => {
  const statsRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            const stats = entry.target.querySelectorAll(".stat-item");
            stats.forEach((stat, index) => {
              setTimeout(() => {
                stat.classList.add("visible");
                const numberElement = stat.querySelector(".stat-number");
                const target = parseInt(
                  numberElement.getAttribute("data-target")
                );
                animateCounter(numberElement, target);
              }, index * 100);
            });
            animatedRef.current = true;
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      statsObserver.disconnect();
    };
  }, []);

  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString() + "+";
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 30);
  };

  return (
    <section className="stats" id="stats" ref={statsRef}>
      <div className="stats-container">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number" data-target="10000">
              0
            </span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-target="500">
              0
            </span>
            <span className="stat-label">Local Businesses</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-target="5000">
              0
            </span>
            <span className="stat-label">Products Listed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-target="25">
              0
            </span>
            <span className="stat-label">Cities Covered</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;