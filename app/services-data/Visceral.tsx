import styles from '../services/[slug]/ServiceDetail.module.css';
import type { ServiceMetadata } from '@lib/getServices';

export const metadata: ServiceMetadata = {
  slug: 'visceral',
  title: 'Вісцеральна терапія',
  description: 'М’який мануальний вплив на внутрішні органи для нормалізації їх роботи.',
  image: '/images/services/visceral_therapy.webp',
};

export default function Visceral() {
  return (
    <div className={styles.serviceContent}>
      <p>
        <span className={styles.highcolor}>Вісцеральна терапія</span> – це стародавній метод
        оздоровлення, який спрямований на відновлення природних функцій внутрішніх органів шляхом
        м’якої та глибокої мануальної роботи.
      </p>

      <h3 className={styles.serviceHeading}>Як працює вісцеральна терапія?</h3>
      <p>
        За допомогою дбайливого натискання, погладжування та легкого масажу живота терапевт знімає
        напруження, покращує кровообіг і нормалізує функції внутрішніх органів. Під час процедури
        терапевт ретельно «слухає» тіло пацієнта, знаходячи місця напруження, застоїв та блокад, які
        можуть викликати дискомфорт або біль.
      </p>

      <p>
        Терапевт м’яко взаємодіє з ділянками живота, відновлюючи природне положення органів і
        стимулюючи їхню активність. Після першого сеансу відчувається глибоке розслаблення,
        полегшення та значне покращення самопочуття.
      </p>

      <p>
        Сеанс триває близько 45–60 хвилин, повний курс процедур визначається індивідуально
        відповідно до потреб пацієнта.
      </p>

      <h3 className={styles.serviceHeading}>Показання до вісцеральної терапії:</h3>
      <ul>
        <li>порушення роботи шлунково-кишкового тракту (здуття, запори, розлади травлення);</li>
        <li>дискінезія жовчовивідних шляхів, застійні явища в печінці та жовчному міхурі;</li>
        <li>хронічні захворювання органів травлення (гастрити, холецистити, панкреатити);</li>
        <li>проблеми сечовидільної системи;</li>
        <li>порушення дихальної системи, діафрагмальні блокади;</li>
        <li>порушення серцево-судинної системи;</li>
        <li>часті головні болі, мігрені;</li>
        <li>хронічна втома, зниження життєвого тонусу;</li>
        <li>ослаблений імунітет;</li>
        <li>профілактика та загальне оздоровлення організму.</li>
      </ul>

      <h3 className={styles.serviceHeading}>Переваги вісцеральної терапії:</h3>
      <ul>
        <li>глибоке та стійке розслаблення;</li>
        <li>зменшення стресу та напруги;</li>
        <li>покращення кровообігу та лімфотоку;</li>
        <li>відновлення гармонійної роботи внутрішніх органів;</li>
        <li>підвищення імунітету;</li>
        <li>покращення загального стану та життєвого тонусу.</li>
      </ul>

      <p>
        Подаруйте своєму тілу уважну турботу та природне оздоровлення, відновіть внутрішню гармонію
        та наповніться життєвою енергією завдяки вісцеральній терапії!
      </p>
    </div>
  );
}
