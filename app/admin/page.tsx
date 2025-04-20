'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import styles from './AdminHome.module.css';

export default function AdminHome() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Панель администратора</h1>
      <div className={styles.buttons}>
        <Link href="/admin/prices" className={styles.link}>
          <button className={styles.button}>Прайс</button>
        </Link>
        <Link href="/admin/appointments" className={styles.link}>
          <button className={styles.button}>Запись приёмов</button>
        </Link>
        <button className={styles.button} onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
          Выход
        </button>
      </div>
    </div>
  );
}
