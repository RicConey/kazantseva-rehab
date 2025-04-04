// app/contact/page.js

export default function ContactPage() {
    return (
        <section
            style={{
                padding: "20px",
                maxWidth: "800px",
                margin: "0 auto",
                textAlign: "center",
            }}
        >
            <back-button></back-button>

            <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Контакти</h1>
            <p>
                <strong>Телефони:</strong>
                <br />
                <a
                    href="tel:+380503843042"
                    style={{ display: "block", margin: "5px 0" }}
                >
                    +380 50 384 3042
                </a>
                <a
                    href="tel:+380967237838"
                    style={{ display: "block", margin: "5px 0" }}
                >
                    +380 96 723 7838
                </a>
            </p>
            <p>
                <strong>Адреса:</strong>{" "}
                <a
                    href="https://maps.app.goo.gl/FBCCwo9srARVsH5bA"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "underline", color: "#0070f3" }}
                >
                    вулиця Молодіжна, 16А, Вишневе, Київська область
                </a>
            </p>

            <div style={{ marginTop: "20px" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Карта проїзду</h2>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d159.00638308329226!2d30.38056825460917!3d50.38329466964006!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x26369bd37d873de7%3A0xaea72a7a3223fd8a!2z0KDQtdCw0LHRltC70ZbRgtCw0YbRltGPINCd0LDRgtCw0LvRltGPINCa0LDQt9Cw0L3RhtC10LLQsA!5e0!3m2!1sru!2spl!4v1742390373089!5m2!1sru!2spl"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: "8px" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            <back-button></back-button>
        </section>
    );
}
