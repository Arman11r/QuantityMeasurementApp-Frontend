import React, { useState } from "react";

function Signup({ switchToLogin }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        alert("Signup Successful ✅");
        switchToLogin();
    };

    return (
        <div>
            <h2>Signup</h2>

            <form onSubmit={handleSignup}>
                <input
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Signup</button>
            </form>

            <p onClick={switchToLogin} style={{cursor:"pointer"}}>
                Go to Login
            </p>
        </div>
    );
}

export default Signup;