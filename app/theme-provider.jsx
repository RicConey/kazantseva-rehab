"use client";

export default function ThemeProvider({ children }) {
    // Всегда светлая тема
    return <div className="light">{children}</div>;
}
