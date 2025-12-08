import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

export default function ViewSubmissions() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [feedbackText, setFeedbackText] = useState({});
  const [expandedStudent, setExpandedStudent] = useState(null);

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

  // Fetch students and their submissions
  const fetchData = async () => {
    setLoading(true);
    try {
      // First get my students
      const studentsRes = await axios.get(`${API_BASE_URL}/faculty/mystudents`, {
        withCredentials: true,
      });
      const myStudents = studentsRes.data || [];
      setStudents(myStudents);

      // Then fetch submissions for each student
      const submissionsData = {};
      for (const student of myStudents) {
        const studentId = student.numericId || student.student_id;
        if (studentId) {
          try {
            const subRes = await axios.get(`${API_BASE_URL}/submissions/${studentId}`, {
              withCredentials: true,
            });
            submissionsData[studentId] = subRes.data || [];
          } catch (err) {
            console.error(`Error fetching submissions for student ${studentId}:`, err);
            submissionsData[studentId] = [];
          }
        }
      }
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ text: 'Failed to load data. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (submission) => {
    const fileId = submission.file_id;
    console.log('Approving submission:', fileId);
    setActionLoading(`approve-${fileId}`);
    setMessage({ text: '', type: '' });

    try {
      console.log('Sending approve request to:', `${API_BASE_URL}/faculty/approvesubmission`);
      console.log('Request body:', { file_id: fileId });
      
      const response = await axios.post(`${API_BASE_URL}/faculty/approvesubmission`,
        { file_id: fileId },
        { withCredentials: true }
      );
      
      console.log('Approve response:', response.data);
      setMessage({ text: 'Submission approved successfully!', type: 'success' });
      await fetchData();
    } catch (error) {
      console.error('Error approving submission:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      setMessage({ text: error.response?.data?.message || error.response?.data || 'Failed to approve submission.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (submission) => {
    const fileId = submission.file_id;
    setActionLoading(`reject-${fileId}`);
    setMessage({ text: '', type: '' });

    try {
      await axios.post(`${API_BASE_URL}/faculty/requestrevision`,
        { file_id: fileId },
        { withCredentials: true }
      );
      setMessage({ text: 'Revision requested successfully! Student can now resubmit.', type: 'success' });
      await fetchData();
    } catch (error) {
      console.error('Error requesting revision:', error);
      setMessage({ text: error.response?.data?.message || 'Failed to request revision.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (submission) => {
    const fileId = submission.file_id;
    const filename = submission.filename;
    setActionLoading(`download-${fileId}`);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/download`,
        { file_id: fileId },
        {
          withCredentials: true,
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setMessage({ text: 'Failed to download file.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddFeedback = async (submission) => {
    const fileId = submission.file_id;
    const content = feedbackText[fileId];
    
    if (!content || content.trim() === '') {
      setMessage({ text: 'Please enter feedback content.', type: 'error' });
      return;
    }

    setActionLoading(`feedback-${fileId}`);
    setMessage({ text: '', type: '' });

    try {
      await axios.post(`${API_BASE_URL}/faculty/addfeedback`,
        { file_id: fileId, content: content.trim() },
        { withCredentials: true }
      );
      setMessage({ text: 'Feedback added successfully!', type: 'success' });
      setFeedbackText(prev => ({ ...prev, [fileId]: '' }));
    } catch (error) {
      console.error('Error adding feedback:', error);
      setMessage({ text: error.response?.data?.message || 'Failed to add feedback.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDocTypeColor = (docType) => {
    const colors = {
      'Proposal': { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', shadow: 'rgba(99, 102, 241, 0.4)' },
      'Design Document': { bg: 'linear-gradient(135deg, #ec4899, #f97316)', shadow: 'rgba(236, 72, 153, 0.4)' },
      'Test Document': { bg: 'linear-gradient(135deg, #14b8a6, #06b6d4)', shadow: 'rgba(20, 184, 166, 0.4)' },
      'Thesis': { bg: 'linear-gradient(135deg, #f59e0b, #eab308)', shadow: 'rgba(245, 158, 11, 0.4)' },
    };
    return colors[docType] || { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', shadow: 'rgba(99, 102, 241, 0.4)' };
  };

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
      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
      borderRadius: '50%',
    },
    orb2: {
      position: 'absolute',
      bottom: '-15%',
      left: '-10%',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '10px',
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '1.1rem',
    },
    messageBox: {
      padding: '15px 20px',
      borderRadius: '12px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    successMessage: {
      background: 'rgba(34, 197, 94, 0.15)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      color: '#22c55e',
    },
    errorMessage: {
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#ef4444',
    },
    studentCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '20px',
      overflow: 'hidden',
    },
    studentHeader: {
      padding: '20px 25px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    studentAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#fff',
    },
    studentName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '4px',
    },
    studentEmail: {
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    submissionCount: {
      background: 'rgba(99, 102, 241, 0.2)',
      color: '#a5b4fc',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    submissionsContainer: {
      padding: '20px',
    },
    submissionRow: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    submissionTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '15px',
    },
    submissionInfo: {
      flex: 1,
      minWidth: '200px',
    },
    docTypeBadge: {
      display: 'inline-block',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '10px',
    },
    filename: {
      fontSize: '1rem',
      color: '#fff',
      fontWeight: '500',
      marginBottom: '5px',
      wordBreak: 'break-all',
    },
    submissionMeta: {
      fontSize: '0.85rem',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    approvedBadge: {
      background: 'rgba(34, 197, 94, 0.2)',
      color: '#22c55e',
    },
    pendingBadge: {
      background: 'rgba(245, 158, 11, 0.2)',
      color: '#f59e0b',
    },
    lateBadge: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      marginLeft: '8px',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    btn: {
      padding: '10px 18px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.3s ease',
    },
    approveBtn: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: '#fff',
    },
    rejectBtn: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#fff',
    },
    downloadBtn: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: '#fff',
    },
    disabledBtn: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    feedbackSection: {
      marginTop: '15px',
      paddingTop: '15px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    feedbackLabel: {
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '10px',
      display: 'block',
    },
    feedbackInputRow: {
      display: 'flex',
      gap: '10px',
    },
    feedbackInput: {
      flex: 1,
      padding: '12px 15px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      fontSize: '0.95rem',
      outline: 'none',
    },
    feedbackBtn: {
      padding: '12px 20px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
      color: '#fff',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    noSubmissions: {
      textAlign: 'center',
      padding: '30px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    emptyTitle: {
      fontSize: '1.5rem',
      color: '#fff',
      marginTop: '20px',
      marginBottom: '10px',
    },
    emptyText: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '1rem',
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
      width: '50px',
      height: '50px',
      border: '4px solid rgba(99, 102, 241, 0.2)',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      color: 'rgba(255, 255, 255, 0.7)',
      marginTop: '20px',
      fontSize: '1.1rem',
    },
    expandIcon: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '1.5rem',
      transition: 'transform 0.3s ease',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading submissions...</p>
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
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>📝 Student Submissions</h1>
          <p style={styles.subtitle}>Review and provide feedback on your students' submissions</p>
        </div>

        {message.text && (
          <div style={{
            ...styles.messageBox,
            ...(message.type === 'success' ? styles.successMessage : styles.errorMessage),
          }}>
            {message.type === 'success' ? '✓' : '⚠'} {message.text}
          </div>
        )}

        {students.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '4rem' }}>👥</span>
            <h2 style={styles.emptyTitle}>No Students Assigned</h2>
            <p style={styles.emptyText}>You don't have any students assigned yet. Go to View Students to pick students.</p>
          </div>
        ) : (
          students.map((student) => {
            const studentId = student.numericId || student.student_id;
            const studentSubmissions = submissions[studentId] || [];
            const isExpanded = expandedStudent === studentId;

            return (
              <div key={studentId} style={styles.studentCard}>
                <div 
                  style={styles.studentHeader}
                  onClick={() => setExpandedStudent(isExpanded ? null : studentId)}
                >
                  <div style={styles.studentInfo}>
                    <div style={styles.studentAvatar}>
                      {student.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={styles.studentName}>{student.name}</div>
                      <div style={styles.studentEmail}>{student.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={styles.submissionCount}>
                      {studentSubmissions.filter(s => s !== null).length} Submissions
                    </span>
                    <span style={{
                      ...styles.expandIcon,
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}>▼</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={styles.submissionsContainer}>
                    {studentSubmissions.filter(s => s !== null).length === 0 ? (
                      <div style={styles.noSubmissions}>
                        <p>No submissions from this student yet.</p>
                      </div>
                    ) : (
                      studentSubmissions.filter(s => s !== null).map((submission) => {
                        const docType = submission.doc_type || submission.documentType?.doc_type;
                        const colors = getDocTypeColor(docType);
                        const isApproved = submission.is_approved;
                        const isLate = submission.submitted_late;
                        const fileId = submission.file_id;

                        return (
                          <div key={fileId} style={styles.submissionRow}>
                            <div style={styles.submissionTop}>
                              <div style={styles.submissionInfo}>
                                <span style={{
                                  ...styles.docTypeBadge,
                                  background: colors.bg,
                                  boxShadow: `0 4px 15px ${colors.shadow}`,
                                }}>
                                  {docType}
                                </span>
                                <div style={styles.filename}>📄 {submission.filename}</div>
                                <div style={styles.submissionMeta}>
                                  Submitted: {formatDateTime(submission.submission_datetime)}
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                  <span style={{
                                    ...styles.statusBadge,
                                    ...(isApproved ? styles.approvedBadge : styles.pendingBadge),
                                  }}>
                                    {isApproved ? '✓ Approved' : '⏳ Pending Review'}
                                  </span>
                                  {isLate && (
                                    <span style={{ ...styles.statusBadge, ...styles.lateBadge }}>
                                      ⚠ Late
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div style={styles.actionButtons}>
                                {!isApproved && (
                                  <>
                                    <button
                                      style={{
                                        ...styles.btn,
                                        ...styles.approveBtn,
                                        ...(actionLoading === `approve-${fileId}` ? styles.disabledBtn : {}),
                                      }}
                                      onClick={() => handleApprove(submission)}
                                      disabled={actionLoading === `approve-${fileId}`}
                                    >
                                      {actionLoading === `approve-${fileId}` ? '...' : '✓ Approve'}
                                    </button>
                                    <button
                                      style={{
                                        ...styles.btn,
                                        ...styles.rejectBtn,
                                        ...(actionLoading === `reject-${fileId}` ? styles.disabledBtn : {}),
                                      }}
                                      onClick={() => handleReject(submission)}
                                      disabled={actionLoading === `reject-${fileId}`}
                                    >
                                      {actionLoading === `reject-${fileId}` ? '...' : '✗ Reject'}
                                    </button>
                                  </>
                                )}
                                <button
                                  style={{
                                    ...styles.btn,
                                    ...styles.downloadBtn,
                                    ...(actionLoading === `download-${fileId}` ? styles.disabledBtn : {}),
                                  }}
                                  onClick={() => handleDownload(submission)}
                                  disabled={actionLoading === `download-${fileId}`}
                                >
                                  {actionLoading === `download-${fileId}` ? '...' : '⬇ Download'}
                                </button>
                              </div>
                            </div>

                            <div style={styles.feedbackSection}>
                              <label style={styles.feedbackLabel}>Add Comment / Feedback:</label>
                              <div style={styles.feedbackInputRow}>
                                <input
                                  type="text"
                                  style={styles.feedbackInput}
                                  placeholder="Enter your feedback for this submission..."
                                  value={feedbackText[fileId] || ''}
                                  onChange={(e) => setFeedbackText(prev => ({
                                    ...prev,
                                    [fileId]: e.target.value
                                  }))}
                                />
                                <button
                                  style={{
                                    ...styles.feedbackBtn,
                                    ...(actionLoading === `feedback-${fileId}` ? styles.disabledBtn : {}),
                                  }}
                                  onClick={() => handleAddFeedback(submission)}
                                  disabled={actionLoading === `feedback-${fileId}`}
                                >
                                  {actionLoading === `feedback-${fileId}` ? '...' : '💬 Send'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
