import React, { useState } from "react";

export default function FacSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    status: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:8080/api/faculty/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!response.ok) {
            const errBody = await response.json().catch(() => null);
            throw new Error((errBody && errBody.message) || response.statusText || "Request failed");
        }

        const data = await response.json().catch(() => ({}));
        alert("Sign up successful");
        setForm({ name: "", email: "", password: "", address: "", status: "" });
    } catch (error) {
        console.error("Signup error:", error);
        alert("Sign up failed: " + (error.message || "Unknown error"));
    }
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Faculty Sign-Up</h2>

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Enter Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="address"
          placeholder="Enter Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <select
          style={styles.select}
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Choose a Status
          </option>
          <option value="Supervisor">Supervisor</option>
          <option value="Evaluator">Evaluation Committee Member</option>
          <option value="FYP Committee">FYP Committee Member</option>
        </select>

        <button style={styles.button} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0f7fa, #80deea)",
  },
  form: {
    width: "420px",
    background: "#fff",
    padding: "40px",
    borderRadius: "25px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  title: {
    marginBottom: "25px",
    color: "#4e73df",
    fontSize: "28px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "14px",
    margin: "10px 0",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  select: {
    width: "100%",
    padding: "14px",
    margin: "10px 0",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "14px",
    marginTop: "20px",
    background: "linear-gradient(90deg, #4e73df, #1cc88a)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "18px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  },
};
