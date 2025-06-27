import ServiceLayout from 'app/components/ServiceLayout';
import type { ServiceMetadata } from '@lib/getServices';
import styles from 'app/components/ServiceLayout.module.css';

export const metadata: ServiceMetadata = {
  slug: 'osteopathy',
  title: 'Остеопатія',
  description: 'Мануальна терапія для відновлення рухливості суглобів і зняття напруги.',
  image: '/images/services/osteopathy.webp',
};

export default function OsteopathyPage() {
  return (
    <ServiceLayout metadata={metadata}>
      <div>
        <p>
          <span className={styles.highlight}>Остеопатія</span> – це комплексний і цілісний підхід до
          здоров'я, що ґрунтується на м’яких мануальних техніках, спрямованих на глибоке відновлення
          природного балансу всіх систем організму.
        </p>
        <h3>Як працює остеопатія?</h3>
        <p>
          Остеопатія базується на принципі, що організм має природну здатність до самовідновлення.
          За допомогою делікатних, безболісних та точних рухів спеціаліст діагностує та усуває
          блокади і напругу в тканинах.
        </p>
        <h3>Коли рекомендується звернутися до остеопата?</h3>
        <ul>
          <li>хронічні болі в спині, шиї та попереку;</li>
          <li>головні болі та мігрені;</li>
          <li>болі у суглобах (артрити, артрози);</li>
          <li>сколіози та порушення постави;</li>
          <li>наслідки фізичних травм.</li>
        </ul>
        <p>
          Запрошуємо на сеанси остеопатії, які допоможуть вам відчути себе краще та повернути
          природну гармонію вашому тілу!
        </p>
      </div>
    </ServiceLayout>
  );
}
