import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function Submissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  // Check if user is authenticated as student
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigate('/Login');
      return;
    }
    
    // Only students should access this page
    if (userRole && userRole.toLowerCase() !== 'student') {
      alert('This page is only for Students.');
      navigate('/');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student/mysubmissions`, {
        withCredentials: true,
      });
      setSubmissions(response.data || []);
      setLoading(false);
      setError("");
    } catch (err) {
      console.error("Error fetching submissions:", err);
      // Check if it's an authentication error
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Please login as a student to view submissions.");
      } else {
        setError(err.response?.data?.message || "Failed to fetch submissions. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/download`,
        { file_id: fileId },
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file. Please try again.");
    }
  };

  const toggleFeedback = (fileId) => {
    setExpandedFeedback(expandedFeedback === fileId ? null : fileId);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDocTypeLabel = (docType) => {
    const labels = {
      'proposal': 'Proposal',
      'Proposal': 'Proposal',
      'design_document': 'Design Document',
      'Design Document': 'Design Document',
      'test_document': 'Test Document',
      'Test Document': 'Test Document',
      'thesis': 'Thesis',
      'Thesis': 'Thesis',
    };
    return labels[docType] || docType;
  };

  const getDocTypeColor = (docType) => {
    const normalizedType = docType?.toLowerCase?.().replace(/\s+/g, '_') || '';
    const colors = {
      'proposal': { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', shadow: 'rgba(99, 102, 241, 0.4)' },
      'design_document': { bg: 'linear-gradient(135deg, #ec4899, #f97316)', shadow: 'rgba(236, 72, 153, 0.4)' },
      'test_document': { bg: 'linear-gradient(135deg, #14b8a6, #06b6d4)', shadow: 'rgba(20, 184, 166, 0.4)' },
      'thesis': { bg: 'linear-gradient(135deg, #f59e0b, #eab308)', shadow: 'rgba(245, 158, 11, 0.4)' },
    };
    return colors[normalizedType] || { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', shadow: 'rgba(99, 102, 241, 0.4)' };
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
      <div style={styles.bgDecor1}></div>
      <div style={styles.bgDecor2}></div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Submissions</h1>
          <p style={styles.subtitle}>View your uploaded documents and feedback</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#ef4444">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {submissions.length === 0 && !error ? (
          <div style={styles.emptyState}>
            <svg viewBox="0 0 100 100" width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="15" width="60" height="70" rx="6" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />
              <path d="M35 35h30M35 45h30M35 55h20" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
              <circle cx="70" cy="70" r="20" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
              <path d="M65 70h10M70 65v10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h2 style={styles.emptyTitle}>No Submissions Yet</h2>
            <p style={styles.emptyText}>You haven't uploaded any documents yet. Go to Upload Documents to submit your FYP files.</p>
          </div>
        ) : (
          <div style={styles.submissionsList}>
            {submissions.map((item, index) => {
              const submission = item.submission;
              const feedbacks = item.feedbacks || [];
              const fileId = submission.file_id;
              const docType = submission.doc_type || submission.documentType?.doc_type;
              const colors = getDocTypeColor(docType);
              const isExpanded = expandedFeedback === fileId;

              return (
                <div key={fileId} style={styles.submissionCard}>
                  <div style={styles.submissionRow}>
                    <div style={{
                      ...styles.docTypeBadge,
                      background: colors.bg,
                      boxShadow: `0 4px 15px ${colors.shadow}`,
                    }}>
                      {getDocTypeLabel(docType)}
                    </div>

                    <div style={styles.fileInfo}>
                      <h3 style={styles.fileName}>{submission.filename}</h3>
                      <div style={styles.fileMeta}>
                        <span style={styles.metaItem}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="#64748b">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5v4h3l-4 5z" />
                          </svg>
                          {formatDateTime(submission.submission_datetime)}
                        </span>
                        <span style={{
                          ...styles.statusBadge,
                          background: submission.is_approved 
                            ? 'rgba(16, 185, 129, 0.15)' 
                            : 'rgba(245, 158, 11, 0.15)',
                          color: submission.is_approved ? '#10b981' : '#f59e0b',
                        }}>
                          {submission.is_approved ? '✓ Approved' : '⏳ Pending'}
                        </span>
                        {submission.submitted_late && (
                          <span style={styles.lateBadge}>Late Submission</span>
                        )}
                      </div>
                    </div>

                    <div style={styles.actions}>
                      <button
                        style={styles.downloadBtn}
                        onClick={() => handleDownload(fileId, submission.filename)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                        </svg>
                        Download
                      </button>
                      <button
                        style={{
                          ...styles.feedbackBtn,
                          background: isExpanded 
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                            : 'transparent',
                          color: isExpanded ? 'white' : '#6366f1',
                        }}
                        onClick={() => toggleFeedback(fileId)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        </svg>
                        Feedback ({feedbacks.length})
                        <svg 
                          viewBox="0 0 24 24" 
                          width="16" 
                          height="16" 
                          fill="currentColor"
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.feedbackSection}>
                      {feedbacks.length === 0 ? (
                        <div style={styles.noFeedback}>
                          <svg viewBox="0 0 24 24" width="40" height="40" fill="#94a3b8">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                          </svg>
                          <p>No feedback yet. Your supervisor will provide feedback soon.</p>
                        </div>
                      ) : (
                        <div style={styles.feedbackList}>
                          {feedbacks.map((feedback, fbIndex) => (
                            <div key={feedback.id || fbIndex} style={styles.feedbackItem}>
                              <div style={styles.feedbackHeader}>
                                <div style={styles.feedbackAvatar}>
                                  <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                  </svg>
                                </div>
                                <div style={styles.feedbackMeta}>
                                  <span style={styles.feedbackAuthor}>Supervisor</span>
                                  <span style={styles.feedbackTime}>
                                    {formatDateTime(feedback.submittedAt)}
                                  </span>
                                </div>
                              </div>
                              <div style={styles.feedbackContent}>
                                {feedback.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "40px 20px",
  },
  bgDecor1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
    animation: "float 6s ease-in-out infinite",
  },
  bgDecor2: {
    position: "absolute",
    bottom: "-15%",
    left: "-10%",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
    animation: "float 8s ease-in-out infinite reverse",
  },
  content: {
    maxWidth: "1000px",
    margin: "0 auto",
    position: "relative",
    zIndex: 10,
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "10px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: 400,
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.5)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "30px",
  },
  errorText: {
    color: "#f87171",
    fontSize: "0.95rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 40px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1e293b",
    marginTop: "20px",
    marginBottom: "10px",
  },
  emptyText: {
    fontSize: "1rem",
    color: "#64748b",
    maxWidth: "400px",
    margin: "0 auto",
  },
  submissionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  submissionCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  submissionRow: {
    display: "flex",
    alignItems: "center",
    padding: "20px 24px",
    gap: "20px",
    flexWrap: "wrap",
  },
  docTypeBadge: {
    padding: "8px 16px",
    borderRadius: "8px",
    color: "white",
    fontSize: "0.85rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  fileInfo: {
    flex: 1,
    minWidth: "200px",
  },
  fileName: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "6px",
    wordBreak: "break-all",
  },
  fileMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.85rem",
    color: "#64748b",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "50px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  lateBadge: {
    padding: "4px 10px",
    borderRadius: "50px",
    fontSize: "0.75rem",
    fontWeight: 600,
    background: "rgba(239, 68, 68, 0.15)",
    color: "#ef4444",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  downloadBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 18px",
    background: "linear-gradient(135deg, #10b981, #34d399)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
  },
  feedbackBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 18px",
    border: "2px solid #6366f1",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  feedbackSection: {
    borderTop: "1px solid #e2e8f0",
    padding: "20px 24px",
    background: "#f8fafc",
    animation: "fadeIn 0.3s ease",
  },
  noFeedback: {
    textAlign: "center",
    padding: "30px",
    color: "#64748b",
  },
  feedbackList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  feedbackItem: {
    background: "white",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
  },
  feedbackHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  feedbackAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackMeta: {
    display: "flex",
    flexDirection: "column",
  },
  feedbackAuthor: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#1e293b",
  },
  feedbackTime: {
    fontSize: "0.8rem",
    color: "#94a3b8",
  },
  feedbackContent: {
    fontSize: "0.95rem",
    color: "#475569",
    lineHeight: 1.6,
    paddingLeft: "48px",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255, 255, 255, 0.2)",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "white",
    marginTop: "20px",
    fontSize: "1.1rem",
  },
};
