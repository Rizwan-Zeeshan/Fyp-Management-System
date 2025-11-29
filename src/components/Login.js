import React, { useState } from "react";
import PropTypes from "prop-types";

export default function Login({ initialEmail = "" }) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordIsValid = password.length >= 6;

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        if (!emailIsValid || !passwordIsValid) return;

        const payload = { email: email.trim(), password };

        console.log("Login submitted:", payload);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <div style={styles.field}>
                <label htmlFor="email" style={styles.label}>
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    style={styles.input}
                    required
                    autoComplete="email"
                />
                {touched.email && !emailIsValid && (
                    <div style={styles.error}>Please enter a valid email address.</div>
                )}
            </div>

            <div style={styles.field}>
                <label htmlFor="password" style={styles.label}>
                    Password
                </label>
                <div style={styles.passwordRow}>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                        style={{ ...styles.input, marginRight: 8 }}
                        required
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        style={styles.toggleBtn}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {touched.password && !passwordIsValid && (
                    <div style={styles.error}>Password must be at least 6 characters.</div>
                )}
            </div>

            <button
                type="submit"
                disabled={!emailIsValid || !passwordIsValid}
                style={{
                    ...styles.submit,
                    opacity: !emailIsValid || !passwordIsValid ? 0.6 : 1,
                    cursor: !emailIsValid || !passwordIsValid ? "not-allowed" : "pointer",
                }}
            >
                Sign in
            </button>
        </form>
    );
}

Login.propTypes = {
    initialEmail: PropTypes.string,
};

const styles = {
    form: {
        maxWidth: 360,
        margin: "0 auto",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    field: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: 600,
    },
    input: {
        padding: "8px 10px",
        fontSize: 14,
        borderRadius: 4,
        border: "1px solid #ccc",
        outline: "none",
    },
    passwordRow: {
        display: "flex",
        alignItems: "center",
    },
    toggleBtn: {
        padding: "8px 10px",
        fontSize: 13,
        borderRadius: 4,
        border: "1px solid #ccc",
        background: "#fff",
    },
    submit: {
        padding: "10px 12px",
        fontSize: 15,
        borderRadius: 6,
        border: "none",
        background: "#0366d6",
        color: "#fff",
        fontWeight: 600,
    },
    error: {
        marginTop: 6,
        color: "#d73a49",
        fontSize: 13,
    },
};
