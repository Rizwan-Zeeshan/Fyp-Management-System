import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

export default function FacSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    status: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/faculty/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          address: form.address,
          status: form.status,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setIsSuccess(true);
      setMessage(`Signup successful! Your Faculty ID is: ${response.data.id}. Please log in.`);
      setForm({ name: "", email: "", password: "", address: "", status: "" });

      setTimeout(() => {
        navigate("");
      }, 2500);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Sign up failed. Please try again.");
      } else if (error.request) {
        setMessage("Network error. Please check if the server is running.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgOrb1}></div>
      <div style={styles.bgOrb2}></div>
      <div style={styles.bgOrb3}></div>

      <div style={styles.card}>
        <div style={styles.cardInner}>
          <div style={styles.iconWrapper}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
            </svg>
          </div>

          <h2 style={styles.title}>Faculty Registration</h2>
          <p style={styles.subtitle}>Create your faculty account</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Full Name
              </label>
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email Address
              </label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Password
              </label>
              <div style={styles.passwordWrapper}>
                <input
                  style={{ ...styles.input, ...styles.passwordInput }}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleBtn}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Address
              </label>
              <input
                style={styles.input}
                type="text"
                name="address"
                placeholder="Enter your address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Role / Status
              </label>
              <div style={styles.selectWrapper}>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Evaluation Committee Member">Evaluation Committee Member</option>
                  <option value="FYP Committee Member">FYP Committee Member</option>
                </select>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={styles.selectArrow}>
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>

            {message && (
              <div style={{
                ...styles.messageBox,
                background: isSuccess ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                borderColor: isSuccess ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
                color: isSuccess ? "#6ee7b7" : "#f87171",
              }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  {isSuccess ? (
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  ) : (
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  )}
                </svg>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submit,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine}></span>
          </div>

          <p style={styles.linkText}>
            Already have an account?{" "}
            <Link to="/facLogin" style={styles.link}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: 20,
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bgOrb1: {
    position: "absolute",
    top: "-150px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.25), transparent 70%)",
    animation: "float 6s ease-in-out infinite",
  },
  bgOrb2: {
    position: "absolute",
    bottom: "-150px",
    left: "-100px",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)",
    animation: "float 8s ease-in-out infinite reverse",
  },
  bgOrb3: {
    position: "absolute",
    top: "50%",
    left: "70%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)",
    animation: "float 10s ease-in-out infinite",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
    position: "relative",
    zIndex: 10,
  },
  cardInner: {
    padding: "40px 36px 36px",
    textAlign: "center",
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 20,
    background: "linear-gradient(135deg, #10b981, #059669)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4)",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "white",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 28,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  label: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.8)",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "0.9rem",
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "white",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    paddingRight: 48,
  },
  toggleBtn: {
    position: "absolute",
    right: 12,
    background: "transparent",
    border: "none",
    color: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease",
  },
  selectWrapper: {
    position: "relative",
  },
  select: {
    width: "100%",
    padding: "12px 40px 12px 14px",
    fontSize: "0.9rem",
    borderRadius: 10,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "#1e293b",
    color: "white",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    boxSizing: "border-box",
  },
  selectArrow: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255, 255, 255, 0.5)",
    pointerEvents: "none",
  },
  messageBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    border: "1px solid",
    borderRadius: 10,
    fontSize: "0.85rem",
  },
  submit: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: "14px",
    marginTop: 4,
    border: "none",
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: 12,
    fontSize: "1rem",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
    transition: "all 0.3s ease",
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    margin: "24px 0 16px",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255, 255, 255, 0.15)",
  },
  dividerText: {
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: 500,
  },
  linkText: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.6)",
  },
  link: {
    color: "#6ee7b7",
    fontWeight: 600,
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
};