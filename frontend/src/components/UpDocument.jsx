import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function UpDocument() {
  const [studentStatus, setStudentStatus] = useState(null);
  const [supervisorAssigned, setSupervisorAssigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState({});
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(null);

  const proposalRef = useRef(null);
  const designRef = useRef(null);
  const testRef = useRef(null);
  const thesisRef = useRef(null);

  const documentTypes = [
    {
      id: "proposal",
      title: "Proposal",
      description: "Submit your project proposal document",
      ref: proposalRef,
      canSubmit: studentStatus?.proposal,
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      shadowColor: "rgba(99, 102, 241, 0.4)",
      icon: "📋",
    },
    {
      id: "design_document",
      title: "Design Document",
      description: "Upload your system design & architecture",
      ref: designRef,
      canSubmit: studentStatus?.design_document,
      gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
      shadowColor: "rgba(236, 72, 153, 0.4)",
      icon: "🎨",
    },
    {
      id: "test_document",
      title: "Test Document",
      description: "Submit your testing documentation",
      ref: testRef,
      canSubmit: studentStatus?.test_document,
      gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)",
      shadowColor: "rgba(20, 184, 166, 0.4)",
      icon: "🧪",
    },
    {
      id: "thesis",
      title: "Thesis",
      description: "Upload your final thesis document",
      ref: thesisRef,
      canSubmit: studentStatus?.thesis,
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      shadowColor: "rgba(245, 158, 11, 0.4)",
      icon: "📚",
    },
  ];

  useEffect(() => {
    fetchStudentStatus();
  }, []);

  const fetchStudentStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student/status`, {
        withCredentials: true,
      });
      setStudentStatus(response.data);
      setSupervisorAssigned(response.data.supervisorId !== -1);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student status:", err);
      setError("Failed to fetch student status. Please try again.");
      setLoading(false);
    }
  };

  const handleUpload = async (docType, file) => {
    if (!file) return;

    setUploadingDoc(docType);
    setError("");

    try {
      const formData = new FormData();
      
      const metadata = {
        filename: file.name,
      };
      
      formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      formData.append("doc_type", docType);
      formData.append("file", file);

      await axios.post(`${API_BASE_URL}/student/upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess((prev) => ({ ...prev, [docType]: true }));
      
      await fetchStudentStatus();
      
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload document. Please try again.");
    } finally {
      setUploadingDoc(null);
    }
  };

  const triggerFileInput = (ref) => {
    ref.current?.click();
  };

  const handleDragOver = (e, docId) => {
    e.preventDefault();
    setDragOver(docId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e, doc) => {
    e.preventDefault();
    setDragOver(null);
    if (!supervisorAssigned) return;
    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(doc.id, file);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading documents...</p>
        </div>
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
      {/* Background Elements */}
      <div style={styles.bgOrb1}></div>
      <div style={styles.bgOrb2}></div>
      <div style={styles.bgOrb3}></div>
      <div style={styles.gridPattern}></div>

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
            </svg>
          </div>
          <h1 style={styles.title}>Upload Documents</h1>
          <p style={styles.subtitle}>
            Submit your FYP documents for review and evaluation
          </p>
        </div>

        {/* Alert for no supervisor */}
        {!supervisorAssigned && (
          <div style={styles.alertBox}>
            <div style={styles.alertIconWrapper}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <div style={styles.alertContent}>
              <strong style={styles.alertTitle}>Supervisor Not Assigned</strong>
              <p style={styles.alertMessage}>You cannot upload documents until a supervisor is assigned to you. Please contact your department.</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={styles.errorBox}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
            <button style={styles.errorClose} onClick={() => setError("")}>×</button>
          </div>
        )}

        {/* Document Cards Grid */}
        <div style={styles.grid}>
          {documentTypes.map((doc) => {
            const isBlocked = !supervisorAssigned;
            const isUploaded = supervisorAssigned && (!doc.canSubmit || uploadSuccess[doc.id]);
            const isUploading = uploadingDoc === doc.id;
            const isDraggedOver = dragOver === doc.id;

            return (
              <div
                key={doc.id}
                style={{
                  ...styles.card,
                  ...(isDraggedOver && !isBlocked ? styles.cardDragOver : {}),
                  ...(isBlocked ? styles.cardBlocked : {}),
                }}
                onDragOver={(e) => handleDragOver(e, doc.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, doc)}
              >
                {/* Card Glow Effect */}
                <div style={{...styles.cardGlow, background: doc.gradient, opacity: isDraggedOver ? 0.3 : 0}}></div>

                {/* Status Ribbon */}
                {isUploaded && (
                  <div style={styles.successRibbon}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    Submitted
                  </div>
                )}

                {isBlocked && (
                  <div style={styles.blockedRibbon}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
                    </svg>
                    Blocked
                  </div>
                )}

                {/* Icon Section */}
                <div style={{...styles.iconWrapper, background: doc.gradient, boxShadow: `0 15px 40px ${doc.shadowColor}`}}>
                  <span style={styles.iconEmoji}>{doc.icon}</span>
                </div>

                {/* Content */}
                <h3 style={styles.cardTitle}>{doc.title}</h3>
                <p style={styles.cardDescription}>{doc.description}</p>

                {/* File Type Info */}
                <div style={styles.fileTypeInfo}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                  <span>PDF, DOC, DOCX</span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={doc.ref}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleUpload(doc.id, e.target.files[0]);
                    }
                  }}
                />

                {/* Upload Button */}
                <button
                  style={{
                    ...styles.uploadButton,
                    background: isBlocked || isUploaded ? 'rgba(148, 163, 184, 0.5)' : doc.gradient,
                    boxShadow: isBlocked || isUploaded ? 'none' : `0 10px 30px ${doc.shadowColor}`,
                    cursor: isBlocked || isUploaded || isUploading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={isBlocked || isUploaded || isUploading}
                  onClick={() => triggerFileInput(doc.ref)}
                >
                  {isUploading ? (
                    <>
                      <div style={styles.buttonSpinner}></div>
                      Uploading...
                    </>
                  ) : isUploaded ? (
                    <>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      Already Submitted
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
                      </svg>
                      Choose File
                    </>
                  )}
                </button>

                {/* Drag & Drop hint */}
                {!isBlocked && !isUploaded && (
                  <p style={styles.dragHint}>or drag and drop file here</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div style={styles.helpSection}>
          <div style={styles.helpIcon}>💡</div>
          <div style={styles.helpContent}>
            <h4 style={styles.helpTitle}>Need Help?</h4>
            <p style={styles.helpText}>
              Make sure your documents are in PDF, DOC, or DOCX format. Maximum file size is 10MB. 
              Contact your supervisor if you face any issues with submissions.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "40px 20px",
  },
  bgOrb1: {
    position: "absolute",
    top: "-100px",
    right: "-50px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent 70%)",
    animation: "float 8s ease-in-out infinite",
  },
  bgOrb2: {
    position: "absolute",
    bottom: "-150px",
    left: "-100px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236, 72, 153, 0.15), transparent 70%)",
    animation: "float 10s ease-in-out infinite reverse",
  },
  bgOrb3: {
    position: "absolute",
    top: "40%",
    right: "20%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(20, 184, 166, 0.15), transparent 70%)",
    animation: "pulse 6s ease-in-out infinite",
  },
  gridPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
    pointerEvents: "none",
  },
  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 10,
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  headerIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    color: "white",
    boxShadow: "0 15px 40px rgba(99, 102, 241, 0.4)",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: "12px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: 400,
  },
  alertBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    background: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: "16px",
    padding: "20px 24px",
    marginBottom: "32px",
  },
  alertIconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "rgba(245, 158, 11, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fbbf24",
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: "#fbbf24",
    fontSize: "1rem",
    display: "block",
    marginBottom: "4px",
  },
  alertMessage: {
    color: "rgba(251, 191, 36, 0.8)",
    fontSize: "0.9rem",
    margin: 0,
    lineHeight: 1.5,
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "12px",
    padding: "14px 20px",
    marginBottom: "24px",
    color: "#f87171",
    fontSize: "0.95rem",
  },
  errorClose: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "#f87171",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: 1,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  card: {
    position: "relative",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "32px 28px",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  cardDragOver: {
    borderColor: "rgba(99, 102, 241, 0.5)",
    transform: "scale(1.02)",
  },
  cardBlocked: {
    opacity: 0.6,
  },
  cardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "24px",
    transition: "opacity 0.4s ease",
    pointerEvents: "none",
  },
  successRibbon: {
    position: "absolute",
    top: "16px",
    right: "-30px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    padding: "6px 40px",
    fontSize: "0.75rem",
    fontWeight: 700,
    transform: "rotate(45deg)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
  },
  blockedRibbon: {
    position: "absolute",
    top: "16px",
    right: "-30px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    padding: "6px 40px",
    fontSize: "0.75rem",
    fontWeight: 700,
    transform: "rotate(45deg)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    position: "relative",
  },
  iconEmoji: {
    fontSize: "2.5rem",
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "white",
    marginBottom: "8px",
  },
  cardDescription: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: "16px",
    lineHeight: 1.5,
  },
  fileTypeInfo: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50px",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.8rem",
    marginBottom: "20px",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    padding: "14px 24px",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontSize: "0.95rem",
    fontWeight: 600,
    transition: "all 0.3s ease",
  },
  buttonSpinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  dragHint: {
    marginTop: "12px",
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.4)",
    margin: "12px 0 0",
  },
  helpSection: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
    borderRadius: "20px",
    padding: "24px 28px",
    border: "1px solid rgba(99, 102, 241, 0.2)",
  },
  helpIcon: {
    fontSize: "2rem",
    flexShrink: 0,
  },
  helpContent: {},
  helpTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "white",
    margin: "0 0 8px",
  },
  helpText: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 1.7,
    margin: 0,
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  loadingCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "50px 60px",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255, 255, 255, 0.1)",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: "20px",
    fontSize: "1rem",
    fontWeight: 500,
  },
};
