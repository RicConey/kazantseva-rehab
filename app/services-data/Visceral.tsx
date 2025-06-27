import ServiceLayout from 'app/components/ServiceLayout';
import type { ServiceMetadata } from '@lib/getServices';
import styles from 'app/components/ServiceLayout.module.css';

export const metadata: ServiceMetadata = {
  slug: 'visceral',
  title: 'Вісцеральна терапія',
  description: 'М’який мануальний вплив на внутрішні органи для нормалізації їх роботи.',
  image: '/images/services/visceral_therapy.webp',
};

export default function VisceralPage() {
  return (
    <ServiceLayout metadata={metadata}>
      <div>
        <p>
          <span className={styles.highlight}>Вісцеральна терапія</span> – це стародавній метод
          оздоровлення, який спрямований на відновлення природних функцій внутрішніх органів шляхом
          м’якої та глибокої мануальної роботи.
        </p>
        <h3>Як працює вісцеральна терапія?</h3>
        <p>
          За допомогою дбайливого натискання, погладжування та легкого масажу живота терапевт знімає
          напруження, покращує кровообіг і нормалізує функції внутрішніх органів.
        </p>
        <h3>Показання:</h3>
        <ul>
          <li>порушення роботи шлунково-кишкового тракту (здуття, запори);</li>
          <li>дискінезія жовчовивідних шляхів;</li>
          <li>хронічні захворювання органів травлення;</li>
          <li>часті головні болі, мігрені;</li>
          <li>хронічна втома, зниження життєвого тонусу.</li>
        </ul>
        <h3>Переваги:</h3>
        <ul>
          <li>глибоке та стійке розслаблення;</li>
          <li>зменшення стресу та напруги;</li>
          <li>відновлення гармонійної роботи внутрішніх органів.</li>
        </ul>
      </div>
    </ServiceLayout>
  );
}
