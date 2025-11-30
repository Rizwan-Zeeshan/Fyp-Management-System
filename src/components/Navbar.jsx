import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Sigma Male</h2>

      <ul style={styles.menu}>
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>

        <li>
          <Link to="/about" style={styles.link}>About</Link>
        </li>

        <li
          style={styles.dropdown}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span style={styles.link}>Join Us ▾</span>

          <div
            style={{
              ...styles.dropdownContent,
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none"
            }}
          >
            <Link to="/student-signup" style={styles.dropdownLink}>
              As a Student
            </Link>

            <a href="/faculty-signup" style={styles.dropdownLink}>
              As a Faculty
            </a>
          </div>
        </li>

        <li>
          <Link to="/contact" style={styles.link}>Contact Us</Link>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  menu: {
    display: "flex",
    gap: "20px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    padding: "8px 12px",
    transition: "color 0.3s ease",
  },
  dropdown: {
    position: "relative",
    cursor: "pointer",
  },
  dropdownContent: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    minWidth: "180px",
    display: "flex",
    flexDirection: "column",
    padding: "10px 0",
    transition: "opacity 0.3s ease",
  },
  dropdownLink: {
    padding: "10px 20px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    transition: "background 0.3s, color 0.3s",
  },
};

const styleSheet = document.styleSheets[0];
const hoverRule = `
  li div a:hover {
    background-color: #007bff;
    color: #fff;
    border-radius: 5px;
  }
`;
styleSheet.insertRule(hoverRule, styleSheet.cssRules.length);
