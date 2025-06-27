// app/components/BottomNav.jsx (Версия с 5 кнопками)
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

// Импортируем иконки, добавляем иконку для Правил
import { FiHome, FiTag, FiPhone, FiUser, FiFileText } from 'react-icons/fi';

// Добавляем новый пункт "Правила"
const navItems = [
  { href: '/', label: 'Головна', icon: FiHome },
  { href: '/prices', label: 'Ціни', icon: FiTag },
  { href: '/about', label: 'Про мене', icon: FiUser },
  { href: '/rules', label: 'Правила', icon: FiFileText },
  { href: '/contact', label: 'Контакти', icon: FiPhone },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNav}>
      {navItems.map(item => {
        return (
          // Убираем логику с isCtaButton, все кнопки теперь одинаковые
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <item.icon className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
