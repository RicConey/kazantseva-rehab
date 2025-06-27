import ServiceLayout from 'app/components/ServiceLayout';
import type { ServiceMetadata } from '@lib/getServices';
import styles from 'app/components/ServiceLayout.module.css';

export const metadata: ServiceMetadata = {
  slug: 'strokerehabilitation',
  title: 'Відновлювальний масаж при травмах та інсультах',
  description: 'Програма з повернення рухових функцій після інсульту й серйозних травм.',
  image: '/images/services/post_stroke_rehabilitation.webp',
};

export default function StrokeRehabilitationPage() {
  return (
    <ServiceLayout metadata={metadata}>
      <div>
        <p>
          <span className={styles.highlight}>Відновлюваний масаж при травмах та інсультах</span> –
          це комплексна програма відновлення, спрямована на повернення втрачених рухових функцій,
          покращення роботи суглобів, м'язів та відновлення загального фізичного стану.
        </p>
        <h3>Що включає програма реабілітації:</h3>
        <ul>
          <li>
            <span className={styles.highlight}>Розробка суглобів:</span> Відновлення гнучкості та
            рухливості суглобів.
          </li>
          <li>
            <span className={styles.highlight}>Робота з обличчям:</span> Спеціальні методики для
            відновлення симетрії та поліпшення мімічних функцій.
          </li>
          <li>
            <span className={styles.highlight}>Відновлення рухів кінцівок:</span> Комплексний підхід
            для повернення контролю над рухами рук і ніг.
          </li>
        </ul>
        <h3>Очікувані результати:</h3>
        <ul>
          <li>Поліпшення рухливості та зменшення болю в суглобах;</li>
          <li>Відновлення симетрії обличчя та поліпшення міміки;</li>
          <li>Відновлення здатності до самообслуговування.</li>
        </ul>
      </div>
    </ServiceLayout>
  );
}
