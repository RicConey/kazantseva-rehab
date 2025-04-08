import styles from "./Contact.module.css";
import SeoText from "../../components/SeoText";

export default function ContactPage() {
    return (
        <section className={`baseText ${styles.contactSection}`}>
            <back-button></back-button>

            {/* Телефони */}
            <h2 className={styles.contactTitle} style={{ textAlign: "center" }}>
                Телефони:
            </h2>

            <div className={styles.phoneRow}>
                <div className={styles.messengerIconsInline}>
                    <a href="https://t.me/+380503843042" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                        <img src="/icons/telegram.svg" alt="Telegram" />
                    </a>
                    <a href="viber://chat?number=+380503843042" aria-label="Viber">
                        <img src="/icons/viber.svg" alt="Viber" />
                    </a>
                    <a href="https://wa.me/380503843042" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                        <img src="/icons/whatsapp.svg" alt="WhatsApp" />
                    </a>
                </div>
                <a href="tel:+380503843042" className={styles.contactLink}>
                    +380 50 384 3042
                </a>
            </div>

            <div className={styles.phoneRow}>
                <div className={styles.messengerIconsInline}>
                    <a href="viber://chat?number=+380967237838" aria-label="Viber">
                        <img src="/icons/viber.svg" alt="Viber" />
                    </a>
                </div>
                <a href="tel:+380967237838" className={styles.contactLink}>
                    +380 96 723 7838
                </a>
            </div>

            {/* Адреса */}
            <h2 className={styles.contactTitle} style={{ textAlign: "center", marginTop: "20px" }}>
                Адреса:
            </h2>
            <a
                href="https://maps.app.goo.gl/FBCCwo9srARVsH5bA"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
            >
                вулиця Молодіжна, 16А, Вишневе, Київська область
            </a>

            {/* Карта */}
            <div className={styles.contactMapWrapper}>
                <h2 className={styles.contactTitle}>Карта проїзду</h2>
                <iframe
                    className={styles.contactIframe}
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d159.00638308329226!2d30.38056825460917!3d50.38329466964006!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x26369bd37d873de7%3A0xaea72a7a3223fd8a!2z0KDQtdCw0LHRltC70ZbRgtCw0YbRltGPINCd0LDRgtCw0LvRltGPINCa0LDQt9Cw0L3RhtC10LLQsA!5e0!3m2!1sru!2spl!4v1742390373089!5m2!1sru!2spl"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <SeoText />

            <back-button></back-button>
        </section>
    );
}
