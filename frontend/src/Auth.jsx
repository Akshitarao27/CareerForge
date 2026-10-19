
import { useState } from "react";
import "./Auth.css";

const API_URL = "http://127.0.0.1:8000";

export default function Auth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      let endpoint = "";
      let payload = {};

      if (mode === "signup") {
        endpoint = "/auth/signup";
        payload = { name, email, password };
      } else if (mode === "verify") {
        endpoint = "/auth/verify-otp";
        payload = { email, otp };
      } else {
        endpoint = "/auth/login";
        payload = { email, password };
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      if (mode === "signup") {
        setMode("verify");
        setMessage("Verification code sent! Check your inbox and spam folder.");
      } else if (mode === "verify") {
        setMode("login");
        setPassword("");
        setOtp("");
        setMessage("Email verified successfully. You can now log in.");
      
} else {
  localStorage.setItem("careerforge_token", data.access_token);
  localStorage.setItem("careerforge_user", JSON.stringify(data.user));

  setMessage("Login successful!");

  if (onLoginSuccess) {
    onLoginSuccess(data.user);
  }
}

    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">CareerForge</div>
        <p className="auth-tagline">Your career copilot</p>

        <h1>
          {mode === "signup"
            ? "Create your account"
            : mode === "verify"
            ? "Verify your email"
            : "Welcome back"}
        </h1>

        <p className="auth-description">
          {mode === "signup"
            ? "Start building your career journey."
            : mode === "verify"
            ? `Enter the six-digit code sent to ${email}.`
            : "Sign in to continue your career journey."}
        </p>

        {message && <div className="auth-message">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label>
              Full name
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                required
              />
            </label>
          )}

          {mode !== "verify" && (
            <label>
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
          )}

          {mode !== "verify" && (
            <label>
              Password
              <input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                required
              />
            </label>
          )}

          {mode === "verify" && (
            <label>
              Six-digit verification code
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </label>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Create account"
              : mode === "verify"
              ? "Verify email"
              : "Log in"}
          </button>
        </form>

        {mode === "login" && (
          <p className="auth-switch">
            Don't have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                setMode("signup");
                setMessage("");
                setError("");
              }}
            >
              Sign up
            </button>
          </p>
        )}

        {mode === "signup" && (
          <p className="auth-switch">
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                setMode("login");
                setMessage("");
                setError("");
              }}
            >
              Log in
            </button>
          </p>
        )}

        {mode === "verify" && (
          <p className="auth-switch">
            Wrong email address?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                setMode("signup");
                setOtp("");
                setMessage("");
                setError("");
              }}
            >
              Go back
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
