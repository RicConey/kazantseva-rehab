// components/AdminPrices/AdminPrices.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent, ReactElement } from 'react';
import styles from './AdminPrices.module.css';
import {
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaTimes,
  FaCheck,
  FaSpinner,
} from 'react-icons/fa';

interface PriceItem {
  id: string;
  service: string;
  duration: string[];
  price: string[];
}

interface FormData {
  service: string;
  duration: string[];
  price: string[];
}

export default function AdminPrices(): ReactElement {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [form, setForm] = useState<FormData>({
    service: '',
    duration: ['', '', '', ''],
    price: ['', '', '', ''],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth <= 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  const fetchPrices = async () => {
    setIsLoadingPrices(true);
    try {
      const res = await fetch('/api/admin/prices', { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as PriceItem[];
      setPrices(Array.isArray(data) ? data : []);
      setError('');
    } catch {
      setError('Не вдалося завантажити ціни');
      setPrices([]);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const resetForm = () => {
    setForm({ service: '', duration: ['', '', '', ''], price: ['', '', '', ''] });
    setEditingId(null);
    setFormVisible(false);
    setError('');
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index?: number,
    field?: 'duration' | 'price'
  ) => {
    if (field !== undefined && index !== undefined) {
      setForm(prev => ({
        ...prev,
        [field]: prev[field].map((v, i) => (i === index ? e.target.value : v)),
      }));
    } else {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loadingAction) return;

    const durationArr = form.duration.filter(d => d.trim());
    const priceArr = form.price.filter(p => p.trim());
    if (!durationArr.length || !priceArr.length) {
      setError('Мінімум одна пара тривалість/ціна обовʼязкова');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/prices/${editingId}` : '/api/admin/prices';

    setLoadingAction(editingId ? 'update' : 'add');
    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: form.service,
          duration: durationArr,
          price: priceArr,
        }),
      });
      if (!res.ok) throw new Error();
      resetForm();
      await fetchPrices();
    } catch {
      setError('Помилка при збереженні');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEdit = (item: PriceItem) => {
    setEditingId(item.id);
    setForm({
      service: item.service,
      duration: Array.isArray(item.duration)
        ? [...item.duration, '', '', ''].slice(0, 4)
        : [item.duration, '', '', ''],
      price: Array.isArray(item.price)
        ? [...item.price, '', '', ''].slice(0, 4)
        : [item.price, '', '', ''],
    });
    setFormVisible(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити запис?') || loadingAction) return;
    setLoadingAction(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/prices/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      await fetchPrices();
    } catch {
      setError('Помилка при видаленні');
    } finally {
      setLoadingAction(null);
    }
  };

  const moveRecord = async (id: string, dir: 'up' | 'down') => {
    if (loadingAction) return;
    setLoadingAction(`move-${id}-${dir}`);
    try {
      const res = await fetch(`/api/admin/prices/${id}/move?direction=${dir}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      await fetchPrices();
    } catch {
      setError('Помилка при переміщенні');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Адмінка: керування цінами</h1>
      {error && <div className={styles.error}>{error}</div>}

      {!editingId && (
        <button
          className={styles.toggleButton}
          onClick={() => setFormVisible(v => !v)}
          disabled={loadingAction === 'add'}
        >
          {loadingAction === 'add' ? (
            <FaSpinner className={styles.spin} />
          ) : formVisible ? (
            <>
              <FaTimes /> Сховати
            </>
          ) : (
            <>
              <FaPlus /> Додати послугу
            </>
          )}
        </button>
      )}

      {formVisible && !editingId && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="service"
            value={form.service}
            onChange={e => handleChange(e)}
            placeholder="Послуга"
            required
          />
          {form.duration.map((d, i) => (
            <div key={i} className={styles.pair}>
              <input
                type="text"
                placeholder={`Тривалість ${i + 1}`}
                value={form.duration[i]}
                onChange={e => handleChange(e, i, 'duration')}
              />
              <input
                type="text"
                placeholder={`Ціна ${i + 1}`}
                value={form.price[i]}
                onChange={e => handleChange(e, i, 'price')}
              />
            </div>
          ))}
          <div className={styles.editButtons}>
            <button type="submit" disabled={loadingAction === 'add'}>
              {loadingAction === 'add' ? (
                <FaSpinner className={styles.spin} />
              ) : (
                <>
                  <FaPlus /> Додати
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className={styles.tableWrapper}>
        {isLoadingPrices ? (
          <div className={styles.loadingWrapper}>
            <FaSpinner className={styles.spin} />
            <span className={styles.loadingText}>Завантаження даних…</span>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>Послуга</th>
                <th>Тривалість / Ціна</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, index) => (
                <tr key={item.id}>
                  <td className={styles.inlineLabel}>№ {index + 1}</td>
                  {editingId === item.id ? (
                    <td colSpan={3}>
                      <form onSubmit={handleSubmit}>
                        <input
                          type="text"
                          name="service"
                          value={form.service}
                          onChange={e => handleChange(e)}
                          placeholder="Послуга"
                          required
                          style={{ marginBottom: 8, width: '100%' }}
                        />
                        {form.duration.map((d, i) => (
                          <div key={i} className={styles.pair}>
                            <input
                              type="text"
                              placeholder={`Тривалість ${i + 1}`}
                              value={form.duration[i]}
                              onChange={e => handleChange(e, i, 'duration')}
                            />
                            <input
                              type="text"
                              placeholder={`Ціна ${i + 1}`}
                              value={form.price[i]}
                              onChange={e => handleChange(e, i, 'price')}
                            />
                          </div>
                        ))}
                        <div className={styles.actions}>
                          <button type="submit" disabled={loadingAction === 'update'}>
                            {loadingAction === 'update' ? (
                              <FaSpinner className={styles.spin} />
                            ) : (
                              <>
                                <FaCheck /> Оновити
                              </>
                            )}
                          </button>
                          <button type="button" onClick={resetForm}>
                            <FaTimes /> Скасувати
                          </button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td>{item.service}</td>
                      <td>
                        {item.duration.map((d, i) => (
                          <div key={i}>
                            {d} — {item.price[i] || ''}
                          </div>
                        ))}
                      </td>
                      <td className={styles.actions}>
                        <button
                          onClick={() => moveRecord(item.id, 'up')}
                          disabled={loadingAction === `move-${item.id}-up`}
                        >
                          {loadingAction === `move-${item.id}-up` ? (
                            <FaSpinner className={styles.spin} />
                          ) : (
                            <FaArrowUp />
                          )}
                        </button>
                        <button
                          onClick={() => moveRecord(item.id, 'down')}
                          disabled={loadingAction === `move-${item.id}-down`}
                        >
                          {loadingAction === `move-${item.id}-down` ? (
                            <FaSpinner className={styles.spin} />
                          ) : (
                            <FaArrowDown />
                          )}
                        </button>
                        <button onClick={() => handleEdit(item)}>
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={loadingAction === `delete-${item.id}`}
                        >
                          {loadingAction === `delete-${item.id}` ? (
                            <FaSpinner className={styles.spin} />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
