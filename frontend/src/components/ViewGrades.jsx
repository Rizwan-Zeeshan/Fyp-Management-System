import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

export default function ViewGrades() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/Login');
      return;
    }
    fetchGrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch grades using the correct endpoint
      const response = await axios.get(`${API_BASE_URL}/student/mygrades`, {
        withCredentials: true
      });
      
      setGrades(response.data);
      // Get student name from the grades response
      if (response.data?.student?.name) {
        setStudentName(response.data.student.name);
      }
    } catch (err) {
      console.error('Error fetching grades:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Grades not available yet.');
      } else {
        setError('FYP Committee has not released grades yet. Please check back later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', shadow: 'rgba(34, 197, 94, 0.5)', text: '#fff' },
      'B': { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59, 130, 246, 0.5)', text: '#fff' },
      'C': { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245, 158, 11, 0.5)', text: '#fff' },
      'D': { bg: 'linear-gradient(135deg, #f97316, #ea580c)', shadow: 'rgba(249, 115, 22, 0.5)', text: '#fff' },
      'F': { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', shadow: 'rgba(239, 68, 68, 0.5)', text: '#fff' },
    };
    return colors[grade] || { bg: 'linear-gradient(135deg, #6b7280, #4b5563)', shadow: 'rgba(107, 114, 128, 0.5)', text: '#fff' };
  };

  const getRubricLabel = (value) => {
    const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    return labels[value] || 'N/A';
  };

  const getRubricColor = (value) => {
    if (value >= 4) return { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e', fill: '#22c55e' };
    if (value >= 3) return { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b', fill: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444', fill: '#ef4444' };
  };

  const rubricDescriptions = {
    rubric1: { name: 'OOP & Design', icon: '🏗️', description: 'Object-Oriented Programming principles and software design patterns' },
    rubric2: { name: 'Workflow', icon: '📋', description: 'Project management, task organization, and development workflow' },
    rubric3: { name: 'Implementation', icon: '💻', description: 'Code implementation, functionality, and feature completeness' },
    rubric4: { name: 'GitHub Usage', icon: '🔗', description: 'Version control, commits, branching, and collaboration' },
    rubric5: { name: 'Code Quality & Docs', icon: '📝', description: 'Clean code, documentation, and code maintainability' },
    rubric6: { name: 'UI/Usability', icon: '🎨', description: 'User interface design and user experience' },
  };

  const calculateTotalScore = () => {
    if (!grades) return 0;
    return grades.rubric1 + grades.rubric2 + grades.rubric3 + grades.rubric4 + grades.rubric5 + grades.rubric6;
  };

  const calculatePercentage = () => {
    const total = calculateTotalScore();
    return Math.round((total / 30) * 100);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your grades...</p>
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
      <div style={styles.backgroundOrbs}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>
        <div style={styles.orb3}></div>
      </div>

      <div style={styles.content}>
        {/* Back Button */}
        <button
          style={styles.backBtn}
          onClick={() => navigate('/Dashboard1')}
          className="back-btn"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>🎓</span>
            <span style={styles.titleText}>My Grades</span>
          </h1>
          <p style={styles.subtitle}>View your FYP evaluation results and rubric scores</p>
          <p style={styles.welcomeText}>Welcome, <strong>{studentName}</strong></p>
        </div>

        {error && (
          <div style={styles.errorCard} className="error-card">
            <div style={styles.errorIcon}>🔒</div>
            <h2 style={styles.errorTitle}>Grades Not Available</h2>
            <p style={styles.errorMessage}>{error}</p>
          </div>
        )}

        {/* Grades Display */}
        {grades && !error && (
          <div style={styles.gradeCard} className="grade-card">
            {/* Grade Header */}
            <div style={styles.gradeHeader}>
              <div style={styles.gradeHeaderGlow}></div>
              <div style={styles.gradeHeaderContent}>
                <div style={styles.finalGradeLabel}>Your Final Grade</div>
                <div 
                  style={{
                    ...styles.finalGradeBadge,
                    background: getGradeColor(grades.grade).bg,
                    boxShadow: `0 20px 60px ${getGradeColor(grades.grade).shadow}`,
                  }}
                  className="grade-badge"
                >
                  <div style={styles.gradeRing}></div>
                  {grades.grade}
                </div>
                <div style={styles.scoreInfo}>
                  <div style={styles.scoreStat}>
                    <div style={styles.scoreValue}>{calculateTotalScore()}/30</div>
                    <div style={styles.scoreLabel}>Total Score</div>
                  </div>
                  <div style={styles.scoreStat}>
                    <div style={styles.scoreValue}>{calculatePercentage()}%</div>
                    <div style={styles.scoreLabel}>Percentage</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rubrics Section */}
            <div style={styles.rubricsSection}>
              <div style={styles.sectionTitle}>
                <span>📊</span> Rubric Breakdown
              </div>
              <div style={styles.rubricsGrid}>
                {Object.entries(rubricDescriptions).map(([key, rubric], index) => {
                  const score = grades[key];
                  const colors = getRubricColor(score);
                  return (
                    <div 
                      key={key} 
                      style={{
                        ...styles.rubricCard,
                        animationDelay: `${index * 0.1}s`,
                      }}
                      className="rubric-card"
                    >
                      <div style={styles.rubricHeader}>
                        <div style={styles.rubricInfo}>
                          <span style={styles.rubricIcon}>{rubric.icon}</span>
                          <span style={styles.rubricName}>{rubric.name}</span>
                        </div>
                        <span style={{
                          ...styles.rubricScore,
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}>
                          {score}/5
                        </span>
                      </div>
                      <p style={styles.rubricDescription}>{rubric.description}</p>
                      <div style={styles.rubricBar}>
                        <div 
                          style={{
                            ...styles.rubricBarFill,
                            width: `${(score / 5) * 100}%`,
                            background: `linear-gradient(90deg, ${colors.fill}, ${colors.border})`,
                          }}
                          className="bar-fill"
                        ></div>
                      </div>
                      <div style={styles.rubricLabel}>{getRubricLabel(score)}</div>
                    </div>
                  );
                })}
              </div>

              {/* Congratulations Message */}
              {grades.grade !== 'F' && (
                <div style={styles.congratsCard} className="congrats-card">
                  <span style={{ fontSize: '2rem', marginRight: '10px' }}>🎉</span>
                  <span style={styles.congratsText}>
                    Congratulations on completing your FYP evaluation!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes gradeReveal {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fillBar {
          from { width: 0%; }
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(-5px);
        }
        .grade-card {
          animation: slideIn 0.6s ease-out;
        }
        .error-card {
          animation: slideIn 0.6s ease-out;
        }
        .rubric-card {
          animation: slideIn 0.5s ease-out both;
        }
        .rubric-card:hover {
          transform: translateY(-5px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%) !important;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        .grade-badge {
          animation: gradeReveal 1s ease-out;
        }
        .congrats-card {
          animation: slideIn 0.8s ease-out;
        }
        .bar-fill {
          animation: fillBar 1.5s ease-out;
        }
      `}</style>
    </div>
  );
}

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
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  orb2: {
    position: 'absolute',
    bottom: '-15%',
    left: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  orb3: {
    position: 'absolute',
    top: '40%',
    left: '60%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '900px',
    margin: '0 auto',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '30px',
    transition: 'all 0.3s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  titleIcon: {
    fontSize: '3rem',
  },
  titleText: {
    background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '200% 200%',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '1.1rem',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1rem',
    marginTop: '10px',
  },
  errorCard: {
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.05))',
    border: '2px solid rgba(249, 115, 22, 0.3)',
    borderRadius: '24px',
    padding: '50px 40px',
    textAlign: 'center',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 20px 60px rgba(249, 115, 22, 0.15)',
  },
  errorIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    margin: '0 auto 24px',
    boxShadow: '0 10px 30px rgba(249, 115, 22, 0.4)',
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '12px',
  },
  errorMessage: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  gradeCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4)',
  },
  gradeHeader: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))',
    padding: '40px',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  gradeHeaderGlow: {
    position: 'absolute',
    top: '-50%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  gradeHeaderContent: {
    position: 'relative',
    zIndex: 1,
  },
  finalGradeLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '20px',
  },
  finalGradeBadge: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    fontWeight: '800',
    color: '#fff',
    margin: '0 auto 24px',
    position: 'relative',
  },
  gradeRing: {
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    right: '-8px',
    bottom: '-8px',
    borderRadius: '50%',
    border: '4px solid rgba(255, 255, 255, 0.2)',
  },
  scoreInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  scoreStat: {
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '4px',
  },
  rubricsSection: {
    padding: '40px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rubricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  rubricCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  rubricHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  rubricInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rubricIcon: {
    fontSize: '1.5rem',
  },
  rubricName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
  },
  rubricScore: {
    padding: '8px 16px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  rubricDescription: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  rubricBar: {
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  rubricBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s ease-out',
  },
  rubricLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '8px',
    textAlign: 'right',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(34, 197, 94, 0.2)',
    borderTopColor: '#22c55e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '20px',
    fontSize: '1.1rem',
  },
  congratsCard: {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '20px',
    padding: '24px',
    marginTop: '30px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratsText: {
    color: '#22c55e',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
};
