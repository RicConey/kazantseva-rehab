"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            username: credentials.username,
            password: credentials.password,
            callbackUrl: "/admin/prices",
        });

        if (res?.error) {
            setError(res.error); // отображаем кастомное сообщение
        } else {
            window.location.href = res.url || "/admin/prices";
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "100px auto" }}>
            <h1>Вхід до адмінки</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ім’я"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
                <button type="submit">Увійти</button>
            </form>
        </div>
    );
}
