import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function FacLogin({ initialUserId = "FAC-23", userType = "faculty" }) {
    const [userId, setUserId] = useState(initialUserId);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ userId: false, password: false });

    const idPrefix = userType === "student" ? "STU" : "FAC";
    const idRegex = new RegExp(`^${idPrefix}-\\d{2}$`, "i");
    const userIdIsValid = idRegex.test(userId.trim().toUpperCase());
    const passwordIsValid = password.length >= 6;

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ userId: true, password: true });

        if (!userIdIsValid || !passwordIsValid) return;

        const payload = {
            userId: userId.trim().toUpperCase(),
            password,
            userType,
        };

        console.log(`${userType} Login submitted:`, payload);
        // replace with real submit logic (API call)
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconBox}>
                    {userType === "student" ? "S" : "F"}
                </div>
                <h2 style={styles.title}>
                    Faculty Login
                </h2>

                <form onSubmit={handleSubmit} style={styles.form} noValidate>
                    <div style={styles.field}>
                        <label htmlFor="userId" style={styles.label}>
                            User ID
                        </label>
                        <input
                            id="userId"
                            name="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, userId: true }))}
                            style={styles.input}
                            required
                            autoComplete="username"
                            placeholder={`${idPrefix}-23`}
                        />
                        {touched.userId && !userIdIsValid && (
                            <div style={styles.error}>
                                User ID must match {idPrefix}-NN (e.g. {idPrefix}-23).
                            </div>
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
                        disabled={!userIdIsValid || !passwordIsValid}
                        style={{
                            ...styles.submit,
                            opacity: !userIdIsValid || !passwordIsValid ? 0.6 : 1,
                            cursor: !userIdIsValid || !passwordIsValid ? "not-allowed" : "pointer",
                        }}
                    >
                        Sign in
                    </button>
                </form>
                <p style={styles.linkText}>
                    Don't have an account?
                    <Link
                         to={"/faculty-signup"}
                        style={styles.link}
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

FacLogin.propTypes = {
    initialUserId: PropTypes.string,
    userType: PropTypes.oneOf(["student", "faculty"]),
};

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
        background: "linear-gradient(135deg,#427BFF,#3FE0C5)",
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
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    field: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: 600,
        textAlign: "left",
        color: "#223054",
    },
    input: {
        padding: "12px 15px",
        fontSize: 15,
        borderRadius: 12,
        border: "1px solid rgba(66,123,255,0.12)",
        background: "linear-gradient(180deg,#ffffff,#f6fbff)",
        outline: "none",
        width: "100%",
        boxShadow: "inset 0 1px 3px rgba(66,123,255,0.04), 0 6px 18px rgba(66,123,255,0.04)",
        transition: "box-shadow 0.18s ease, transform 0.06s ease",
    },
    passwordRow: {
        display: "flex",
        alignItems: "center",
    },
    toggleBtn: {
        padding: "11px 13px",
        fontSize: 13,
        borderRadius: 10,
        border: "1px solid rgba(66,123,255,0.08)",
        background: "#ffffff",
        cursor: "pointer",
        boxShadow: "0 6px 12px rgba(66,123,255,0.03)",
    },
    submit: {
        width: "100%",
        padding: "14px",
        marginTop: 8,
        border: "none",
        background: "linear-gradient(135deg,#427BFF,#3FE0C5)",
        borderRadius: 12,
        fontSize: 18,
        color: "white",
        cursor: "pointer",
    },
    error: {
        marginTop: 6,
        color: "#d73a49",
        fontSize: 13,
        textAlign: "left",
    },
    linkText: {
        marginTop: 15,
        fontSize: 14,
        color: "#445",
    },
    link: {
        marginLeft: 5,
        color: "#427BFF",
        fontWeight: "bold",
        cursor: "pointer",
        textDecoration: "none",
    },
};