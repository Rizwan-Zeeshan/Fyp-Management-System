import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function Login({ initialUserId = "", userType = "student" }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(initialUserId);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ userId: false, password: false });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const idPrefix = userType === "student" ? "STU" : "FAC";
  const idRegex = new RegExp(`^${idPrefix}-\\d+$`, "i");
  const userIdIsValid = idRegex.test(userId.trim().toUpperCase());
  const passwordIsValid = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ userId: true, password: true });
    setErrorMessage("");

    if (!userIdIsValid || !passwordIsValid) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          id: userId.trim().toUpperCase(),
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { role, message } = response.data;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", userId.trim().toUpperCase());
      localStorage.setItem("userRole", role);
      console.log("Login successful:", message);
      navigate("/Dashboard1");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Invalid credentials. Please try again.");
      } else if (error.request) {
        setErrorMessage("Network error. Please check if the server is running.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgOrb1}></div>
      <div style={styles.bgOrb2}></div>

      <div style={styles.card}>
        <div style={styles.cardInner}>
          <div style={styles.iconWrapper}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>

          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your student account</p>

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <div style={styles.field}>
              <label htmlFor="userId" style={styles.label}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                Student ID
              </label>
              <div style={styles.inputWrapper}>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, userId: true }))}
                  style={{
                    ...styles.input,
                    borderColor: touched.userId && !userIdIsValid ? '#ef4444' : 'rgba(255,255,255,0.15)',
                  }}
                  required
                  autoComplete="username"
                  placeholder="STU-01"
                />
              </div>
              {touched.userId && !userIdIsValid && (
                <div style={styles.error}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  User ID must match STU-NN format (e.g. STU-09)
                </div>
              )}
            </div>

            <div style={styles.field}>
              <label htmlFor="password" style={styles.label}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Password
              </label>
              <div style={styles.passwordWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  style={{
                    ...styles.input,
                    ...styles.passwordInput,
                    borderColor: touched.password && !passwordIsValid ? '#ef4444' : 'rgba(255,255,255,0.15)',
                  }}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={styles.toggleBtn}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              {touched.password && !passwordIsValid && (
                <div style={styles.error}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  Password must be at least 6 characters
                </div>
              )}
            </div>

            {errorMessage && (
              <div style={styles.errorBox}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={!userIdIsValid || !passwordIsValid || loading}
              style={{
                ...styles.submit,
                opacity: !userIdIsValid || !passwordIsValid || loading ? 0.6 : 1,
                cursor: !userIdIsValid || !passwordIsValid || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
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
            Don't have an account?{" "}
            <Link to="/student-signup" style={styles.link}>
              Create Account
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

Login.propTypes = {
  initialUserId: PropTypes.string,
  userType: PropTypes.oneOf(["student", "faculty"]),
};

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
    background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
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
  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
    position: "relative",
    zIndex: 10,
  },
  cardInner: {
    padding: "48px 40px 40px",
    textAlign: "center",
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 20,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    boxShadow: "0 15px 35px rgba(99, 102, 241, 0.4)",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 32,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  label: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.8)",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "0.95rem",
    borderRadius: 12,
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
    paddingRight: 50,
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
  submit: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: "15px",
    marginTop: 8,
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: 12,
    fontSize: "1rem",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
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
  error: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    color: "#f87171",
    fontSize: "0.8rem",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 10,
    color: "#f87171",
    fontSize: "0.9rem",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    margin: "28px 0 20px",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255, 255, 255, 0.15)",
  },
  dividerText: {
    fontSize: "0.85rem",
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: 500,
  },
  linkText: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.6)",
  },
  link: {
    color: "#a5b4fc",
    fontWeight: 600,
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
};
