"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                {/* Логотип + текст */}
                <div className={styles.logoBlock}>
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Логотип"
                            className={styles.logo}
                            width={120}
                            height={80}
                        />
                    </Link>
                    <div className={styles.logoText}>
                        <span>Ваш шлях</span>
                        <span>до здоров'я</span>
                    </div>
                </div>

                {/* Десктопное меню */}
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>
                        Головна
                    </Link>
                    <Link href="/about" className={styles.link}>
                        Про нас
                    </Link>
                    <Link href="/prices" className={styles.link}>
                        Ціни
                    </Link>
                    <Link href="/contact" className={styles.link}>
                        Контакти
                    </Link>
                </nav>

                {/* Бургер-меню */}
                <div
                    className={styles.burger}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Відкрити меню"
                    role="button"
                    aria-expanded={isMenuOpen}
                >
                    ☰
                </div>
            </div>

            {/* Мобильное меню */}
            {isMenuOpen && (
                <nav className={styles.mobileNav}>
                    <Link href="/" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                        Головна
                    </Link>
                    <Link href="/about" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                        Про нас
                    </Link>
                    <Link href="/prices" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                        Ціни
                    </Link>
                    <Link href="/contact" className={styles.link} onClick={() => setIsMenuOpen(false)}>
                        Контакти
                    </Link>
                </nav>
            )}
        </header>
    );
}
