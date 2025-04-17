import styles from '../services/[slug]/ServiceDetail.module.css';
import type { ServiceMetadata } from '@lib/getServices';

export const metadata: ServiceMetadata = {
  slug: 'taping',
  title: 'Тейпування',
  description: 'Еластичні стрічки для підтримки м’язів і суглобів без обмеження рухів.',
  image: '/images/services/taping.webp',
};

export default function Taping() {
  return (
    <div className={styles.serviceContent}>
      <p>
        <span className={styles.highcolor}>Тейпування</span> – це сучасний неінвазивний метод
        лікування і реабілітації, який полягає у накладанні спеціальних еластичних стрічок (тейпів)
        на певні ділянки тіла. Цей метод широко використовується в спортивній медицині, фізіотерапії
        та ортопедії.
      </p>

      <h3 className={styles.serviceHeading}>Як проходить процедура тейпування?</h3>
      <p>
        Під час процедури спеціаліст наносить спеціальні кінезіологічні тейпи, які підтримують
        м'язи, зв'язки та суглоби без обмеження рухливості. Тейпи накладаються за спеціальними
        схемами залежно від конкретних завдань: зняття болю, зменшення набряку, покращення
        кровообігу чи стабілізації суглобів.
      </p>

      <h3 className={styles.serviceHeading}>Показання до застосування тейпування:</h3>
      <ul>
        <li>спортивні та професійні травми;</li>
        <li>розтягнення, забої, удари;</li>
        <li>болі в суглобах і м'язах;</li>
        <li>порушення постави та сколіоз;</li>
        <li>реабілітація після операцій і травм;</li>
        <li>набряки і застійні явища;</li>
        <li>профілактика травм при фізичних навантаженнях.</li>
      </ul>

      <h3 className={styles.serviceHeading}>Переваги тейпування:</h3>
      <ul>
        <li>швидке усунення болю і дискомфорту;</li>
        <li>підтримка рухливості суглобів без обмеження активності;</li>
        <li>стимуляція лімфотоку і кровообігу;</li>
        <li>прискорення реабілітації та одужання;</li>
        <li>зменшення набряків і запальних процесів;</li>
        <li>ефективна профілактика травм.</li>
      </ul>

      <p>
        Після процедури ви відчуєте зменшення болю, поліпшення рухливості та загальне полегшення.
        Регулярне використання тейпування дозволяє значно скоротити терміни реабілітації та
        повернути вам активне життя.
      </p>

      <p>Відчуйте комфорт і безпеку рухів завдяки методу тейпування!</p>
    </div>
  );
}
