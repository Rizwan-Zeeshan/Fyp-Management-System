import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Start countdown for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.bgDecor1}></div>
      <div style={styles.bgDecor2}></div>
      <div style={styles.bgDecor3}></div>

      <div style={styles.card}>
        <div style={{
          ...styles.iconWrapper,
          background: 'linear-gradient(135deg, #10b981, #34d399)'
        }}>
          <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>

        <h2 style={styles.title}>Logged out successfully!</h2>
        <p style={styles.subtitle}>
          Redirecting to home page in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>

        <div style={styles.progressContainer}>
          <div style={{
            ...styles.progressBar,
            animation: 'progressAnimation 3s linear forwards'
          }}></div>
        </div>

        <div style={styles.buttonContainer}>
          <button 
            style={styles.loginBtn}
            onClick={() => navigate('/Login')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Login Again
          </button>
          <button 
            style={styles.homeBtn}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Go to Home Now
          </button>
        </div>
      </div>

      <style>{`
        @keyframes progressAnimation {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgDecor1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
    animation: "float 6s ease-in-out infinite",
  },
  bgDecor2: {
    position: "absolute",
    bottom: "-15%",
    left: "-10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, transparent 70%)",
    animation: "float 8s ease-in-out infinite reverse",
  },
  bgDecor3: {
    position: "absolute",
    top: "40%",
    left: "60%",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
    animation: "pulse 4s ease-in-out infinite",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    padding: "50px 60px",
    textAlign: "center",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(16, 185, 129, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    zIndex: 10,
    minWidth: "340px",
  },
  iconWrapper: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 28px",
    boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4)",
    transition: "all 0.5s ease",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "10px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#64748b",
    marginBottom: "32px",
    fontWeight: 400,
  },
  progressContainer: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e2e8f0",
    borderRadius: "100px",
    overflow: "hidden",
    marginBottom: "28px",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #10b981, #34d399, #06b6d4)",
    borderRadius: "100px",
    width: "0%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },
  loginBtn: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
  },
  homeBtn: {
    padding: "12px 32px",
    background: "transparent",
    border: "2px solid #6366f1",
    borderRadius: "12px",
    color: "#6366f1",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};
