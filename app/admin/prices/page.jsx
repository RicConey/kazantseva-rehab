"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import AdminPrices from "./AdminPrices";

export default function AdminPricesWrapper() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn(); // редирект на /auth/signin
        }
    }, [status]);

    if (status === "loading") return <div>Завантаження...</div>;

    if (!session) return null; // пока не знаем сессию — ничего не рендерим

    return <AdminPrices />;
}
