import styles from '../services/[slug]/ServiceDetail.module.css';

export const metadata = {
    slug: "massage",
    title: "Масаж тіла та обличчя",
    description:
        "Комплексний масаж, що сприяє розслабленню м’язів, покращенню кровообігу та відновленню життєвих сил.",
    image: "/images/services/massage.webp",
    order: 2, // Числовой порядок, чем меньше число – тем раньше отображается
};
export default function Massage() {
    return (
        <div className={styles.serviceContent}>

             <h3 className={styles.serviceHeading}>Особливості масажу тіла:</h3>
            <p>
                Масаж тіла включає різноманітні техніки, які допомагають зняти м’язове напруження, стимулювати кровообіг, поліпшити лімфодренаж та виведення токсинів з організму. Після сеансу ви відчуєте легкість, свіжість і наповненість енергією.
            </p>
            <ul>
                <li>зняття м'язових болів і дискомфорту;</li>
                <li>відновлення м’язового тонусу;</li>
                <li>покращення постави та рухливості;</li>
                <li>загальне зміцнення імунітету;</li>
                <li>покращення якості сну та загального самопочуття.</li>
            </ul>

             <h3 className={styles.serviceHeading}>Особливості масажу обличчя:</h3>
            <p>
                Масаж обличчя ефективно повертає шкірі молодість, пружність і здоровий вигляд. Завдяки правильно підібраним технікам, масаж:
            </p>
            <ul>
                <li>покращує кровообіг і живлення шкіри;</li>
                <li>стимулює вироблення колагену та еластину;</li>
                <li>зменшує зморшки та ознаки старіння;</li>
                <li>знімає набряки та виводить токсини;</li>
                <li>повертає шкірі природне сяйво та пружність.</li>
            </ul>

             <h3 className={styles.serviceHeading}>Міопластичний масаж обличчя:</h3>
            <p>
                Міопластичний масаж – це інноваційна техніка глибокого моделюючого масажу обличчя, яка активно впливає на м'язи, фасції та шкірні покриви. Завдяки глибокому та точному впливу, ця методика дозволяє:
            </p>
            <ul>
                <li>значно покращити контури обличчя;</li>
                <li>усунути м'язові спазми та асиметрію;</li>
                <li>зменшити глибокі та мімічні зморшки;</li>
                <li>відновити еластичність і пружність шкіри;</li>
                <li>досягти видимого омолоджуючого ефекту без інвазивних процедур.</li>
            </ul>

            <p>
                <span className={styles.highcolor}>Масаж тіла та обличчя</span> – це комплексна процедура, що поєднує глибоке розслаблення і лікувальний ефект, спрямований на загальне оздоровлення та поліпшення зовнішнього вигляду шкіри.
            </p>

             <h3 className={styles.serviceHeading}>Переваги комплексного масажу тіла й обличчя:</h3>
            <p>
                Поєднання цих процедур забезпечує подвійний ефект – глибоке фізичне розслаблення та помітне омолодження шкіри обличчя. Комплексний підхід:
            </p>
            <ul>
                <li>усуває стрес і втому;</li>
                <li>відновлює баланс і гармонію організму;</li>
                <li>підвищує настрій та покращує емоційний стан;</li>
                <li>допомагає підтримувати здоров’я та красу на будь-якому етапі життя.</li>
            </ul>

            <p>
                Подаруйте собі професійний догляд і відчуйте, як ваш організм наповнюється новими силами, енергією та красою завдяки комплексному масажу тіла та міопластичному масажу обличчя!
            </p>
        </div>
    );
}
