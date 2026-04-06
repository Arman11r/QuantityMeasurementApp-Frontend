import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Converter from "./components/Converter";
import History from "./components/History";

const PAGE_LOGIN = "login";
const PAGE_SIGNUP = "signup";
const PAGE_CONVERTER = "converter";
const PAGE_HISTORY = "history";

function App() {
    const [page, setPage] = useState(PAGE_CONVERTER);
    const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

    useEffect(() => {
        if (window.location.pathname === '/oauth-success') {
            const params = new URLSearchParams(window.location.search);
            const urlToken = params.get('token');
            if (urlToken) {
                localStorage.setItem('token', urlToken);
            }
            window.history.replaceState({}, document.title, '/');
            setPage(PAGE_HISTORY);
            setRedirectAfterLogin(null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setPage(PAGE_CONVERTER);
    };

    // Guest clicks Login button in navbar
    const handleGoToLogin = () => {
        setPage(PAGE_LOGIN);
    };

    // User clicks History button
    const handleNavigateHistory = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setRedirectAfterLogin(PAGE_HISTORY);
            setPage(PAGE_LOGIN);
        } else {
            setPage(PAGE_HISTORY);
        }
    };

    // After successful login/signup
    const handleLoginSuccess = () => {
        const dest = redirectAfterLogin || PAGE_CONVERTER;
        setRedirectAfterLogin(null);
        setPage(dest);
    };

    if (page === PAGE_LOGIN) {
        return (
            <Login
                switchToSignup={() => setPage(PAGE_SIGNUP)}
                onLoginSuccess={handleLoginSuccess}
                onBack={() => setPage(PAGE_CONVERTER)}
                redirectingToHistory={redirectAfterLogin === PAGE_HISTORY}
            />
        );
    }

    if (page === PAGE_SIGNUP) {
        return (
            <Signup
                switchToLogin={() => setPage(PAGE_LOGIN)}
                onSignupSuccess={handleLoginSuccess}
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

    // Default: Converter — works for guests, history not saved
    return (
        <Converter
            onNavigateHistory={handleNavigateHistory}
            onLogout={handleLogout}
            onLogin={handleGoToLogin}
        />
    );
}

export default App;