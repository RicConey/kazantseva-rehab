// app/contact/page.tsx (Новая версия)
import Image from 'next/image';
import ContactCard from 'app/components/ContactCard';
import styles from './Contact.module.css';

// Импортируем иконки для заголовков карточек
import { FiPhone, FiMapPin } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <section className="baseText">
      <div className={styles.pageWrapper}>
        {/* Левая колонка с информацией */}
        <div className={styles.infoColumn}>
          <ContactCard
            icon={<FiPhone />}
            title="Основний номер"
            linkHref="tel:+380503843042"
            linkText="+380 50 384 30 42"
            copyText="0503843042"
          >
            <div className={styles.messengerIcons}>
              <a
                href="https://t.me/+380503843042"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <Image src="/icons/telegram.svg" alt="Telegram" width={28} height={28} />
              </a>
              <a href="viber://chat?number=+380503843042" aria-label="Viber">
                <Image src="/icons/viber.svg" alt="Viber" width={28} height={28} />
              </a>
              <a
                href="https://wa.me/380503843042"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={28} height={28} />
              </a>
            </div>
          </ContactCard>

          <ContactCard
            icon={<FiPhone />}
            title="Додатковий номер"
            linkHref="tel:+380967237838"
            linkText="+380 96 723 78 38"
            copyText="0967237838"
          >
            <div className={styles.messengerIcons}>
              <a href="viber://chat?number=+380967237838" aria-label="Viber">
                <Image src="/icons/viber.svg" alt="Viber" width={28} height={28} />
              </a>
            </div>
          </ContactCard>

          <ContactCard
            icon={<FiMapPin />}
            title="Адреса кабінету"
            linkHref="https://maps.app.goo.gl/FBCCwo9srARVsH5bA"
            linkText="вулиця Молодіжна, 16А, Вишневе, Київська область"
            copyText="вулиця Молодіжна, 16А, Вишневе, Київська область"
          />
        </div>

        {/* Правая колонка с картой */}
        <div className={styles.mapColumn}>
          <h2>Карта проїзду</h2>
          <iframe
            className={styles.contactIframe}
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d159.00638308329226!2d30.38056825460917!3d50.38329466964006!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x26369bd37d873de7%3A0xaea72a7a3223fd8a!2z0KDQtdCw0LHRltC70ZbRgtCw0YbRltGPINCd0LDRgtCw0LvRltGPINCa0LDQt9Cw0L3RhtC10LLQsA!5e0!3m2!1sru!2spl!4v1742390373089!5m2!1sru!2spl"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
