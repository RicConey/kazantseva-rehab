// app/Header.jsx (Финальная версия без бургер-меню)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Логотип */}
        <div className={styles.logoBlock}>
          <Link href="/">
            <Image src="/logo.png" alt="Логотип" className={styles.logo} width={120} height={80} />
          </Link>
          <div className={styles.logoText}>
            <span>Ваш шлях</span>
            <span>до здоров'я</span>
          </div>
        </div>

        {/* Десктопное меню (остается без изменений) */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Головна
          </Link>
          <Link href="/about" className={styles.link}>
            Про мене
          </Link>
          <Link href="/prices" className={styles.link}>
            Ціни
          </Link>
          <Link href="/rules" className={styles.link}>
            Правила
          </Link>
          <Link href="/contact" className={styles.link}>
            Контакти
          </Link>
        </nav>
      </div>
    </header>
  );
}
