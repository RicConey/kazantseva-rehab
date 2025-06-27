import ServiceLayout from 'app/components/ServiceLayout';
import type { ServiceMetadata } from '@lib/getServices';
import styles from 'app/components/ServiceLayout.module.css';

export const metadata: ServiceMetadata = {
  slug: 'rehabilitation',
  title: 'Реабілітація',
  description: 'Комплексний підхід до відновлення функцій після травм та операцій.',
  image: '/images/services/rehabilitation.webp',
  order: 1,
};

export default function RehabilitationPage() {
  return (
    <ServiceLayout metadata={metadata}>
      <div>
        <p>
          <span className={styles.highlight}>Реабілітація</span> – це комплекс заходів, спрямованих
          на відновлення функціональних можливостей організму після травм, операцій або захворювань.
          Я пропоную індивідуальні програми, що враховують особливості кожного пацієнта.
        </p>
        <p>
          Програма реабілітації включає фізіотерапію, спеціальні вправи, сучасні методики
          відновлення, масаж та тейпування. Метою є покращення рухливості, зміцнення м’язів та
          відновлення загального балансу.
        </p>
        <p>
          Окрім фізичної реабілітації, я також практикую{' '}
          <span className={styles.highlight}>ДПДГ-терапію</span> (EMDR) – ефективний
          психотерапевтичний метод для лікування ПТСР, фобій, тривожних станів, депресії та
          наслідків психологічних травм.
        </p>
        <p>
          Я забезпечую повну підтримку на кожному етапі вашого відновлення, щоб ви знову змогли жити
          активно та повноцінно.
        </p>
      </div>
    </ServiceLayout>
  );
}
