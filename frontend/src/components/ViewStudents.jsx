import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

export default function ViewStudents() {
  const navigate = useNavigate();
  const [myStudents, setMyStudents] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickingStudent, setPickingStudent] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Check authorization
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigate('/facLogin');
      return;
    }
    
    if (!userRole || userRole.toLowerCase() !== 'supervisor') {
      alert('Access Denied: This page is only for Supervisors.');
      navigate('/');
      return;
    }
  }, [navigate]);

  const fetchStudents = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      console.log('Fetching my students...');
      console.log('User ID from localStorage:', localStorage.getItem('userId'));
      console.log('User Role from localStorage:', localStorage.getItem('userRole'));
      
      // Fetch my students (assigned to current supervisor)
      const myStudentsRes = await axios.get(`${API_BASE_URL}/faculty/mystudents`, {
        withCredentials: true,
      });
      console.log('My students response:', myStudentsRes.data);
      console.log('My students count:', myStudentsRes.data?.length || 0);
      setMyStudents(myStudentsRes.data || []);

      // Fetch unassigned students (supervisor_id = -1)
      const unassignedRes = await axios.get(`${API_BASE_URL}/faculty/unassignedstudents`, {
        withCredentials: true,
      });
      console.log('Unassigned students response:', unassignedRes.data);
      console.log('Unassigned students count:', unassignedRes.data?.length || 0);
      setUnassignedStudents(unassignedRes.data || []);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setMessage({ text: 'Session expired or unauthorized. Please login again.', type: 'error' });
        // Optionally redirect to login
        // navigate('/facLogin');
      } else {
        setMessage({ text: error.response?.data?.message || 'Failed to load students. Please try again.', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const handlePickStudent = async (student) => {
    console.log('Picking student:', student);
    setPickingStudent(student.id || student.numericId);
    setMessage({ text: '', type: '' });
    
    try {
      // Get the numeric ID from the student object
      let studentId = student.numericId;
      
      // If numericId is not available, try to extract from id (STU-X format)
      if (!studentId && student.id) {
        if (typeof student.id === 'string' && student.id.startsWith('STU-')) {
          studentId = parseInt(student.id.substring(4));
        } else if (typeof student.id === 'number') {
          studentId = student.id;
        }
      }
      
      console.log('Sending studentId:', studentId);
      
      if (!studentId) {
        throw new Error('Could not determine student ID');
      }
      
      const response = await axios.post(`${API_BASE_URL}/faculty/assignstudent`, 
        { numericId: studentId },
        { withCredentials: true }
      );
      
      console.log('Assignment response:', response.data);
      setMessage({ text: `Successfully assigned ${student.name} as your student!`, type: 'success' });
      
      // Refresh the lists
      await fetchStudents();
    } catch (error) {
      console.error('Error picking student:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Failed to assign student. Please try again.';
      setMessage({ text: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), type: 'error' });
    } finally {
      setPickingStudent(null);
    }
  };

  const userName = localStorage.getItem('userId') || 'Supervisor';

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
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '10px 20px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '20px',
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 50%, #6366f1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
      marginBottom: '10px',
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '16px',
    },
    messageBox: {
      padding: '15px 20px',
      borderRadius: '12px',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideUp 0.3s ease-out',
    },
    sectionsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: '30px',
    },
    section: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '24px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
      animation: 'slideUp 0.6s ease-out',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    sectionIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    badge: {
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
    },
    studentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxHeight: '500px',
      overflowY: 'auto',
    },
    studentCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 20px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'all 0.3s ease',
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    studentAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.1))',
      border: '1px solid rgba(99, 102, 241, 0.3)',
    },
    studentDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    studentName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
    },
    studentId: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    pickButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      border: 'none',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
    },
    pickButtonDisabled: {
      background: 'rgba(255, 255, 255, 0.1)',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '15px',
    },
    emptyText: {
      fontSize: '16px',
    },
    loadingSpinner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid rgba(99, 102, 241, 0.3)',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  const globalStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(5deg); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .back-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(99, 102, 241, 0.5);
      transform: translateX(-5px);
    }
    .student-card:hover {
      transform: translateX(5px);
      border-color: rgba(99, 102, 241, 0.3);
      background: rgba(255, 255, 255, 0.04);
    }
    .pick-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }
    .students-list::-webkit-scrollbar {
      width: 6px;
    }
    .students-list::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    .students-list::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.3);
      border-radius: 3px;
    }
    .students-list::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 0.5);
    }
  `;

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>
      
      {/* Background Orbs */}
      <div style={styles.backgroundOrbs}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>
      </div>

      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <button 
            className="back-btn"
            style={styles.backButton}
            onClick={() => navigate('/Dashboard2')}
          >
            <span>←</span>
            Back to Dashboard
          </button>
          
          <h1 style={styles.title}>Student Management</h1>
          <p style={styles.subtitle}>
            Welcome, {userName}! Manage your students and pick new ones to supervise.
          </p>
        </header>

        {/* Message */}
        {message.text && (
          <div style={{
            ...styles.messageBox,
            background: message.type === 'success' 
              ? 'rgba(16, 185, 129, 0.15)' 
              : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${message.type === 'success' 
              ? 'rgba(16, 185, 129, 0.3)' 
              : 'rgba(239, 68, 68, 0.3)'}`,
            color: message.type === 'success' ? '#6ee7b7' : '#f87171',
          }}>
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            {message.text}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingSpinner}>
            <div style={styles.spinner}></div>
          </div>
        ) : (
          <div style={styles.sectionsContainer}>
            {/* Section 1: My Students */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>
                  <div style={{
                    ...styles.sectionIcon,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}>
                    👨‍🎓
                  </div>
                  My Students
                </div>
                <span style={{
                  ...styles.badge,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}>
                  {myStudents.length} Student{myStudents.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="students-list" style={styles.studentsList}>
                {myStudents.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📭</div>
                    <p style={styles.emptyText}>No students assigned yet</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                      Pick students from the unassigned list
                    </p>
                  </div>
                ) : (
                  myStudents.map((student, index) => (
                    <div 
                      key={student.id || index} 
                      className="student-card"
                      style={styles.studentCard}
                    >
                      <div style={styles.studentInfo}>
                        <div style={styles.studentAvatar}>👤</div>
                        <div style={styles.studentDetails}>
                          <span style={styles.studentName}>{student.name}</span>
                          <span style={styles.studentId}>{student.id || `STU-${student.student_id}`}</span>
                        </div>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}>
                        Supervised
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section 2: Unassigned Students */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>
                  <div style={{
                    ...styles.sectionIcon,
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}>
                    🎯
                  </div>
                  Unassigned Students
                </div>
                <span style={{
                  ...styles.badge,
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}>
                  {unassignedStudents.length} Available
                </span>
              </div>

              <div className="students-list" style={styles.studentsList}>
                {unassignedStudents.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>✨</div>
                    <p style={styles.emptyText}>All students are assigned</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                      No unassigned students available
                    </p>
                  </div>
                ) : (
                  unassignedStudents.map((student, index) => (
                    <div 
                      key={student.id || index} 
                      className="student-card"
                      style={styles.studentCard}
                    >
                      <div style={styles.studentInfo}>
                        <div style={{
                          ...styles.studentAvatar,
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                        }}>
                          👤
                        </div>
                        <div style={styles.studentDetails}>
                          <span style={styles.studentName}>{student.name}</span>
                          <span style={styles.studentId}>{student.id || `STU-${student.student_id}`}</span>
                        </div>
                      </div>
                      <button
                        className="pick-btn"
                        style={{
                          ...styles.pickButton,
                          ...(pickingStudent === student.id ? styles.pickButtonDisabled : {}),
                        }}
                        onClick={() => handlePickStudent(student)}
                        disabled={pickingStudent === student.id}
                      >
                        {pickingStudent === student.id ? (
                          <>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid rgba(255,255,255,0.3)',
                              borderTop: '2px solid #fff',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                            }}></div>
                            Picking...
                          </>
                        ) : (
                          <>
                            <span>✓</span>
                            Pick
                          </>
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
