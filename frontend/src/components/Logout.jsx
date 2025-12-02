import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function Logout() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Checking session...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlreadyLoggedOut, setIsAlreadyLoggedOut] = useState(false);

  useEffect(() => {
    const performLogout = async () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      
      if (!isAuthenticated || isAuthenticated !== "true") {
        setIsAlreadyLoggedOut(true);
        setStatus("You are already logged out!");
        
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/student/status`, {
          withCredentials: true,
        });

        setStatus("Logging out...");
        
        try {
          await axios.post(
            `${API_BASE_URL}/auth/logout`,
            {},
            {
              withCredentials: true,
            }
          );
        } catch (logoutErr) {}

        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        setIsSuccess(true);
        setStatus("Logged out successfully!");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setIsAlreadyLoggedOut(true);
          setStatus("You are already logged out!");
          
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
        } else {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");

          setIsSuccess(true);
          setStatus("Logged out successfully!");

          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.bgDecor1}></div>
      <div style={styles.bgDecor2}></div>
      <div style={styles.bgDecor3}></div>

      <div style={styles.card}>
        <div style={{
          ...styles.iconWrapper,
          background: isSuccess 
            ? 'linear-gradient(135deg, #10b981, #34d399)' 
            : isAlreadyLoggedOut
            ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        }}>
          {isSuccess ? (
            <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          ) : isAlreadyLoggedOut ? (
            <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
          )}
        </div>

        <h2 style={styles.title}>{status}</h2>
        <p style={styles.subtitle}>
          {isSuccess 
            ? "Redirecting you to home page..." 
            : isAlreadyLoggedOut 
            ? "Please login first to access the system."
            : "Please wait a moment..."}
        </p>

        {!isAlreadyLoggedOut && (
          <div style={styles.progressContainer}>
            <div style={{
              ...styles.progressBar,
              animation: 'progressAnimation 2s ease-in-out forwards'
            }}></div>
          </div>
        )}

        {isAlreadyLoggedOut && (
          <div style={styles.buttonContainer}>
            <button 
              style={styles.loginBtn}
              onClick={() => navigate('/Login')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Go to Login
            </button>
            <button 
              style={styles.homeBtn}
              onClick={() => navigate('/')}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Back to Home
            </button>
          </div>
        )}

        {!isAlreadyLoggedOut && (
          <div style={styles.dotsContainer}>
            <span style={{...styles.dot, animationDelay: '0s'}}></span>
            <span style={{...styles.dot, animationDelay: '0.2s'}}></span>
            <span style={{...styles.dot, animationDelay: '0.4s'}}></span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes progressAnimation {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
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
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
    animation: "float 6s ease-in-out infinite",
  },
  bgDecor2: {
    position: "absolute",
    bottom: "-15%",
    left: "-10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
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
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(99, 102, 241, 0.2)",
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
    boxShadow: "0 15px 35px rgba(99, 102, 241, 0.4)",
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
    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
    borderRadius: "100px",
    width: "0%",
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    animation: "bounce 1.4s ease-in-out infinite",
    display: "inline-block",
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
