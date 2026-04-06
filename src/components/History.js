import React, { useState, useEffect } from "react";
import { getHistory } from "../services/api";
import "./Converter.css";

const TYPE_COLORS = {
    "LengthUnit": "#00c9a7",
    "TemperatureUnit": "#ff6b6b",
    "VolumeUnit": "#7c5cbf"
};

function History({ onBack, onLogout }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Failed to load history. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="history-page">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-logo">Quantity Measurement</div>
                <div className="navbar-actions">
                    <button id="history-nav-back" className="nav-history-btn" onClick={onBack}>Converter</button>
                    <button id="history-nav-logout" className="nav-logout-btn" onClick={onLogout}>Logout</button>
                </div>
            </nav>

            {/* HERO BANNER */}
            <div className="hero-banner">
                <h1>Welcome To Quantity Measurement</h1>
            </div>

            {/* MAIN CONTENT */}
            <main className="history-main">
                <button id="back-to-converter" className="back-btn" onClick={onBack}>
                    ← Back to Converter
                </button>
                <h2 className="history-title">Conversion History</h2>

                {loading && <p className="history-loading">Loading history...</p>}
                {error && <div className="auth-error">{error}</div>}

                {!loading && !error && history.length === 0 && (
                    <p className="history-empty">No conversions yet. Start converting!</p>
                )}

                {!loading && !error && history.length > 0 && (
                    <div className="history-list">
                        {history.map((item, idx) => (
                            <div key={idx} className="history-item">
                                <div>
                                    {/* thisMeasurementType: "LengthUnit" | "TemperatureUnit" | "VolumeUnit" */}
                                    <p
                                        className="history-item-type"
                                        style={{ color: TYPE_COLORS[item.thisMeasurementType] || "#4169e1" }}
                                    >
                                        {item.thisMeasurementType?.replace("Unit", "") || item.operation}
                                    </p>
                                    <p className="history-item-conversion">
                                        {item.thisValue} {item.thisUnit} → {item.resultValue} {item.resultUnit}
                                    </p>
                                    {item.resultString && (
                                        <p style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                                            {item.resultString}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span className="history-item-date">
                                        {item.operation}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default History;
