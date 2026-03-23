export const loginUser = async (data) => {
    const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const text = await res.text();

    if (!res.ok) {
        throw new Error(text);
    }

    return text;
};