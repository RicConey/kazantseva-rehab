// app/components/ClientRulesPage.tsx (Финальная версия)
import RuleAccordion from './RuleAccordion';
import styles from '../rules/Rules.module.css';

// Иконки
import { FiClock, FiXCircle, FiGift, FiHeart, FiThumbsUp } from 'react-icons/fi';

// Компонент для выделения текста теперь использует класс из CSS-модуля
const Highlight = ({ children }) => <span className={styles.highlight}>{children}</span>;

export default function ClientRulesPage() {
  return (
    // Применяем класс к главному контейнеру
    <section className={`baseText ${styles.container}`}>
      <h1 className={styles.pageTitle}>Правила для клієнтів</h1>

      <div className={styles.accordionContainer}>
        <RuleAccordion title="1. Запізнення та неявка" icon={<FiClock />}>
          <ul>
            <li>
              У разі запізнення тривалість сеансу <Highlight>зменшується пропорційно</Highlight>,
              щоб не затримувати наступних клієнтів.
            </li>
            <li>
              Якщо Ви <Highlight>не попередили про відсутність</Highlight> щонайменше за{' '}
              <Highlight>2 години</Highlight> до запланованого візиту — вартість сеансу{' '}
              <Highlight>не повертається</Highlight>.
            </li>
            <li>
              Неявка без попередження розцінюється як <Highlight>використаний сеанс</Highlight>.
            </li>
            <li>
              У разі повторної неявки без повідомлення я залишаю за собою право{' '}
              <Highlight>відмовити у подальших прийомах</Highlight>.
            </li>
          </ul>
        </RuleAccordion>

        <RuleAccordion title="2. Скасування запису" icon={<FiXCircle />}>
          <ul>
            <li>
              <Highlight>За 24 години і більше</Highlight> — можна{' '}
              <Highlight>повернути передоплату</Highlight> або{' '}
              <Highlight>перенести сеанс</Highlight> без пояснень.
            </li>
            <li>
              <Highlight>За 12 годин і більше</Highlight> — можливе повернення коштів, але{' '}
              <Highlight>наступний сеанс має бути сплачений наперед і в повному обсязі</Highlight>.
            </li>
            <li>
              <Highlight>Менше ніж за 2 годин</Highlight> —{' '}
              <Highlight>передоплата не повертається</Highlight>. Наступний запис можливий лише у
              разі <Highlight>компенсації 50%</Highlight> вартості пропущеного сеансу.
            </li>
            <li>
              Для ранкових сеансів (9:00 або 10:00) — скасування повинно відбутись{' '}
              <Highlight>не пізніше ніж за 12 годин</Highlight>.
            </li>
          </ul>
        </RuleAccordion>

        {/* ... Остальные компоненты RuleAccordion без изменений ... */}

        <RuleAccordion title="3. Скасування запису з мого боку" icon={<FiGift />}>
          <ul>
            <li>
              <Highlight>Поверну передоплату</Highlight>, якщо скасування сталося з моєї вини.
            </li>
            <li>
              Або <Highlight>надам знижку 50%</Highlight> на аналогічний масаж,
            </li>
            <li>
              Або <Highlight>запропоную бонус</Highlight> до наступної процедури (на Ваш вибір).
            </li>
          </ul>
        </RuleAccordion>

        <RuleAccordion title="4. Стан здоров’я, гігієна та відповідальність" icon={<FiHeart />}>
          <ul>
            <li>
              Будь ласка, дбайливо ставтесь до свого самопочуття. При наявності симптомів (застуда,
              температура, кашель) — <Highlight>перенесіть запис якнайшвидше</Highlight>.
            </li>
            <li>
              Послуги <Highlight>не надаються</Highlight> особам у стані{' '}
              <Highlight>алкогольного або наркотичного сп’яніння</Highlight>.
            </li>
            <li>
              Обов’язкова <Highlight>особиста гігієна</Highlight> та чистий одяг перед сеансом.
            </li>
            <li>
              Якщо у Вас є <Highlight>лікарські протипоказання</Highlight>, обов’язково попередьте
              про це заздалегідь. У разі приховування вся відповідальність покладається на клієнта.
            </li>
            <li>
              У разі порушення цих умов я можу{' '}
              <Highlight>відмовити у проведенні процедури</Highlight> без повернення коштів.
            </li>
          </ul>
        </RuleAccordion>

        <RuleAccordion title="5. Поважне ставлення" icon={<FiThumbsUp />}>
          <ul>
            <li>
              Прошу дотримуватись <Highlight>ввічливості та поваги</Highlight> у спілкуванні.
            </li>
            <li>
              У разі агресії, грубощів чи зневажливого ставлення я залишаю за собою право{' '}
              <Highlight>відмовити у подальших прийомах</Highlight>.
            </li>
          </ul>
        </RuleAccordion>
      </div>
    </section>
  );
}
