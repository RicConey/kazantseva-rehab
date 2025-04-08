// components/SeoText.js

const serviceNames = {
    Rehabilitation: "реабілітація",
    Acupuncture: "акупунктура",
    Craniosacral: "краніосакральна терапія",
    Fitobocha: "фітобочка",
    Massage: "масаж",
    Osteopathy: "остеопатія",
    Visceral: "вісцеральна терапія",
    Taping: "тейпування",
    StrokeRehabilitation: "реабілітація після інсульту",
    InstantPainRelief: "миттєве знеболення",
    CuppingTherapy: "вакуумно-роликовий масаж",
};

export default function SeoText({ slug }) {
    const serviceName = serviceNames[slug] || "реабілітаційні послуги";

    return (
        <p className="visually-hidden">
            Наталія Казанцева — сертифікований спеціаліст з {serviceName} у місті Вишневе та Крюківщина.
            Ми пропонуємо професійні методи відновлення для дітей і дорослих: масаж, остеопатія,
            тейпування, краніосакральна терапія та інші. Реабілітація після інсульту, травм, болю у спині
            та суглобах — наша спеціалізація. Реабілітація Наталії Казанцевої допомагає пацієнтам повернути якість життя.
        </p>
    );
}
