
import SeoText from "./SeoText";

export default function ClientRulesPage() {
    return (
        <section className="baseText">

            <back-button></back-button>

            <h1 className="pageTitle" style={{ color: '#249B89' }}>Правила для клієнтів</h1>

                <div>
                    <h2 style={{ color: '#249B89' }}>1. Запізнення та неявка</h2>
                    <ul>
                        <li>У разі запізнення тривалість сеансу <span style={{ color: '#249B89' }}>зменшується пропорційно</span>, щоб не затримувати наступних клієнтів.</li>
                        <li>Якщо Ви <span style={{ color: '#249B89' }}>не попередили про відсутність</span> щонайменше за <span style={{ color: '#249B89' }}>2 години</span> до запланованого візиту — вартість сеансу <span style={{ color: '#249B89' }}>не повертається</span>.</li>
                        <li>Неявка без попередження розцінюється як <span style={{ color: '#249B89' }}>використаний сеанс</span>.</li>
                        <li>У разі повторної неявки без повідомлення я залишаю за собою право <span style={{ color: '#249B89' }}>відмовити у подальших прийомах</span>.</li>
                    </ul>
                </div>

                <div>
                    <h2 style={{ color: '#249B89' }}>2. Скасування запису</h2>
                    <ul>
                        <li><span style={{ color: '#249B89' }}>За 24 години і більше</span> — можна <span style={{ color: '#249B89' }}>повернути передоплату</span> або <span style={{ color: '#249B89' }}>перенести сеанс</span> без пояснень.</li>
                        <li><span style={{ color: '#249B89' }}>За 12 годин і більше</span> — можливе повернення коштів, але <span style={{ color: '#249B89' }}>наступний сеанс має бути сплачений наперед і в повному обсязі</span>.</li>
                        <li><span style={{ color: '#249B89' }}>Менше ніж за 2 годин</span> — <span style={{ color: '#249B89' }}>передоплата не повертається</span>. Наступний запис можливий лише у разі <span style={{ color: '#249B89' }}>компенсації 50%</span> вартості пропущеного сеансу.</li>
                        <li>Для ранкових сеансів (9:00 або 10:00) — скасування повинно відбутись <span style={{ color: '#249B89' }}>не пізніше ніж за 12 годин</span>.</li>
                    </ul>
                </div>

                <div>
                    <h2 style={{ color: '#249B89' }}>3. Скасування запису з мого боку</h2>
                    <ul>
                        <li><span style={{ color: '#249B89' }}>Поверну передоплату</span>, якщо скасування сталося з моєї вини.</li>
                        <li>Або <span style={{ color: '#249B89' }}>надам знижку 50%</span> на аналогічний масаж,</li>
                        <li>Або <span style={{ color: '#249B89' }}>запропоную бонус</span> до наступної процедури (на Ваш вибір).</li>
                    </ul>
                </div>

                <div>
                    <h2 style={{ color: '#249B89' }}>4. Стан здоров’я, гігієна та відповідальність</h2>
                    <ul>
                        <li>Будь ласка, дбайливо ставтесь до свого самопочуття. При наявності симптомів (застуда, температура, кашель) — <span style={{ color: '#249B89' }}>перенесіть запис якнайшвидше</span>.</li>
                        <li>Послуги <span style={{ color: '#249B89' }}>не надаються</span> особам у стані <span style={{ color: '#249B89' }}>алкогольного або наркотичного сп’яніння</span>.</li>
                        <li>Обов’язкова <span style={{ color: '#249B89' }}>особиста гігієна</span> та чистий одяг перед сеансом.</li>
                        <li>Якщо у Вас є <span style={{ color: '#249B89' }}>лікарські протипоказання</span>, обов’язково попередьте про це заздалегідь. У разі приховування вся відповідальність покладається на клієнта.</li>
                        <li>У разі порушення цих умов я можу <span style={{ color: '#249B89' }}>відмовити у проведенні процедури</span> без повернення коштів.</li>
                    </ul>
                </div>

                <div>
                    <h2 style={{ color: '#249B89' }}>5. Поважне ставлення</h2>
                    <ul>
                        <li>Прошу дотримуватись <span style={{ color: '#249B89' }}>ввічливості та поваги</span> у спілкуванні.</li>
                        <li>У разі агресії, грубощів чи зневажливого ставлення я залишаю за собою право <span style={{ color: '#249B89' }}>відмовити у подальших прийомах</span>.</li>
                    </ul>
                </div>

            <SeoText />

            <back-button></back-button>
        </section>
    );
}