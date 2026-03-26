import React, { useState } from "react";
import { registerUser } from "../services/api";
import "./Auth.css";

function Signup({ switchToLogin }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await registerUser({ username, password });
            alert("Account created successfully! Please sign in.");
            switchToLogin();
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Quanment</div>
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join us to start converting quantities</p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            id="signup-username"
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button id="signup-submit" type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <span id="go-to-login" onClick={switchToLogin}>Sign in</span>
                </p>
            </div>
        </div>
    );
}

export default Signup;