import ServiceLayout from 'app/components/ServiceLayout';
import type { ServiceMetadata } from '@lib/getServices';
import styles from 'app/components/ServiceLayout.module.css';

export const metadata: ServiceMetadata = {
  slug: 'fitobocha',
  title: 'Фітобочка',
  description: 'Оздоровча процедура з трав’яною парою: очищення, детокс, релаксація.',
  image: '/images/services/phytobarrel.webp',
};

export default function FitobochaPage() {
  return (
    <ServiceLayout metadata={metadata}>
      <div>
        <p>
          <span className={styles.highlight}>Фітобочка</span> – це унікальна оздоровча процедура,
          яка використовує натуральні рослинні компоненти для комплексного впливу на організм. Тіло
          занурюється в теплу пару, насичену цілющими травами.
        </p>
        <h3>Як проходить процедура?</h3>
        <p>
          Процедура проводиться у спеціальній дерев'яній бочці, в якій тіло м'яко обволікається
          парою, а голова залишається зовні, що дозволяє комфортно дихати. Тривалість сеансу –
          приблизно 15–20 хвилин.
        </p>
        <h3>Користь фітобочки:</h3>
        <ul>
          <li>ефективне виведення токсинів та очищення організму;</li>
          <li>покращення кровообігу та лімфодренажу;</li>
          <li>глибоке розслаблення м’язів і зняття напруги;</li>
          <li>зміцнення імунітету і підвищення життєвого тонусу;</li>
          <li>поліпшення стану шкіри, її пружності й еластичності.</li>
        </ul>
        <h3>Протипоказання:</h3>
        <ul>
          <li>серйозні серцево-судинні захворювання;</li>
          <li>вагітність;</li>
          <li>гострі запальні захворювання;</li>
          <li>онкологічні захворювання.</li>
        </ul>
      </div>
    </ServiceLayout>
  );
}
