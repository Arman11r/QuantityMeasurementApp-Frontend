const BASE_URL = "https://quantitymeasurementapp-backend-springboot.onrender.com/api/v1/quantities";
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
    };
};

export const loginUser = async (data) => {
    const res = await fetch("https://quantitymeasurementapp-backend-springboot.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text);
    return text;
};

export const registerUser = async (data) => {
    const res = await fetch("https://quantitymeasurementapp-backend-springboot.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text);
    return text;
};

export const performOperation = async (operation, { fromUnit, toUnit, value1, value2, measurementType }) => {
    const endpoint = operation.toLowerCase();
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            thisQuantityDTO: {
                value: value1 || 0,
                unit: fromUnit ? fromUnit.trim().toUpperCase() : fromUnit,
                measurementType: measurementType
            },
            thatQuantityDTO: {
                value: value2 || 0,
                unit: toUnit ? toUnit.trim().toUpperCase() : toUnit,
                measurementType: measurementType
            }
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return res.json();
};

export const convert = async (params) => {
    return performOperation('convert', {
        ...params,
        value1: params.value,
        value2: 0
    });
};

export const getHistory = async () => {
    const res = await fetch(
        `https://quantitymeasurementapp-backend-springboot.onrender.com/api/v1/quantities/history/me`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
};