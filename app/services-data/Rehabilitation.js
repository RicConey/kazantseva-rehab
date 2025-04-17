import styles from '../services/[slug]/ServiceDetail.module.css';

export const metadata = {
    slug: "rehabilitation",
    title: "Реабілітація",
    description:
        "Комплексний підхід до відновлення фізичного стану, допомога у відновленні балансу організму та зменшенні болю.",
    image: "/images/services/rehabilitation.webp",
    order: 1, // Числовой порядок, чем меньше число – тем раньше отображается
};

export default function Rehabilitation() {
    return (
        <div className={styles.serviceContent}>
            <p>
                <span className={styles.highcolor}>Реабілітація</span> – це комплекс заходів, спрямованих на відновлення функціональних можливостей організму після травм, операцій або захворювань. У моєму приватному кабінеті я пропоную індивідуальні програми, що враховують особливості кожного пацієнта.
            </p>
            <p>
                Програма реабілітації включає фізіотерапію, спеціальні вправи, сучасні методики відновлення, масаж та тейпування. Метою є покращення рухливості, зміцнення м’язів та відновлення загального балансу, що дозволяє повернутися до повноцінного активного життя.
            </p>
            <p>
                Окрім фізичної реабілітації, я також практикую <span className={styles.highcolor}>ДПДГ-терапію</span> (EMDR) – ефективний психотерапевтичний метод для лікування посттравматичного стресового розладу (ПТСР), фобій, тривожних станів, депресії та наслідків психологічних травм. Ця методика дозволяє швидко зменшити інтенсивність негативних переживань і відновити емоційний баланс.
            </p>
            <p>
                Я забезпечую повну підтримку на кожному етапі вашого відновлення, враховуючи як фізичний, так і психоемоційний стан, щоб ви знову змогли жити активно та повноцінно.
            </p>
        </div>
    );
}