// components/PromoBlock.js

export default function PromoBlock() {
  return (
    <div className="baseText" style={{ margin: '16px auto', maxWidth: '800px' }}>
      {/* Сертифікати */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p>Також пропонуємо</p>
        <p
          style={{
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            color: '#249B89',
            fontFamily: 'LogoFont',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          }}
        >
          Подарункові сертифікати
        </p>
        <p style={{ marginTop: 0 }}>на будь-яку суму та послугу</p>
      </div>

      {/* Знижки */}
      <div style={{ textAlign: 'center' }}>
        <p>
          Для військових після поранень та контузій —{' '}
          <span style={{ color: '#249B89' }}>знижка 50%</span> на усі послуги.
        </p>
        <p>
          При оплаті комплексу з 10 сеансів — один сеанс{' '}
          <span style={{ color: '#249B89' }}>у подарунок</span>
        </p>
      </div>
    </div>
  );
}
