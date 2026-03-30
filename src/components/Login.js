import React, { useState } from "react";
import { loginUser } from "../services/api";
import "./Auth.css";

function Login({ switchToSignup, onLoginSuccess }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const token = await loginUser({ username, password });
            localStorage.setItem("token", token);
            onLoginSuccess();
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="auth-page" style={{ "--bg-image": `url(${process.env.PUBLIC_URL}/bg.gif)` }}>
            <div className="auth-card">
                <div className="auth-logo">QuantityMeasurement</div>
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to continue converting</p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            id="login-username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button id="login-submit" type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-divider"><span>or</span></div>

                <button id="login-google" className="btn-google" onClick={handleGoogleLogin}>
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <span id="go-to-signup" onClick={switchToSignup}>Sign up</span>
                </p>
            </div>
        </div>
    );
}

export default Login;