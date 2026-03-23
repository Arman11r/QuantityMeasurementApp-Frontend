import React, { useState } from "react";
import { loginUser } from "../services/api";

function Login({ switchToSignup }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const token = await loginUser({ username, password });

            localStorage.setItem("token", token);
            alert("Login Successful ✅");

        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>

            <br />

            <button onClick={handleGoogleLogin}>
                Login with Google
            </button>

            <p onClick={switchToSignup} style={{cursor:"pointer"}}>
                Go to Signup
            </p>
        </div>
    );
}

export default Login;