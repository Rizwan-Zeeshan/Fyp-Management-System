import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

export default function Dashboard1() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    graded: false,
  });
  const [loading, setLoading] = useState(true);
  const [deadlines, setDeadlines] = useState([]);
  const [finalGrade, setFinalGrade] = useState(null);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 17) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/student/mysubmissions`, {
          withCredentials: true,
        });
        const rawData = response.data || [];
        console.log('Dashboard1 - Raw Data:', rawData);
        
        // API returns { submission: {...}, feedbacks: [...] } objects
        // Extract the actual submission objects
        const submissions = rawData.map(item => item.submission || item);
        
        console.log('Dashboard1 - Extracted Submissions:', submissions);
        
        const total = submissions.length;
        
        // Count approved submissions
        const approved = submissions.filter(s => {
          const val = s.is_approved;
          // If value is explicitly false, 0, "0", "false", null, undefined => not approved
          if (val === false || val === 0 || val === "0" || val === "false" || val === null || val === undefined) {
            return false;
          }
          return true;
        }).length;
        
        // Pending = not approved yet
        const pending = total - approved;
        
        setStats(prev => ({ ...prev, total, pending }));
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setStats(prev => ({ ...prev, total: 0, pending: 0 }));
      } finally {
        setLoading(false);
      }
    };

    // Fetch grade status from the grades endpoint
    const fetchGradeStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/student/mygrades`, {
          withCredentials: true,
        });
        // If we get a response, grades have been released and student has a grade
        if (response.data && response.data.grade) {
          setStats(prev => ({ ...prev, graded: true }));
          setFinalGrade(response.data.grade);
        }
      } catch (error) {
        // Grades not released yet or no grade assigned - this is expected
        console.log('Grades not available:', error.response?.data || error.message);
        setStats(prev => ({ ...prev, graded: false }));
        setFinalGrade(null);
      }
    };

    const fetchDeadlines = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/student/deadlines`, {
          withCredentials: true,
        });
        const deadlineData = response.data || [];
        
        // Remove duplicates based on doc_type (keep only one per type)
        const uniqueDeadlines = deadlineData.reduce((acc, current) => {
          const exists = acc.find(item => item.doc_type === current.doc_type);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
        
        // Map to friendly names
        const deadlineMap = {
          'Proposal': { name: 'Proposal', icon: '📄' },
          'Design Document': { name: 'Design Document', icon: '📐' },
          'Test Document': { name: 'Test Document', icon: '🧪' },
          'Thesis': { name: 'Thesis', icon: '📚' }
        };
        const formattedDeadlines = uniqueDeadlines.map(d => ({
          ...d,
          displayName: deadlineMap[d.doc_type]?.name || d.doc_type,
          icon: deadlineMap[d.doc_type]?.icon || '📄'
        }));
        setDeadlines(formattedDeadlines);
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      }
    };

    updateGreeting();
    updateTime();
    fetchSubmissions();
    fetchDeadlines();
    fetchGradeStatus();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const userName = localStorage.getItem('userId') || 'Student';

  const statsData = [
    { label: 'Documents', value: loading ? '...' : stats.total.toString(), icon: '📄', color: '#6366f1' },
    { label: 'Pending', value: loading ? '...' : stats.pending.toString(), icon: '⏳', color: '#f59e0b' },
    { label: 'Final Grade', value: loading ? '...' : (stats.graded ? finalGrade : 'Not Released'), icon: stats.graded ? '🎓' : '🔒', color: stats.graded ? '#10b981' : '#6b7280' },
  ];

  const quickActions = [
    {
      title: 'Upload Documents',
      description: 'Submit your FYP documents, proposals, and reports securely',
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      shadowColor: 'rgba(99, 102, 241, 0.5)',
      route: '/upload-document',
    },
    {
      title: 'Submission History',
      description: 'Track all your previous submissions and their status',
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      shadowColor: 'rgba(6, 182, 212, 0.5)',
      route: '/submission-history',
    },
    {
      title: 'View Grades',
      description: 'Check your grades and feedback from supervisors',
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      shadowColor: 'rgba(16, 185, 129, 0.5)',
      route: '/view-grades',
    },
  ];

  return (
    <div style={styles.container}>
      {/* Animated Background Elements */}
      <div style={styles.bgOrb1}></div>
      <div style={styles.bgOrb2}></div>
      <div style={styles.bgOrb3}></div>
      <div style={styles.gridPattern}></div>

      <div style={styles.dashboard}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.timeDisplay}>
              <span style={styles.timeIcon}>🕐</span>
              <span style={styles.timeText}>{currentTime}</span>
            </div>
            <h1 style={styles.greeting}>{greeting},</h1>
            <h2 style={styles.userName}>{userName}! 👋</h2>
            <p style={styles.subtitle}>Here's your FYP progress overview</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.avatarWrapper}>
              <div style={styles.avatarRing}>
                <div style={styles.avatar}>
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              <div style={styles.statusDot}></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsRow}>
          {statsData.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statInfo}>
                <span style={{...styles.statValue, color: stat.color}}>{stat.value}</span>
                <span style={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Deadlines Section */}
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📅</span>
            Upcoming Deadlines
          </h3>
          <p style={styles.sectionSubtitle}>Keep track of your document submission deadlines</p>
        </div>

        <div style={styles.deadlinesGrid}>
          {deadlines.length > 0 ? (
            deadlines.map((deadline, index) => {
              const deadlineDate = deadline.deadline_date ? new Date(deadline.deadline_date) : null;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const daysLeft = deadlineDate ? Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)) : null;
              
              let statusColor = '#10b981'; // green
              let statusText = 'On Track';
              if (daysLeft !== null) {
                if (daysLeft < 0) {
                  statusColor = '#ef4444'; // red
                  statusText = 'Overdue';
                } else if (daysLeft <= 7) {
                  statusColor = '#f59e0b'; // orange
                  statusText = 'Due Soon';
                }
              }
              
              return (
                <div key={index} style={styles.deadlineCard}>
                  <div style={styles.deadlineIcon}>{deadline.icon}</div>
                  <div style={styles.deadlineInfo}>
                    <h4 style={styles.deadlineName}>{deadline.displayName}</h4>
                    <p style={styles.deadlineDate}>
                      {deadlineDate ? deadlineDate.toLocaleDateString('en-US', { 
                        weekday: 'short',
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Not Set'}
                    </p>
                  </div>
                  <div style={styles.deadlineStatus}>
                    <span style={{...styles.statusBadge, background: `${statusColor}20`, color: statusColor}}>
                      {daysLeft !== null ? (daysLeft < 0 ? `${Math.abs(daysLeft)} days ago` : daysLeft === 0 ? 'Today' : `${daysLeft} days left`) : statusText}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={styles.noDeadlines}>
              <span style={styles.noDeadlinesIcon}>📭</span>
              <p style={styles.noDeadlinesText}>No deadlines set yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>⚡</span>
            Quick Actions
          </h3>
          <p style={styles.sectionSubtitle}>What would you like to do today?</p>
        </div>

        <div style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <div
              key={index}
              style={styles.actionCard}
              onClick={() => navigate(action.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 30px 60px ${action.shadowColor}`;
                e.currentTarget.querySelector('.card-glow').style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                e.currentTarget.querySelector('.card-glow').style.opacity = '0';
              }}
            >
              <div className="card-glow" style={{...styles.cardGlow, background: action.gradient}}></div>
              <div style={styles.cardContent}>
                <div style={{...styles.iconBox, background: action.gradient, boxShadow: `0 10px 30px ${action.shadowColor}`}}>
                  {action.icon}
                </div>
                <h4 style={styles.cardTitle}>{action.title}</h4>
                <p style={styles.cardDescription}>{action.description}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.cardLink}>Get Started</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={styles.arrowIcon}>
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div style={styles.tipsCard}>
          <div style={styles.tipsIcon}>💡</div>
          <div style={styles.tipsContent}>
            <h4 style={styles.tipsTitle}>Pro Tip</h4>
            <p style={styles.tipsText}>
              Upload your documents regularly to keep your supervisor updated on your progress. 
              Early submissions often receive more detailed feedback!
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.8); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '40px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgOrb1: {
    position: 'absolute',
    top: '-100px',
    right: '-50px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent 70%)',
    animation: 'float 8s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-150px',
    left: '-100px',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%)',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  bgOrb3: {
    position: 'absolute',
    top: '40%',
    left: '60%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent 70%)',
    animation: 'pulse 6s ease-in-out infinite',
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
  },
  dashboard: {
    maxWidth: '1000px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  headerLeft: {},
  timeDisplay: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50px',
    marginBottom: '16px',
  },
  timeIcon: {
    fontSize: '1rem',
  },
  timeText: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  greeting: {
    fontSize: '1.2rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  userName: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'white',
    margin: '4px 0 12px',
    background: 'linear-gradient(135deg, #ffffff, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  headerRight: {},
  avatarWrapper: {
    position: 'relative',
  },
  avatarRing: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    padding: '4px',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4, #10b981)',
    animation: 'glow 3s ease-in-out infinite',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e293b, #334155)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  statusDot: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#10b981',
    border: '3px solid #1e293b',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '50px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  statIcon: {
    fontSize: '2rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 800,
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 500,
  },
  sectionHeader: {
    marginBottom: '24px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'white',
    margin: '0 0 8px',
  },
  sectionIcon: {
    fontSize: '1.2rem',
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  actionCard: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    opacity: 0,
    transition: 'opacity 400ms ease',
  },
  cardContent: {
    padding: '32px 28px',
    position: 'relative',
  },
  iconBox: {
    width: '64px',
    height: '64px',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'white',
    margin: '0 0 10px',
  },
  cardDescription: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.6,
    margin: '0 0 20px',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardLink: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#a5b4fc',
  },
  arrowIcon: {
    color: '#a5b4fc',
    transition: 'transform 200ms ease',
  },
  tipsCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1))',
    borderRadius: '20px',
    padding: '24px 28px',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  tipsIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  tipsContent: {},
  tipsTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'white',
    margin: '0 0 8px',
  },
  tipsText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.7,
    margin: 0,
  },
  deadlinesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '40px',
  },
  deadlineCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'all 300ms ease',
  },
  deadlineIcon: {
    fontSize: '2rem',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(99, 102, 241, 0.2)',
    borderRadius: '12px',
    flexShrink: 0,
  },
  deadlineInfo: {
    flex: 1,
    minWidth: 0,
  },
  deadlineName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'white',
    margin: '0 0 4px',
  },
  deadlineDate: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  deadlineStatus: {
    flexShrink: 0,
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  noDeadlines: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  noDeadlinesIcon: {
    fontSize: '3rem',
    marginBottom: '12px',
  },
  noDeadlinesText: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
};