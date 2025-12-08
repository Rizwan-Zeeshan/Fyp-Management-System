import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export default function ReleaseRes() {
  const [studentGrades, setStudentGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('studentName');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all student grades
      const gradesResponse = await axios.get(
        `${API_BASE_URL}/faculty/allstudentgrades`,
        { withCredentials: true }
      );
      setStudentGrades(gradesResponse.data || []);
      
      // Fetch release status
      const statusResponse = await axios.get(
        `${API_BASE_URL}/faculty/gradereleasestatus`,
        { withCredentials: true }
      );
      setIsReleased(statusResponse.data?.released || false);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ text: 'Failed to load data. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseGrades = async () => {
    setReleasing(true);
    setMessage({ text: '', type: '' });
    
    try {
      await axios.get(
        `${API_BASE_URL}/faculty/releasegrades`,
        { withCredentials: true }
      );
      setIsReleased(true);
      setMessage({ text: '🎉 Grades have been released successfully! Students can now view their results.', type: 'success' });
    } catch (error) {
      console.error('Error releasing grades:', error);
      setMessage({ text: 'Failed to release grades. Please try again.', type: 'error' });
    } finally {
      setReleasing(false);
    }
  };

  const handleHideGrades = async () => {
    setReleasing(true);
    setMessage({ text: '', type: '' });
    
    try {
      await axios.get(
        `${API_BASE_URL}/faculty/hidegrades`,
        { withCredentials: true }
      );
      setIsReleased(false);
      setMessage({ text: 'Grades have been hidden. Students can no longer view their results.', type: 'warning' });
    } catch (error) {
      console.error('Error hiding grades:', error);
      setMessage({ text: 'Failed to hide grades. Please try again.', type: 'error' });
    } finally {
      setReleasing(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', shadow: 'rgba(34, 197, 94, 0.4)', text: '#fff' },
      'B': { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59, 130, 246, 0.4)', text: '#fff' },
      'C': { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245, 158, 11, 0.4)', text: '#fff' },
      'D': { bg: 'linear-gradient(135deg, #f97316, #ea580c)', shadow: 'rgba(249, 115, 22, 0.4)', text: '#fff' },
      'F': { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', shadow: 'rgba(239, 68, 68, 0.4)', text: '#fff' },
    };
    return colors[grade] || { bg: 'linear-gradient(135deg, #6b7280, #4b5563)', shadow: 'rgba(107, 114, 128, 0.4)', text: '#fff' };
  };

  const getRubricLabel = (value) => {
    const labels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    return labels[value] || 'N/A';
  };

  const sortedAndFilteredGrades = studentGrades
    .filter(student => 
      student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.supervisorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(student.studentId).includes(searchTerm)
    )
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  // Statistics
  const totalStudents = studentGrades.length;
  const gradeDistribution = studentGrades.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1;
    return acc;
  }, {});

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
      left: '50%',
      width: '300px',
      height: '300px',
      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      transform: 'translateX(-50%)',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '1400px',
      margin: '0 auto',
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
      animation: 'bounce 2s infinite',
    },
    titleText: {
      background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 3s ease infinite',
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '1.1rem',
    },
    releaseStatusCard: {
      background: isReleased 
        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))'
        : 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.05))',
      border: isReleased 
        ? '2px solid rgba(34, 197, 94, 0.4)'
        : '2px solid rgba(249, 115, 22, 0.4)',
      borderRadius: '24px',
      padding: '30px',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px',
      backdropFilter: 'blur(20px)',
      boxShadow: isReleased 
        ? '0 20px 60px rgba(34, 197, 94, 0.2)'
        : '0 20px 60px rgba(249, 115, 22, 0.2)',
      animation: 'slideIn 0.6s ease-out',
    },
    statusInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    statusIcon: {
      width: '70px',
      height: '70px',
      borderRadius: '20px',
      background: isReleased 
        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
        : 'linear-gradient(135deg, #f97316, #ea580c)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      boxShadow: isReleased 
        ? '0 10px 30px rgba(34, 197, 94, 0.4)'
        : '0 10px 30px rgba(249, 115, 22, 0.4)',
      animation: isReleased ? 'pulse 2s infinite' : 'none',
    },
    statusText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    statusTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#fff',
    },
    statusSubtitle: {
      fontSize: '0.95rem',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    releaseButton: {
      padding: '18px 40px',
      borderRadius: '16px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.3s ease',
      letterSpacing: '0.02em',
    },
    releaseBtn: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: '#fff',
      boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
    },
    hideBtn: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#fff',
      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
    },
    disabledBtn: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginBottom: '30px',
    },
    statCard: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '5px',
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    messageBox: {
      padding: '18px 24px',
      borderRadius: '16px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '1rem',
      fontWeight: '500',
      animation: 'slideIn 0.4s ease-out',
    },
    successMessage: {
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))',
      border: '1px solid rgba(34, 197, 94, 0.4)',
      color: '#22c55e',
    },
    errorMessage: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      color: '#ef4444',
    },
    warningMessage: {
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      color: '#f59e0b',
    },
    searchFilterSection: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    searchInput: {
      flex: '1 1 300px',
      padding: '16px 24px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    sortSelect: {
      padding: '16px 24px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      cursor: 'pointer',
    },
    tableContainer: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    tableHeader: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
      padding: '20px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    tableTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '18px 20px',
      textAlign: 'left',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '600',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.03)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    td: {
      padding: '20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      color: '#fff',
      transition: 'all 0.3s ease',
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    studentAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#fff',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
    },
    studentDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    studentName: {
      fontWeight: '600',
      fontSize: '1rem',
    },
    studentEmail: {
      fontSize: '0.85rem',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    gradeBadge: {
      padding: '10px 20px',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '700',
      display: 'inline-block',
      letterSpacing: '0.05em',
    },
    supervisorBadge: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.1))',
      color: '#a5b4fc',
      padding: '8px 16px',
      borderRadius: '10px',
      fontSize: '0.9rem',
      fontWeight: '500',
      border: '1px solid rgba(99, 102, 241, 0.3)',
    },
    rubricContainer: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
    },
    rubricBadge: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '0.8rem',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    noDataCard: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '60px 40px',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
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
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading student grades...</p>
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
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>🎓</span>
            <span style={styles.titleText}>Release Results</span>
          </h1>
          <p style={styles.subtitle}>Review and release student grades to make them visible</p>
        </div>

        {/* Release Status Card */}
        <div style={styles.releaseStatusCard} className="status-card">
          <div style={styles.statusInfo}>
            <div style={styles.statusIcon}>
              {isReleased ? '✅' : '🔒'}
            </div>
            <div style={styles.statusText}>
              <div style={styles.statusTitle}>
                {isReleased ? 'Results are LIVE!' : 'Results are Hidden'}
              </div>
              <div style={styles.statusSubtitle}>
                {isReleased 
                  ? 'Students can currently view their grades and rubric scores'
                  : 'Students cannot see their grades yet. Release when ready.'}
              </div>
            </div>
          </div>
          
          {isReleased ? (
            <button
              style={{
                ...styles.releaseButton,
                ...styles.hideBtn,
                ...(releasing ? styles.disabledBtn : {}),
              }}
              onClick={handleHideGrades}
              disabled={releasing}
              className="release-btn"
            >
              {releasing ? '⏳ Processing...' : '🔒 Hide Grades'}
            </button>
          ) : (
            <button
              style={{
                ...styles.releaseButton,
                ...styles.releaseBtn,
                ...(releasing ? styles.disabledBtn : {}),
              }}
              onClick={handleReleaseGrades}
              disabled={releasing}
              className="release-btn"
            >
              {releasing ? '⏳ Processing...' : '🚀 Release Grades'}
            </button>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            ...styles.messageBox,
            ...(message.type === 'success' ? styles.successMessage : 
                message.type === 'warning' ? styles.warningMessage : styles.errorMessage),
          }}>
            {message.text}
          </div>
        )}

        {/* Statistics */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard} className="stat-card">
            <div style={{ ...styles.statValue, color: '#a5b4fc' }}>{totalStudents}</div>
            <div style={styles.statLabel}>Total Graded</div>
          </div>
          {['A', 'B', 'C', 'D', 'F'].map(grade => (
            <div key={grade} style={styles.statCard} className="stat-card">
              <div style={{ ...styles.statValue, color: getGradeColor(grade).shadow.replace('0.4', '1') }}>
                {gradeDistribution[grade] || 0}
              </div>
              <div style={styles.statLabel}>Grade {grade}</div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div style={styles.searchFilterSection}>
          <input
            type="text"
            placeholder="🔍 Search by name, email, ID, or supervisor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="studentName">Sort by Name</option>
            <option value="studentId">Sort by ID</option>
            <option value="grade">Sort by Grade</option>
            <option value="supervisorName">Sort by Supervisor</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Student Grades Table */}
        {sortedAndFilteredGrades.length === 0 ? (
          <div style={styles.noDataCard} className="no-data">
            <span style={{ fontSize: '4rem' }}>📭</span>
            <h2 style={{ color: '#fff', marginTop: '20px' }}>No Grades Found</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {searchTerm ? 'No results match your search criteria.' : 'No student grades have been assigned yet.'}
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer} className="table-animate">
            <div style={styles.tableHeader}>
              <div style={styles.tableTitle}>
                <span>📋</span> Student Grades Overview
                <span style={{ 
                  marginLeft: 'auto', 
                  fontSize: '0.9rem', 
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.6)' 
                }}>
                  Showing {sortedAndFilteredGrades.length} of {totalStudents} students
                </span>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th} onClick={() => { setSortBy('studentId'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                      Student ID {sortBy === 'studentId' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={styles.th} onClick={() => { setSortBy('studentName'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                      Student {sortBy === 'studentName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={styles.th} onClick={() => { setSortBy('supervisorName'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                      Supervisor {sortBy === 'supervisorName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={styles.th}>Rubrics (1-5)</th>
                    <th style={styles.th} onClick={() => { setSortBy('grade'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                      Grade {sortBy === 'grade' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredGrades.map((student, index) => {
                    const gradeColors = getGradeColor(student.grade);
                    return (
                      <tr 
                        key={student.studentId} 
                        style={{ 
                          background: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                        }}
                        className="table-row"
                      >
                        <td style={styles.td}>
                          <span style={{
                            background: 'rgba(99, 102, 241, 0.2)',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#a5b4fc',
                          }}>
                            STU-{student.studentId}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.studentInfo}>
                            <div style={styles.studentAvatar}>
                              {student.studentName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div style={styles.studentDetails}>
                              <div style={styles.studentName}>{student.studentName}</div>
                              <div style={styles.studentEmail}>{student.studentEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.supervisorBadge}>
                            👨‍🏫 {student.supervisorName || 'Not Assigned'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.rubricContainer}>
                            {[1, 2, 3, 4, 5, 6].map(r => (
                              <span 
                                key={r} 
                                style={{
                                  ...styles.rubricBadge,
                                  background: student[`rubric${r}`] >= 4 
                                    ? 'rgba(34, 197, 94, 0.2)' 
                                    : student[`rubric${r}`] >= 3 
                                      ? 'rgba(245, 158, 11, 0.2)'
                                      : 'rgba(239, 68, 68, 0.2)',
                                  color: student[`rubric${r}`] >= 4 
                                    ? '#22c55e' 
                                    : student[`rubric${r}`] >= 3 
                                      ? '#f59e0b'
                                      : '#ef4444',
                                }}
                                title={`Rubric ${r}: ${getRubricLabel(student[`rubric${r}`])}`}
                              >
                                R{r}: {student[`rubric${r}`]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.gradeBadge,
                            background: gradeColors.bg,
                            color: gradeColors.text,
                            boxShadow: `0 6px 20px ${gradeColors.shadow}`,
                          }}>
                            {student.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .status-card {
          animation: slideIn 0.6s ease-out;
        }
        .stat-card {
          animation: fadeIn 0.5s ease-out;
          animation-fill-mode: both;
        }
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.15s; }
        .stat-card:nth-child(3) { animation-delay: 0.2s; }
        .stat-card:nth-child(4) { animation-delay: 0.25s; }
        .stat-card:nth-child(5) { animation-delay: 0.3s; }
        .stat-card:nth-child(6) { animation-delay: 0.35s; }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        .table-animate {
          animation: slideIn 0.7s ease-out;
        }
        .table-row:hover {
          background: rgba(99, 102, 241, 0.1) !important;
        }
        .release-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(34, 197, 94, 0.5);
        }
        .search-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }
        .no-data {
          animation: fadeIn 0.6s ease-out;
        }
        select option {
          background: #1a1a2e;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
