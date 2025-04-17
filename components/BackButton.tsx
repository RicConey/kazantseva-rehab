'use client';

import { useRouter } from 'next/navigation';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import styles from './BackButton.module.css';

export default function BackButton() {
  const router = useRouter();

  return (
    <button type="button" className={styles.btn} onClick={() => router.back()} aria-label="Назад">
      <AiOutlineArrowLeft size={18} />
      Назад
    </button>
  );
}
