'use client';

import React, { useState, useEffect } from 'react';
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
import BackButton from '../../../components/BackButton';

export default function AdminPrices() {
  const [prices, setPrices] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    service: '',
    duration: ['', '', '', ''],
    price: ['', '', '', ''],
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);

  // Загрузка списка цен
  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/admin/prices', {
        credentials: 'include',
      });
      if (!res.ok) {
        if (res.status === 401) {
          setError('Доступ заборонений. Зайдіть як адмін.');
        } else {
          setError(`Помилка завантаження: HTTP ${res.status}`);
        }
        setPrices([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        setError('Невірний формат даних від сервера');
        setPrices([]);
        return;
      }
      setPrices(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Не вдалося завантажити ціни');
      setPrices([]);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // Сброс формы
  const resetForm = () => {
    setForm({
      service: '',
      duration: ['', '', '', ''],
      price: ['', '', '', ''],
    });
    setEditingId(null);
    setFormVisible(false);
    setError('');
  };

  // Обработка изменений полей формы
  const handleChange = (e, index = null, field = null) => {
    if (field != null && index != null) {
      setForm(prev => ({
        ...prev,
        [field]: prev[field].map((val, i) => (i === index ? e.target.value : val)),
      }));
    } else {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  // Отправка формы (добавление или обновление)
  const handleSubmit = async e => {
    e.preventDefault();
    if (loadingAction) return;

    const durationArr = form.duration.filter(d => d.trim() !== '');
    const priceArr = form.price.filter(p => p.trim() !== '');
    if (durationArr.length === 0 || priceArr.length === 0) {
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
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      resetForm();
      await fetchPrices();
    } catch (err) {
      console.error(err);
      setError('Помилка при збереженні');
    } finally {
      setLoadingAction(null);
    }
  };

  // Редактирование существующей записи
  const handleEdit = item => {
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

  // Удаление записи
  const handleDelete = async id => {
    if (!confirm('Ви впевнені, що хочете видалити запис?')) return;
    if (loadingAction) return;

    setLoadingAction(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/prices/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchPrices();
    } catch (err) {
      console.error(err);
      setError('Помилка при видаленні');
    } finally {
      setLoadingAction(null);
    }
  };

  // Перемещение записи
  const moveRecord = async (id, direction) => {
    if (loadingAction) return;

    setLoadingAction(`move-${id}-${direction}`);
    try {
      const res = await fetch(`/api/admin/prices/${id}/move?direction=${direction}`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchPrices();
    } catch (err) {
      console.error(err);
      setError('Помилка при переміщенні');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className={styles.container}>
      <BackButton />

      <h1 className={styles.title}>Адмінка: керування цінами</h1>
      {error && <div className={styles.error}>{error}</div>}

      {!editingId && (
        <button className={styles.toggleButton} onClick={() => setFormVisible(v => !v)}>
          {formVisible ? (
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
            onChange={handleChange}
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
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
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
                        onChange={handleChange}
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
                      {Array.isArray(item.duration) && Array.isArray(item.price) ? (
                        item.duration.map((d, i) => (
                          <div key={i}>
                            {d} — {item.price[i] || ''}
                          </div>
                        ))
                      ) : (
                        <div>
                          {item.duration} — {item.price}
                        </div>
                      )}
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
      </div>

      <BackButton />
    </div>
  );
}
