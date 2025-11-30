import React, { useState } from 'react';

export default function StudentDashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderDashboard = () => (
    <div style={styles.dashboard}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>Student Dashboard</h1>
        <p style={styles.welcomeSubtitle}>Manage your academic activities</p>
      </div>

      <div style={styles.optionsGrid}>
        <div 
          style={styles.optionCard}
          onClick={() => setActiveView('upload')}
        >
          <div style={styles.optionIcon}>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-6-7V9h-2v4H7l4 4 4-4h-3z"/>
            </svg>
          </div>
          <h3 style={styles.optionTitle}>Upload Documents</h3>
          <p style={styles.optionDescription}>Submit your assignments and projects</p>
        </div>

        <div 
          style={styles.optionCard}
          onClick={() => setActiveView('feedback')}
        >
          <div style={styles.optionIcon}>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
            </svg>
          </div>
          <h3 style={styles.optionTitle}>View Feedback</h3>
          <p style={styles.optionDescription}>Check faculty feedback on your submissions</p>
        </div>

        <div 
          style={styles.optionCard}
          onClick={() => setActiveView('history')}
        >
          <div style={styles.optionIcon}>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <h3 style={styles.optionTitle}>View History</h3>
          <p style={styles.optionDescription}>Track your submission history</p>
        </div>
      </div>
    </div>
  );

const fileInputRef = React.useRef(null);
const titleRef = React.useRef(null);
const courseRef = React.useRef(null);
const descRef = React.useRef(null);
const typeRef = React.useRef(null);

const [selectedFile, setSelectedFile] = useState(null);
const [dragActive, setDragActive] = useState(false);
const [uploading, setUploading] = useState(false);
const [errorMsg, setErrorMsg] = useState('');
const MAX_SIZE = 10 * 1024 * 1024; 

const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
};

const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > MAX_SIZE) {
        setErrorMsg('File is too large. Max 10MB allowed.');
        setSelectedFile(null);
        return;
    }
    setErrorMsg('');
    setSelectedFile(f);
};

const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
};

const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
};

const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    if (f.size > MAX_SIZE) {
        setErrorMsg('File is too large. Max 10MB allowed.');
        setSelectedFile(null);
        return;
    }
    setErrorMsg('');
    setSelectedFile(f);
};

const handleSubmitUpload = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // basic validation
    const title = titleRef.current?.value?.trim();
    const type = typeRef.current?.value;
    const course = courseRef.current?.value?.trim();
    const desc = descRef.current?.value?.trim();

    if (!title || !type || !course) {
        setErrorMsg('Please fill required fields: title, type and course.');
        return;
    }
    if (!selectedFile) {
        setErrorMsg('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('type', type);
    formData.append('course', course);
    formData.append('description', desc);

    try {
        setUploading(true);
        // adjust endpoint as needed
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Upload failed');
        }
        setSelectedFile(null);
        titleRef.current.value = '';
        typeRef.current.value = '';
        courseRef.current.value = '';
        descRef.current.value = '';
        alert('Upload successful');
        setActiveView('dashboard');
    } catch (err) {
        setErrorMsg(err.message || 'Upload error');
    } finally {
        setUploading(false);
    }
};

const renderUploadDocuments = () => (
    <div style={styles.formContainer}>
        <div style={styles.formHeader}>
            <button 
                style={styles.backButton}
                onClick={() => setActiveView('dashboard')}
            >
                ← Back to Dashboard
            </button>
            <h2 style={styles.formTitle}>Upload Document</h2>
        </div>

        <form style={styles.form} onSubmit={handleSubmitUpload}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Document Title</label>
                <input
                    ref={titleRef}
                    type="text"
                    style={styles.input}
                    placeholder="Enter document title"
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Document Type</label>
                <select ref={typeRef} style={styles.select} required defaultValue="">
                    <option value="">Select document type</option>
                    <option value="proposal">Proposal</option>
                    <option value="design">Design Document</option>
                    <option value="test">Test Document</option>
                    <option value="thesis">Thesis</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Course/Subject</label>
                <input
                    ref={courseRef}
                    type="text"
                    style={styles.input}
                    placeholder="Enter course or subject name"
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                    ref={descRef}
                    style={styles.textarea}
                    placeholder="Describe your document..."
                    rows="4"
                />
            </div>

            <div
                style={{
                    ...styles.uploadBox,
                    borderColor: dragActive ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.22)',
                    background: dragActive ? 'linear-gradient(180deg, rgba(99,102,241,0.06), rgba(6,182,212,0.03))' : styles.uploadBox.background,
                }}
                onClick={openFileDialog}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    style={styles.fileInput}
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                />
                <div style={styles.uploadArea}>
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" style={styles.uploadIcon}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-6-7V9h-2v4H7l4 4 4-4h-3z"/>
                    </svg>

                    {selectedFile ? (
                        <>
                            <p style={styles.uploadText}>{selectedFile.name}</p>
                            <p style={styles.uploadSubtext}>{Math.round(selectedFile.size / 1024)} KB</p>
                        </>
                    ) : (
                        <>
                            <p style={styles.uploadText}>Click to upload or drag and drop</p>
                            <p style={styles.uploadSubtext}>PDF, DOC, DOCX, TXT (Max 10MB)</p>
                        </>
                    )}
                </div>
            </div>

            {errorMsg && (
                <div style={{ color: 'crimson', fontWeight: 700, marginTop: 6 }}>
                    {errorMsg}
                </div>
            )}

            <button type="submit" style={{ ...styles.submitButton, opacity: uploading ? 0.7 : 1 }} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
        </form>
    </div>
);

  const renderViewFeedback = () => (
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <button 
          style={styles.backButton}
          onClick={() => setActiveView('dashboard')}
        >
          ← Back to Dashboard
        </button>
        <h2 style={styles.formTitle}>Feedback</h2>
        <p style={styles.formSubtitle}>Your feedback will appear here once available</p>
      </div>

      <div style={styles.emptyState}>
        <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" style={styles.emptyIcon}>
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
        </svg>
        <h3 style={styles.emptyTitle}>No Feedback Available</h3>
        <p style={styles.emptyText}>Feedback from faculty will be displayed here once your documents are reviewed.</p>
      </div>
    </div>
  );

  const renderViewHistory = () => (
    <div style={styles.formContainer}>
      <div style={styles.formHeader}>
        <button 
          style={styles.backButton}
          onClick={() => setActiveView('dashboard')}
        >
          ← Back to Dashboard
        </button>
        <h2 style={styles.formTitle}>Submission History</h2>
        <p style={styles.formSubtitle}>Your submission history will be displayed here</p>
      </div>

      <div style={styles.emptyState}>
        <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" style={styles.emptyIcon}>
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
        <h3 style={styles.emptyTitle}>No Submission History</h3>
        <p style={styles.emptyText}>Your document submission history will appear here once you start uploading files.</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'upload' && renderUploadDocuments()}
      {activeView === 'feedback' && renderViewFeedback()}
      {activeView === 'history' && renderViewHistory()}
    </div>
  );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 45%, #a78bfa 100%)',
        padding: '30px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundBlendMode: 'soft-light',
    },
    dashboard: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 24px',
    },
    welcomeSection: {
        textAlign: 'center',
        marginBottom: '56px',
        color: 'rgba(255,255,255,0.95)',
    },
    welcomeTitle: {
        fontSize: '3rem',
        fontWeight: 800,
        marginBottom: '12px',
        color: 'rgba(255,255,255,0.98)',
        letterSpacing: '-0.02em',
    },
    welcomeSubtitle: {
        fontSize: '1.15rem',
        opacity: 0.95,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.9)',
    },
    optionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '28px',
        marginTop: '34px',
    },
    optionCard: {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
        backdropFilter: 'blur(10px) saturate(120%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '18px',
        padding: '36px 28px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.96)',
        cursor: 'pointer',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        boxShadow: '0 10px 30px rgba(12, 14, 20, 0.25)',
    },
    optionIcon: {
        marginBottom: '18px',
        color: 'rgba(255,255,255,0.95)',
    },
    optionTitle: {
        fontSize: '1.35rem',
        fontWeight: 700,
        marginBottom: '10px',
        color: 'rgba(255,255,255,0.98)',
    },
    optionDescription: {
        fontSize: '0.98rem',
        opacity: 0.9,
        lineHeight: '1.5',
        color: 'rgba(255,255,255,0.9)',
    },

    formContainer: {
        maxWidth: '840px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(246,247,255,0.86) 100%)',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 24px 60px rgba(16, 24, 40, 0.12), 0 6px 18px rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.08)',
        backdropFilter: 'blur(6px) saturate(120%)',
        position: 'relative',
        overflow: 'hidden',
    },
    formAccent: {
        position: 'absolute',
        right: '-60px',
        top: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.18), transparent 40%), radial-gradient(circle at 70% 70%, rgba(6,182,212,0.12), transparent 40%)',
        transform: 'rotate(25deg)',
        pointerEvents: 'none',
    },
    formHeader: {
        marginBottom: '22px',
    },
    backButton: {
        background: 'transparent',
        border: 'none',
        color: '#4f46e5',
        fontSize: '15px',
        cursor: 'pointer',
        padding: '6px 0',
        marginBottom: '18px',
        fontWeight: 700,
        borderRadius: '8px',
    },
    formTitle: {
        fontSize: '1.9rem',
        fontWeight: 750,
        color: '#0f172a',
        marginBottom: '8px',
    },
    formSubtitle: {
        color: '#475569',
        fontSize: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '13px',
        fontWeight: 700,
        color: '#0f172a',
    },
    input: {
        padding: '12px 14px',
        fontSize: '15px',
        border: '1px solid rgba(15,23,42,0.06)',
        borderRadius: '10px',
        outline: 'none',
        transition: 'box-shadow 150ms ease, border-color 150ms ease',
        background: 'linear-gradient(180deg,#fff,#fbfdff)',
        color: '#0f172a',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
    },
    select: {
        padding: '12px 14px',
        fontSize: '15px',
        border: '1px solid rgba(15,23,42,0.06)',
        borderRadius: '10px',
        outline: 'none',
        background: 'linear-gradient(180deg,#fff,#fbfdff)',
        transition: 'box-shadow 150ms ease, border-color 150ms ease',
        color: '#0f172a',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
    },
    textarea: {
        padding: '12px 14px',
        fontSize: '15px',
        border: '1px solid rgba(15,23,42,0.06)',
        borderRadius: '10px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        transition: 'box-shadow 150ms ease, border-color 150ms ease',
        color: '#0f172a',
        background: 'linear-gradient(180deg,#fff,#fbfdff)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
    },
    uploadBox: {
        border: '1.5px dashed rgba(99,102,241,0.22)',
        borderRadius: '12px',
        padding: '18px',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        background: 'linear-gradient(180deg, rgba(99,102,241,0.03), rgba(6,182,212,0.02))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
    },
    fileInput: {
        display: 'none',
    },
    uploadArea: {
        color: '#334155',
    },
    uploadIcon: {
        color: '#6366f1',
        marginBottom: '10px',
    },
    uploadText: {
        fontSize: '15px',
        fontWeight: 700,
        marginBottom: '6px',
        color: '#111827',
    },
    uploadSubtext: {
        fontSize: '13px',
        opacity: 0.85,
        color: '#475569',
    },
    submitButton: {
        background: 'linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)',
        color: 'white',
        border: 'none',
        padding: '14px 28px',
        fontSize: '15px',
        fontWeight: 700,
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        marginTop: '8px',
        boxShadow: '0 8px 30px rgba(99,102,241,0.18), 0 2px 6px rgba(6,182,212,0.06)',
    },
    emptyState: {
        textAlign: 'center',
        padding: '56px 20px',
        color: '#475569',
        background: 'linear-gradient(180deg, rgba(99,102,241,0.03), rgba(6,182,212,0.01))',
        borderRadius: '12px',
        border: '1px solid rgba(99,102,241,0.05)',
    },
    emptyIcon: {
        color: '#c7d2fe',
        marginBottom: '18px',
    },
    emptyTitle: {
        fontSize: '1.25rem',
        fontWeight: 700,
        marginBottom: '10px',
        color: '#0f172a',
    },
    emptyText: {
        fontSize: '1rem',
        lineHeight: '1.6',
        maxWidth: '460px',
        margin: '0 auto',
        color: '#475569',
    },
};