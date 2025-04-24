// components/notes/NotesPanel.tsx
'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import NoteForm from './NoteForm';
import NotesList from './NotesList';
import notesStyles from './Notes.module.css';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function NotesPanel() {
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    const data: Note[] = await fetch('/api/admin/notes').then(r => r.json());
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAdd = async (title: string, content: string) => {
    const res = await fetch('/api/admin/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setShowForm(false);
      await fetchNotes();
    }
  };

  const handleEdit = async (id: string, title: string, content: string) => {
    const res = await fetch('/api/admin/notes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, content }),
    });
    if (res.ok) await fetchNotes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цю нотатку?')) return;
    const res = await fetch('/api/admin/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      <button
        type="button"
        className={notesStyles.addButton}
        onClick={() => setShowForm(prev => !prev)}
        aria-label={showForm ? 'Скасувати' : 'Додати'}
      >
        {showForm ? <FaTimes /> : <FaPlus />}
      </button>

      {showForm && <NoteForm onSave={handleAdd} />}

      <NotesList notes={notes} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
