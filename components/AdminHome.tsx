// components/AdminHome.tsx
'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from './AdminHome.module.css';

export default function AdminHome() {
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
  const router = useRouter();

  const handleNavigate = async (href: string) => {
    if (loadingTarget) return;
    setLoadingTarget(href);
    router.push(href);
  };

  const handleLogout = async () => {
    if (loadingTarget) return;
    setLoadingTarget('logout');
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Панель адміністратора</h1>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => handleNavigate('/admin/prices')}
          disabled={!!loadingTarget}
        >
          {loadingTarget === '/admin/prices' ? <FaSpinner className={styles.spin} /> : 'Прайс'}
        </button>
        <button
          className={styles.button}
          onClick={() => handleNavigate('/admin/weekly-schedule')}
          disabled={!!loadingTarget}
        >
          {loadingTarget === '/admin/weekly-schedule' ? (
            <FaSpinner className={styles.spin} />
          ) : (
            'Розклад прийомів'
          )}
        </button>
        <button
          className={styles.button}
          onClick={() => handleNavigate('/admin/finance')}
          disabled={!!loadingTarget}
        >
          {loadingTarget === '/admin/finance' ? (
            <FaSpinner className={styles.spin} />
          ) : (
            'Фінансова звітність'
          )}
        </button>
        <button
          className={styles.button}
          onClick={() => handleNavigate('/admin/notes')}
          disabled={!!loadingTarget}
        >
          {loadingTarget === '/admin/notes' ? <FaSpinner className={styles.spin} /> : 'Нотатки'}
        </button>
        <button className={styles.button} onClick={handleLogout} disabled={!!loadingTarget}>
          {loadingTarget === 'logout' ? <FaSpinner className={styles.spin} /> : 'Вихід'}
        </button>
      </div>
    </div>
  );
}
