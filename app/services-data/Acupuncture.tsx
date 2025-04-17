import styles from '../services/[slug]/ServiceDetail.module.css';
import type { ServiceMetadata } from '@lib/getServices';

/** Метаданные услуги (типизированы интерфейсом ServiceMetadata) */
export const metadata: ServiceMetadata = {
  slug: 'acupuncture',
  title: 'Акупунктура',
  description:
    'Давня китайська методика з використанням тонких голок для стимуляції природних процесів самозцілення.',
  image: '/images/services/acupuncture.webp',
  // order можно задать при необходимости; если не нужен — строку можно удалить
  // order: 10,
};

/** Компонент, полностью сохраняющий исходное содержимое */
export default function Acupuncture() {
  return (
    <div className={styles.serviceContent}>
      <p>
        <span className={styles.highcolor}>Суха голка (Dry Needling)</span> – це сучасний метод
        лікування, що полягає у введенні тонких стерильних голок у певні тригерні точки на тілі для
        усунення болю, м'язового напруження та поліпшення функцій опорно-рухового апарату. На
        відміну від класичної акупунктури, суха голка орієнтована на лікування конкретних больових
        синдромів та м'язових дисфункцій без акценту на енергетичні канали.
      </p>

      <h3 className={styles.serviceHeading}>Як проходить сеанс сухої голки?</h3>
      <p>
        Під час процедури фахівець ретельно визначає больові зони та тригерні точки в м'язах, після
        чого вводить голки з максимальною точністю. Стимуляція цих точок допомагає зняти м'язові
        спазми, зменшити біль та активізувати локальний кровообіг.
      </p>

      <p>
        Процедура триває від 20 до 40 хвилин і зазвичай супроводжується легкими відчуттями тиску чи
        дискомфорту, але загалом є комфортною для пацієнтів.
      </p>

      <h3 className={styles.serviceHeading}>Показання до застосування сухої голки:</h3>
      <ul>
        <li>хронічні та гострі болі в спині, шиї, плечах та інших частинах тіла;</li>
        <li>міофасціальні больові синдроми;</li>
        <li>головні болі, пов'язані з м'язовими спазмами;</li>
        <li>спортивні та професійні травми;</li>
        <li>м'язове напруження через стрес;</li>
        <li>відновлення після травм та операцій.</li>
      </ul>

      <h3 className={styles.serviceHeading}>Переваги методу сухої голки:</h3>
      <ul>
        <li>швидке усунення больового синдрому;</li>
        <li>ефективне зняття м'язових спазмів;</li>
        <li>покращення рухливості та функцій м'язів;</li>
        <li>активізація процесів природного загоєння;</li>
        <li>мінімальний ризик побічних ефектів;</li>
        <li>довгостроковий позитивний результат.</li>
      </ul>

      <p>
        Після сеансу ви можете відчути суттєве полегшення, легкість руху та загальне покращення
        самопочуття. Регулярне застосування методу сухої голки допомагає ефективно усунути біль,
        відновити функції м'язів і забезпечити стійке оздоровлення організму.
      </p>

      <p>Відчуйте швидке полегшення і поверніть собі свободу рухів завдяки методу сухої голки!</p>
    </div>
  );
}
