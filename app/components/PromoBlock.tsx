// app/components/PromoBlock.tsx (Новая версия с правилами)
import styles from './PromoBlock.module.css';
import { FiGift, FiStar, FiFileText } from 'react-icons/fi';
import Link from 'next/link';

export default function PromoBlock() {
  return (
    <div className={styles.promoContainer}>
      {/* --- КАРТОЧКА: ПРАВИЛА --- */}
      <Link href="/rules" className={`${styles.promoCard} ${styles.ruleCard}`}>
        <FiFileText className={styles.icon} />
        <h3 className={styles.title}>Важлива інформація</h3>
        <p className={styles.text}>
          Ознайомтесь, будь ласка, з правилами відвідування перед записом на сеанс.
        </p>
        <span className={styles.ruleLinkText}>Перейти до правил →</span>
      </Link>

      {/* Карточка 1: Подарочные сертификаты */}
      <div className={styles.promoCard}>
        <FiGift className={styles.icon} />
        <h3 className={styles.title}>Подарункові сертифікати</h3>
        <p className={styles.text}>
          Чудовий спосіб подбати про здоров'я близьких. Доступні на будь-яку суму чи послугу.
        </p>
      </div>

      {/* Карточка 2: Специальные предложения */}
      <div className={styles.promoCard}>
        <FiStar className={styles.icon} />
        <h3 className={styles.title}>Спеціальні пропозиції</h3>
        <div className={styles.text}>
          <p>
            Для військових після поранень та контузій —{' '}
            <span className={styles.highlight}>знижка 50%</span> на усі послуги.
          </p>
          <p>
            При оплаті комплексу з 10 сеансів — одинадцятий сеанс{' '}
            <span className={styles.highlight}>у подарунок</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
