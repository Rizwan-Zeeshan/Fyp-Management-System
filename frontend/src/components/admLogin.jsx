import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ username: false, password: false });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [focusedField, setFocusedField] = useState(null);
    const [hoveredBtn, setHoveredBtn] = useState(false);

    const usernameIsValid = username.trim().length >= 3;
    const passwordIsValid = password.length >= 4;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ username: true, password: true });
        setErrorMessage("");

        if (!usernameIsValid || !passwordIsValid) return;

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/admin/login`,
                {
                    username: username.trim(),
                    password: password,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            const { role, message, adminId, username: adminUsername } = response.data;
            
            // Store admin info in localStorage
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userId", adminId);
            localStorage.setItem("userRole", role);
            localStorage.setItem("adminUsername", adminUsername);
            
            window.dispatchEvent(new Event("loginStatusChanged"));
            
            console.log("Admin login successful:", message);
            
            // Navigate to admin dashboard (Dashboard5 - FYP Committee)
            navigate("/Dashboard5");
            
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Invalid credentials. Please try again.");
            } else if (error.request) {
                setErrorMessage("Network error. Please check if the server is running.");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Animated Background */}
            <div style={styles.bgContainer}>
                <div style={styles.bgOrb1}></div>
                <div style={styles.bgOrb2}></div>
                <div style={styles.bgOrb3}></div>
                <div style={styles.bgGrid}></div>
                <div style={styles.particles}>
                    {[...Array(20)].map((_, i) => (
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

            <div style={styles.card}>
                {/* Card glow effect */}
                <div style={styles.cardGlow}></div>
                
                <div style={styles.cardInner}>
                    {/* Icon with animated ring */}
                    <div style={styles.iconContainer}>
                        <div style={styles.iconRing}></div>
                        <div style={styles.iconWrapper}>
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                            </svg>
                        </div>
                    </div>

                    <h2 style={styles.title}>
                        <span style={styles.titleGradient}>Admin Portal</span>
                    </h2>
                    <p style={styles.subtitle}>
                        <span style={styles.sparkle}>🛡️</span>
                        Secure system administration access
                    </p>

                    <form onSubmit={handleSubmit} style={styles.form} noValidate>
                        <div style={styles.field}>
                            <label htmlFor="username" style={styles.label}>
                                <span style={styles.labelIcon}>👤</span>
                                Username
                            </label>
                            <div style={{
                                ...styles.inputWrapper,
                                ...(focusedField === 'username' ? styles.inputWrapperFocused : {}),
                                ...(touched.username && !usernameIsValid ? styles.inputWrapperError : {}),
                            }}>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => {
                                        setFocusedField(null);
                                        setTouched((t) => ({ ...t, username: true }));
                                    }}
                                    style={styles.input}
                                    required
                                    autoComplete="username"
                                    placeholder="Enter your username"
                                />
                                <div style={styles.inputGlow}></div>
                            </div>
                            {touched.username && !usernameIsValid && (
                                <div style={styles.error}>
                                    <span style={styles.errorIcon}>⚠️</span>
                                    Username must be at least 3 characters
                                </div>
                            )}
                        </div>

                        <div style={styles.field}>
                            <label htmlFor="password" style={styles.label}>
                                <span style={styles.labelIcon}>🔐</span>
                                Password
                            </label>
                            <div style={{
                                ...styles.inputWrapper,
                                ...(focusedField === 'password' ? styles.inputWrapperFocused : {}),
                                ...(touched.password && !passwordIsValid ? styles.inputWrapperError : {}),
                            }}>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => {
                                        setFocusedField(null);
                                        setTouched((t) => ({ ...t, password: true }));
                                    }}
                                    style={{...styles.input, paddingRight: 50}}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    style={styles.toggleBtn}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                                <div style={styles.inputGlow}></div>
                            </div>
                            {touched.password && !passwordIsValid && (
                                <div style={styles.error}>
                                    <span style={styles.errorIcon}>⚠️</span>
                                    Password must be at least 4 characters
                                </div>
                            )}
                        </div>

                        {errorMessage && (
                            <div style={styles.errorBox}>
                                <span style={styles.errorBoxIcon}>❌</span>
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!usernameIsValid || !passwordIsValid || loading}
                            onMouseEnter={() => setHoveredBtn(true)}
                            onMouseLeave={() => setHoveredBtn(false)}
                            style={{
                                ...styles.submit,
                                opacity: !usernameIsValid || !passwordIsValid || loading ? 0.6 : 1,
                                cursor: !usernameIsValid || !passwordIsValid || loading ? "not-allowed" : "pointer",
                                transform: hoveredBtn && usernameIsValid && passwordIsValid && !loading 
                                    ? 'translateY(-3px) scale(1.02)' 
                                    : 'translateY(0)',
                                boxShadow: hoveredBtn && usernameIsValid && passwordIsValid && !loading
                                    ? '0 20px 40px rgba(239,68,68,0.5), 0 0 0 3px rgba(239,68,68,0.2)'
                                    : '0 10px 30px rgba(239, 68, 68, 0.4)',
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={styles.spinner}></span>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <span style={styles.btnIcon}>⚡</span>
                                    Access Dashboard
                                    <span style={styles.btnArrow}>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div style={styles.divider}>
                        <span style={styles.dividerLine}></span>
                        <span style={styles.dividerText}>🔒 Admin Access Only</span>
                        <span style={styles.dividerLine}></span>
                    </div>

                    <div style={styles.infoBox}>
                        <span style={styles.infoIcon}>ℹ️</span>
                        <span style={styles.infoText}>
                            Contact system administrator if you need access
                        </span>
                    </div>

                    {/* Security badge */}
                    <div style={styles.securityBadge}>
                        <span style={styles.securityIcon}>🛡️</span>
                        <span style={styles.securityText}>Protected by advanced security</span>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
                
                @keyframes float { 
                    0%, 100% { transform: translateY(0) rotate(0deg); } 
                    50% { transform: translateY(-25px) rotate(3deg); } 
                }
                
                @keyframes spin { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(360deg); } 
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                @keyframes ringRotate {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                
                @keyframes particleFloat {
                    0%, 100% { 
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0.4;
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px) scale(1.1);
                        opacity: 0.7;
                    }
                    50% { 
                        transform: translateY(-40px) translateX(-5px) scale(0.9);
                        opacity: 0.3;
                    }
                    75% {
                        transform: translateY(-20px) translateX(-10px) scale(1.05);
                        opacity: 0.5;
                    }
                }
                
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.3); }
                    50% { box-shadow: 0 0 50px rgba(168, 85, 247, 0.5); }
                }
                
                @keyframes sparkle {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.2) rotate(10deg); }
                }
                
                .particle {
                    animation: particleFloat 5s ease-in-out infinite;
                }
                
                input::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }
                
                input:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 40%, #0f172a 100%)",
        padding: 20,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    bgContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
    },
    bgOrb1: {
        position: "absolute",
        top: "-150px",
        right: "-100px",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(239,68,68,0.3), transparent 60%)",
        animation: "float 8s ease-in-out infinite",
        filter: "blur(40px)",
    },
    bgOrb2: {
        position: "absolute",
        bottom: "-150px",
        left: "-100px",
        width: "550px",
        height: "550px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.25), transparent 60%)",
        animation: "float 10s ease-in-out infinite reverse",
        filter: "blur(50px)",
    },
    bgOrb3: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.15), transparent 60%)",
        animation: "float 7s ease-in-out infinite",
        filter: "blur(35px)",
        transform: "translate(-50%, -50%)",
    },
    bgGrid: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
    },
    particles: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    particle: {
        position: "absolute",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ef4444, #a855f7)",
        boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
    },
    card: {
        width: "100%",
        maxWidth: 440,
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))",
        backdropFilter: "blur(20px)",
        borderRadius: 28,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
    },
    cardGlow: {
        position: "absolute",
        top: "-2px",
        left: "-2px",
        right: "-2px",
        bottom: "-2px",
        borderRadius: 30,
        background: "linear-gradient(135deg, rgba(239,68,68,0.3), rgba(168,85,247,0.2), rgba(251,191,36,0.3))",
        filter: "blur(15px)",
        zIndex: -1,
        animation: "glow 4s ease-in-out infinite",
    },
    cardInner: {
        padding: "50px 45px 45px",
        textAlign: "center",
    },
    iconContainer: {
        position: "relative",
        width: 90,
        height: 90,
        margin: "0 auto 28px",
    },
    iconRing: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: "2px dashed rgba(239, 68, 68, 0.4)",
        animation: "ringRotate 10s linear infinite",
    },
    iconWrapper: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 75,
        height: 75,
        borderRadius: 22,
        background: "linear-gradient(135deg, #ef4444, #dc2626, #a855f7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 15px 40px rgba(239, 68, 68, 0.5)",
    },
    title: {
        marginBottom: 8,
    },
    titleGradient: {
        fontSize: "2rem",
        fontWeight: 800,
        background: "linear-gradient(135deg, #fff 0%, #fca5a5 50%, #c4b5fd 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "shimmer 4s linear infinite",
    },
    subtitle: {
        fontSize: "1rem",
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: 35,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
    },
    sparkle: {
        animation: "sparkle 2s ease-in-out infinite",
        display: "inline-block",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 22,
    },
    field: {
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
    },
    label: {
        display: "flex",
        alignItems: "center",
        marginBottom: 12,
        fontSize: "0.95rem",
        fontWeight: 600,
        color: "rgba(255, 255, 255, 0.85)",
    },
    labelIcon: {
        marginRight: 10,
        fontSize: "1.1rem",
    },
    inputWrapper: {
        position: "relative",
        borderRadius: 14,
        background: "rgba(255, 255, 255, 0.06)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
    },
    inputWrapperFocused: {
        borderColor: "#ef4444",
        background: "rgba(239, 68, 68, 0.08)",
        boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)",
    },
    inputWrapperError: {
        borderColor: "#ef4444",
        background: "rgba(239, 68, 68, 0.08)",
    },
    input: {
        width: "100%",
        padding: "16px 18px",
        fontSize: "1rem",
        border: "none",
        background: "transparent",
        color: "white",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "inherit",
    },
    inputGlow: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, #ef4444, #a855f7, transparent)",
        opacity: 0,
        transition: "opacity 0.3s ease",
    },
    toggleBtn: {
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        background: "transparent",
        border: "none",
        fontSize: "1.2rem",
        cursor: "pointer",
        padding: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s ease",
    },
    submit: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: "100%",
        padding: "17px",
        marginTop: 10,
        border: "none",
        background: "linear-gradient(135deg, #ef4444, #dc2626)",
        borderRadius: 14,
        fontSize: "1.05rem",
        fontWeight: 700,
        color: "white",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "inherit",
        position: "relative",
        overflow: "hidden",
    },
    btnIcon: {
        fontSize: "1.1rem",
    },
    btnArrow: {
        fontSize: "1.2rem",
        transition: "transform 0.3s ease",
    },
    spinner: {
        width: 20,
        height: 20,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "white",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    error: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 10,
        color: "#f87171",
        fontSize: "0.85rem",
    },
    errorIcon: {
        fontSize: "0.9rem",
    },
    errorBox: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        background: "rgba(239, 68, 68, 0.12)",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        borderRadius: 12,
        color: "#f87171",
        fontSize: "0.95rem",
    },
    errorBoxIcon: {
        fontSize: "1rem",
    },
    divider: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        margin: "30px 0 22px",
    },
    dividerLine: {
        flex: 1,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
    },
    dividerText: {
        fontSize: "0.9rem",
        color: "rgba(255, 255, 255, 0.5)",
        fontWeight: 500,
    },
    infoBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "12px 16px",
        background: "rgba(168, 85, 247, 0.1)",
        border: "1px solid rgba(168, 85, 247, 0.2)",
        borderRadius: "12px",
        marginBottom: "15px",
    },
    infoIcon: {
        fontSize: "1rem",
    },
    infoText: {
        fontSize: "0.85rem",
        color: "rgba(255, 255, 255, 0.6)",
    },
    securityBadge: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginTop: "10px",
        padding: "10px 16px",
        background: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        borderRadius: "20px",
    },
    securityIcon: {
        fontSize: "0.9rem",
    },
    securityText: {
        fontSize: "0.8rem",
        color: "rgba(239, 68, 68, 0.8)",
        fontWeight: 500,
    },
};
