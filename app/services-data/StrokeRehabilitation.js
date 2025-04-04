import styles from '../services/[slug]/ServiceDetail.module.css';

export const metadata = {
    slug: "strokerehabilitation",
    title: "Реабілітація після інсульту",
    description:
        "Комплексна програма відновлення, спрямована на повернення втрачених рухових функцій.",
    image: "/images/services/post_stroke_rehabilitation.webp",
};
export default function StrokeRehabilitation() {
    return (
        <div className={styles.serviceContent}>
            <p>
                <b>Реабілітація після інсульту</b> – це комплексна програма відновлення, спрямована на повернення втрачених рухових функцій, покращення роботи суглобів, м'язів та відновлення загального фізичного стану пацієнта. Індивідуально підібрана програма включає спеціальні вправи, мануальні техніки та методики, які допомагають ефективно боротися з наслідками перенесеного інсульту.
            </p>

             <h3 className={styles.serviceHeading}>Що включає програма реабілітації:</h3>
            <ul>
                <li><strong>Розробка суглобів:</strong> Відновлення гнучкості та рухливості суглобів, які постраждали внаслідок інсульту, зменшення болю та дискомфорту при русі.</li>
                <li><strong>Робота з обличчям:</strong> Спеціальні методики та вправи для відновлення симетрії, поліпшення мімічних функцій і ковтання, що допомагає повернути природний вигляд і комфорт у повсякденному житті.</li>
                <li><strong>Відновлення рухів кінцівок:</strong> Комплексний підхід, що включає мануальні техніки, кінезіотерапію та фізичні вправи, спрямовані на поступове повернення контролю над рухами рук і ніг, зменшення м'язової спастики та посилення м'язів.</li>
            </ul>

             <h3 className={styles.serviceHeading}>Як проходять заняття:</h3>
            <p>
                Під час сеансів спеціаліст детально оцінює стан пацієнта, розробляє індивідуальну програму та використовує техніки мануальної терапії, м’які вправи для суглобів, спеціальні масажні техніки та вправи для м’язів обличчя. Тривалість одного заняття становить 40–60 хвилин, і весь курс адаптується залежно від прогресу і стану пацієнта.
            </p>

             <h3 className={styles.serviceHeading}>Очікувані результати реабілітації:</h3>
            <ul>
                <li>Поліпшення рухливості та зменшення болю в суглобах;</li>
                <li>Відновлення симетрії обличчя та поліпшення міміки;</li>
                <li>Відновлення здатності до самообслуговування;</li>
                <li>Зменшення м'язової спастики та болю;</li>
                <li>Покращення якості життя і загального фізичного та емоційного стану.</li>
            </ul>

            <p>
                Професійна підтримка та індивідуальний підхід допоможуть вам максимально ефективно повернути активність, впевненість і радість руху після перенесеного інсульту.
            </p>
        </div>
    );
}
