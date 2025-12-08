import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function MonProgress() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // Check authorization
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");

    if (!isAuthenticated || isAuthenticated !== "true") {
      navigate("/facLogin");
      return;
    }

    if (!userRole || userRole.toLowerCase() !== "fyp committee member") {
      navigate("/");
      return;
    }
  }, [navigate]);

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // FYP Committee Member uses /allstudents to get all students
      const response = await axios.get(`${API_BASE_URL}/faculty/allstudents`, {
        withCredentials: true,
      });
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setMessage({
          text: "Session expired or unauthorized. Please login again.",
          type: "error",
        });
      } else {
        setMessage({
          text: error.response?.data?.message || "Failed to load students.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentSubmissions = async (studentId) => {
    setSubmissionsLoading(true);
    try {
      // Extract numeric ID from STU-X format
      let numericId = studentId;
      if (typeof studentId === "string" && studentId.startsWith("STU-")) {
        numericId = parseInt(studentId.substring(4));
      }

      // Use the correct endpoint from HomeController
      const response = await axios.get(
        `${API_BASE_URL}/submissions/${numericId}`,
        {
          withCredentials: true,
        }
      );
      setStudentSubmissions(response.data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setStudentSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    const studentId = student.numericId || student.id;
    fetchStudentSubmissions(studentId);
  };

  const calculateProgress = (student) => {
    let completed = 0;
    const total = 4;
    if (!student.proposal) completed++;
    if (!student.design_document && !student.designDocument) completed++;
    if (!student.test_document && !student.testDocument) completed++;
    if (!student.thesis) completed++;
    return Math.round((completed / total) * 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "#10b981";
    if (progress >= 50) return "#f59e0b";
    if (progress >= 25) return "#3b82f6";
    return "#ef4444";
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <div style={styles.iconRing}></div>
            <div style={styles.iconWrapper}>
              <span style={{ fontSize: "28px" }}>📊</span>
            </div>
          </div>
          <h1 style={styles.title}>
            <span style={styles.titleGradient}>Monitor Student Progress</span>
          </h1>
          <p style={styles.subtitle}>
            <span style={styles.sparkle}>✨</span>
            Track and manage your students' FYP journey
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            style={{
              ...styles.messageBox,
              ...(message.type === "error"
                ? styles.errorMessage
                : styles.successMessage),
            }}
          >
            <span style={{ marginRight: "8px" }}>
              {message.type === "error" ? "⚠️" : "✅"}
            </span>
            {message.text}
          </div>
        )}

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search students by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={styles.clearSearch}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Students List */}
          <div style={styles.studentsPanel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>
                <span style={{ marginRight: "8px" }}>👨‍🎓</span>
                My Students
                <span style={styles.badge}>{filteredStudents.length}</span>
              </h3>
            </div>

            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={{ fontSize: "48px", marginBottom: "16px" }}>📭</span>
                <p style={styles.emptyText}>
                  {searchTerm
                    ? "No students match your search"
                    : "No students assigned yet"}
                </p>
              </div>
            ) : (
              <div style={styles.studentsList}>
                {filteredStudents.map((student, index) => {
                  const progress = calculateProgress(student);
                  const isSelected =
                    selectedStudent?.id === student.id ||
                    selectedStudent?.numericId === student.numericId;

                  return (
                    <div
                      key={student.id || student.numericId || index}
                      style={{
                        ...styles.studentCard,
                        ...(isSelected ? styles.studentCardSelected : {}),
                        ...(hoveredCard === index ? styles.studentCardHover : {}),
                      }}
                      onClick={() => handleStudentSelect(student)}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={styles.studentAvatar}>
                        {student.name?.charAt(0)?.toUpperCase() || "S"}
                      </div>
                      <div style={styles.studentInfo}>
                        <h4 style={styles.studentName}>{student.name}</h4>
                        <p style={styles.studentEmail}>{student.email}</p>
                        <p style={styles.studentId}>
                          {student.id || `STU-${student.numericId}`}
                        </p>
                      </div>
                      <div style={styles.progressContainer}>
                        <div style={styles.progressBar}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${progress}%`,
                              backgroundColor: getProgressColor(progress),
                            }}
                          ></div>
                        </div>
                        <span
                          style={{
                            ...styles.progressText,
                            color: getProgressColor(progress),
                          }}
                        >
                          {progress}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress Details Panel */}
          <div style={styles.detailsPanel}>
            {selectedStudent ? (
              <>
                <div style={styles.panelHeader}>
                  <h3 style={styles.panelTitle}>
                    <span style={{ marginRight: "8px" }}>📋</span>
                    Progress Details
                  </h3>
                </div>

                {/* Student Info Card */}
                <div style={styles.infoCard}>
                  <div style={styles.infoHeader}>
                    <div style={styles.largeAvatar}>
                      {selectedStudent.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div>
                      <h3 style={styles.infoName}>{selectedStudent.name}</h3>
                      <p style={styles.infoEmail}>{selectedStudent.email}</p>
                      <p style={styles.infoId}>
                        {selectedStudent.id ||
                          `STU-${selectedStudent.numericId}`}
                      </p>
                    </div>
                  </div>

                  <div style={styles.overallProgress}>
                    <div style={styles.progressLabel}>
                      <span>Overall Progress</span>
                      <span
                        style={{
                          color: getProgressColor(
                            calculateProgress(selectedStudent)
                          ),
                          fontWeight: "bold",
                        }}
                      >
                        {calculateProgress(selectedStudent)}%
                      </span>
                    </div>
                    <div style={styles.largeProgressBar}>
                      <div
                        style={{
                          ...styles.largeProgressFill,
                          width: `${calculateProgress(selectedStudent)}%`,
                          backgroundColor: getProgressColor(
                            calculateProgress(selectedStudent)
                          ),
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Document Status Cards */}
                <div style={styles.documentsGrid}>
                  {[
                    {
                      name: "Proposal",
                      key: "proposal",
                      icon: "📝",
                      color: "#8b5cf6",
                    },
                    {
                      name: "Design Document",
                      key: "design_document",
                      altKey: "designDocument",
                      icon: "📐",
                      color: "#3b82f6",
                    },
                    {
                      name: "Test Document",
                      key: "test_document",
                      altKey: "testDocument",
                      icon: "🧪",
                      color: "#10b981",
                    },
                    {
                      name: "Thesis",
                      key: "thesis",
                      icon: "📚",
                      color: "#f59e0b",
                    },
                  ].map((doc, idx) => {
                    const canSubmit =
                      selectedStudent[doc.key] ||
                      (doc.altKey && selectedStudent[doc.altKey]);
                    const isCompleted = !canSubmit;

                    return (
                      <div
                        key={idx}
                        style={{
                          ...styles.documentCard,
                          borderColor: isCompleted ? doc.color : "#374151",
                          ...(hoveredBtn === `doc-${idx}`
                            ? styles.documentCardHover
                            : {}),
                        }}
                        onMouseEnter={() => setHoveredBtn(`doc-${idx}`)}
                        onMouseLeave={() => setHoveredBtn(null)}
                      >
                        <div
                          style={{
                            ...styles.documentIcon,
                            backgroundColor: `${doc.color}20`,
                          }}
                        >
                          <span style={{ fontSize: "24px" }}>{doc.icon}</span>
                        </div>
                        <h4 style={styles.documentName}>{doc.name}</h4>
                        <div
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: isCompleted
                              ? `${doc.color}20`
                              : "#fef3c720",
                            color: isCompleted ? doc.color : "#fcd34d",
                          }}
                        >
                          {isCompleted ? "✓ Submitted" : "⏳ Pending"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submissions History */}
                <div style={styles.submissionsSection}>
                  <h4 style={styles.sectionTitle}>
                    <span style={{ marginRight: "8px" }}>📂</span>
                    Submission History
                  </h4>

                  {submissionsLoading ? (
                    <div style={styles.loadingSmall}>
                      <div style={styles.spinnerSmall}></div>
                      <span>Loading submissions...</span>
                    </div>
                  ) : studentSubmissions.length === 0 ? (
                    <div style={styles.noSubmissions}>
                      <span style={{ fontSize: "32px", marginBottom: "8px" }}>
                        📭
                      </span>
                      <p>No submissions yet</p>
                    </div>
                  ) : (
                    <div style={styles.submissionsList}>
                      {studentSubmissions.map((submission, idx) => (
                        <div key={idx} style={styles.submissionItem}>
                          <div style={styles.submissionIcon}>
                            {submission.is_approved ? "✅" : "⏳"}
                          </div>
                          <div style={styles.submissionInfo}>
                            <p style={styles.submissionType}>
                              {submission.doc_type ||
                                submission.documentType?.doc_type ||
                                "Document"}
                            </p>
                            <p style={styles.submissionFile}>
                              {submission.filename}
                            </p>
                            <p style={styles.submissionDate}>
                              {submission.submission_datetime
                                ? new Date(
                                    submission.submission_datetime
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </p>
                          </div>
                          <div
                            style={{
                              ...styles.approvalBadge,
                              backgroundColor: submission.is_approved
                                ? "#10b98120"
                                : "#f59e0b20",
                              color: submission.is_approved
                                ? "#10b981"
                                : "#f59e0b",
                            }}
                          >
                            {submission.is_approved ? "Approved" : "Pending"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={styles.selectPrompt}>
                <div style={styles.selectIcon}>👈</div>
                <h3 style={styles.selectTitle}>Select a Student</h3>
                <p style={styles.selectText}>
                  Click on a student from the list to view their detailed
                  progress and submissions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchStudents}
          style={{
            ...styles.refreshBtn,
            ...(hoveredBtn === "refresh" ? styles.refreshBtnHover : {}),
          }}
          onMouseEnter={() => setHoveredBtn("refresh")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <span style={{ marginRight: "8px" }}>🔄</span>
          Refresh Data
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -15px) scale(1.02); }
          50% { transform: translate(-5px, 10px) scale(0.98); }
          75% { transform: translate(-10px, -5px) scale(1.01); }
        }

        @keyframes particleFloat {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          10% { opacity: 1; transform: translateY(-10px) scale(1); }
          90% { opacity: 1; transform: translateY(-80px) scale(1); }
          100% { opacity: 0; transform: translateY(-100px) scale(0); }
        }

        @keyframes ringRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
        }

        .particle {
          animation: particleFloat linear infinite;
        }

        * {
          font-family: 'Poppins', sans-serif;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  },
  bgContainer: {
    position: "fixed",
    inset: 0,
    overflow: "hidden",
    zIndex: 0,
  },
  bgOrb1: {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
    top: "-200px",
    left: "-200px",
    animation: "float 20s ease-in-out infinite",
  },
  bgOrb2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
    bottom: "-150px",
    right: "-150px",
    animation: "float 25s ease-in-out infinite reverse",
  },
  bgOrb3: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "float 18s ease-in-out infinite",
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
  },
  particles: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },
  particle: {
    position: "absolute",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "rgba(139, 92, 246, 0.6)",
    boxShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    padding: "40px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  headerIcon: {
    position: "relative",
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
  },
  iconRing: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    border: "2px solid transparent",
    borderTopColor: "#8b5cf6",
    borderRightColor: "#06b6d4",
    borderRadius: "50%",
    animation: "ringRotate 3s linear infinite",
  },
  iconWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "12px",
  },
  titleGradient: {
    background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  sparkle: {
    animation: "pulse 2s ease-in-out infinite",
  },
  messageBox: {
    padding: "16px 24px",
    borderRadius: "12px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "500",
    backdropFilter: "blur(10px)",
  },
  errorMessage: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
  },
  successMessage: {
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#6ee7b7",
  },
  searchContainer: {
    marginBottom: "32px",
  },
  searchWrapper: {
    position: "relative",
    maxWidth: "500px",
    margin: "0 auto",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "18px",
  },
  searchInput: {
    width: "100%",
    padding: "14px 48px",
    borderRadius: "16px",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  clearSearch: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    color: "#94a3b8",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    gap: "32px",
  },
  studentsPanel: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    padding: "24px",
    backdropFilter: "blur(20px)",
    maxHeight: "calc(100vh - 300px)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  detailsPanel: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    padding: "24px",
    backdropFilter: "blur(20px)",
    maxHeight: "calc(100vh - 300px)",
    overflow: "auto",
  },
  panelHeader: {
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  panelTitle: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    margin: 0,
  },
  badge: {
    marginLeft: "12px",
    padding: "4px 12px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    fontSize: "12px",
    fontWeight: "600",
    color: "#fff",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "3px solid rgba(139, 92, 246, 0.2)",
    borderTopColor: "#8b5cf6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    color: "#64748b",
  },
  emptyText: {
    fontSize: "14px",
    textAlign: "center",
    margin: 0,
  },
  studentsList: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "8px",
  },
  studentCard: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  studentCardHover: {
    background: "rgba(139, 92, 246, 0.1)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    transform: "translateX(4px)",
  },
  studentCardSelected: {
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.5)",
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
  },
  studentAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    marginRight: "14px",
    flexShrink: 0,
  },
  studentInfo: {
    flex: 1,
    minWidth: 0,
  },
  studentName: {
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    margin: "0 0 4px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  studentEmail: {
    color: "#94a3b8",
    fontSize: "12px",
    margin: "0 0 2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  studentId: {
    color: "#64748b",
    fontSize: "11px",
    margin: 0,
  },
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: "12px",
    width: "60px",
  },
  progressBar: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    background: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    marginBottom: "4px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.5s ease",
  },
  progressText: {
    fontSize: "11px",
    fontWeight: "600",
  },
  infoCard: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid rgba(139, 92, 246, 0.2)",
  },
  infoHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "24px",
  },
  largeAvatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "28px",
    fontWeight: "700",
    marginRight: "20px",
    boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
  },
  infoName: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 4px 0",
  },
  infoEmail: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0 0 4px 0",
  },
  infoId: {
    color: "#64748b",
    fontSize: "12px",
    margin: 0,
  },
  overallProgress: {
    padding: "0",
  },
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "10px",
  },
  largeProgressBar: {
    width: "100%",
    height: "12px",
    borderRadius: "6px",
    background: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  largeProgressFill: {
    height: "100%",
    borderRadius: "6px",
    transition: "width 0.5s ease",
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
  },
  documentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  documentCard: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "16px",
    padding: "20px",
    border: "2px solid",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  documentCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  },
  documentIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  documentName: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 10px 0",
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },
  submissionsSection: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 16px 0",
    display: "flex",
    alignItems: "center",
  },
  loadingSmall: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    color: "#94a3b8",
    fontSize: "14px",
  },
  spinnerSmall: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(139, 92, 246, 0.2)",
    borderTopColor: "#8b5cf6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "10px",
  },
  noSubmissions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px",
    color: "#64748b",
    fontSize: "14px",
  },
  submissionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  submissionItem: {
    display: "flex",
    alignItems: "center",
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  submissionIcon: {
    fontSize: "24px",
    marginRight: "14px",
  },
  submissionInfo: {
    flex: 1,
  },
  submissionType: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 4px 0",
  },
  submissionFile: {
    color: "#94a3b8",
    fontSize: "12px",
    margin: "0 0 2px 0",
    wordBreak: "break-all",
  },
  submissionDate: {
    color: "#64748b",
    fontSize: "11px",
    margin: 0,
  },
  approvalBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    marginLeft: "12px",
  },
  selectPrompt: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    minHeight: "400px",
    textAlign: "center",
    padding: "40px",
  },
  selectIcon: {
    fontSize: "64px",
    marginBottom: "24px",
    animation: "pulse 2s ease-in-out infinite",
  },
  selectTitle: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  selectText: {
    color: "#94a3b8",
    fontSize: "14px",
    maxWidth: "300px",
    lineHeight: "1.6",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "32px auto 0",
    padding: "14px 32px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
  },
  refreshBtnHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 0 40px rgba(139, 92, 246, 0.5)",
  },
};
