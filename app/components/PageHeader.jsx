// app/components/PageHeader.jsx
import Link from 'next/link';
import styles from '../ServicePage.module.css'; // Используем тот же файл стилей

export default function PageHeader() {
  return (
    <>
      {/* --- шапка --- */}
      <div className={styles.pageHeader}>
        <p className={styles.brandTitle}>Kazantseva Rehabilitation</p>
        <p className={styles.brandTagline}>ваш шлях до здоров'я починається тут</p>
      </div>

      {/* --- вступление --- */}
      <p className={styles.intro}>
        Шукаєте ефективну реабілітацію, професійний масаж чи комплексний підхід до відновлення
        здоров’я у Вишневому?
      </p>
      <p className={styles.intro}>
        Мене звати{' '}
        <Link href="/about" className={styles.highlight}>
          Наталія Казанцева
        </Link>
        , і я пропоную широкий спектр послуг, які допоможуть вам повернути активність, гарне
        самопочуття та баланс всього організму.
      </p>
    </>
  );
}
