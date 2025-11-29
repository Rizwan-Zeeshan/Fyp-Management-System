// src/components/About.js
import React from "react";

export function About() {
  return (
    <section id="about" style={styles.section}>
      <div style={styles.content}>
        <h2 style={styles.title}>About Us</h2>
        <p style={styles.text}>
          We provide a modern and user-friendly system for both students and faculty,
          making the entire FYP workflow easier, smoother, and more efficient.
        </p>
      </div>
    </section>
  );
}

const styles = {
  section: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
    background: "linear-gradient(to right, #6a11cb, #2575fc)", // purple to blue gradient
  },
  content: {
    maxWidth: "700px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#ffffff", // white title text
    textShadow: "2px 2px 8px rgba(0,0,0,0.4)", // subtle shadow for readability
  },
  text: {
    fontSize: "20px",
    lineHeight: "1.6",
    color: "#f0f0f0", // light text color for contrast
  },
};

export default About;
