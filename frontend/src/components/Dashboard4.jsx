import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function Dashboard4() {
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState("");
    const [memberName, setMemberName] = useState("");
    const [stats, setStats] = useState({
        totalStudents: "--",
        completedProjects: "--",
        pendingReviews: "--"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        const userRole = localStorage.getItem("userRole");
        
        // Allow FYP Committee Member role
        if (!isAuthenticated || (userRole?.toLowerCase() !== "fyp committee member")) {
            navigate("/facLogin");
            return;
        }

        setMemberId(localStorage.getItem("userId") || "");
        setMemberName(localStorage.getItem("userName") || "FYP Committee Member");

        // Fetch stats
        fetchStats();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/faculty/fypcommittee/stats`,
                { withCredentials: true }
            );
            setStats({
                totalStudents: response.data.totalStudents || 0,
                completedProjects: response.data.completedProjects || 0,
                pendingReviews: response.data.pendingReviews || 0
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
            // Keep default values on error
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        {
            id: 1,
            title: "Set Deadlines",
            description: "Configure submission deadlines for FYP milestones and document submissions",
            icon: (
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                </svg>
            ),
            color: "#6366f1",
            gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            route: "/set-deadlines"
        },
        {
            id: 2,
            title: "Monitor Progress",
            description: "Track and review the progress of all FYP groups and their submissions",
            icon: (
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
            ),
            color: "#10b981",
            gradient: "linear-gradient(135deg, #10b981, #059669)",
            route: "/monitor-progress"
        },
        {
            id: 3,
            title: "Release Final Results",
            description: "Publish and announce the final grades and results for all FYP students",
            icon: (
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
            ),
            color: "#f59e0b",
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            route: "/release-results"
        }
    ];

    return (
        <div style={styles.container}>
            {/* Background Elements */}
            <div style={styles.bgOrb1}></div>
            <div style={styles.bgOrb2}></div>
            <div style={styles.bgOrb3}></div>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.titleSection}>
                        <span style={styles.titleIcon}>📋</span>
                        <h1 style={styles.title}>FYP Committee Dashboard</h1>
                    </div>
                    <p style={styles.subtitle}>
                        Welcome back, <span style={styles.highlight}>{memberName}</span>! 
                        Manage FYP processes and oversee student progress.
                    </p>
                </div>
                
                {/* Member Info Card */}
                <div style={styles.adminCard}>
                    <div style={styles.adminAvatar}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                        </svg>
                    </div>
                    <div style={styles.adminInfo}>
                        <span style={styles.adminName}>{memberName}</span>
                        <span style={styles.adminRole}>FYP Committee Member</span>
                        {memberId && <span style={styles.adminIdBadge}>ID: {memberId}</span>}
                    </div>
                </div>
            </div>

            {/* Main Content - Menu Cards */}
            <div style={styles.menuGrid}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        style={styles.menuCard}
                        className="menu-card"
                        onClick={() => navigate(item.route)}
                    >
                        <div 
                            style={{
                                ...styles.iconContainer,
                                background: item.gradient,
                                boxShadow: `0 15px 35px ${item.color}40`
                            }}
                        >
                            {item.icon}
                        </div>
                        <h3 style={styles.cardTitle}>{item.title}</h3>
                        <p style={styles.cardDescription}>{item.description}</p>
                        <div style={{...styles.cardArrow, background: item.gradient}}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div style={styles.statsSection}>
                <h2 style={styles.statsTitle}>Quick Overview</h2>
                {loading ? (
                    <div style={styles.loadingText}>Loading statistics...</div>
                ) : (
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={styles.statNumber}>{stats.totalStudents}</span>
                            <span style={styles.statLabel}>Total Students</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={styles.statNumber}>{stats.completedProjects}</span>
                            <span style={styles.statLabel}>Completed Projects</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                            </svg>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={styles.statNumber}>{stats.pendingReviews}</span>
                            <span style={styles.statLabel}>Pending Reviews</span>
                        </div>
                    </div>
                </div>
                )}
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .menu-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .menu-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3) !important;
                }
                .menu-card:hover .card-arrow {
                    transform: translateX(5px);
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
        maxWidth: "1200px",
        margin: "0 auto 50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "20px",
        position: "relative",
        zIndex: 10,
    },
    headerContent: {
        flex: 1,
        minWidth: "300px",
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
        fontSize: "2.5rem",
        fontWeight: 800,
        color: "white",
        margin: 0,
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "rgba(255, 255, 255, 0.6)",
        margin: 0,
        marginLeft: "60px",
    },
    highlight: {
        color: "#6366f1",
        fontWeight: 600,
    },
    adminCard: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "15px 25px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    adminAvatar: {
        width: "50px",
        height: "50px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    adminInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    adminName: {
        fontSize: "1rem",
        fontWeight: 600,
        color: "white",
    },
    adminRole: {
        fontSize: "0.85rem",
        color: "rgba(255, 255, 255, 0.5)",
    },
    adminIdBadge: {
        fontSize: "0.75rem",
        color: "#6366f1",
        fontWeight: 500,
    },
    menuGrid: {
        maxWidth: "1200px",
        margin: "0 auto 50px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "30px",
        position: "relative",
        zIndex: 10,
    },
    menuCard: {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "40px 30px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        textAlign: "center",
        position: "relative",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
    },
    iconContainer: {
        width: "90px",
        height: "90px",
        borderRadius: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 25px",
        color: "white",
    },
    cardTitle: {
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "white",
        marginBottom: "12px",
    },
    cardDescription: {
        fontSize: "0.95rem",
        color: "rgba(255, 255, 255, 0.6)",
        lineHeight: 1.6,
        marginBottom: "25px",
    },
    cardArrow: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        transition: "transform 0.3s ease",
    },
    statsSection: {
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 10,
    },
    statsTitle: {
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "white",
        marginBottom: "25px",
        textAlign: "center",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    statCard: {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "25px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
    },
    statIcon: {
        width: "55px",
        height: "55px",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    statInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    statNumber: {
        fontSize: "1.75rem",
        fontWeight: 700,
        color: "white",
    },
    statLabel: {
        fontSize: "0.9rem",
        color: "rgba(255, 255, 255, 0.5)",
    },
    loadingText: {
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "1rem",
        padding: "40px",
    },
};
