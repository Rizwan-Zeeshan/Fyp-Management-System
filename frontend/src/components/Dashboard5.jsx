import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function Dashboard5() {
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState("");
    const [adminUsername, setAdminUsername] = useState("");
    const [stats, setStats] = useState({
        totalUsers: '--',
        activeProjects: '--',
        totalSubmissions: '--'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        const userRole = localStorage.getItem("userRole");
        
        if (!isAuthenticated || userRole !== "admin") {
            navigate("/admin-login");
            return;
        }

        setAdminId(localStorage.getItem("userId") || "");
        setAdminUsername(localStorage.getItem("adminUsername") || "Admin");

        // Fetch admin stats
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/faculty/admin/stats`, {
                    withCredentials: true
                });
                setStats({
                    totalUsers: response.data.totalUsers || 0,
                    activeProjects: response.data.activeProjects || 0,
                    totalSubmissions: response.data.totalSubmissions || 0
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
                setStats({
                    totalUsers: 'Error',
                    activeProjects: 'Error',
                    totalSubmissions: 'Error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [navigate]);

    const menuItems = [
        {
            id: 1,
            title: "Manage Users",
            description: "Add new faculty members and supervisors to the system",
            icon: (
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
            ),
            color: "#6366f1",
            gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            route: "/manage-users"
        },
        {
            id: 2,
            title: "View Reports",
            description: "View comprehensive student reports, grades, and analytics",
            icon: (
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
            ),
            color: "#f59e0b",
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            route: "/admin-reports"
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
                        <span style={styles.titleIcon}>🛡️</span>
                        <h1 style={styles.title}>Admin Dashboard</h1>
                    </div>
                    <p style={styles.subtitle}>
                        Welcome back, <span style={styles.highlight}>{adminUsername}</span>! 
                        Full system control and administration.
                    </p>
                </div>
                
                {/* Admin Info Card */}
                <div style={styles.adminCard}>
                    <div style={styles.adminAvatar}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                        </svg>
                    </div>
                    <div style={styles.adminInfo}>
                        <span style={styles.adminName}>{adminUsername}</span>
                        <span style={styles.adminRole}>System Administrator</span>
                        {adminId && <span style={styles.adminIdBadge}>ID: {adminId}</span>}
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
                <h2 style={styles.statsTitle}>System Overview</h2>
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={styles.statNumber}>{loading ? '...' : stats.totalUsers}</span>
                            <span style={styles.statLabel}>Total Users</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={styles.statNumber}>{loading ? '...' : stats.activeProjects}</span>
                            <span style={styles.statLabel}>Active Projects</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={styles.statNumber}>{loading ? '...' : stats.totalSubmissions}</span>
                            <span style={styles.statLabel}>Total Submissions</span>
                        </div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <div style={styles.statInfo}>
                            <span style={styles.statNumber}>Online</span>
                            <span style={styles.statLabel}>System Status</span>
                        </div>
                    </div>
                </div>
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
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
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
        background: "radial-gradient(circle, rgba(239,68,68,0.2), transparent 70%)",
        animation: "float 6s ease-in-out infinite",
    },
    bgOrb2: {
        position: "absolute",
        bottom: "-150px",
        left: "-100px",
        width: "450px",
        height: "450px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)",
        animation: "float 8s ease-in-out infinite reverse",
    },
    bgOrb3: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.1), transparent 70%)",
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
        color: "#ef4444",
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
        background: "linear-gradient(135deg, #ef4444, #dc2626)",
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
        color: "#ef4444",
        fontWeight: 500,
    },
    logoutBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: "rgba(239, 68, 68, 0.2)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        borderRadius: "10px",
        color: "#f87171",
        fontSize: "0.9rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginLeft: "15px",
    },
    menuGrid: {
        maxWidth: "1200px",
        margin: "0 auto 50px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px",
        position: "relative",
        zIndex: 10,
    },
    menuCard: {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "35px 25px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        textAlign: "center",
        position: "relative",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
    },
    iconContainer: {
        width: "80px",
        height: "80px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        color: "white",
    },
    cardTitle: {
        fontSize: "1.35rem",
        fontWeight: 700,
        color: "white",
        marginBottom: "10px",
    },
    cardDescription: {
        fontSize: "0.9rem",
        color: "rgba(255, 255, 255, 0.6)",
        lineHeight: 1.6,
        marginBottom: "20px",
    },
    cardArrow: {
        width: "40px",
        height: "40px",
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
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
};
