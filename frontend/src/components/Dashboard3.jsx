import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

export default function Dashboard3() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState({});
  const [allStudents, setAllStudents] = useState([]); // Students without submissions
  const [grades, setGrades] = useState({});
  
  // Get logged-in faculty info from localStorage
  const facultyId = localStorage.getItem('userId');
  const facultyName = localStorage.getItem('userName');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [gradingStudent, setGradingStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('withSubmissions'); // Tab state
  const [pendingDeadlineStudents, setPendingDeadlineStudents] = useState([]);
  const [assigningFGrades, setAssigningFGrades] = useState(false);
  const [rubricValues, setRubricValues] = useState({
    rubric1: 3,
    rubric2: 3,
    rubric3: 3,
    rubric4: 3,
    rubric5: 3,
    rubric6: 3,
  });

  // Rubric descriptions - Updated as per requirements
  const rubricDescriptions = {
    rubric1: "OOP & Design",
    rubric2: "Workflow",
    rubric3: "Implementation",
    rubric4: "GitHub",
    rubric5: "Code Quality & Documentation",
    rubric6: "UI/Usability",
  };

  // Rubric scale labels
  const rubricScale = {
    5: "Excellent",
    4: "Good",
    3: "Satisfactory",
    2: "Need Improvement",
    1: "Poor",
  };

  // Check authorization - only Evaluation Committee Member
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigate('/facLogin');
      return;
    }
    
    if (!userRole || userRole.toLowerCase() !== 'evaluation committee member') {
      alert('Access Denied: This page is only for Evaluation Committee Members.');
      navigate('/');
      return;
    }
  }, [navigate]);

  // Check deadlines and auto-assign F grades
  const checkAndAssignFGrades = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/faculty/checkdeadlines`, {}, {
        withCredentials: true,
      });
      const result = response.data;
      if (result.affectedCount > 0) {
        setMessage({ 
          text: `Auto-assigned F grade to ${result.affectedCount} student(s) due to missed deadlines.`, 
          type: 'warning' 
        });
      }
    } catch (error) {
      console.error('Error checking deadlines:', error);
    }
  };

  // Manually trigger F grade assignment
  const handleAssignFGrades = async () => {
    setAssigningFGrades(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/faculty/checkdeadlines`, {}, {
        withCredentials: true,
      });
      const result = response.data;
      if (result.affectedCount > 0) {
        setMessage({ 
          text: `Assigned F grade to ${result.affectedCount} student(s) due to missed deadlines.`, 
          type: 'success' 
        });
        // Refresh data
        fetchData();
      } else {
        setMessage({ 
          text: 'No students with missed deadlines found.', 
          type: 'info' 
        });
      }
    } catch (error) {
      console.error('Error assigning F grades:', error);
      setMessage({ text: 'Failed to assign F grades.', type: 'error' });
    } finally {
      setAssigningFGrades(false);
    }
  };

  // Fetch all approved submissions and all students
  const fetchData = async () => {
    setLoading(true);
    try {
      // First, check deadlines and auto-assign F grades for expired deadlines
      await checkAndAssignFGrades();
      
      // Get all students first
      const studentsRes = await axios.get(`${API_BASE_URL}/faculty/allstudents`, {
        withCredentials: true,
      });
      const allStudentsList = studentsRes.data || [];

      // Get pending deadline students
      try {
        const pendingRes = await axios.get(`${API_BASE_URL}/faculty/pendingdeadlines`, {
          withCredentials: true,
        });
        setPendingDeadlineStudents(pendingRes.data || []);
      } catch (err) {
        console.error('Error fetching pending deadlines:', err);
      }

      // Get all approved submissions
      const submissionsRes = await axios.get(`${API_BASE_URL}/faculty/approvedsubmissions`, {
        withCredentials: true,
      });
      const approvedSubmissions = submissionsRes.data || [];
      
      // Group submissions by student - using new getter fields
      const submissionsByStudent = {};
      const studentIdsWithSubmissions = new Set();
      
      approvedSubmissions.forEach(sub => {
        const studentId = sub.student_id; // Using the new getter
        if (studentId) {
          studentIdsWithSubmissions.add(studentId);
          if (!submissionsByStudent[studentId]) {
            submissionsByStudent[studentId] = {
              student_id: studentId,
              name: sub.student_name || 'Unknown Student',
              email: sub.student_email || '',
              submissions: []
            };
          }
          submissionsByStudent[studentId].submissions.push(sub);
        }
      });
      setSubmissions(submissionsByStudent);

      // Filter students who haven't submitted any approved documents
      const studentsWithoutSubmissions = allStudentsList.filter(student => {
        const studentId = student.numericId || student.student_id;
        return !studentIdsWithSubmissions.has(studentId);
      });
      setAllStudents(studentsWithoutSubmissions);

      // Fetch existing grades for each student with submissions
      const gradesData = {};
      const studentIds = Object.keys(submissionsByStudent);
      for (const studentId of studentIds) {
        try {
          const gradeRes = await axios.get(`${API_BASE_URL}/faculty/grades/${studentId}`, {
            withCredentials: true,
          });
          gradesData[studentId] = gradeRes.data;
        } catch (err) {
          // No grades yet for this student
          gradesData[studentId] = null;
        }
      }
      setGrades(gradesData);

    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ text: 'Failed to load data. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleOpenGrading = (student) => {
    const studentId = student.numericId || student.student_id;
    const existingGrade = grades[studentId];
    
    if (existingGrade) {
      setRubricValues({
        rubric1: existingGrade.rubric1,
        rubric2: existingGrade.rubric2,
        rubric3: existingGrade.rubric3,
        rubric4: existingGrade.rubric4,
        rubric5: existingGrade.rubric5,
        rubric6: existingGrade.rubric6 || 3,
      });
    } else {
      setRubricValues({
        rubric1: 3,
        rubric2: 3,
        rubric3: 3,
        rubric4: 3,
        rubric5: 3,
        rubric6: 3,
      });
    }
    setGradingStudent(student);
  };

  const handleSubmitGrade = async () => {
    if (!gradingStudent) return;
    
    const studentId = gradingStudent.numericId || gradingStudent.student_id;
    setActionLoading(`grade-${studentId}`);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/faculty/gradestudent`,
        {
          student: { numericId: studentId },
          rubric1: rubricValues.rubric1,
          rubric2: rubricValues.rubric2,
          rubric3: rubricValues.rubric3,
          rubric4: rubricValues.rubric4,
          rubric5: rubricValues.rubric5,
          rubric6: rubricValues.rubric6,
        },
        { withCredentials: true }
      );

      const newGrade = response.data;
      setGrades(prev => ({ ...prev, [studentId]: newGrade }));
      setMessage({ text: `Grade ${newGrade.grade} assigned successfully!`, type: 'success' });
      setGradingStudent(null);
      
      // If grade is F, show option to request revision
      if (newGrade.grade === 'F') {
        setMessage({ 
          text: `Grade F assigned. Consider requesting a revision for this student.`, 
          type: 'warning' 
        });
      }
    } catch (error) {
      console.error('Error submitting grade:', error);
      setMessage({ 
        text: error.response?.data?.message || error.response?.data || 'Failed to submit grade.', 
        type: 'error' 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestRevision = async (student, docType) => {
    const studentId = student.numericId || student.student_id;
    setActionLoading(`revision-${studentId}-${docType}`);
    setMessage({ text: '', type: '' });

    try {
      await axios.post(
        `${API_BASE_URL}/faculty/evalrequestrevision`,
        { student_id: studentId, doc_type: docType },
        { withCredentials: true }
      );

      setMessage({ 
        text: `Revision requested for ${student.name}'s ${docType}. Student has been notified.`, 
        type: 'success' 
      });
      await fetchData();
    } catch (error) {
      console.error('Error requesting revision:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to request revision.', 
        type: 'error' 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const calculateGradeFromRubrics = () => {
    const total = rubricValues.rubric1 + rubricValues.rubric2 + rubricValues.rubric3 + 
                  rubricValues.rubric4 + rubricValues.rubric5 + rubricValues.rubric6;
    const average = total / 6.0;
    
    if (average >= 4.5) return 'A';
    if (average >= 3.5) return 'B';
    if (average >= 2.5) return 'C';
    if (average >= 1.5) return 'D';
    return 'F';
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', shadow: 'rgba(34, 197, 94, 0.4)' },
      'B': { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59, 130, 246, 0.4)' },
      'C': { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245, 158, 11, 0.4)' },
      'D': { bg: 'linear-gradient(135deg, #f97316, #ea580c)', shadow: 'rgba(249, 115, 22, 0.4)' },
      'F': { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', shadow: 'rgba(239, 68, 68, 0.4)' },
    };
    return colors[grade] || { bg: 'linear-gradient(135deg, #6b7280, #4b5563)', shadow: 'rgba(107, 114, 128, 0.4)' };
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

  // Calculate statistics - submissions now contains objects with student info and submissions array
  const studentsWithSubmissions = Object.values(submissions);
  const studentsWithoutSubmissions = allStudents;
  const totalStudentsWithSubmissions = studentsWithSubmissions.length;
  const totalStudentsWithoutSubmissions = studentsWithoutSubmissions.length;
  const totalSubmissions = studentsWithSubmissions.reduce((acc, s) => acc + (s.submissions?.length || 0), 0);
  const gradedStudents = Object.values(grades).filter(g => g !== null).length;
  const failingStudents = Object.values(grades).filter(g => g?.grade === 'F').length;

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
      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
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
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    titleIcon: {
      fontSize: '2.8rem',
    },
    titleText: {
      background: 'linear-gradient(135deg, #fff 0%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '1.1rem',
    },
    facultyInfoCard: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      background: 'rgba(99, 102, 241, 0.15)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '12px',
      padding: '12px 20px',
      marginTop: '20px',
    },
    facultyAvatar: {
      width: '45px',
      height: '45px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#fff',
    },
    facultyDetails: {
      textAlign: 'left',
    },
    facultyName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#fff',
    },
    facultyMeta: {
      fontSize: '0.85rem',
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: '2px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '5px',
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '0.9rem',
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
    warningMessage: {
      background: 'rgba(245, 158, 11, 0.15)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      color: '#f59e0b',
    },
    studentCard: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      marginBottom: '24px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    studentHeader: {
      padding: '24px 28px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
    },
    studentAvatar: {
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
    },
    studentName: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '4px',
      letterSpacing: '-0.02em',
    },
    studentEmail: {
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    studentId: {
      fontSize: '0.8rem',
      color: 'rgba(255, 255, 255, 0.4)',
      marginTop: '4px',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
    },
    approvedBadge: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(99, 102, 241, 0.1))',
      color: '#a5b4fc',
      padding: '10px 18px',
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: '1px solid rgba(99, 102, 241, 0.3)',
    },
    gradeBadge: {
      padding: '12px 24px',
      borderRadius: '14px',
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#fff',
      letterSpacing: '0.05em',
    },
    submissionsContainer: {
      padding: '24px',
      background: 'rgba(0, 0, 0, 0.1)',
    },
    submissionRow: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
      borderRadius: '16px',
      padding: '20px 24px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'all 0.3s ease',
    },
    submissionTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
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
    downloadBtn: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: '#fff',
    },
    gradeBtn: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: '#fff',
    },
    revisionBtn: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: '#fff',
    },
    disabledBtn: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    gradingModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '20px',
      padding: '30px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '20px',
      textAlign: 'center',
    },
    rubricRow: {
      marginBottom: '20px',
    },
    rubricLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.95rem',
      marginBottom: '10px',
      display: 'block',
    },
    rubricSlider: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    slider: {
      flex: 1,
      WebkitAppearance: 'none',
      appearance: 'none',
      height: '8px',
      borderRadius: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      outline: 'none',
    },
    sliderValue: {
      width: '40px',
      textAlign: 'center',
      color: '#fff',
      fontSize: '1.2rem',
      fontWeight: '600',
    },
    previewGrade: {
      textAlign: 'center',
      marginTop: '20px',
      marginBottom: '20px',
    },
    previewGradeLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '0.9rem',
      marginBottom: '10px',
    },
    previewGradeValue: {
      fontSize: '3rem',
      fontWeight: '700',
      padding: '10px 30px',
      borderRadius: '12px',
      display: 'inline-block',
    },
    modalButtons: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '20px',
    },
    cancelBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      color: '#fff',
    },
    noSubmissions: {
      textAlign: 'center',
      padding: '30px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    expandIcon: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '1rem',
      transition: 'transform 0.3s ease',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '8px 12px',
      borderRadius: '8px',
    },
    tabContainer: {
      display: 'flex',
      gap: '8px',
      marginBottom: '32px',
      background: 'linear-gradient(135deg, rgba(15, 15, 30, 0.9) 0%, rgba(26, 26, 46, 0.95) 100%)',
      padding: '8px',
      borderRadius: '24px',
      width: 'fit-content',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
    },
    tabContainerGlow: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.1), transparent, rgba(236, 72, 153, 0.1), transparent)',
      animation: 'rotateGlow 8s linear infinite',
      pointerEvents: 'none',
    },
    tab: {
      padding: '16px 28px',
      borderRadius: '18px',
      border: 'none',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative',
      zIndex: 1,
      letterSpacing: '0.02em',
      overflow: 'hidden',
    },
    activeTab: {
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
      color: '#fff',
      boxShadow: '0 10px 40px rgba(99, 102, 241, 0.5), 0 0 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px) scale(1.02)',
    },
    inactiveTab: {
      background: 'rgba(255, 255, 255, 0.03)',
      color: 'rgba(255, 255, 255, 0.5)',
      border: '1px solid transparent',
    },
    tabBadge: {
      background: 'rgba(255, 255, 255, 0.2)',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '700',
      minWidth: '28px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
    },
    tabIcon: {
      fontSize: '1.2rem',
      transition: 'transform 0.3s ease',
    },
    sectionTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      padding: '16px 24px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      animation: 'slideIn 0.5s ease-out',
    },
    sectionTitleText: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    sectionContainer: {
      animation: 'fadeIn 0.6s ease-out',
    },
    assignFButton: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '14px',
      fontSize: '0.95rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
      letterSpacing: '0.02em',
    },
    missedDeadlinesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    missedDeadlineCard: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.06) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(239, 68, 68, 0.1)',
    },
    missedDeadlineInfo: {
      flex: '1 1 200px',
    },
    missedStudentName: {
      fontSize: '1.15rem',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '4px',
    },
    missedStudentEmail: {
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    missedDeadlineDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center',
    },
    missedDocType: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
      padding: '8px 16px',
      borderRadius: '12px',
      fontSize: '0.9rem',
      color: '#fff',
      fontWeight: '600',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    missedDeadlineDate: {
      fontSize: '0.85rem',
      color: '#ef4444',
      fontWeight: '500',
    },
    missedStatus: {},
    pendingApprovalBadge: {
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.1))',
      color: '#fbbf24',
      padding: '10px 18px',
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    noSubmissionBadge: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(239, 68, 68, 0.1))',
      color: '#f87171',
      padding: '10px 18px',
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: '1px solid rgba(239, 68, 68, 0.3)',
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
    pendingStudentCard: {
      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(249, 115, 22, 0.2)',
      padding: '24px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
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
      border: '4px solid rgba(236, 72, 153, 0.2)',
      borderTopColor: '#ec4899',
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
        <p style={styles.loadingText}>Loading student submissions...</p>
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
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>📊</span>
            <span style={styles.titleText}>Evaluation Committee Dashboard</span>
          </h1>
          <p style={styles.subtitle}>Review approved submissions and assign grades using rubrics</p>
          
          {/* Faculty Info Card */}
          <div style={styles.facultyInfoCard}>
            <div style={styles.facultyAvatar}>
              {facultyName?.charAt(0)?.toUpperCase() || 'E'}
            </div>
            <div style={styles.facultyDetails}>
              <div style={styles.facultyName}>{facultyName || 'Evaluation Committee Member'}</div>
              <div style={styles.facultyMeta}>ID: {facultyId}</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#a5b4fc' }}>{totalStudentsWithSubmissions}</div>
            <div style={styles.statLabel}>Students with Submissions</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#f97316' }}>{totalStudentsWithoutSubmissions}</div>
            <div style={styles.statLabel}>Pending Submissions</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#22c55e' }}>{totalSubmissions}</div>
            <div style={styles.statLabel}>Approved Submissions</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#f59e0b' }}>{gradedStudents}</div>
            <div style={styles.statLabel}>Graded</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#ef4444' }}>{failingStudents}</div>
            <div style={styles.statLabel}>Grade F (Need Revision)</div>
          </div>
        </div>

        {message.text && (
          <div style={{
            ...styles.messageBox,
            ...(message.type === 'success' ? styles.successMessage : 
                message.type === 'warning' ? styles.warningMessage : styles.errorMessage),
          }}>
            {message.type === 'success' ? '✓' : message.type === 'warning' ? '⚠' : '✕'} {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={styles.tabContainer} className="tab-container-animate">
          <div style={styles.tabContainerGlow}></div>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'withSubmissions' ? styles.activeTab : styles.inactiveTab),
            }}
            onClick={() => setActiveTab('withSubmissions')}
            className={activeTab === 'withSubmissions' ? 'tab-active-pulse' : 'tab-hover'}
          >
            <span style={styles.tabIcon} className="tab-icon">📄</span>
            <span>With Submissions</span>
            <span style={{
              ...styles.tabBadge,
              background: activeTab === 'withSubmissions' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(99, 102, 241, 0.3)',
              color: activeTab === 'withSubmissions' ? '#fff' : '#a5b4fc',
            }}>{totalStudentsWithSubmissions}</span>
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'withoutSubmissions' ? styles.activeTab : styles.inactiveTab),
            }}
            onClick={() => setActiveTab('withoutSubmissions')}
            className={activeTab === 'withoutSubmissions' ? 'tab-active-pulse' : 'tab-hover'}
          >
            <span style={styles.tabIcon} className="tab-icon">⏳</span>
            <span>Pending Submissions</span>
            <span style={{
              ...styles.tabBadge,
              background: activeTab === 'withoutSubmissions' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(249, 115, 22, 0.3)',
              color: activeTab === 'withoutSubmissions' ? '#fff' : '#f97316',
            }}>{totalStudentsWithoutSubmissions}</span>
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'missedDeadlines' ? styles.activeTab : styles.inactiveTab),
            }}
            onClick={() => setActiveTab('missedDeadlines')}
            className={activeTab === 'missedDeadlines' ? 'tab-active-pulse' : 'tab-hover'}
          >
            <span style={{...styles.tabIcon, animation: pendingDeadlineStudents.length > 0 ? 'shake 0.5s ease-in-out infinite' : 'none'}} className="tab-icon">⚠️</span>
            <span>Missed Deadlines</span>
            <span style={{
              ...styles.tabBadge, 
              background: pendingDeadlineStudents.length > 0 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : (activeTab === 'missedDeadlines' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)'),
              color: '#fff',
              boxShadow: pendingDeadlineStudents.length > 0 ? '0 0 15px rgba(239, 68, 68, 0.5)' : 'none',
              animation: pendingDeadlineStudents.length > 0 ? 'pulseGlow 2s ease-in-out infinite' : 'none',
            }}>{pendingDeadlineStudents.length}</span>
          </button>
        </div>

        {/* Section: Missed Deadlines */}
        {activeTab === 'missedDeadlines' && (
          <div style={styles.sectionContainer} className="slide-right" key="missedDeadlines">
            <div style={styles.sectionTitle}>
              <span style={styles.sectionTitleText}>
                <span>⚠️</span> Students with Missed Deadlines
              </span>
              {pendingDeadlineStudents.length > 0 && (
                <button
                  style={{
                    ...styles.assignFButton,
                    opacity: assigningFGrades ? 0.7 : 1,
                    cursor: assigningFGrades ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleAssignFGrades}
                  disabled={assigningFGrades}
                >
                  {assigningFGrades ? '⏳ Assigning...' : '🔴 Assign F Grade to All'}
                </button>
              )}
            </div>
            {pendingDeadlineStudents.length === 0 ? (
              <div style={styles.noDataCard} className="scale-in">
                <span style={{ fontSize: '4rem' }}>✅</span>
                <h2 style={{ color: '#fff', marginTop: '20px' }}>No Missed Deadlines</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>All students have submitted their documents on time or haven't missed any deadlines yet.</p>
              </div>
            ) : (
              <div style={styles.missedDeadlinesList}>
                {pendingDeadlineStudents.map((student, index) => (
                  <div key={`${student.studentId}-${student.documentType}-${index}`} style={{...styles.missedDeadlineCard, animationDelay: `${index * 0.1}s`}} className="slide-up">
                    <div style={styles.missedDeadlineInfo}>
                      <div style={styles.missedStudentName}>{student.studentName}</div>
                      <div style={styles.missedStudentEmail}>{student.email}</div>
                    </div>
                    <div style={styles.missedDeadlineDetails}>
                      <span style={styles.missedDocType}>{student.documentType}</span>
                      <span style={styles.missedDeadlineDate}>Deadline: {new Date(student.deadline).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.missedStatus}>
                      {student.hasSubmission ? (
                        <span style={styles.pendingApprovalBadge}>Pending Approval</span>
                      ) : (
                        <span style={styles.noSubmissionBadge}>No Submission</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 1: Students WITH Submissions */}
        {activeTab === 'withSubmissions' && (
          <div style={styles.sectionContainer} className="slide-left" key="withSubmissions">
            <div style={styles.sectionTitle}>
              <span style={styles.sectionTitleText}>
                <span>✅</span> Students with Approved Submissions
              </span>
            </div>
            {studentsWithSubmissions.length === 0 ? (
              <div style={styles.noDataCard}>
                <span style={{ fontSize: '4rem' }}>📭</span>
                <h2 style={{ color: '#fff', marginTop: '20px' }}>No Approved Submissions</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>There are no submissions approved by supervisors yet.</p>
              </div>
            ) : (
              studentsWithSubmissions.map((studentData) => {
                const studentId = studentData.student_id;
                const studentSubmissions = studentData.submissions || [];
                const studentGrade = grades[studentId];
                const isExpanded = expandedStudent === studentId;
                const gradeColors = studentGrade ? getGradeColor(studentGrade.grade) : null;

                return (
                  <div key={studentId} style={styles.studentCard}>
                    <div 
                      style={styles.studentHeader}
                      onClick={() => setExpandedStudent(isExpanded ? null : studentId)}
                    >
                      <div style={styles.studentInfo}>
                        <div style={styles.studentAvatar}>
                          {studentData.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={styles.studentName}>{studentData.name}</div>
                          <div style={styles.studentEmail}>{studentData.email}</div>
                          <div style={styles.studentId}>ID: STU-{studentId}</div>
                        </div>
                      </div>
                      <div style={styles.headerRight}>
                        {studentGrade ? (
                          <div style={{
                            ...styles.gradeBadge,
                            background: gradeColors.bg,
                            boxShadow: `0 8px 24px ${gradeColors.shadow}`,
                          }}>
                            Grade: {studentGrade.grade}
                          </div>
                        ) : (
                          <div style={{
                            ...styles.gradeBadge,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}>
                            ✏️ Not Graded
                          </div>
                        )}
                        <span style={styles.approvedBadge}>
                          📄 {studentSubmissions.length} Approved
                        </span>
                        <span style={{
                          ...styles.expandIcon,
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}>▼</span>
                      </div>
                    </div>

                {isExpanded && (
                  <div style={styles.submissionsContainer}>
                    {/* Grade Button */}
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        style={{
                          ...styles.btn,
                          ...styles.gradeBtn,
                        }}
                        onClick={() => handleOpenGrading(studentData)}
                      >
                        📝 {studentGrade ? 'Update Grade' : 'Assign Grade'}
                      </button>
                      
                      {studentGrade?.grade === 'F' && studentSubmissions.map(sub => {
                        const docType = sub.doc_type || sub.documentType?.doc_type;
                        return (
                          <button
                            key={`revision-${sub.file_id}`}
                            style={{
                              ...styles.btn,
                              ...styles.revisionBtn,
                              ...(actionLoading === `revision-${studentId}-${docType}` ? styles.disabledBtn : {}),
                            }}
                            onClick={() => handleRequestRevision(studentData, docType)}
                            disabled={actionLoading === `revision-${studentId}-${docType}`}
                          >
                            {actionLoading === `revision-${studentId}-${docType}` ? '...' : `🔄 Request ${docType} Revision`}
                          </button>
                        );
                      })}
                    </div>

                    {/* Submissions List */}
                    {studentSubmissions.length === 0 ? (
                      <div style={styles.noSubmissions}>
                        <p>No approved submissions from this student yet.</p>
                      </div>
                    ) : (
                      studentSubmissions.map((submission) => {
                        const docType = submission.doc_type || submission.documentType?.doc_type;
                        const colors = getDocTypeColor(docType);
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
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    color: '#22c55e',
                                  }}>
                                    ✓ Approved by Supervisor
                                  </span>
                                </div>
                              </div>

                              <div style={styles.actionButtons}>
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
        )}

        {/* Section 2: Students WITHOUT Submissions */}
        {activeTab === 'withoutSubmissions' && (
          <div style={styles.sectionContainer} className="fade-in" key="withoutSubmissions">
            <div style={styles.sectionTitle}>
              <span style={styles.sectionTitleText}>
                <span>⏳</span> Students Pending Submissions
              </span>
            </div>
            {studentsWithoutSubmissions.length === 0 ? (
              <div style={styles.noDataCard}>
                <span style={{ fontSize: '4rem' }}>🎉</span>
                <h2 style={{ color: '#fff', marginTop: '20px' }}>All Students Have Submitted!</h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Every student has at least one approved submission.</p>
              </div>
            ) : (
              studentsWithoutSubmissions.map((student) => {
                const studentId = student.numericId || student.student_id;
                return (
                  <div key={studentId} style={styles.pendingStudentCard}>
                    <div style={styles.studentInfo}>
                      <div style={{
                        ...styles.studentAvatar,
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      }}>
                        {student.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={styles.studentName}>{student.name}</div>
                        <div style={styles.studentEmail}>{student.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '2px' }}>ID: STU-{studentId}</div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <span style={{
                        background: 'rgba(249, 115, 22, 0.2)',
                        color: '#f97316',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}>
                        ⏳ No Approved Submissions
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {gradingStudent && (
        <div style={styles.gradingModal} onClick={() => setGradingStudent(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              📝 Grade {gradingStudent.name}
            </h2>
            
            {Object.entries(rubricDescriptions).map(([key, description]) => (
              <div key={key} style={styles.rubricRow}>
                <label style={styles.rubricLabel}>
                  {description}
                </label>
                <div style={styles.rubricSlider}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>1</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubricValues[key]}
                    onChange={(e) => setRubricValues(prev => ({
                      ...prev,
                      [key]: parseInt(e.target.value)
                    }))}
                    style={styles.slider}
                  />
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>5</span>
                  <div style={styles.sliderValue}>
                    {rubricValues[key]} - {rubricScale[rubricValues[key]]}
                  </div>
                </div>
              </div>
            ))}

            <div style={styles.previewGrade}>
              <div style={styles.previewGradeLabel}>Calculated Grade</div>
              <div style={{
                ...styles.previewGradeValue,
                ...(() => {
                  const grade = calculateGradeFromRubrics();
                  const colors = getGradeColor(grade);
                  return {
                    background: colors.bg,
                    boxShadow: `0 4px 20px ${colors.shadow}`,
                    color: '#fff',
                  };
                })(),
              }}>
                {calculateGradeFromRubrics()}
              </div>
            </div>

            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.btn, ...styles.cancelBtn }}
                onClick={() => setGradingStudent(null)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.btn,
                  ...styles.submitBtn,
                  ...(actionLoading ? styles.disabledBtn : {}),
                }}
                onClick={handleSubmitGrade}
                disabled={actionLoading}
              >
                {actionLoading ? 'Submitting...' : '✓ Submit Grade'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideFromRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px) rotate(-5deg); }
          75% { transform: translateX(3px) rotate(5deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 25px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4);
            transform: scale(1.1);
          }
        }
        @keyframes tabGlow {
          0%, 100% { box-shadow: 0 10px 40px rgba(99, 102, 241, 0.5); }
          50% { box-shadow: 0 15px 50px rgba(139, 92, 246, 0.7), 0 0 30px rgba(236, 72, 153, 0.4); }
        }
        .tab-container-animate {
          animation: fadeIn 0.5s ease-out;
        }
        .tab-hover:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.9) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .tab-hover:hover .tab-icon {
          transform: scale(1.2);
        }
        .tab-active-pulse {
          animation: tabGlow 3s ease-in-out infinite;
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        .scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .slide-up {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .bounce-in {
          animation: bounceIn 0.8s ease-out forwards;
        }
        .slide-left {
          animation: slideFromLeft 0.5s ease-out forwards;
        }
        .slide-right {
          animation: slideFromRight 0.5s ease-out forwards;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(236, 72, 153, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 10px rgba(236, 72, 153, 0.5);
        }
      `}</style>
    </div>
  );
}
