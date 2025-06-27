import ServiceLayout from 'app/components/ServiceLayout';
import type { ServiceMetadata } from '@lib/getServices';
import styles from 'app/components/ServiceLayout.module.css';

export const metadata: ServiceMetadata = {
  slug: 'instantpainrelief',
  title: 'Метод миттєвого лікування болю',
  description: 'Швидке зняття болю завдяки комбінації акупунктури й фасціального тестування.',
  image: '/images/services/instant_pain_relief.webp',
};

export default function InstantPainReliefPage() {
  return (
    <ServiceLayout metadata={metadata}>
      <div>
        <p>
          <span className={styles.highlight}>Метод миттєвого лікування болю</span> – це комплексний
          підхід, що передбачає точну діагностику і цілеспрямований вплив на першопричину больового
          синдрому. Можна досягти швидкого зменшення болю (до 90%) вже в перші 2-10 секунд.
        </p>
        <p>
          Основу методу складає акупунктурна модель доктора Тана («Метод Балансу»), яка ґрунтується
          на взаємозв'язку між «хворими» та «здоровими» меридіанами.
        </p>
        <h3>Переваги методу:</h3>
        <ul>
          <li>швидке та ефективне зняття болю;</li>
          <li>точний і цілеспрямований вплив на причину проблеми;</li>
          <li>миттєвий терапевтичний ефект, що зберігається надовго;</li>
          <li>комфортність процедури для пацієнта.</li>
        </ul>
        <p>
          Вибравши метод Балансу доктора Тана, ви можете миттєво повернути собі свободу рухів, зняти
          больовий синдром і покращити якість свого життя.
        </p>
      </div>
    </ServiceLayout>
  );
}
