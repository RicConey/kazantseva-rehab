// public/back-button.js
if (typeof window !== 'undefined') {
  class BackButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          /* Переопределяем выравнивание для самого кастомного элемента */
          :host {
            display: block;
            text-align: left;
            margin: 10px 0; /* отступ сверху/снизу, при необходимости */
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #249B89;
            color: white;
            text-decoration: none;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
          }
          .btn:hover {
            transform: translateY(-3px);
            background: #1D8473;
          }
          .btn:active {
            transform: translateY(0);
          }
        </style>
        <button class="btn">← Назад</button>
      `;
      this.shadowRoot.querySelector('button').addEventListener('click', () => {
        window.history.back();
      });
    }
  }

  if (!customElements.get('back-button')) {
    customElements.define('back-button', BackButton);
  }
}
