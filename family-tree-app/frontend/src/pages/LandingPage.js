import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing">

      <nav className="navbar">
        <h2>🌳 FamilyRoots</h2>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#snapshot">Snapshot</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Build Your Family Legacy</h1>

        <p>
          Create family trees, track generations,
          preserve memories and stay connected.
        </p>

        <div className="hero-btns">
          <button>Get Started</button>
          <button className="secondary">
            Live Demo
          </button>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Features</h2>

        <div className="feature-grid">
          <div>🌳 Family Tree</div>
          <div>📸 Photos</div>
          <div>🎂 Reminders</div>
          <div>👨‍👩‍👧 Relationships</div>
          <div>📅 Timeline</div>
          <div>☁ Cloud Sync</div>
        </div>
      </section>

      <section id="snapshot" className="snapshot">
        <h2>Live Family Snapshot</h2>

        <div className="card">
          🎂 Priya Birthday in 5 Days
        </div>

        <div className="card">
          💍 Anniversary in 12 Days
        </div>

        <div className="card">
          👶 New Member Added
        </div>

        <div className="card">
          🌳 4 Generations Connected
        </div>
      </section>

      <section className="cta">
        <h2>
          Start Building Your Family Tree Today
        </h2>

        <button>Create Family Tree</button>
      </section>
    </div>
  );
}