import React, { useState } from "react";
import { registerUser, loginUser } from "../services/api";
import "./Auth.css";

function Signup({ switchToLogin, onSignupSuccess }) {

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
            // Auto-login after successful signup so they land on their destination
            try {
                const token = await loginUser({ username, password });
                localStorage.setItem("token", token);
                if (onSignupSuccess) {
                    onSignupSuccess(); // redirects to history if that was the trigger
                } else {
                    switchToLogin();
                }
            } catch {
                // Auto-login failed — just go to login page
                alert("Account created! Please sign in.");
                switchToLogin();
            }
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page" style={{ "--bg-image": `url(${process.env.PUBLIC_URL}/bg.gif)` }}>
            <div className="auth-card">
                <div className="auth-logo">QuantityMeasurement</div>
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Sign up to save your conversion history</p>

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