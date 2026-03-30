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

    // On mount, check if already logged in or returning from OAuth
    useEffect(() => {
        // Handle OAuth success redirect
        if (window.location.pathname === '/oauth-success') {
            const params = new URLSearchParams(window.location.search);
            const urlToken = params.get('token');
            if (urlToken) {
                localStorage.setItem('token', urlToken);
            }
            // Clear the URL so we are back at the root path visually
            window.history.replaceState({}, document.title, '/');
            setPage(PAGE_CONVERTER);
            return;
        }

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