import React, { useState } from "react";
import { supabase } from "../supabase";
import "../styles/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGIN
  const login = async () => {
  setLoading(true);

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  if (!data.user.email_confirmed_at) {
    alert(
      "Please verify your email before logging in."
    );

    await supabase.auth.signOut();
    return;
  }
};

  // SIGNUP
  const signup = async () => {
    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert(
        "Account created! Check your email."
      );
    }
  };

  // FORGOT PASSWORD
  const resetPassword = async () => {
    if (!email) {
      alert("Please enter your email first");
      return;
    }

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email
      );

    if (error) {
      alert(error.message);
    } else {
      alert(
        "Password reset email sent!"
      );
    }
  };

  return (
    <div className="login-container">

      <div className="login-left">

        <h1>🌳 FamilyRoots</h1>

        <p>
          Preserve your family legacy,
          track generations and keep
          memories forever.
        </p>

        <div className="stats">

          <div className="stat">
            <h3>5000+</h3>
            <span>Families</span>
          </div>

          <div className="stat">
            <h3>25000+</h3>
            <span>Members</span>
          </div>

          <div className="stat">
            <h3>99.9%</h3>
            <span>Secure</span>
          </div>

        </div>

      </div>

      <div className="login-right">

        <div className="login-card">

          <div className="login-logo">
            🌳
          </div>

          <h1 className="login-title">
            Welcome Back
          </h1>

          <p className="login-subtitle">
            Sign in to continue building
            your family legacy
          </p>

          <input
            className="login-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="login-btn"
            onClick={login}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : "Login"}
          </button>

          <button
            className="signup-btn"
            onClick={signup}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : "Create Account"}
          </button>

          <button
            className="forgot-btn"
            onClick={resetPassword}
          >
            Forgot Password?
          </button>

        </div>

      </div>

    </div>
  );
}