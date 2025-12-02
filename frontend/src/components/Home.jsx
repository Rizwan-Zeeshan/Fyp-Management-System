import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const text = "TriNova FYP Management";
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index === text.length) {
        setTimeout(() => {
          setDisplayed("");
          setIndex(0);
        }, 2000);
      } else {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [index, text]);

  return (
    <div style={styles.container}>
      <div style={styles.bgOrb1}></div>
      <div style={styles.bgOrb2}></div>
      
      <div style={styles.content}>
        <div style={styles.badge}>🚀 Final Year Project Portal</div>
        
        <h1 style={styles.title}>
          {displayed}
          <span style={styles.cursor}>|</span>
        </h1>
        
        <p style={styles.subtitle}>
          Streamline your academic journey. Upload documents, track progress, 
          and collaborate with supervisors all in one place.
        </p>

        <div style={styles.buttons}>
          <button 
            style={styles.primaryBtn}
            onClick={() => navigate('/Login')}
          >
            Get Started →
          </button>
          <button 
            style={styles.secondaryBtn}
            onClick={() => navigate('/about')}
          >
            Learn More
          </button>
        </div>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statNum}>500+</span>
            <span style={styles.statLabel}>Students</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>50+</span>
            <span style={styles.statLabel}>Faculty</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>1000+</span>
            <span style={styles.statLabel}>Projects</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
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
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },
  bgOrb1: {
    position: "absolute",
    top: "-100px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)",
    animation: "float 6s ease-in-out infinite",
  },
  bgOrb2: {
    position: "absolute",
    bottom: "-150px",
    left: "-100px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)",
    animation: "float 8s ease-in-out infinite reverse",
  },
  content: {
    textAlign: "center",
    zIndex: 10,
    padding: "40px",
  },
  badge: {
    display: "inline-block",
    padding: "8px 20px",
    background: "rgba(99,102,241,0.2)",
    border: "1px solid rgba(99,102,241,0.4)",
    borderRadius: "50px",
    color: "#a5b4fc",
    fontSize: "0.9rem",
    marginBottom: "24px",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #fff, #a5b4fc, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "20px",
    minHeight: "80px",
  },
  cursor: {
    animation: "pulse 1s infinite",
    color: "#6366f1",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.6)",
    maxWidth: "500px",
    margin: "0 auto 32px",
    lineHeight: 1.7,
  },
  buttons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginBottom: "48px",
  },
  primaryBtn: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(99,102,241,0.4)",
  },
  secondaryBtn: {
    padding: "14px 32px",
    background: "transparent",
    border: "2px solid rgba(255,255,255,0.2)",
    borderRadius: "12px",
    color: "white",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  stats: {
    display: "flex",
    gap: "48px",
    justifyContent: "center",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
  },
  statNum: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "white",
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.5)",
  },
};

export default Home;
