// src/components/About.js
import React, { useState } from "react";

export function About() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const teamMembers = [
    {
      name: "Muhammad Rizwan",
      role: "Frontend Developer",
      passion: "Building scalable web applications & solving complex problems",
      skills: ["React", "Spring Boot", "Database Design"],
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      shadowColor: "rgba(99, 102, 241, 0.4)",
      icon: "💻",
    },
    {
      name: "Ahmad Ali",
      role: "App Developer",
      passion: "Creating mobile applications & system architecture",
      skills: ["Java", "REST APIs", "Security", "Flutter"],
      gradient: "linear-gradient(135deg, #ec4899, #f97316)",
      shadowColor: "rgba(236, 72, 153, 0.4)",
      icon: "📱",
    },
    {
      name: "Faseeh Ur Rehman",
      role: "Backend Developer",
      passion: "Designing robust backend systems & APIs",
      skills: ["UI/UX", "Python", "Django"],
      gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)",
      shadowColor: "rgba(20, 184, 166, 0.4)",
      icon: "⚙️",
    },
  ];

  const features = [
    {
      icon: "📄",
      title: "Document Management",
      text: "Upload proposals, designs, tests & thesis with ease",
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    },
    {
      icon: "💬",
      title: "Real-time Feedback",
      text: "Get supervisor feedback instantly on submissions",
      gradient: "linear-gradient(135deg, #22c55e, #10b981)",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      text: "Monitor your FYP journey from start to finish",
      gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    },
    {
      icon: "🔒",
      title: "Secure Platform",
      text: "Role-based access for students & faculty",
      gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
    },
  ];

  return (
    <section id="about" style={styles.section}>
      {/* Animated Background */}
      <div style={styles.bgContainer}>
        <div style={styles.bgDecor1}></div>
        <div style={styles.bgDecor2}></div>
        <div style={styles.bgDecor3}></div>
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
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.taglineContainer}>
            <span style={styles.taglineIcon}>✨</span>
            <span style={styles.tagline}>WHO WE ARE</span>
            <span style={styles.taglineIcon}>✨</span>
          </div>
          <h1 style={styles.title}>
            Meet The <span style={styles.titleHighlight}>Creative Minds</span>
          </h1>
          <h2 style={styles.subtitle}>Behind FYP Management System</h2>
          <p style={styles.description}>
            Three passionate developers united by a common goal — to revolutionize 
            how Final Year Projects are managed, submitted, and evaluated. We believe 
            in creating technology that makes academic life simpler and more efficient.
          </p>
          <div style={styles.headerDecoration}>
            <div style={styles.decorLine}></div>
            <div style={styles.decorDot}></div>
            <div style={styles.decorLine}></div>
          </div>
        </div>

        {/* Mission Statement */}
        <div style={styles.missionBox}>
          <div style={styles.missionIcon}>🎯</div>
          <h3 style={styles.missionTitle}>Our Mission</h3>
          <p style={styles.missionText}>
            "To bridge the gap between students and faculty through an intuitive platform 
            that streamlines document submissions, feedback, and project tracking — 
            empowering the next generation of innovators."
          </p>
          <div style={styles.missionGlow}></div>
        </div>

        {/* Team Cards */}
        <div style={styles.teamSection}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>👥</span>
            The Dream Team
          </h3>
          <div style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  ...styles.teamCard,
                  transform: hoveredCard === index ? 'translateY(-15px) scale(1.02)' : 'translateY(0)',
                  boxShadow: hoveredCard === index 
                    ? `0 30px 60px ${member.shadowColor}, 0 0 0 2px rgba(255, 255, 255, 0.1)`
                    : '0 20px 40px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Glow Effect */}
                <div style={{
                  ...styles.cardGlow,
                  background: member.gradient,
                  opacity: hoveredCard === index ? 0.15 : 0,
                }}></div>

                {/* Avatar */}
                <div style={styles.avatarContainer}>
                  <div style={{...styles.avatar, background: member.gradient}}>
                    <span style={styles.avatarText}>{member.name.charAt(0)}</span>
                  </div>
                  <div style={{...styles.avatarRing, borderColor: member.gradient.includes('#6366f1') ? '#6366f1' : member.gradient.includes('#ec4899') ? '#ec4899' : '#14b8a6'}}></div>
                  <span style={styles.memberIcon}>{member.icon}</span>
                </div>
                
                {/* Name & Role */}
                <h3 style={styles.memberName}>{member.name}</h3>
                <span style={{...styles.memberRole, background: member.gradient}}>
                  {member.role}
                </span>
                
                {/* Passion */}
                <p style={styles.memberPassion}>
                  <span style={styles.quoteIcon}>"</span>
                  {member.passion}
                  <span style={styles.quoteIcon}>"</span>
                </p>
                
                {/* Skills Box */}
                <div style={styles.skillsBox}>
                  <div style={styles.skillsHeader}>
                    <span style={styles.skillsIcon}>⚡</span>
                    <span style={styles.skillsTitle}>Tech Stack</span>
                  </div>
                  <div style={styles.skillsContainer}>
                    {member.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        style={{
                          ...styles.skillBadge,
                          background: member.gradient,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What We Do Section */}
        <div style={styles.whatWeDo}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🚀</span>
            What We Built
          </h3>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  ...styles.featureItem,
                  transform: hoveredFeature === index ? 'translateY(-10px) scale(1.03)' : 'translateY(0)',
                  boxShadow: hoveredFeature === index
                    ? '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(99, 102, 241, 0.2)'
                    : '0 10px 30px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div style={{
                  ...styles.featureIconContainer,
                  background: hoveredFeature === index ? feature.gradient : 'rgba(255, 255, 255, 0.1)',
                }}>
                  <span style={styles.featureIcon}>{feature.icon}</span>
                </div>
                <h4 style={styles.featureTitle}>{feature.title}</h4>
                <p style={styles.featureText}>{feature.text}</p>
                <div style={{
                  ...styles.featureBar,
                  background: feature.gradient,
                  transform: hoveredFeature === index ? 'scaleX(1)' : 'scaleX(0)',
                }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>3</span>
            <span style={styles.statLabel}>Team Members</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>∞</span>
            <span style={styles.statLabel}>Passion</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>100%</span>
            <span style={styles.statLabel}>Dedication</span>
          </div>
        </div>

        {/* Quote */}
        <div style={styles.quoteSection}>
          <div style={styles.quoteDecor}>"</div>
          <p style={styles.bigQuote}>
            Code is like humor. When you have to explain it, it's bad.
          </p>
          <span style={styles.quoteAuthor}>— Cory House</span>
          <div style={styles.quoteGlow}></div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.1);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-40px) translateX(-5px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-20px) translateX(-10px) scale(1.05);
            opacity: 0.7;
          }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .particle {
          animation: particleFloat 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "100px 20px",
    background: "linear-gradient(135deg, #0a0a1a 0%, #1a103d 40%, #0f172a 100%)",
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  bgDecor1: {
    position: "absolute",
    top: "-20%",
    right: "-10%",
    width: "700px",
    height: "700px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 60%)",
    animation: "float 8s ease-in-out infinite",
    filter: "blur(40px)",
  },
  bgDecor2: {
    position: "absolute",
    bottom: "-20%",
    left: "-15%",
    width: "800px",
    height: "800px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 60%)",
    animation: "float 10s ease-in-out infinite reverse",
    filter: "blur(50px)",
  },
  bgDecor3: {
    position: "absolute",
    top: "30%",
    left: "60%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 60%)",
    animation: "pulse 6s ease-in-out infinite",
    filter: "blur(30px)",
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
  content: {
    maxWidth: "1300px",
    position: "relative",
    zIndex: 10,
  },
  header: {
    marginBottom: "80px",
  },
  taglineContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "25px",
  },
  taglineIcon: {
    fontSize: "1.2rem",
  },
  tagline: {
    display: "inline-block",
    padding: "10px 28px",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))",
    borderRadius: "50px",
    color: "#a5b4fc",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "4rem",
    fontWeight: 900,
    color: "#ffffff",
    marginBottom: "15px",
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
  },
  titleHighlight: {
    background: "linear-gradient(135deg, #6366f1, #ec4899, #f59e0b)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "shimmer 3s linear infinite",
  },
  subtitle: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "30px",
  },
  description: {
    fontSize: "1.2rem",
    lineHeight: 1.9,
    color: "rgba(255, 255, 255, 0.6)",
    maxWidth: "800px",
    margin: "0 auto 30px",
  },
  headerDecoration: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
  },
  decorLine: {
    width: "80px",
    height: "3px",
    background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
    borderRadius: "3px",
  },
  decorDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #ec4899)",
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)",
  },
  missionBox: {
    position: "relative",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))",
    backdropFilter: "blur(20px)",
    borderRadius: "30px",
    padding: "50px",
    marginBottom: "80px",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    overflow: "hidden",
  },
  missionIcon: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  missionTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "20px",
  },
  missionText: {
    fontSize: "1.2rem",
    fontStyle: "italic",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 2,
    maxWidth: "800px",
    margin: "0 auto",
  },
  missionGlow: {
    position: "absolute",
    top: "-50%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(40px)",
  },
  teamSection: {
    marginBottom: "80px",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "50px",
  },
  sectionIcon: {
    fontSize: "2rem",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "35px",
  },
  teamCard: {
    position: "relative",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))",
    borderRadius: "30px",
    padding: "45px 35px",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    cursor: "default",
  },
  cardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: "opacity 0.4s ease",
    borderRadius: "30px",
  },
  avatarContainer: {
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto 25px",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 15px 35px rgba(99, 102, 241, 0.35)",
    position: "relative",
    zIndex: 2,
  },
  avatarRing: {
    position: "absolute",
    top: "-5px",
    left: "-5px",
    right: "-5px",
    bottom: "-5px",
    borderRadius: "50%",
    border: "3px dashed",
    opacity: 0.5,
    animation: "rotate 20s linear infinite",
  },
  avatarText: {
    fontSize: "2.8rem",
    fontWeight: 800,
    color: "white",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  },
  memberIcon: {
    position: "absolute",
    bottom: "-5px",
    right: "-5px",
    fontSize: "1.8rem",
    background: "white",
    borderRadius: "50%",
    padding: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    zIndex: 3,
  },
  memberName: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "12px",
    position: "relative",
    zIndex: 2,
  },
  memberRole: {
    display: "inline-block",
    padding: "8px 22px",
    borderRadius: "50px",
    color: "white",
    fontSize: "0.9rem",
    fontWeight: 600,
    marginBottom: "25px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
    position: "relative",
    zIndex: 2,
  },
  memberPassion: {
    fontSize: "1rem",
    color: "#64748b",
    fontStyle: "italic",
    marginBottom: "25px",
    lineHeight: 1.7,
    position: "relative",
    zIndex: 2,
  },
  quoteIcon: {
    color: "#6366f1",
    fontWeight: 700,
    fontSize: "1.2rem",
  },
  skillsBox: {
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderRadius: "20px",
    padding: "22px",
    border: "2px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(255, 255, 255, 0.8)",
    position: "relative",
    zIndex: 2,
  },
  skillsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "18px",
    paddingBottom: "15px",
    borderBottom: "2px dashed #cbd5e1",
  },
  skillsIcon: {
    fontSize: "1.3rem",
  },
  skillsTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
  },
  skillBadge: {
    padding: "10px 20px",
    borderRadius: "14px",
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "white",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
  },
  whatWeDo: {
    marginBottom: "80px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "28px",
  },
  featureItem: {
    position: "relative",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px 28px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "default",
    overflow: "hidden",
  },
  featureIconContainer: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    transition: "all 0.3s ease",
  },
  featureIcon: {
    fontSize: "2.2rem",
  },
  featureTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: "12px",
  },
  featureText: {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 1.7,
  },
  featureBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
    transformOrigin: "left",
    transition: "transform 0.4s ease",
  },
  statsSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "50px",
    padding: "50px",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))",
    borderRadius: "30px",
    marginBottom: "80px",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    backdropFilter: "blur(10px)",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  statNumber: {
    fontSize: "3rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #6366f1, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  statLabel: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  statDivider: {
    width: "2px",
    height: "60px",
    background: "linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.5), transparent)",
    borderRadius: "2px",
  },
  quoteSection: {
    position: "relative",
    padding: "60px 50px",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.1))",
    borderRadius: "30px",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    overflow: "hidden",
  },
  quoteDecor: {
    position: "absolute",
    top: "20px",
    left: "30px",
    fontSize: "8rem",
    fontWeight: 900,
    color: "rgba(99, 102, 241, 0.15)",
    lineHeight: 1,
    fontFamily: "Georgia, serif",
  },
  bigQuote: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#ffffff",
    fontStyle: "italic",
    marginBottom: "20px",
    lineHeight: 1.6,
    position: "relative",
    zIndex: 2,
  },
  quoteAuthor: {
    fontSize: "1.1rem",
    color: "#a5b4fc",
    fontWeight: 600,
    position: "relative",
    zIndex: 2,
  },
  quoteGlow: {
    position: "absolute",
    bottom: "-50px",
    right: "-50px",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
    borderRadius: "50%",
    filter: "blur(40px)",
  },
};

export default About;