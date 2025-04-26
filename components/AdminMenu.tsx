// components/AdminMenu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tag, Users, Calendar, DollarSign, FileText, LogOut, Menu as MenuIcon } from 'lucide-react';
import styles from './AdminMenu.module.css';

interface MenuItem {
  href: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const items: MenuItem[] = [
  { href: '/admin/prices', label: 'Прайс', Icon: Tag },
  { href: '/admin/clients', label: 'Клієнти', Icon: Users },
  { href: '/admin/weekly-schedule', label: 'Розклад', Icon: Calendar },
  { href: '/admin/finance', label: 'Фінанси', Icon: DollarSign },
  { href: '/admin/notes', label: 'Нотатки', Icon: FileText },
  { href: '/api/auth/signout', label: 'Вихід', Icon: LogOut },
];

export default function AdminMenu() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuHeader}>
        <button
          className={styles.menuToggle}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
        >
          <MenuIcon size={20} />
        </button>
        <span className={styles.headerTitle}>Панель адміністратора</span>
      </div>

      <nav className={`${styles.menu} ${open ? styles.open : ''}`}>
        {items.map(({ href, label, Icon }) => {
          const isLogout = href === '/api/auth/signout';
          const isActive = !isLogout && path === href;

          if (isLogout) {
            return (
              <a key={href} href={href} className={styles.link}>
                <Icon className={styles.icon} />
                <span className={styles.label}>{label}</span>
              </a>
            );
          }

          return (
            <Link key={href} href={href} legacyBehavior>
              <a
                className={`${styles.link} ${isActive ? styles.active : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon className={styles.icon} />
                <span className={styles.label}>{label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
