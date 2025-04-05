"use client";

import React, { useState, useEffect } from "react";
import styles from "./AdminPrices.module.css";
import {
    FaEdit,
    FaTrash,
    FaArrowUp,
    FaArrowDown,
    FaPlus,
    FaTimes,
    FaCheck,
} from "react-icons/fa";

export default function AdminPrices() {
    const [prices, setPrices] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [form, setForm] = useState({
        service: "",
        duration: ["", "", "", ""],
        price: ["", "", "", ""],
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const res = await fetch("/api/prices");
            const data = await res.json();
            setPrices(data);
        } catch (err) {
            console.error("Помилка завантаження:", err);
        }
    };

    const handleChange = (e, index = null, field = null) => {
        if (field && index !== null) {
            setForm((prev) => ({
                ...prev,
                [field]: prev[field].map((val, i) =>
                    i === index ? e.target.value : val
                ),
            }));
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const durationArr = form.duration.filter((d) => d.trim() !== "");
            const priceArr = form.price.filter((p) => p.trim() !== "");

            if (durationArr.length === 0 || priceArr.length === 0) {
                setError("Мінімум одна пара тривалість/ціна обовʼязкова");
                return;
            }

            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/prices/${editingId}` : "/api/prices";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    service: form.service,
                    duration: durationArr,
                    price: priceArr,
                }),
            });

            if (!res.ok) throw new Error("Помилка при збереженні");

            resetForm();
            fetchPrices();
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setForm({
            service: "",
            duration: ["", "", "", ""],
            price: ["", "", "", ""],
        });
        setEditingId(null);
        setFormVisible(false);
        setError("");
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({
            service: item.service,
            duration: Array.isArray(item.duration)
                ? item.duration.concat(["", "", "", ""]).slice(0, 4)
                : [item.duration, "", "", ""],
            price: Array.isArray(item.price)
                ? item.price.concat(["", "", "", ""]).slice(0, 4)
                : [item.price, "", "", ""],
        });
        setFormVisible(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Ви впевнені, що хочете видалити запис?")) return;
        try {
            const res = await fetch(`/api/prices/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Помилка при видаленні");
            fetchPrices();
        } catch (err) {
            setError(err.message);
        }
    };

    const moveRecord = async (id, direction) => {
        try {
            const res = await fetch(
                `/api/prices/${id}/move?direction=${direction}`,
                { method: "PUT" }
            );
            if (!res.ok) throw new Error("Помилка при переміщенні");
            fetchPrices();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Адмінка: керування цінами</h1>

            {error && <div className={styles.error}>{error}</div>}

            {!editingId && (
                <button
                    className={styles.toggleButton}
                    onClick={() => setFormVisible((prev) => !prev)}
                >
                    {formVisible ? (
                        <>
                            <FaTimes /> Сховати
                        </>
                    ) : (
                        <>
                            <FaPlus /> Додати послугу
                        </>
                    )}
                </button>
            )}

            {formVisible && !editingId && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        placeholder="Послуга"
                        required
                    />
                    {form.duration.map((d, i) => (
                        <div key={i} className={styles.pair}>
                            <input
                                type="text"
                                placeholder={`Тривалість ${i + 1}`}
                                value={form.duration[i]}
                                onChange={(e) => handleChange(e, i, "duration")}
                            />
                            <input
                                type="text"
                                placeholder={`Ціна ${i + 1}`}
                                value={form.price[i]}
                                onChange={(e) => handleChange(e, i, "price")}
                            />
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                        <button
                            type="submit"
                            title="Додати"
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#249B89",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "14px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <FaPlus /> Додати
                        </button>
                    </div>


                </form>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Послуга</th>
                        <th>Тривалість / Ціна</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {prices.map((item, index) => (
                        <tr key={item.id}>
                            <td className={styles.inlineLabel}>№ {index + 1}</td>
                            {editingId === item.id ? (
                                <>
                                    <td colSpan={2}>
                                        <form onSubmit={handleSubmit}>
                                            <input
                                                type="text"
                                                name="service"
                                                value={form.service}
                                                onChange={handleChange}
                                                placeholder="Послуга"
                                                required
                                                style={{ marginBottom: 8, width: "100%" }}
                                            />
                                            {form.duration.map((d, i) => (
                                                <div key={i} className={styles.pair}>
                                                    <input
                                                        type="text"
                                                        placeholder={`Тривалість ${i + 1}`}
                                                        value={form.duration[i]}
                                                        onChange={(e) => handleChange(e, i, "duration")}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder={`Ціна ${i + 1}`}
                                                        value={form.price[i]}
                                                        onChange={(e) => handleChange(e, i, "price")}
                                                    />
                                                </div>
                                            ))}
                                            <div className={styles.actions}>
                                                <button type="submit">
                                                    <FaCheck /> Оновити
                                                </button>
                                                <button type="button" onClick={resetForm}>
                                                    <FaTimes /> Скасувати
                                                </button>
                                            </div>
                                        </form>
                                    </td>
                                    <td></td>
                                </>
                            ) : (
                                <>
                                    <td>{item.service}</td>
                                    <td>
                                        {Array.isArray(item.duration) &&
                                        Array.isArray(item.price) ? (
                                            item.duration.map((d, i) => (
                                                <div key={i}>
                                                    {d} — {item.price[i] || ""}
                                                </div>
                                            ))
                                        ) : (
                                            <div>
                                                {item.duration} — {item.price}
                                            </div>
                                        )}
                                    </td>
                                    <td className={styles.actions}>
                                        <button onClick={() => moveRecord(item.id, "up")}>
                                            <FaArrowUp />
                                        </button>
                                        <button onClick={() => moveRecord(item.id, "down")}>
                                            <FaArrowDown />
                                        </button>
                                        <button onClick={() => handleEdit(item)}>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
