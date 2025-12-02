import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = React.useState(false);

  const hoverStyle = `
    .nav-link {
      position: relative;
      overflow: hidden;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    .nav-link:hover::after {
      width: 80%;
    }
    .nav-link:hover {
      color: #6366f1 !important;
    }
    .dropdown-link {
      position: relative;
      transition: all 0.3s ease;
    }
    .dropdown-link:hover {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff !important;
      padding-left: 28px;
    }
    .dropdown-link::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
    }
    .dropdown-link:hover::before {
      transform: translateY(-50%) scale(1);
    }
    .logout-btn:hover {
      background: linear-gradient(135deg, #ef4444, #f97316) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  return (
    <>
      <style>{hoverStyle}</style>
      <nav style={styles.nav}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 style={styles.logo}>TriNova</h2>
          </div>
        </Link>

        <ul style={styles.menu}>
          <li>
            <Link to="/" style={styles.link} className="nav-link">
              <span style={styles.linkIcon}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </span>
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" style={styles.link} className="nav-link">
              <span style={styles.linkIcon}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </span>
              About
            </Link>
          </li>

          <li
            style={styles.dropdown}
            onMouseEnter={() => setLoginDropdownOpen(true)}
            onMouseLeave={() => setLoginDropdownOpen(false)}
          >
            <span style={styles.link} className="nav-link">
              <span style={styles.linkIcon}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                </svg>
              </span>
              Login
              <span style={styles.dropdownArrow}>▾</span>
            </span>

            <div
              style={{
                ...styles.dropdownContent,
                opacity: loginDropdownOpen ? 1 : 0,
                transform: loginDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                pointerEvents: loginDropdownOpen ? "auto" : "none",
              }}
            >
              <div style={styles.dropdownHeader}>Choose your role</div>
              <Link 
                to="/Login" 
                style={styles.dropdownLink} 
                className="dropdown-link"
              >
                <span style={styles.dropdownIcon}>🎓</span>
                As a Student
              </Link>

              <Link 
                to="/facLogin" 
                style={styles.dropdownLink} 
                className="dropdown-link"
              >
                <span style={styles.dropdownIcon}>👨‍🏫</span>
                As a Faculty
              </Link>
            </div>
          </li>

          <li
            style={styles.dropdown}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <span style={styles.link} className="nav-link">
              <span style={styles.linkIcon}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              Join Us
              <span style={styles.dropdownArrow}>▾</span>
            </span>

            <div
              style={{
                ...styles.dropdownContent,
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(-10px)',
                pointerEvents: open ? "auto" : "none"
              }}
            >
              <div style={styles.dropdownHeader}>Create an account</div>
              <Link to="/student-signup" style={styles.dropdownLink} className="dropdown-link">
                <span style={styles.dropdownIcon}>🎓</span>
                As a Student
              </Link>

              <Link to="/faculty-signup" style={styles.dropdownLink} className="dropdown-link">
                <span style={styles.dropdownIcon}>👨‍🏫</span>
                As a Faculty
              </Link>
            </div>
          </li>

          <li>
            <Link to="/contact" style={styles.link} className="nav-link">
              <span style={styles.linkIcon}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              Contact
            </Link>
          </li>

          <li>
            <Link to="/logout" style={styles.logoutBtn} className="logout-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </Link>
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
    padding: "12px 40px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1, #06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
  },
  logo: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #6366f1, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.02em",
  },
  menu: {
    display: "flex",
    gap: "8px",
    listStyle: "none",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: 500,
    padding: "10px 16px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontSize: "0.95rem",
  },
  linkIcon: {
    display: "flex",
    alignItems: "center",
    opacity: 0.8,
  },
  dropdown: {
    position: "relative",
    cursor: "pointer",
  },
  dropdownArrow: {
    fontSize: "0.75rem",
    marginLeft: "4px",
    opacity: 0.7,
  },
  dropdownContent: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(180deg, #1e293b, #0f172a)",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  dropdownHeader: {
    padding: "10px 16px 8px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "8px",
  },
  dropdownLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: 500,
    borderRadius: "10px",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
  },
  dropdownIcon: {
    fontSize: "1.1rem",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "white",
    fontWeight: 600,
    padding: "10px 20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #dc2626, #ef4444)",
    boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
    marginLeft: "8px",
  },
};