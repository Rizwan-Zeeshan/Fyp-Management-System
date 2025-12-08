import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);

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
        `${API_BASE_URL}/student/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          address: form.address,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setIsSuccess(true);
      setMessage(`Signup successful! Your Student ID is: ${response.data.id}. Please log in.`);
      setForm({ name: "", email: "", password: "", address: "" });

      setTimeout(() => {
        navigate("");
      }, 2500);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Signup failed. Please try again.");
      } else if (error.request) {
        setMessage("Network error. Please check if the server is running.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", icon: "👤", type: "text", placeholder: "Enter your full name" },
    { name: "email", label: "Email Address", icon: "📧", type: "email", placeholder: "Enter your email" },
    { name: "password", label: "Password", icon: "🔒", type: "password", placeholder: "Create a password (min 6 chars)" },
    { name: "address", label: "Address", icon: "📍", type: "text", placeholder: "Enter your address" },
  ];

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.bgContainer}>
        <div style={styles.bgOrb1}></div>
        <div style={styles.bgOrb2}></div>
        <div style={styles.bgOrb3}></div>
        <div style={styles.bgGrid}></div>
        <div style={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                ...styles.particle,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        {/* Card glow effect */}
        <div style={styles.cardGlow}></div>
        
        <div style={styles.cardInner}>
          {/* Icon with animated ring */}
          <div style={styles.iconContainer}>
            <div style={styles.iconRing}></div>
            <div style={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
          </div>

          <h2 style={styles.title}>
            <span style={styles.titleGradient}>Student Registration</span>
          </h2>
          <p style={styles.subtitle}>
            <span style={styles.sparkle}>🎓</span>
            Create your student account
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {fields.map((field) => (
              <div key={field.name} style={styles.field}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>{field.icon}</span>
                  {field.label}
                </label>
                <div style={{
                  ...styles.inputWrapper,
                  ...(focusedField === field.name ? styles.inputWrapperFocused : {}),
                }}>
                  {field.name === "password" ? (
                    <>
                      <input
                        style={{...styles.input, paddingRight: 50}}
                        type={showPassword ? "text" : "password"}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={form[field.name]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.toggleBtn}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </>
                  ) : (
                    <input
                      style={styles.input}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                  )}
                  <div style={styles.inputGlow}></div>
                </div>
              </div>
            ))}

            {message && (
              <div style={{
                ...styles.messageBox,
                background: isSuccess ? "rgba(99, 102, 241, 0.12)" : "rgba(239, 68, 68, 0.12)",
                borderColor: isSuccess ? "rgba(99, 102, 241, 0.25)" : "rgba(239, 68, 68, 0.25)",
                color: isSuccess ? "#a5b4fc" : "#f87171",
              }}>
                <span style={styles.messageIcon}>{isSuccess ? "✅" : "❌"}</span>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setHoveredBtn(true)}
              onMouseLeave={() => setHoveredBtn(false)}
              style={{
                ...styles.submit,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                transform: hoveredBtn && !loading ? 'translateY(-3px) scale(1.02)' : 'translateY(0)',
                boxShadow: hoveredBtn && !loading
                  ? '0 20px 40px rgba(99,102,241,0.5), 0 0 0 3px rgba(99,102,241,0.2)'
                  : '0 10px 30px rgba(99, 102, 241, 0.4)',
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span style={styles.btnIcon}>🚀</span>
                  Create Account
                  <span style={styles.btnArrow}>→</span>
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
            <Link to="/Login" style={styles.link}>
              <span style={styles.linkHighlight}>Sign In</span>
              <span style={styles.linkIcon}>✨</span>
            </Link>
          </p>

          {/* Security badge */}
          <div style={styles.securityBadge}>
            <span style={styles.securityIcon}>🔐</span>
            <span style={styles.securityText}>Your data is secure with us</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        
        @keyframes float { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-25px) rotate(3deg); } 
        }
        
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes ringRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.1);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-40px) translateX(-5px) scale(0.9);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-20px) translateX(-10px) scale(1.05);
            opacity: 0.5;
          }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 50px rgba(139, 92, 246, 0.5); }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(10deg); }
        }
        
        .particle {
          animation: particleFloat 5s ease-in-out infinite;
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        
        input:focus {
          outline: none;
        }
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
    background: "linear-gradient(135deg, #0a0a1a 0%, #1a103d 40%, #0f172a 100%)",
    padding: 20,
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  bgOrb1: {
    position: "absolute",
    top: "-150px",
    right: "-100px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent 60%)",
    animation: "float 8s ease-in-out infinite",
    filter: "blur(40px)",
  },
  bgOrb2: {
    position: "absolute",
    bottom: "-150px",
    left: "-100px",
    width: "550px",
    height: "550px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(6,182,212,0.25), transparent 60%)",
    animation: "float 10s ease-in-out infinite reverse",
    filter: "blur(50px)",
  },
  bgOrb3: {
    position: "absolute",
    top: "50%",
    left: "60%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent 60%)",
    animation: "float 7s ease-in-out infinite",
    filter: "blur(35px)",
  },
  bgGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
  },
  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: "absolute",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))",
    backdropFilter: "blur(20px)",
    borderRadius: 28,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
    position: "relative",
    zIndex: 10,
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: "-2px",
    left: "-2px",
    right: "-2px",
    bottom: "-2px",
    borderRadius: 30,
    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2), rgba(6,182,212,0.3))",
    filter: "blur(15px)",
    zIndex: -1,
    animation: "glow 4s ease-in-out infinite",
  },
  cardInner: {
    padding: "45px 40px 40px",
    textAlign: "center",
  },
  iconContainer: {
    position: "relative",
    width: 85,
    height: 85,
    margin: "0 auto 25px",
  },
  iconRing: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "2px dashed rgba(99, 102, 241, 0.4)",
    animation: "ringRotate 10s linear infinite",
  },
  iconWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 70,
    height: 70,
    borderRadius: 20,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 15px 40px rgba(99, 102, 241, 0.5)",
  },
  title: {
    marginBottom: 6,
  },
  titleGradient: {
    fontSize: "1.8rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #06b6d4 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "shimmer 4s linear infinite",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  sparkle: {
    animation: "sparkle 2s ease-in-out infinite",
    display: "inline-block",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
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
    color: "rgba(255, 255, 255, 0.85)",
  },
  labelIcon: {
    marginRight: 10,
    fontSize: "1rem",
  },
  inputWrapper: {
    position: "relative",
    borderRadius: 14,
    background: "rgba(255, 255, 255, 0.06)",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  inputWrapperFocused: {
    borderColor: "#6366f1",
    background: "rgba(99, 102, 241, 0.08)",
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "0.95rem",
    border: "none",
    background: "transparent",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  toggleBtn: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
  },
  messageBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    border: "1px solid",
    borderRadius: 12,
    fontSize: "0.9rem",
  },
  messageIcon: {
    fontSize: "1rem",
  },
  submit: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    padding: "16px",
    marginTop: 8,
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: 14,
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "inherit",
  },
  btnIcon: {
    fontSize: "1.1rem",
  },
  btnArrow: {
    fontSize: "1.2rem",
    transition: "transform 0.3s ease",
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    margin: "26px 0 20px",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
  },
  dividerText: {
    fontSize: "0.85rem",
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: 500,
  },
  linkText: {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.6)",
  },
  link: {
    color: "#a5b4fc",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  linkHighlight: {
    background: "linear-gradient(135deg, #a5b4fc, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  linkIcon: {
    fontSize: "0.9rem",
    animation: "sparkle 2s ease-in-out infinite",
  },
  securityBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "20px",
    padding: "10px 16px",
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: "20px",
  },
  securityIcon: {
    fontSize: "0.9rem",
  },
  securityText: {
    fontSize: "0.8rem",
    color: "rgba(34, 197, 94, 0.8)",
    fontWeight: 500,
  },
};