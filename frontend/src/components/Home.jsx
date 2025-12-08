import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const text = "TriNova FYP Management";
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

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

  const features = [
    { icon: "📄", title: "Document Upload", desc: "Submit your work easily" },
    { icon: "💬", title: "Instant Feedback", desc: "Get real-time reviews" },
    { icon: "📊", title: "Track Progress", desc: "Monitor your journey" },
  ];

  const stats = [
    { num: "500+", label: "Students", icon: "🎓", color: "#6366f1" },
    { num: "50+", label: "Faculty", icon: "👨‍🏫", color: "#ec4899" },
    { num: "1000+", label: "Projects", icon: "📁", color: "#06b6d4" },
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
          {[...Array(25)].map((_, i) => (
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
      
      <div style={styles.content}>
        {/* Badge */}
        <div style={styles.badgeContainer}>
          <span style={styles.badgeIcon}>🚀</span>
          <span style={styles.badge}>Final Year Project Portal</span>
          <span style={styles.badgeGlow}></span>
        </div>
        
        {/* Main Title */}
        <h1 style={styles.title}>
          <span style={styles.titlePrefix}>Welcome to</span>
          <span style={styles.titleMain}>
            {displayed}
            <span style={styles.cursor}>|</span>
          </span>
        </h1>
        
        {/* Subtitle */}
        <p style={styles.subtitle}>
          Streamline your academic journey. Upload documents, track progress, 
          and collaborate with supervisors all in one powerful platform.
        </p>

        {/* Buttons */}
        <div style={styles.buttons}>
          <button 
            style={{
              ...styles.primaryBtn,
              transform: hoveredBtn === 'primary' ? 'translateY(-4px) scale(1.02)' : 'translateY(0)',
              boxShadow: hoveredBtn === 'primary' 
                ? '0 20px 40px rgba(99,102,241,0.5), 0 0 0 2px rgba(99,102,241,0.3)'
                : '0 10px 30px rgba(99,102,241,0.4)',
            }}
            onClick={() => navigate('/Login')}
            onMouseEnter={() => setHoveredBtn('primary')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <span style={styles.btnIcon}>✨</span>
            Get Started
            <span style={styles.btnArrow}>→</span>
          </button>
          <button 
            style={{
              ...styles.secondaryBtn,
              background: hoveredBtn === 'secondary' 
                ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))'
                : 'transparent',
              borderColor: hoveredBtn === 'secondary' ? '#6366f1' : 'rgba(255,255,255,0.2)',
              transform: hoveredBtn === 'secondary' ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onClick={() => navigate('/about')}
            onMouseEnter={() => setHoveredBtn('secondary')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <span style={styles.btnIcon}>📖</span>
            Learn More
          </button>
        </div>

        {/* Features Row */}
        <div style={styles.featuresRow}>
          {features.map((feature, i) => (
            <div key={i} style={styles.featureItem}>
              <span style={styles.featureIcon}>{feature.icon}</span>
              <div style={styles.featureText}>
                <span style={styles.featureTitle}>{feature.title}</span>
                <span style={styles.featureDesc}>{feature.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          {stats.map((stat, i) => (
            <div 
              key={i}
              style={{
                ...styles.stat,
                transform: hoveredStat === i ? 'translateY(-8px) scale(1.05)' : 'translateY(0)',
                boxShadow: hoveredStat === i 
                  ? `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${stat.color}40`
                  : '0 10px 30px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <span style={styles.statIcon}>{stat.icon}</span>
              <span style={{...styles.statNum, color: stat.color}}>{stat.num}</span>
              <span style={styles.statLabel}>{stat.label}</span>
              <div style={{
                ...styles.statBar,
                background: `linear-gradient(90deg, ${stat.color}, transparent)`,
              }}></div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div style={styles.scrollIndicator}>
          <div style={styles.scrollMouse}>
            <div style={styles.scrollWheel}></div>
          </div>
          <span style={styles.scrollText}>Scroll to explore</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes pulse { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0; } 
        }
        
        @keyframes float { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-30px) rotate(5deg); } 
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.5;
          }
          25% {
            transform: translateY(-25px) translateX(15px) scale(1.2);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-50px) translateX(-10px) scale(0.8);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-25px) translateX(-15px) scale(1.1);
            opacity: 0.6;
          }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        
        @keyframes scrollAnim {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .particle {
          animation: particleFloat 5s ease-in-out infinite;
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
    background: "linear-gradient(135deg, #0a0a1a 0%, #1a103d 40%, #0f172a 100%)",
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
    right: "-150px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent 60%)",
    animation: "float 8s ease-in-out infinite",
    filter: "blur(40px)",
  },
  bgOrb2: {
    position: "absolute",
    bottom: "-200px",
    left: "-150px",
    width: "700px",
    height: "700px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(6,182,212,0.2), transparent 60%)",
    animation: "float 10s ease-in-out infinite reverse",
    filter: "blur(50px)",
  },
  bgOrb3: {
    position: "absolute",
    top: "40%",
    left: "60%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236,72,153,0.15), transparent 60%)",
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
    backgroundSize: "60px 60px",
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
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
  },
  content: {
    textAlign: "center",
    zIndex: 10,
    padding: "40px",
    maxWidth: "1000px",
  },
  badgeContainer: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 28px",
    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "50px",
    marginBottom: "30px",
    backdropFilter: "blur(10px)",
  },
  badgeIcon: {
    fontSize: "1.2rem",
  },
  badge: {
    color: "#a5b4fc",
    fontSize: "0.95rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
  badgeGlow: {
    position: "absolute",
    top: "-2px",
    left: "-2px",
    right: "-2px",
    bottom: "-2px",
    borderRadius: "50px",
    background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2))",
    filter: "blur(8px)",
    zIndex: -1,
    animation: "glow 3s ease-in-out infinite",
  },
  title: {
    marginBottom: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  titlePrefix: {
    fontSize: "1.3rem",
    fontWeight: 500,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  titleMain: {
    fontSize: "4rem",
    fontWeight: 900,
    background: "linear-gradient(135deg, #fff 0%, #a5b4fc 40%, #06b6d4 80%, #ec4899 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    minHeight: "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "shimmer 4s linear infinite",
    letterSpacing: "-0.02em",
  },
  cursor: {
    animation: "pulse 1s infinite",
    WebkitTextFillColor: "#6366f1",
    marginLeft: "2px",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "rgba(255,255,255,0.6)",
    maxWidth: "600px",
    margin: "0 auto 40px",
    lineHeight: 1.9,
  },
  buttons: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginBottom: "50px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 36px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "16px",
    color: "white",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "inherit",
  },
  secondaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 36px",
    background: "transparent",
    border: "2px solid rgba(255,255,255,0.2)",
    borderRadius: "16px",
    color: "white",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "inherit",
  },
  btnIcon: {
    fontSize: "1.2rem",
  },
  btnArrow: {
    fontSize: "1.2rem",
    transition: "transform 0.3s ease",
  },
  featuresRow: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginBottom: "50px",
    flexWrap: "wrap",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
  },
  featureIcon: {
    fontSize: "1.8rem",
  },
  featureText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "2px",
  },
  featureTitle: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#fff",
  },
  featureDesc: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.5)",
  },
  stats: {
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    marginBottom: "50px",
    flexWrap: "wrap",
  },
  stat: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "30px 40px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "default",
    overflow: "hidden",
    minWidth: "150px",
  },
  statIcon: {
    fontSize: "2rem",
    marginBottom: "5px",
  },
  statNum: {
    fontSize: "2.5rem",
    fontWeight: 800,
    transition: "color 0.3s ease",
  },
  statLabel: {
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.6)",
    fontWeight: 500,
  },
  statBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
  },
  scrollIndicator: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    animation: "bounce 2s ease-in-out infinite",
  },
  scrollMouse: {
    width: "26px",
    height: "42px",
    borderRadius: "13px",
    border: "2px solid rgba(255,255,255,0.3)",
    display: "flex",
    justifyContent: "center",
    paddingTop: "8px",
  },
  scrollWheel: {
    width: "4px",
    height: "10px",
    borderRadius: "2px",
    background: "rgba(255,255,255,0.5)",
    animation: "scrollAnim 1.5s ease-in-out infinite",
  },
  scrollText: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
};

export default Home;
