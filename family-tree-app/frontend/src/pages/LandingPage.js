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
      <section className="live-stats">
        <section className="preview-showcase">

  <h2>FamilyRoots In Action</h2>

  <div className="preview-grid">

    <div className="card">
      🌳
      <h3>Interactive Family Tree</h3>
      <p>Visualize generations beautifully.</p>
    </div>

    <div className="card">
      👨‍👩‍👧‍👦
      <h3>Member Profiles</h3>
      <p>Store photos and family details.</p>
    </div>

    <div className="card">
      🎂
      <h3>Birthday Tracking</h3>
      <p>Never miss important events.</p>
    </div>

    <div className="card">
      📅
      <h3>Calendar View</h3>
      <p>See all family events in one place.</p>
    </div>

  </div>

</section>

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
    <p>Yes. Core family tree features are free.</p>
  </div>

  <div className="faq-item">
    <h3>Can I upload photos?</h3>
    <p>Yes. Every member can have photos attached.</p>
  </div>

  <div className="faq-item">
    <h3>Can I access from mobile?</h3>
    <p>Yes. FamilyRoots works on all devices.</p>
  </div>

  <div className="faq-item">
    <h3>Is my data secure?</h3>
    <p>Your family information is stored securely.</p>
  </div>

  <div className="faq-item">
    <h3>Can I export my tree?</h3>
    <p>Yes. Export your family tree anytime.</p>
  </div>

</section>

      {/* Contact */}
      <section
  id="contact"
  className="contact"
>

  <h2>Contact Us</h2>

  <p>📧 support@familyroots.com</p>

  <p>📞 +91 9876543210</p>

  <p>📍 Bangalore, India</p>

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