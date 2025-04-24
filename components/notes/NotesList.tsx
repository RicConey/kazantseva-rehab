// components/notes/NotesList.tsx
'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaSpinner, FaTimes } from 'react-icons/fa';
import notesStyles from './Notes.module.css';
import adminStyles from '@components/AdminAppointments.module.css';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type NotesListProps = {
  notes: Note[];
  loading: boolean;
  onEdit: (id: string, title: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotesList({ notes, loading, onEdit, onDelete }: NotesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditForm({ title: note.title, content: note.content });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSavingId(editingId);
    await onEdit(editingId, editForm.title, editForm.content);
    setSavingId(null);
    setEditingId(null);
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Видалити цю нотатку?')) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (loading) return <p>Завантаження…</p>;
  if (notes.length === 0) return <p>Немає жодної нотатки.</p>;

  return (
    <ul className={notesStyles.notesList}>
      {notes.map(n => (
        <li key={n.id} className={notesStyles.notesListItem}>
          {editingId === n.id ? (
            <div className={notesStyles.notesForm}>
              <input
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Заголовок нотатки"
                maxLength={64}
              />
              <textarea
                ref={el => {
                  if (el) {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                  }
                }}
                value={editForm.content}
                onChange={e => {
                  setEditForm({ ...editForm, content: e.currentTarget.value });
                  const ta = e.currentTarget;
                  ta.style.height = 'auto';
                  ta.style.height = ta.scrollHeight + 'px';
                }}
                placeholder="Текст нотатки"
                maxLength={512}
                required
              />
              <span className={notesStyles.charCount}>{editForm.content.length}/512</span>
              <div className={notesStyles.noteActions}>
                <button
                  type="button"
                  disabled={savingId === n.id}
                  className={`${notesStyles.saveButton} ${notesStyles.actionButton}`}
                  onClick={saveEdit}
                >
                  {savingId === n.id ? <FaSpinner className={adminStyles.spin} /> : <FaCheck />}
                </button>
                <button
                  type="button"
                  disabled={savingId === n.id}
                  className={`${notesStyles.cancelButton} ${notesStyles.actionButton}`}
                  onClick={cancelEdit}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3>{n.title}</h3>
              <p className={notesStyles.notesContent}>{n.content}</p>
              <span className={notesStyles.notesMeta}>Створено: {formatDate(n.createdAt)}</span>
              {n.updatedAt !== n.createdAt && (
                <span className={notesStyles.notesMeta}>Оновлено: {formatDate(n.updatedAt)}</span>
              )}
              <div className={notesStyles.noteActions}>
                <button
                  type="button"
                  className={`${notesStyles.editButton} ${notesStyles.actionButton}`}
                  onClick={() => startEdit(n)}
                  disabled={deletingId === n.id || savingId === n.id}
                >
                  {savingId === n.id ? <FaSpinner className={adminStyles.spin} /> : <FaEdit />}
                </button>
                <button
                  type="button"
                  disabled={deletingId === n.id}
                  className={`${notesStyles.deleteButton} ${notesStyles.actionButton}`}
                  onClick={() => deleteNote(n.id)}
                >
                  {deletingId === n.id ? <FaSpinner className={adminStyles.spin} /> : <FaTrash />}
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
