import React, { useState } from "react";

export default function FacSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/faculty/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Faculty signup successful! You can now login.");
        setForm({ name: "", email: "", password: "", address: "" });
      } else {
        setMessage(data.message || "Faculty signup failed. Please try again.");
      }
    } catch (error) {
      setMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const Icon = ({ type }) => {
    switch (type) {
      case "user":
        return (
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-8 1.8-8 4v2h16v-2c0-2.2-3.6-4-8-4z"
            />
          </svg>
        );

      case "email":
        return (
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 17.5v-11zM4.5 6L12 11l7.5-5H4.5z"
            />
          </svg>
        );

      case "lock":
        return (
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17 8h-1V6a4 4 0 00-8 0v2H7a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1v-9a1 1 0 00-1-1zm-6 0V6a2 2 0 114 0v2h-4z"
            />
          </svg>
        );

      case "address":
        return (
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 119.5 9 2.5 2.5 0 0112 11.5z"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.iconBox}>F</div>

        <h2 style={styles.title}>Faculty Sign-Up</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputWrapper}>
            <Icon type="user" />
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <Icon type="email" />
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <Icon type="lock" />
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <Icon type="address" />
            <input
              style={styles.input}
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            style={styles.button} 
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p style={{
            ...styles.linkText,
            color: message.includes("successful") ? "#2ecc71" : "#e74c3c",
            marginTop: 10,
            marginBottom: 0
          }}>
            {message}
          </p>
        )}

        <p style={styles.linkText}>
          Already have an account?
          <a href="/Login" style={styles.link}> Login</a>
        </p>
      </div>
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
    background: "#f5f9ff",
    padding: 20,
  },

  card: {
    width: 420,
    background: "white",
    borderRadius: 20,
    padding: "60px 35px 40px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
    position: "relative",
    textAlign: "center",
  },

  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 18,
    background: "linear-gradient(135deg,#FF7B42,#FFC33F)",
    position: "absolute",
    top: -35,
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 34,
    color: "white",
    fontWeight: "bold",
  },

  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 600,
    color: "#1c2a4b",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#f3f6fa",
    borderRadius: 12,
    padding: "12px 15px",
    marginBottom: 18,
  },

  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
    color: "#334b7d",
  },

  input: {
    width: "100%",
    fontSize: 15,
    border: "none",
    outline: "none",
    background: "transparent",
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: 8,
    border: "none",
    background: "linear-gradient(135deg,#FF7B42,#FFC33F)",
    borderRadius: 12,
    fontSize: 18,
    color: "white",
    cursor: "pointer",
  },

  linkText: {
    marginTop: 15,
    fontSize: 14,
    color: "#445",
  },

  link: {
    marginLeft: 5,
    color: "#FF7B42",
    fontWeight: "bold",
    cursor: "pointer",
  },
};