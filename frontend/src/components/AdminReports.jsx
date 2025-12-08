import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export default function AdminReports() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [stats, setStats] = useState({
    totalStudents: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
    gradedStudents: 0
  });

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || userRole !== 'admin') {
      navigate('/admin-login');
      return;
    }

    fetchStudentData();
  }, [navigate]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      // Fetch all student reports (admin-specific endpoint)
      const response = await axios.get(
        `${API_BASE_URL}/faculty/admin/studentreports`,
        { withCredentials: true }
      );
      
      const studentData = response.data || [];
      setStudents(studentData);
      
      // Calculate stats
      const total = studentData.length;
      const graded = studentData.filter(s => s.isGraded).length;
      
      setStats({
        totalStudents: total,
        gradedStudents: graded,
        pendingGrades: total - graded
      });
      
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const name = student.studentName?.toLowerCase() || '';
      const id = student.studentId?.toString() || '';
      const email = student.email?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      return name.includes(search) || id.includes(search) || email.includes(search);
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.studentName || '';
          bVal = b.studentName || '';
          break;
        case 'id':
          aVal = a.studentId || 0;
          bVal = b.studentId || 0;
          break;
        case 'grade':
          aVal = a.grade || 'Z';
          bVal = b.grade || 'Z';
          break;
        case 'total':
          aVal = a.totalScore || 0;
          bVal = b.totalScore || 0;
          break;
        default:
          aVal = a.studentName || '';
          bVal = b.studentName || '';
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const getGradeColor = (grade) => {
    const colors = {
      'A': '#22c55e',
      'B': '#3b82f6',
      'C': '#f59e0b',
      'D': '#f97316',
      'F': '#ef4444',
    };
    return colors[grade] || '#6b7280';
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading student reports...</p>
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
      {/* Background */}
      <div style={styles.bgOrb1}></div>
      <div style={styles.bgOrb2}></div>
      <div style={styles.bgOrb3}></div>

      <div style={styles.content}>
        {/* Back Button */}
        <button
          style={styles.backBtn}
          onClick={() => navigate('/Dashboard5')}
          className="back-btn"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>📊</div>
          <h1 style={styles.title}>Student Reports</h1>
          <p style={styles.subtitle}>View comprehensive reports and analytics of all students</p>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIconBox, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              👥
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.totalStudents}</span>
              <span style={styles.statLabel}>Total Students</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIconBox, background: 'linear-gradient(135deg, #22c55e, #16a34a)'}}>
              ✅
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.gradedStudents}</span>
              <span style={styles.statLabel}>Graded Students</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIconBox, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
              ⏳
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{stats.pendingGrades}</span>
              <span style={styles.statLabel}>Pending Grades</span>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div style={styles.controlsSection}>
          <div style={styles.searchBox}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="rgba(255,255,255,0.5)" style={{marginRight: '10px'}}>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.resultCount}>
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => handleSort('id')}>
                  Student ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th} onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th}>Email</th>
                <th style={styles.th} onClick={() => handleSort('total')}>
                  Total Score {sortBy === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th} onClick={() => handleSort('grade')}>
                  Grade {sortBy === 'grade' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={styles.th}>Rubrics</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>
                    {students.length === 0 ? 'No students found' : 'No matching students'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student.studentId || index} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.idBadge}>STU-{student.studentId}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.studentName}>{student.studentName || 'N/A'}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.emailText}>{student.email || 'N/A'}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.scoreText}>
                        {student.totalScore !== undefined ? `${student.totalScore}/30` : 'N/A'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {student.grade ? (
                        <span style={{
                          ...styles.gradeBadge,
                          background: getGradeColor(student.grade),
                        }}>
                          {student.grade}
                        </span>
                      ) : (
                        <span style={styles.pendingBadge}>Pending</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.rubricsList}>
                        {student.rubric1 !== undefined ? (
                          <>
                            <span style={styles.rubricItem} title="OOP & Design">R1: {student.rubric1}</span>
                            <span style={styles.rubricItem} title="Workflow">R2: {student.rubric2}</span>
                            <span style={styles.rubricItem} title="Implementation">R3: {student.rubric3}</span>
                            <span style={styles.rubricItem} title="GitHub">R4: {student.rubric4}</span>
                            <span style={styles.rubricItem} title="Code Quality">R5: {student.rubric5}</span>
                            <span style={styles.rubricItem} title="UI/UX">R6: {student.rubric6}</span>
                          </>
                        ) : (
                          <span style={styles.naText}>Not graded</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Graphs Section */}
        <div style={styles.graphsSection}>
          <h2 style={styles.graphsTitle}>📈 Analytics & Charts</h2>
          
          <div style={styles.graphsGrid}>
            {/* Grade Distribution Chart */}
            <div style={styles.graphCard}>
              <h3 style={styles.graphCardTitle}>Grade Distribution</h3>
              <div style={styles.barChart}>
                {(() => {
                  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
                  students.forEach(s => {
                    if (s.grade && gradeCounts.hasOwnProperty(s.grade)) {
                      gradeCounts[s.grade]++;
                    }
                  });
                  const maxCount = Math.max(...Object.values(gradeCounts), 1);
                  
                  return Object.entries(gradeCounts).map(([grade, count]) => (
                    <div key={grade} style={styles.barItem}>
                      <div style={styles.barLabel}>{grade}</div>
                      <div style={styles.barContainer}>
                        <div 
                          style={{
                            ...styles.bar,
                            width: `${(count / maxCount) * 100}%`,
                            background: getGradeColor(grade),
                          }}
                        ></div>
                      </div>
                      <div style={styles.barValue}>{count}</div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Grading Status Pie Chart */}
            <div style={styles.graphCard}>
              <h3 style={styles.graphCardTitle}>Grading Status</h3>
              <div style={styles.pieChartContainer}>
                <div style={styles.pieChart}>
                  <svg viewBox="0 0 100 100" style={styles.pieSvg}>
                    {(() => {
                      const graded = students.filter(s => s.isGraded).length;
                      const pending = students.length - graded;
                      const total = students.length || 1;
                      const gradedPercent = (graded / total) * 100;
                      const pendingPercent = (pending / total) * 100;
                      
                      // Calculate stroke-dasharray for the pie chart
                      const circumference = 2 * Math.PI * 40; // radius = 40
                      const gradedDash = (gradedPercent / 100) * circumference;
                      const pendingDash = (pendingPercent / 100) * circumference;
                      
                      return (
                        <>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="20"
                            strokeDasharray={`${gradedDash} ${circumference}`}
                            transform="rotate(-90 50 50)"
                          />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20"
                            strokeDasharray={`${pendingDash} ${circumference}`}
                            strokeDashoffset={-gradedDash}
                            transform="rotate(-90 50 50)"
                          />
                        </>
                      );
                    })()}
                  </svg>
                  <div style={styles.pieCenter}>
                    <span style={styles.pieCenterValue}>{students.length}</span>
                    <span style={styles.pieCenterLabel}>Total</span>
                  </div>
                </div>
                <div style={styles.pieLegend}>
                  <div style={styles.legendItem}>
                    <span style={{...styles.legendDot, background: '#22c55e'}}></span>
                    <span>Graded ({stats.gradedStudents})</span>
                  </div>
                  <div style={styles.legendItem}>
                    <span style={{...styles.legendDot, background: '#f59e0b'}}></span>
                    <span>Pending ({stats.pendingGrades})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Rubric Scores */}
            <div style={styles.graphCard}>
              <h3 style={styles.graphCardTitle}>Average Rubric Scores</h3>
              <div style={styles.rubricChart}>
                {(() => {
                  const rubrics = [
                    { key: 'rubric1', name: 'OOP & Design', icon: '🏗️' },
                    { key: 'rubric2', name: 'Workflow', icon: '📋' },
                    { key: 'rubric3', name: 'Implementation', icon: '💻' },
                    { key: 'rubric4', name: 'GitHub', icon: '🔗' },
                    { key: 'rubric5', name: 'Code Quality', icon: '📝' },
                    { key: 'rubric6', name: 'UI/UX', icon: '🎨' },
                  ];
                  
                  return rubrics.map(rubric => {
                    const gradedStudents = students.filter(s => s[rubric.key] !== undefined && s[rubric.key] !== null);
                    const avg = gradedStudents.length > 0 
                      ? (gradedStudents.reduce((sum, s) => sum + s[rubric.key], 0) / gradedStudents.length).toFixed(1)
                      : 0;
                    const percentage = (avg / 5) * 100;
                    
                    return (
                      <div key={rubric.key} style={styles.rubricRow}>
                        <div style={styles.rubricLabel}>
                          <span>{rubric.icon}</span>
                          <span>{rubric.name}</span>
                        </div>
                        <div style={styles.rubricBarContainer}>
                          <div 
                            style={{
                              ...styles.rubricBar,
                              width: `${percentage}%`,
                              background: percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#3b82f6' : percentage >= 40 ? '#f59e0b' : '#ef4444',
                            }}
                          ></div>
                        </div>
                        <div style={styles.rubricAvg}>{avg}/5</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Score Distribution */}
            <div style={styles.graphCard}>
              <h3 style={styles.graphCardTitle}>Score Distribution</h3>
              <div style={styles.scoreDistribution}>
                {(() => {
                  const ranges = [
                    { label: '25-30', min: 25, max: 30, color: '#22c55e' },
                    { label: '20-24', min: 20, max: 24, color: '#3b82f6' },
                    { label: '15-19', min: 15, max: 19, color: '#f59e0b' },
                    { label: '10-14', min: 10, max: 14, color: '#f97316' },
                    { label: '0-9', min: 0, max: 9, color: '#ef4444' },
                  ];
                  
                  const maxCount = Math.max(...ranges.map(range => 
                    students.filter(s => s.totalScore >= range.min && s.totalScore <= range.max).length
                  ), 1);
                  
                  return ranges.map(range => {
                    const count = students.filter(s => s.totalScore >= range.min && s.totalScore <= range.max).length;
                    return (
                      <div key={range.label} style={styles.scoreRow}>
                        <div style={styles.scoreLabel}>{range.label}</div>
                        <div style={styles.scoreBarContainer}>
                          <div 
                            style={{
                              ...styles.scoreBar,
                              width: `${(count / maxCount) * 100}%`,
                              background: range.color,
                            }}
                          ></div>
                        </div>
                        <div style={styles.scoreCount}>{count}</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(-5px);
        }
        tr:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
        th {
          cursor: pointer;
        }
        th:hover {
          background: rgba(255, 255, 255, 0.1) !important;
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
  bgOrb1: {
    position: 'absolute',
    top: '-150px',
    right: '-100px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
    animation: 'float 6s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-150px',
    left: '-100px',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent 70%)',
    animation: 'float 8s ease-in-out infinite reverse',
  },
  bgOrb3: {
    position: 'absolute',
    top: '40%',
    left: '60%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08), transparent 70%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1400px',
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
  headerIcon: {
    fontSize: '3.5rem',
    marginBottom: '15px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #22c55e 50%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '1.1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  controlsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px 16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    flex: '1',
    maxWidth: '400px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.95rem',
    width: '100%',
  },
  resultCount: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
  },
  tableContainer: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    fontSize: '0.9rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    whiteSpace: 'nowrap',
  },
  tr: {
    transition: 'background 0.2s ease',
  },
  td: {
    padding: '16px 20px',
    color: '#fff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  emptyCell: {
    padding: '40px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '1rem',
  },
  idBadge: {
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  studentName: {
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  emailText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
  },
  scoreText: {
    fontWeight: '600',
    color: '#22c55e',
  },
  gradeBadge: {
    padding: '6px 16px',
    borderRadius: '8px',
    fontWeight: '700',
    color: '#fff',
    fontSize: '0.9rem',
  },
  pendingBadge: {
    background: 'rgba(107, 114, 128, 0.3)',
    color: '#9ca3af',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  rubricsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  rubricItem: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  naText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontStyle: 'italic',
    fontSize: '0.85rem',
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
  // Graph Styles
  graphsSection: {
    marginTop: '40px',
  },
  graphsTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '24px',
  },
  graphsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  graphCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  graphCardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '20px',
  },
  barChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  barItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  barLabel: {
    width: '30px',
    fontWeight: '700',
    color: '#fff',
    fontSize: '0.95rem',
  },
  barContainer: {
    flex: 1,
    height: '24px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: '12px',
    transition: 'width 0.5s ease',
    minWidth: '4px',
  },
  barValue: {
    width: '30px',
    textAlign: 'right',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  },
  pieChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  pieChart: {
    position: 'relative',
    width: '160px',
    height: '160px',
  },
  pieSvg: {
    width: '100%',
    height: '100%',
  },
  pieCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  pieCenterValue: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fff',
  },
  pieCenterLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  pieLegend: {
    display: 'flex',
    gap: '24px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.9rem',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  rubricChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  rubricRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rubricLabel: {
    width: '120px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.85rem',
  },
  rubricBarContainer: {
    flex: 1,
    height: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  rubricBar: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.5s ease',
  },
  rubricAvg: {
    width: '45px',
    textAlign: 'right',
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  scoreDistribution: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  scoreLabel: {
    width: '50px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.85rem',
  },
  scoreBarContainer: {
    flex: 1,
    height: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
    minWidth: '4px',
  },
  scoreCount: {
    width: '30px',
    textAlign: 'right',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  },
};
