import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function SetDeadlines() {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([
        { doc_type: "Proposal", deadline_date: "", displayName: "Proposal", icon: "📄" },
        { doc_type: "Design Document", deadline_date: "", displayName: "Design Document", icon: "📐" },
        { doc_type: "Test Document", deadline_date: "", displayName: "Test Document", icon: "🧪" },
        { doc_type: "Thesis", deadline_date: "", displayName: "Thesis", icon: "📚" }
    ]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Check authentication
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        const userRole = localStorage.getItem("userRole");
        
        if (!isAuthenticated || (userRole?.toLowerCase() !== "fyp committee member")) {
            navigate("/facLogin");
            return;
        }

        fetchDeadlines();
    }, [navigate]);

    const fetchDeadlines = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/faculty/documenttypes`,
                { withCredentials: true }
            );
            
            // Update documents with fetched deadlines
            const fetchedDocs = response.data;
            setDocuments(prev => prev.map(doc => {
                const fetched = fetchedDocs.find(f => f.doc_type === doc.doc_type);
                return {
                    ...doc,
                    deadline_date: fetched?.deadline_date || ""
                };
            }));
        } catch (error) {
            console.error("Error fetching deadlines:", error);
            setErrorMessage("Failed to load current deadlines");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (docType, newDate) => {
        setDocuments(prev => prev.map(doc => 
            doc.doc_type === docType 
                ? { ...doc, deadline_date: newDate }
                : doc
        ));
    };

    const handleSaveDeadline = async (docType) => {
        const doc = documents.find(d => d.doc_type === docType);
        if (!doc.deadline_date) {
            setErrorMessage("Please select a date first");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setSaving(prev => ({ ...prev, [docType]: true }));
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await axios.post(
                `${API_BASE_URL}/faculty/changedeadline`,
                {
                    doc_type: docType,
                    deadline_date: doc.deadline_date
                },
                { 
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );
            
            setSuccessMessage(`Deadline for ${doc.displayName} updated successfully!`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error saving deadline:", error);
            setErrorMessage(`Failed to update deadline for ${doc.displayName}`);
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setSaving(prev => ({ ...prev, [docType]: false }));
        }
    };

    const handleSaveAll = async () => {
        const docsWithDates = documents.filter(d => d.deadline_date);
        if (docsWithDates.length === 0) {
            setErrorMessage("Please set at least one deadline");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setSaving({ all: true });
        setErrorMessage("");
        setSuccessMessage("");

        try {
            for (const doc of docsWithDates) {
                await axios.post(
                    `${API_BASE_URL}/faculty/changedeadline`,
                    {
                        doc_type: doc.doc_type,
                        deadline_date: doc.deadline_date
                    },
                    { 
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" }
                    }
                );
            }
            
            setSuccessMessage("All deadlines updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error saving deadlines:", error);
            setErrorMessage("Failed to update some deadlines");
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setSaving({});
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const isDatePast = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    return (
        <div style={styles.container}>
            {/* Background Elements */}
            <div style={styles.bgOrb1}></div>
            <div style={styles.bgOrb2}></div>
            <div style={styles.bgOrb3}></div>

            {/* Header */}
            <div style={styles.header}>
                <button onClick={() => navigate("/Dashboard4")} style={styles.backBtn}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    Back to Dashboard
                </button>
                <div style={styles.titleSection}>
                    <span style={styles.titleIcon}>📅</span>
                    <h1 style={styles.title}>Set Document Deadlines</h1>
                </div>
                <p style={styles.subtitle}>
                    Configure submission deadlines for FYP documents. Students will see these deadlines on their dashboard.
                </p>
            </div>

            {/* Messages */}
            {successMessage && (
                <div style={styles.successBox}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div style={styles.errorBox}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {errorMessage}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div style={styles.loadingContainer}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading deadlines...</p>
                </div>
            ) : (
                <>
                    {/* Document Cards */}
                    <div style={styles.cardsContainer}>
                        {documents.map((doc, index) => (
                            <div key={doc.doc_type} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.cardIconWrapper}>
                                        <span style={styles.cardIcon}>{doc.icon}</span>
                                    </div>
                                    <div style={styles.cardTitleSection}>
                                        <h3 style={styles.cardTitle}>{doc.displayName}</h3>
                                        <span style={styles.cardNumber}>Document {index + 1}</span>
                                    </div>
                                </div>

                                <div style={styles.cardBody}>
                                    <div style={styles.currentDeadline}>
                                        <span style={styles.currentLabel}>Current Deadline:</span>
                                        <span style={{
                                            ...styles.currentValue,
                                            color: doc.deadline_date 
                                                ? (isDatePast(doc.deadline_date) ? '#ef4444' : '#10b981')
                                                : '#94a3b8'
                                        }}>
                                            {formatDate(doc.deadline_date)}
                                            {isDatePast(doc.deadline_date) && doc.deadline_date && (
                                                <span style={styles.expiredBadge}>Expired</span>
                                            )}
                                        </span>
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.inputLabel}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                                            </svg>
                                            Set New Deadline
                                        </label>
                                        <div style={styles.inputRow}>
                                            <input
                                                type="date"
                                                value={doc.deadline_date}
                                                onChange={(e) => handleDateChange(doc.doc_type, e.target.value)}
                                                style={styles.dateInput}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            <button
                                                onClick={() => handleSaveDeadline(doc.doc_type)}
                                                disabled={saving[doc.doc_type] || !doc.deadline_date}
                                                style={{
                                                    ...styles.saveBtn,
                                                    opacity: saving[doc.doc_type] || !doc.deadline_date ? 0.6 : 1,
                                                    cursor: saving[doc.doc_type] || !doc.deadline_date ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {saving[doc.doc_type] ? (
                                                    <span style={styles.btnSpinner}></span>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                                    </svg>
                                                )}
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Save All Button */}
                    <div style={styles.footer}>
                        <button
                            onClick={handleSaveAll}
                            disabled={saving.all}
                            style={{
                                ...styles.saveAllBtn,
                                opacity: saving.all ? 0.6 : 1,
                                cursor: saving.all ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {saving.all ? (
                                <>
                                    <span style={styles.btnSpinner}></span>
                                    Saving All...
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                                    </svg>
                                    Save All Deadlines
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    bgOrb1: {
        position: "absolute",
        top: "-150px",
        right: "-100px",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)",
        animation: "float 6s ease-in-out infinite",
    },
    bgOrb2: {
        position: "absolute",
        bottom: "-150px",
        left: "-100px",
        width: "450px",
        height: "450px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)",
        animation: "float 8s ease-in-out infinite reverse",
    },
    bgOrb3: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.1), transparent 70%)",
        animation: "float 10s ease-in-out infinite",
    },
    header: {
        maxWidth: "900px",
        margin: "0 auto 30px",
        position: "relative",
        zIndex: 10,
    },
    backBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        color: "white",
        fontSize: "0.9rem",
        cursor: "pointer",
        marginBottom: "20px",
        transition: "all 0.3s ease",
    },
    titleSection: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "10px",
    },
    titleIcon: {
        fontSize: "2.5rem",
    },
    title: {
        fontSize: "2rem",
        fontWeight: 800,
        color: "white",
        margin: 0,
    },
    subtitle: {
        fontSize: "1rem",
        color: "rgba(255, 255, 255, 0.6)",
        marginLeft: "60px",
    },
    successBox: {
        maxWidth: "900px",
        margin: "0 auto 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "15px 20px",
        background: "rgba(16, 185, 129, 0.15)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        borderRadius: "12px",
        color: "#10b981",
        fontSize: "0.95rem",
        position: "relative",
        zIndex: 10,
    },
    errorBox: {
        maxWidth: "900px",
        margin: "0 auto 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "15px 20px",
        background: "rgba(239, 68, 68, 0.15)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        borderRadius: "12px",
        color: "#ef4444",
        fontSize: "0.95rem",
        position: "relative",
        zIndex: 10,
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
        border: "4px solid rgba(255,255,255,0.1)",
        borderTopColor: "#6366f1",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    loadingText: {
        marginTop: "20px",
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "1rem",
    },
    cardsContainer: {
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "relative",
        zIndex: 10,
    },
    card: {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        transition: "all 0.3s ease",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "25px 30px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        background: "rgba(255, 255, 255, 0.02)",
    },
    cardIconWrapper: {
        width: "60px",
        height: "60px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
    },
    cardIcon: {
        fontSize: "1.8rem",
    },
    cardTitleSection: {
        flex: 1,
    },
    cardTitle: {
        fontSize: "1.3rem",
        fontWeight: 700,
        color: "white",
        margin: 0,
    },
    cardNumber: {
        fontSize: "0.85rem",
        color: "rgba(255, 255, 255, 0.5)",
    },
    cardBody: {
        padding: "25px 30px",
    },
    currentDeadline: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "20px",
        padding: "15px 20px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
    },
    currentLabel: {
        fontSize: "0.9rem",
        color: "rgba(255, 255, 255, 0.6)",
    },
    currentValue: {
        fontSize: "1rem",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    expiredBadge: {
        fontSize: "0.75rem",
        padding: "3px 8px",
        background: "rgba(239, 68, 68, 0.2)",
        borderRadius: "6px",
        color: "#ef4444",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    inputLabel: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.9rem",
        color: "rgba(255, 255, 255, 0.7)",
        fontWeight: 500,
    },
    inputRow: {
        display: "flex",
        gap: "15px",
        alignItems: "center",
    },
    dateInput: {
        flex: 1,
        padding: "14px 18px",
        fontSize: "1rem",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        background: "rgba(255, 255, 255, 0.08)",
        color: "white",
        outline: "none",
        cursor: "pointer",
    },
    saveBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "14px 24px",
        background: "linear-gradient(135deg, #10b981, #059669)",
        border: "none",
        borderRadius: "12px",
        color: "white",
        fontSize: "0.95rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
    },
    btnSpinner: {
        width: "18px",
        height: "18px",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "white",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    footer: {
        maxWidth: "900px",
        margin: "30px auto 0",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        zIndex: 10,
    },
    saveAllBtn: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "16px 40px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        border: "none",
        borderRadius: "14px",
        color: "white",
        fontSize: "1.1rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
    },
};
