import React from "react";
import "./LandingPage.css";

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🌳 FamilyRoots
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#stats">Statistics</a>
          <a href="#testimonials">Reviews</a>
          <a href="#faq">FAQ</a>
          <a
  href="#contact"
  onClick={(e) => {
    e.preventDefault();
    document
      .getElementById('contact')
      ?.scrollIntoView({
        behavior: 'smooth'
      });
  }}
>
  Contact
</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <h1>
  Build, Preserve & Share Your Family Legacy
</h1>

<p>
  Create interactive family trees, track generations,
  preserve memories, celebrate milestones and keep
  your family history securely accessible from anywhere.
</p>
<div className="trust-badges">
  <span>✓ Secure Cloud Storage</span>
  <span>✓ Unlimited Members</span>
  <span>✓ Mobile Friendly</span>
</div>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={onStart}
            >
              Start Building
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Features
            </button>
          </div>
        </div>

        <div className="hero-right">

  <div className="preview-window">

    <div className="preview-header">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div className="preview-content">

      <div className="preview-card">
        <div className="avatar">RJ</div>
        <h4>Robert</h4>
      </div>

      <div className="preview-card">
        <div className="avatar">EJ</div>
        <h4>Eleanor</h4>
      </div>

      <div className="preview-card">
        <div className="avatar">DJ</div>
        <h4>David</h4>
      </div>

      <div className="preview-card">
        <div className="avatar">MJ</div>
        <h4>Michael</h4>
      </div>

    </div>

  </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="stats">
        <div className="stat-card">
          <h2>5000+</h2>
          <p>Families</p>
        </div>

        <div className="stat-card">
          <h2>25000+</h2>
          <p>Members</p>
        </div>

        <div className="stat-card">
          <h2>99.9%</h2>
          <p>Secure Data</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Cloud Access</p>
        </div>
      </section>
      <section className="live-stats">

  <div className="stat-box">
    <h2>5000+</h2>
    <p>Families</p>
  </div>

  <div className="stat-box">
    <h2>25000+</h2>
    <p>Members</p>
  </div>

  <div className="stat-box">
    <h2>99.9%</h2>
    <p>Availability</p>
  </div>

  <div className="stat-box">
    <h2>24/7</h2>
    <p>Cloud Access</p>
  </div>

</section>

      {/* Features */}
      <section id="features" className="features">

        <h2>Why Choose FamilyRoots?</h2>

        <div className="feature-grid">

          <div className="card">
            <h3>🌳 Family Tree</h3>
            <p>Create unlimited family trees.</p>
          </div>

          <div className="card">
            <h3>👨‍👩‍👧 Relationships</h3>
            <p>Track parents, children and spouses.</p>
          </div>

          <div className="card">
            <h3>🎂 Events</h3>
            <p>Birthdays, anniversaries and reminders.</p>
          </div>

          <div className="card">
            <h3>☁ Cloud Storage</h3>
            <p>Access from any device.</p>
          </div>

          <div className="card">
            <h3>📷 Memories</h3>
            <p>Store photos and family stories.</p>
          </div>

          <div className="card">
            <h3>🔒 Security</h3>
            <p>Protected family information.</p>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="testimonials"
      >
        <h2>What Families Say</h2>

        <div className="testimonial-grid">

          <div className="card">
            ⭐⭐⭐⭐⭐
            <p>
              Best family tree platform
              I've ever used.
            </p>
          </div>

          <div className="card">
            ⭐⭐⭐⭐⭐
            <p>
              Easy to connect family
              members across generations.
            </p>
          </div>

          <div className="card">
            ⭐⭐⭐⭐⭐
            <p>
              Perfect for preserving
              family history.
            </p>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq">

        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h3>Is FamilyRoots free?</h3>
          <p>Yes, basic features are free.</p>
        </div>

        <div className="faq-item">
          <h3>Can I add photos?</h3>
          <p>Yes, photos can be stored for members.</p>
        </div>

        <div className="faq-item">
          <h3>Can I access from mobile?</h3>
          <p>Yes, it works on all devices.</p>
        </div>

      </section>

      {/* Contact */}
      <section
        id="contact"
        className="contact"
      >
        <h2>Contact Us</h2>

        <p>
          Email:
          support@familyroots.com
        </p>

        <p>
          Phone:
          +91 9876543210
        </p>

        <button
          className="primary-btn"
          onClick={onStart}
        >
          Start Building Your Family Tree
        </button>
      </section>
      <section className="premium-cta">

  <h2>
    Start Preserving Your Family Legacy Today
  </h2>

  <p>
    Build beautiful family trees,
    preserve memories and connect generations.
  </p>

  <button
    className="primary-btn"
    onClick={onStart}
  >
    Get Started Free
  </button>

</section>

      {/* Footer */}
      <footer className="footer">
        © 2026 FamilyRoots.
        All Rights Reserved.
      </footer>

    </div>
  );
}