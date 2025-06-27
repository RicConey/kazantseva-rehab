import ServiceLayout from 'app/components/ServiceLayout';
import type { ServiceMetadata } from '@lib/getServices';
import styles from 'app/components/ServiceLayout.module.css';

export const metadata: ServiceMetadata = {
  slug: 'taping',
  title: 'Тейпування',
  description: 'Еластичні стрічки для підтримки м’язів і суглобів без обмеження рухів.',
  image: '/images/services/taping.webp',
};

export default function TapingPage() {
  return (
    <ServiceLayout metadata={metadata}>
      <div>
        <p>
          <span className={styles.highlight}>Тейпування</span> – це сучасний неінвазивний метод
          лікування і реабілітації, який полягає у накладанні спеціальних еластичних стрічок
          (тейпів) на певні ділянки тіла.
        </p>
        <h3>Як проходить процедура?</h3>
        <p>
          Під час процедури спеціаліст наносить спеціальні кінезіологічні тейпи, які підтримують
          м'язи, зв'язки та суглоби без обмеження рухливості.
        </p>
        <h3>Показання до застосування:</h3>
        <ul>
          <li>спортивні та професійні травми;</li>
          <li>розтягнення, забої, удари;</li>
          <li>болі в суглобах і м'язах;</li>
          <li>порушення постави та сколіоз;</li>
          <li>реабілітація після операцій і травм.</li>
        </ul>
        <h3>Переваги тейпування:</h3>
        <ul>
          <li>швидке усунення болю і дискомфорту;</li>
          <li>підтримка рухливості суглобів;</li>
          <li>стимуляція лімфотоку і кровообігу.</li>
        </ul>
        <p>Відчуйте комфорт і безпеку рухів завдяки методу тейпування!</p>
      </div>
    </ServiceLayout>
  );
}
