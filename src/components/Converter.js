import React, { useState, useEffect, useCallback } from "react";
import { performOperation } from "../services/api";
import "./Converter.css";

const UNIT_MAP = {
    "Feet": "FEET",
    "Inches": "INCHES",
    "Yards": "YARDS",
    "Centimetres": "CENTIMETERS",
    "Meters": "METER",

    "Celsius": "CELSIUS",
    "Fahrenheit": "FAHRENHEIT",
    "Kelvin": "KELVIN",

    "Litres": "LITRE",
    "Millilitres": "MILLILITRE",
    "Gallons": "GALLON",

    "Grams": "GRAM",
    "Kilograms": "KILOGRAM",
    "Pounds": "POUND"
};

const MEASUREMENT_TYPE_MAP = {
    "LENGTH": "LengthUnit",
    "TEMPERATURE": "TemperatureUnit",
    "VOLUME": "VolumeUnit",
    "WEIGHT": "WeightUnit"
};

const TYPES = [
    {
        id: "LENGTH",
        label: "Length",
        icon: (active) => (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="10" width="32" height="28" rx="3" fill={active ? "#00c9a7" : "#ccc"} fillOpacity="0.15" stroke={active ? "#00c9a7" : "#bbb"} strokeWidth="2" />
                <line x1="12" y1="18" x2="12" y2="22" stroke={active ? "#00c9a7" : "#aaa"} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="20" x2="16" y2="22" stroke={active ? "#00c9a7" : "#aaa"} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="20" y1="18" x2="20" y2="22" stroke={active ? "#00c9a7" : "#aaa"} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="20" x2="24" y2="22" stroke={active ? "#00c9a7" : "#aaa"} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="28" y1="18" x2="28" y2="22" stroke={active ? "#00c9a7" : "#aaa"} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="32" y1="20" x2="32" y2="22" stroke={active ? "#00c9a7" : "#aaa"} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="36" y1="18" x2="36" y2="22" stroke={active ? "#00c9a7" : "#aaa"} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        activeColor: "#00c9a7",
        activeBg: "#e8fff8",
        activeBorder: "#00c9a7",
        units: ["Feet", "Inches", "Yards", "Centimetres", "Meters"]
    },
    {
        id: "TEMPERATURE",
        label: "Temperature",
        icon: (active) => (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="20" y="8" width="8" height="22" rx="4" fill={active ? "#ff6b6b" : "#ddd"} fillOpacity="0.3" stroke={active ? "#ff6b6b" : "#ccc"} strokeWidth="1.5" />
                <circle cx="24" cy="33" r="6" fill={active ? "#ff6b6b" : "#ccc"} />
                <rect x="22" y="14" width="4" height="15" rx="2" fill={active ? "#ff6b6b" : "#ccc"} />
                <line x1="28" y1="14" x2="32" y2="14" stroke={active ? "#ff6b6b" : "#ccc"} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="28" y1="18" x2="30" y2="18" stroke={active ? "#ff6b6b" : "#ccc"} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="28" y1="22" x2="32" y2="22" stroke={active ? "#ff6b6b" : "#ccc"} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        activeColor: "#ff6b6b",
        activeBg: "#fff0f0",
        activeBorder: "#ff6b6b",
        units: ["Celsius", "Fahrenheit", "Kelvin"]
    },
    {
        id: "VOLUME",
        label: "Volume",
        icon: (active) => (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M14 16 L12 38 H36 L34 16 Z" fill={active ? "#7c5cbf" : "#ccc"} fillOpacity="0.2" stroke={active ? "#7c5cbf" : "#bbb"} strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 16 H34" stroke={active ? "#7c5cbf" : "#bbb"} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 26 H35" stroke={active ? "#a78bfa" : "#ddd"} strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
                <path d="M34 14 L34 10 Q38 10 38 14 Z" fill={active ? "#a78bfa" : "#ccc"} fillOpacity="0.5" />
            </svg>
        ),
        activeColor: "#7c5cbf",
        activeBg: "#f3f0ff",
        activeBorder: "#7c5cbf",
        units: ["Litres", "Millilitres", "Gallons"]
    },
    {
        id: "WEIGHT",
        label: "Weight",
        icon: (active) => (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M18 14 H30 L34 38 H14 Z" fill={active ? "#f59e0b" : "#ccc"} fillOpacity="0.2" stroke={active ? "#f59e0b" : "#bbb"} strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M22 14 V8 Q24 5 26 8 V14" stroke={active ? "#f59e0b" : "#bbb"} strokeWidth="1.5" fill="none" />
                <circle cx="24" cy="26" r="3" fill={active ? "#f59e0b" : "#aaa"} />
            </svg>
        ),
        activeColor: "#f59e0b",
        activeBg: "#fffbeb",
        activeBorder: "#f59e0b",
        units: ["Grams", "Kilograms", "Pounds"]
    }
];

const DEFAULT_UNITS = {
    LENGTH: { from: "Feet", to: "Inches" },
    TEMPERATURE: { from: "Celsius", to: "Fahrenheit" },
    VOLUME: { from: "Litres", to: "Millilitres" },
    WEIGHT: { from: "Kilograms", to: "Grams" }
};

function Converter({ onNavigateHistory, onLogout, onLogin }) {
    const isLoggedIn = !!localStorage.getItem("token");
    const [operation, setOperation] = useState("CONVERT");
    const [selectedType, setSelectedType] = useState("TEMPERATURE");
    const [fromValue, setFromValue] = useState("0");
    const [toValue, setToValue] = useState("");
    const [value2, setValue2] = useState("0");
    const [mathResult, setMathResult] = useState("");
    const [fromUnit, setFromUnit] = useState("Celsius");
    const [toUnit, setToUnit] = useState("Fahrenheit");
    const [loading, setLoading] = useState(false);

    const currentType = TYPES.find(t => t.id === selectedType);

    const handleTypeChange = (typeId) => {
        setSelectedType(typeId);
        const defaults = DEFAULT_UNITS[typeId];
        setFromUnit(defaults.from);
        setToUnit(defaults.to);
        setFromValue("0");
        setToValue("");
        setValue2("0");
        setMathResult("");
    };

    const handleCalculate = useCallback(async (v1, v2, fUnit, tUnit, type, op) => {
        const num1 = parseFloat(v1);
        const num2 = parseFloat(v2);

        if (op === "CONVERT" && isNaN(num1)) {
            setToValue("");
            return;
        } else if (op !== "CONVERT" && (isNaN(num1) || isNaN(num2))) {
            setMathResult("");
            return;
        }

        setLoading(true);
        try {
            const result = await performOperation(op, {
                fromUnit: UNIT_MAP[fUnit],
                toUnit: UNIT_MAP[tUnit],
                value1: num1,
                value2: op === "CONVERT" ? 0 : num2,
                measurementType: MEASUREMENT_TYPE_MAP[type]
            });

            if (op === "CONVERT") {
                setToValue(result.resultValue);
            } else if (op === "COMPARE") {
                // Backend compare returns "true" or "false" in resultString
                if (result.resultString === "true") {
                    setMathResult("Values are Equal");
                } else if (result.resultString === "false") {
                    setMathResult("Values are Not Equal");
                } else if (result.message) {
                    setMathResult(result.message);
                } else {
                    setMathResult("Unknown comparison result");
                }
            } else {
                setMathResult(String(result.resultValue));
            }
        } catch (err) {
            console.error(`${op} error:`, err.message);
            if (op === "CONVERT") setToValue("Error");
            else setMathResult("Error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleCalculate(fromValue, value2, fromUnit, toUnit, selectedType, operation);
        }, 400);
        return () => clearTimeout(timer);
    }, [fromValue, value2, fromUnit, toUnit, selectedType, operation, handleCalculate]);

    return (
        <div className="converter-page">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-logo">Quantity Measurement</div>
                <div className="navbar-actions">
                    <button id="nav-history" className="nav-history-btn" onClick={onNavigateHistory}>History</button>
                    {isLoggedIn
                        ? <button id="nav-logout" className="nav-logout-btn" onClick={onLogout}>Logout</button>
                        : <button id="nav-login" className="nav-logout-btn" onClick={onLogin}>Login</button>
                    }
                </div>
            </nav>

            {/* HERO BANNER */}
            <div className="hero-banner">
                <h1>Welcome To Quantity Measurement</h1>
            </div>

            {/* MAIN CONTENT */}
            <main className="converter-main">
                {/* TYPE SELECTOR */}
                <div className="type-section">
                    <p className="section-label">CHOOSE TYPE</p>
                    <div className="type-cards">
                        {TYPES.map(type => {
                            const isActive = selectedType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    id={`type-${type.id.toLowerCase()}`}
                                    className={`type-card ${isActive ? "active" : ""}`}
                                    style={isActive ? {
                                        borderColor: type.activeBorder,
                                        background: type.activeBg,
                                    } : {}}
                                    onClick={() => handleTypeChange(type.id)}
                                >
                                    <span className="type-icon">{type.icon(isActive)}</span>
                                    <span className="type-label" style={isActive ? { color: type.activeColor } : {}}>
                                        {type.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* OPERATION SELECTOR */}
                <div className="operation-section">
                    <p className="section-label">CHOOSE OPERATION</p>
                    <div className="operation-pills">
                        {["CONVERT", "COMPARE", "ADD", "SUBTRACT", "DIVIDE"].map(op => (
                            <button
                                key={op}
                                className={`op-pill ${operation === op ? "active" : ""}`}
                                onClick={() => {
                                    setOperation(op);
                                    setMathResult("");
                                }}
                            >
                                {op}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONVERSION INPUTS */}
                <div className="conversion-section">
                    {/* FROM / VALUE 1 */}
                    <div className="conversion-box">
                        <p className="box-label">{operation === "CONVERT" ? "FROM" : "VALUE 1"}</p>
                        <div className="input-box">
                            <input
                                id="from-value"
                                type="number"
                                className="value-input"
                                value={fromValue}
                                onChange={(e) => setFromValue(e.target.value)}
                            />
                            <select
                                id="from-unit"
                                className="unit-select"
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                            >
                                {currentType.units.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SWAP ICON / OP ICON */}
                    <div className="swap-icon">
                        {operation === "CONVERT" || operation === "COMPARE" ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M7 16L3 12M3 12L7 8M3 12H21" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M17 8L21 12M21 12L17 16M21 12H3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <div className="op-sign">
                                {operation === "ADD" && "+"}
                                {operation === "SUBTRACT" && "-"}
                                {operation === "DIVIDE" && "÷"}
                            </div>
                        )}
                    </div>

                    {/* TO / VALUE 2 */}
                    <div className="conversion-box">
                        <p className="box-label">{operation === "CONVERT" ? "TO" : "VALUE 2"}</p>
                        <div className="input-box">
                            {operation === "CONVERT" ? (
                                <div className="value-display">
                                    {loading ? <span className="loading-dots">...</span> : (toValue !== "" ? toValue : "—")}
                                </div>
                            ) : (
                                <input
                                    id="to-value"
                                    type="number"
                                    className="value-input"
                                    value={value2}
                                    onChange={(e) => setValue2(e.target.value)}
                                />
                            )}
                            <select
                                id="to-unit"
                                className="unit-select"
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                            >
                                {currentType.units.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* RESULT BOX FOR MATH OR COMPARE */}
                {operation !== "CONVERT" && (
                    <div className="result-section">
                        <p className="section-label">RESULT</p>
                        <div className="result-display-box">
                            {loading ? <span className="loading-dots">Computing...</span> : (mathResult ? mathResult : "—")}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Converter;