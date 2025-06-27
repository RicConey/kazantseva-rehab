// app/components/RuleAccordion.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RuleAccordion.module.css';
import { FiChevronDown } from 'react-icons/fi';

export default function RuleAccordion({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Применяем активный класс ко всему элементу
    <div className={`${styles.accordionItem} ${isOpen ? styles.active : ''}`}>
      <button className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.titleContainer}>
          {/* Обертка для иконки остается */}
          {icon && <div className={styles.iconWrapper}>{icon}</div>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={styles.chevronWrapper}
        >
          <FiChevronDown />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.contentWrapper}
          >
            <div className={styles.content}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
