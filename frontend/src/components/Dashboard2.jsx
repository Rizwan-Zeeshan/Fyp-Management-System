import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

export default function Dashboard2() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubmissions: 0,
    pendingReview: 0,
  });
  const [facultyRole, setFacultyRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Check if user is authorized (Supervisor only)
  useEffect(() => {
    const checkAuthorization = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const userRole = localStorage.getItem('userRole');
      
      console.log('Checking authorization - isAuthenticated:', isAuthenticated, 'userRole:', userRole);
      
      if (!isAuthenticated || isAuthenticated !== 'true') {
        // Not logged in, redirect to login
        navigate('/facLogin');
        return;
      }
      
      // Check if user is a Supervisor
      if (userRole && userRole.toLowerCase() === 'supervisor') {
        setAuthorized(true);
        setFacultyRole(userRole);
      } else {
        // Not a supervisor, show access denied and redirect
        alert('Access Denied: This dashboard is only for Supervisors.');
        navigate('/'); // Redirect to home or another appropriate page
        return;
      }
      
      setCheckingAuth(false);
    };
    
    checkAuthorization();
  }, [navigate]);

  useEffect(() => {
    // Only run if authorized
    if (!authorized) return;
    
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

    const fetchStats = async () => {
      // Get role from localStorage (set during login for current user)
      const storedRole = localStorage.getItem('userRole');
      console.log('Current user role from localStorage:', storedRole);
      console.log('Current user ID:', localStorage.getItem('userId'));
      
      if (storedRole && storedRole !== 'faculty') {
        // Use the actual role/status (Supervisor, FYP Committee Member, etc.)
        setFacultyRole(storedRole);
      } else if (storedRole === 'faculty') {
        // Default fallback if status was not set in database
        setFacultyRole('Faculty Member');
      }

      try {
        // First check if session is valid
        console.log('Checking session with /auth/me...');
        try {
          const meRes = await axios.get(`${API_BASE_URL}/auth/me`, {
            withCredentials: true,
          });
          console.log('Session check (/auth/me) response:', meRes.data);
        } catch (meErr) {
          console.error('Session check failed:', meErr.response?.status, meErr.response?.data);
        }

        // Fetch students
        console.log('Fetching my students for dashboard...');
        const studentsRes = await axios.get(`${API_BASE_URL}/faculty/mystudents`, {
          withCredentials: true,
        });
        console.log('Dashboard - Students response:', studentsRes.data);
        console.log('Dashboard - Students count:', studentsRes.data?.length || 0);
        const students = studentsRes.data || [];

        // Fetch submissions for my students
        console.log('Fetching submissions for dashboard...');
        let allSubmissions = [];
        for (const student of students) {
          const studentId = student.numericId || student.student_id;
          console.log(`Fetching submissions for student:`, student.name, `ID:`, studentId, `Full student object:`, student);
          if (studentId) {
            try {
              const subRes = await axios.get(`${API_BASE_URL}/submissions/${studentId}`, {
                withCredentials: true,
              });
              console.log(`Submissions for student ${studentId}:`, subRes.data);
              if (subRes.data && Array.isArray(subRes.data)) {
                allSubmissions = [...allSubmissions, ...subRes.data];
              }
            } catch (subErr) {
              console.log(`Could not fetch submissions for student ${studentId}:`, subErr.response?.status, subErr.response?.data);
            }
          }
        }
        console.log('Dashboard - All Submissions:', allSubmissions);
        
        // Log each submission's approval status in detail
        allSubmissions.forEach((s, index) => {
          console.log(`Submission ${index + 1}:`, {
            file_id: s.file_id,
            filename: s.filename,
            is_approved: s.is_approved,
            type: typeof s.is_approved,
            rawValue: JSON.stringify(s.is_approved)
          });
        });
        
        // Count pending submissions
        // Handle any truthy/falsy value - if it's truthy in any way, it's approved
        const isApproved = (submission) => {
          const val = submission.is_approved;
          // Use double negation to convert any truthy value to true
          // This handles: true, 1, "1", "true", or any non-zero/non-empty value
          return !!val && val !== "false" && val !== "0" && val !== 0;
        };
        
        const pendingReview = allSubmissions.filter(s => s && !isApproved(s)).length;
        const approvedCount = allSubmissions.filter(s => s && isApproved(s)).length;
        
        console.log('Dashboard - Total submissions:', allSubmissions.length);
        console.log('Dashboard - Approved:', approvedCount);
        console.log('Dashboard - Pending:', pendingReview);

        setStats({
          totalStudents: students.length,
          totalSubmissions: allSubmissions.length,
          pendingReview: pendingReview,
        });
        setFetchError('');
      } catch (error) {
        console.error('Error fetching stats:', error);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          setFetchError('Session expired. Please login again.');
        } else {
          setFetchError('Could not load data. Check console for details.');
        }
        setStats({ totalStudents: 0, totalSubmissions: 0, pendingReview: 0 });
      } finally {
        setLoading(false);
      }
    };

    updateGreeting();
    updateTime();
    fetchStats();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [authorized]);

  const userName = localStorage.getItem('userId') || 'Professor';

  const statsData = [
    { label: 'Students', value: loading ? '...' : stats.totalStudents.toString(), icon: '👨‍🎓', color: '#6366f1' },
    { label: 'Submissions', value: loading ? '...' : stats.totalSubmissions.toString(), icon: '📑', color: '#06b6d4' },
    { label: 'Pending Review', value: loading ? '...' : stats.pendingReview.toString(), icon: '⏳', color: '#f59e0b' },
  ];

  const quickActions = [
    {
      title: 'View All Students',
      description: 'Browse and manage all students under your supervision',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      shadowColor: 'rgba(99, 102, 241, 0.5)',
      route: '/view-students',
      hoverGradient: 'linear-gradient(135deg, #818cf8, #a78bfa)',
    },
    {
      title: 'View Submissions',
      description: 'Review student submissions, provide feedback and grades',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      shadowColor: 'rgba(6, 182, 212, 0.5)',
      route: '/view-submissions',
      hoverGradient: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
    },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '30px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundOrbs: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    },
    orb1: {
      position: 'absolute',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
      top: '-100px',
      right: '-100px',
      animation: 'float 8s ease-in-out infinite',
    },
    orb2: {
      position: 'absolute',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
      bottom: '-50px',
      left: '-50px',
      animation: 'float 10s ease-in-out infinite reverse',
    },
    orb3: {
      position: 'absolute',
      width: '250px',
      height: '250px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'pulse 6s ease-in-out infinite',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '40px',
      animation: 'slideDown 0.6s ease-out',
    },
    welcomeSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '20px',
    },
    greetingContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    greeting: {
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.6)',
      fontWeight: '400',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    welcomeText: {
      fontSize: '42px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 50%, #6366f1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
      lineHeight: 1.2,
    },
    roleTag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '30px',
      padding: '8px 18px',
      marginTop: '12px',
    },
    roleIcon: {
      fontSize: '18px',
    },
    roleText: {
      color: '#a5b4fc',
      fontSize: '14px',
      fontWeight: '500',
    },
    timeContainer: {
      textAlign: 'right',
      padding: '20px 25px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
    },
    timeLabel: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '5px',
    },
    time: {
      fontSize: '32px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    date: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginTop: '5px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '50px',
      animation: 'slideUp 0.6s ease-out 0.2s both',
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '20px',
      padding: '25px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      transition: 'all 0.3s ease',
      cursor: 'default',
    },
    statIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      flexShrink: 0,
    },
    statInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: 1,
    },
    statLabel: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    titleIcon: {
      width: '36px',
      height: '36px',
      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
    },
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '30px',
      animation: 'slideUp 0.6s ease-out 0.4s both',
    },
    actionCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '24px',
      padding: '35px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    actionCardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      opacity: 0,
      transition: 'opacity 0.4s ease',
    },
    actionIconContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      transition: 'all 0.4s ease',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '10px',
      transition: 'color 0.3s ease',
    },
    actionDescription: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: 1.6,
      marginBottom: '20px',
    },
    actionButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    actionArrow: {
      transition: 'transform 0.3s ease',
      fontSize: '18px',
    },
    footer: {
      marginTop: '60px',
      textAlign: 'center',
      padding: '30px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      animation: 'fadeIn 0.6s ease-out 0.6s both',
    },
    footerText: {
      color: 'rgba(255, 255, 255, 0.4)',
      fontSize: '14px',
    },
    footerHighlight: {
      color: '#06b6d4',
      fontWeight: '500',
    },
  };

  const globalStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(5deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
      50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.15; }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .stat-card:hover {
      transform: translateY(-5px);
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
    .action-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(99, 102, 241, 0.4);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
    }
    .action-card:hover .action-glow {
      opacity: 1;
    }
    .action-card:hover .action-icon {
      transform: scale(1.1) rotate(-5deg);
    }
    .action-card:hover .action-arrow {
      transform: translateX(5px);
    }
    .action-card:hover .action-btn {
      color: #06b6d4;
    }
  `;

  // Show loading while checking authorization
  if (checkingAuth || !authorized) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(99, 102, 241, 0.3)',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>Checking authorization...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>
      
      {/* Background Orbs */}
      <div style={styles.backgroundOrbs}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>
        <div style={styles.orb3}></div>
      </div>

      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.welcomeSection}>
            <div style={styles.greetingContainer}>
              <span style={styles.greeting}>{greeting}</span>
              <h1 style={styles.welcomeText}>Welcome, {userName}!</h1>
              <div style={styles.roleTag}>
                <span style={styles.roleIcon}>👨‍🏫</span>
                <span style={styles.roleText}>{facultyRole || 'Faculty Member'}</span>
              </div>
            </div>
            <div style={styles.timeContainer}>
              <div style={styles.timeLabel}>Current Time</div>
              <div style={styles.time}>{currentTime}</div>
              <div style={styles.date}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card"
              style={styles.statCard}
            >
              <div 
                style={{
                  ...styles.statIcon,
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                {stat.icon}
              </div>
              <div style={styles.statInfo}>
                <span style={styles.statValue}>{stat.value}</span>
                <span style={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {fetchError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '15px 20px',
            marginBottom: '30px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <span>{fetchError}</span>
          </div>
        )}

        {/* Quick Actions Section */}
        <section>
          <h2 style={styles.sectionTitle}>
            <div style={styles.titleIcon}>⚡</div>
            Quick Actions
          </h2>
          
          <div style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="action-card"
                style={styles.actionCard}
                onClick={() => navigate(action.route)}
              >
                {/* Glow Effect */}
                <div 
                  className="action-glow"
                  style={{
                    ...styles.actionCardGlow,
                    background: action.gradient,
                  }}
                ></div>

                {/* Icon */}
                <div 
                  className="action-icon"
                  style={{
                    ...styles.actionIconContainer,
                    background: action.gradient,
                    boxShadow: `0 10px 30px ${action.shadowColor}`,
                  }}
                >
                  {action.icon}
                </div>

                {/* Content */}
                <div style={styles.actionContent}>
                  <h3 style={styles.actionTitle}>{action.title}</h3>
                  <p style={styles.actionDescription}>{action.description}</p>
                  <div className="action-btn" style={styles.actionButton}>
                    <span>Click to access</span>
                    <span className="action-arrow" style={styles.actionArrow}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            FYP Management System • <span style={styles.footerHighlight}>Faculty Portal</span> • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
