const BASE_URL = "http://localhost:8080/api/v1/quantities";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
    };
};

export const loginUser = async (data) => {
    const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text);
    return text;
};

export const registerUser = async (data) => {
    const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text);
    return text;
};

// measurementType must be: "LengthUnit" | "VolumeUnit" | "TemperatureUnit"
export const convert = async ({ fromUnit, toUnit, value, measurementType }) => {
    const res = await fetch(`${BASE_URL}/convert`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            thisQuantityDTO: {
                value: value,
                unit: fromUnit,
                measurementType: measurementType
            },
            thatQuantityDTO: {
                value: 0,
                unit: toUnit,
                measurementType: measurementType
            }
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return res.json(); // returns QuantityMeasurementDTO — use .resultValue
};

// Controller endpoints: /history/operation/{op}  /history/type/{type}  /history/errors
export const getHistory = async () => {
    const res = await fetch(`${BASE_URL}/history/operation/CONVERT`, {
        method: "GET",
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
};