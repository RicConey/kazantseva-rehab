// app/components/ContactCard.jsx (Исправленная версия)
'use client';

import { useState } from 'react';
import styles from '../contact/Contact.module.css';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function ContactCard({
  icon,
  title,
  linkHref,
  linkText,
  copyText,
  children = null,
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!copyText) return;

    const textArea = document.createElement('textarea');
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className={styles.contactCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>{icon}</div>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.cardBody}>
        {linkHref && (
          <a href={linkHref} target="_blank" rel="noopener noreferrer" className={styles.mainLink}>
            {linkText}
          </a>
        )}
        {/* Теперь этот блок будет отображаться, только если children существуют */}
        {children}
      </div>
      {copyText && (
        <button onClick={handleCopy} className={styles.copyButton} aria-label="Copy to clipboard">
          {isCopied ? <FiCheck /> : <FiCopy />}
          <span>{isCopied ? 'Скопійовано!' : 'Копіювати'}</span>
        </button>
      )}
    </div>
  );
}
