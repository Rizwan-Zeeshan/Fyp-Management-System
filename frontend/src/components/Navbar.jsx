import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationBell from "./NotificationBell";

const API_BASE_URL = "http://localhost:8080";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Refs for dropdown timeout
  const loginTimeoutRef = React.useRef(null);
  const joinTimeoutRef = React.useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown hover with delay
  const handleLoginMouseEnter = () => {
    if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current);
    setLoginDropdownOpen(true);
  };

  const handleLoginMouseLeave = () => {
    loginTimeoutRef.current = setTimeout(() => {
      setLoginDropdownOpen(false);
    }, 300);
  };

  const handleJoinMouseEnter = () => {
    if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
    setOpen(true);
  };

  const handleJoinMouseLeave = () => {
    joinTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  // Check login status on component mount and when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      setIsLoggedIn(isAuthenticated === "true");
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn || isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      // Even if API fails, clear local storage
    }

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");

    setIsLoggedIn(false);
    setIsLoggingOut(false);

    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/logout");
  };

  const hoverStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
    
    .navbar-container {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .nav-link {
      position: relative;
      overflow: hidden;
    }
    
    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 12px;
    }
    
    .nav-link:hover::before {
      opacity: 1;
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 50%;
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, #8b5cf6, #06b6d4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(-50%);
      border-radius: 2px;
    }
    
    .nav-link:hover::after {
      width: 60%;
    }
    
    .nav-link:hover {
      color: #a78bfa !important;
      transform: translateY(-2px);
    }
    
    .dropdown-link {
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    
    .dropdown-link::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #8b5cf6, #06b6d4);
      transform: scaleY(0);
      transition: transform 0.3s ease;
      border-radius: 0 4px 4px 0;
    }
    
    .dropdown-link:hover::before {
      transform: scaleY(1);
    }
    
    .dropdown-link:hover {
      background: linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.05));
      color: #a78bfa !important;
      padding-left: 24px !important;
    }
    
    .logout-btn {
      position: relative;
      overflow: hidden;
    }
    
    .logout-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
    }
    
    .logout-btn:hover::before {
      width: 300px;
      height: 300px;
    }
    
    .logout-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 30px rgba(239, 68, 68, 0.5), 0 0 0 2px rgba(239, 68, 68, 0.3) !important;
    }
    
    .join-btn {
      position: relative;
      overflow: hidden;
    }
    
    .join-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
    
    .join-btn:hover::before {
      left: 100%;
    }
    
    .join-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 30px rgba(34, 197, 94, 0.5) !important;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
      50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.6); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .logo-icon {
      animation: glow 3s ease-in-out infinite;
    }
    
    .logo-icon:hover {
      animation: float 2s ease-in-out infinite;
    }
    
    .logo-text {
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    
    .dropdown-menu {
      animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-15px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{hoverStyle}</style>
      <nav 
        className="navbar-container"
        style={{
          ...styles.nav,
          background: scrolled 
            ? "rgba(15, 23, 42, 0.95)" 
            : "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: scrolled 
            ? "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.1)" 
            : "0 4px 20px rgba(0, 0, 0, 0.3)",
          padding: scrolled ? "8px 40px" : "16px 50px",
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon} className="logo-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <div style={styles.logoTextContainer}>
              <h2 style={styles.logo} className="logo-text">TriNova</h2>
              <span style={styles.logoSubtext}>FYP Management</span>
            </div>
          </div>
        </Link>

        <ul style={styles.menu}>
          {/* Show these links only when NOT logged in */}
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/" style={styles.link} className="nav-link">
                  <span style={styles.linkIcon}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </span>
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about" style={styles.link} className="nav-link">
                  <span style={styles.linkIcon}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </span>
                  About
                </Link>
              </li>

              <li
                style={styles.dropdown}
                onMouseEnter={handleLoginMouseEnter}
                onMouseLeave={handleLoginMouseLeave}
              >
                <span style={styles.link} className="nav-link">
                  <span style={styles.linkIcon}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                  </span>
                  Login
                  <span style={styles.dropdownArrow}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </span>

                <div
                  className="dropdown-menu"
                  style={{
                    ...styles.dropdownContent,
                    opacity: loginDropdownOpen ? 1 : 0,
                    transform: loginDropdownOpen ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-10px)',
                    pointerEvents: loginDropdownOpen ? "auto" : "none",
                    visibility: loginDropdownOpen ? "visible" : "hidden",
                  }}
                  onMouseEnter={handleLoginMouseEnter}
                  onMouseLeave={handleLoginMouseLeave}
                >
                  <div style={styles.dropdownHeader}>
                    <span style={styles.dropdownHeaderIcon}>🔐</span>
                    Choose your role
                  </div>
                  <Link 
                    to="/Login" 
                    style={styles.dropdownLink} 
                    className="dropdown-link"
                  >
                    <span style={styles.dropdownIcon}>🎓</span>
                    <div style={styles.dropdownLinkText}>
                      <span style={styles.dropdownLinkTitle}>Student</span>
                      <span style={styles.dropdownLinkDesc}>Access your dashboard</span>
                    </div>
                  </Link>

                  <Link 
                    to="/facLogin" 
                    style={styles.dropdownLink} 
                    className="dropdown-link"
                  >
                    <span style={styles.dropdownIcon}>👨‍🏫</span>
                    <div style={styles.dropdownLinkText}>
                      <span style={styles.dropdownLinkTitle}>Faculty</span>
                      <span style={styles.dropdownLinkDesc}>Manage your students</span>
                    </div>
                  </Link>

                  <Link 
                    to="/admin-login" 
                    style={styles.dropdownLink} 
                    className="dropdown-link"
                  >
                    <span style={styles.dropdownIcon}>🛡️</span>
                    <div style={styles.dropdownLinkText}>
                      <span style={styles.dropdownLinkTitle}>Admin</span>
                      <span style={styles.dropdownLinkDesc}>System administration</span>
                    </div>
                  </Link>
                </div>
              </li>

              <li
                style={styles.dropdown}
                onMouseEnter={handleJoinMouseEnter}
                onMouseLeave={handleJoinMouseLeave}
              >
                <button style={styles.joinBtn} className="join-btn">
                  <span style={styles.linkIcon}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                  </span>
                  Join Us
                  <span style={styles.dropdownArrow}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </button>

                <div
                  className="dropdown-menu"
                  style={{
                    ...styles.dropdownContent,
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-10px)',
                    pointerEvents: open ? "auto" : "none",
                    visibility: open ? "visible" : "hidden",
                  }}
                  onMouseEnter={handleJoinMouseEnter}
                  onMouseLeave={handleJoinMouseLeave}
                >
                  <div style={styles.dropdownHeader}>
                    <span style={styles.dropdownHeaderIcon}>✨</span>
                    Create an account
                  </div>
                  <Link to="/student-signup" style={styles.dropdownLink} className="dropdown-link">
                    <span style={styles.dropdownIcon}>🎓</span>
                    <div style={styles.dropdownLinkText}>
                      <span style={styles.dropdownLinkTitle}>Student</span>
                      <span style={styles.dropdownLinkDesc}>Start your FYP journey</span>
                    </div>
                  </Link>
                </div>
              </li>

              <li>
                <Link to="/contact" style={styles.link} className="nav-link">
                  <span style={styles.linkIcon}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  Contact
                </Link>
              </li>
            </>
          )}

          {/* Show Notification Bell for logged-in students */}
          {isLoggedIn && localStorage.getItem('userRole')?.toLowerCase() === 'student' && (
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <NotificationBell />
            </li>
          )}

          {/* Show Logout button - always visible but only enabled when logged in */}
          <li>
            <button 
              onClick={handleLogout}
              disabled={!isLoggedIn || isLoggingOut}
              style={{
                ...styles.logoutBtn,
                opacity: isLoggedIn ? 1 : 0.5,
                cursor: isLoggedIn ? "pointer" : "not-allowed",
                filter: isLoggedIn ? "none" : "grayscale(50%)",
              }} 
              className={isLoggedIn ? "logout-btn" : ""}
              title={isLoggedIn ? "Click to logout" : "Please login first"}
            >
              {isLoggingOut ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              )}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
  },
  logoIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
  },
  logoTextContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  logo: {
    margin: 0,
    fontSize: "1.6rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #a78bfa 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
  },
  logoSubtext: {
    fontSize: "0.7rem",
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: 500,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  menu: {
    display: "flex",
    gap: "6px",
    listStyle: "none",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: 500,
    padding: "12px 18px",
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  linkIcon: {
    display: "flex",
    alignItems: "center",
    opacity: 0.85,
  },
  dropdown: {
    position: "relative",
    cursor: "pointer",
  },
  dropdownArrow: {
    display: "flex",
    alignItems: "center",
    marginLeft: "4px",
    opacity: 0.7,
    transition: "transform 0.3s ease",
  },
  dropdownContent: {
    position: "absolute",
    top: "calc(100% + 12px)",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    minWidth: "240px",
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 16px 10px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    marginBottom: "8px",
  },
  dropdownHeaderIcon: {
    fontSize: "0.9rem",
  },
  dropdownLink: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: 500,
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "0.9rem",
  },
  dropdownIcon: {
    fontSize: "1.4rem",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
  },
  dropdownLinkText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  dropdownLinkTitle: {
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  dropdownLinkDesc: {
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: 400,
  },
  joinBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "white",
    fontWeight: 600,
    padding: "12px 22px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
    boxShadow: "0 8px 20px rgba(34, 197, 94, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "0.95rem",
    border: "none",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "white",
    fontWeight: 600,
    padding: "12px 22px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    boxShadow: "0 8px 20px rgba(239, 68, 68, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "0.95rem",
    marginLeft: "8px",
    border: "none",
    fontFamily: "inherit",
  },
};