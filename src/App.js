import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Converter from "./components/Converter";
import History from "./components/History";

// Pages
const PAGE_LOGIN = "login";
const PAGE_SIGNUP = "signup";
const PAGE_CONVERTER = "converter";
const PAGE_HISTORY = "history";

function App() {
    const [page, setPage] = useState(PAGE_LOGIN);

    // On mount, check if already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setPage(PAGE_CONVERTER);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setPage(PAGE_LOGIN);
    };

    if (page === PAGE_LOGIN) {
        return (
            <Login
                switchToSignup={() => setPage(PAGE_SIGNUP)}
                onLoginSuccess={() => setPage(PAGE_CONVERTER)}
            />
        );
    }

    if (page === PAGE_SIGNUP) {
        return (
            <Signup
                switchToLogin={() => setPage(PAGE_LOGIN)}
            />
        );
    }

    if (page === PAGE_HISTORY) {
        return (
            <History
                onBack={() => setPage(PAGE_CONVERTER)}
                onLogout={handleLogout}
            />
        );
    }

    // Default: converter
    return (
        <Converter
            onNavigateHistory={() => setPage(PAGE_HISTORY)}
            onLogout={handleLogout}
        />
    );
}

export default App;