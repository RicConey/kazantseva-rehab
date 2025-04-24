// components/notes/NoteForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import notesStyles from './Notes.module.css';
import adminStyles from '@components/AdminAppointments.module.css';

type NoteFormProps = {
  onSave: (title: string, content: string) => Promise<void>;
};

export default function NoteForm({ onSave }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(title.trim(), content);
    setTitle('');
    setContent('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={notesStyles.notesForm}>
      <input
        type="text"
        placeholder="Заголовок нотатки"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={64}
        required
      />

      <textarea
        ref={textareaRef}
        placeholder="Текст нотатки"
        value={content}
        onChange={e => setContent(e.target.value)}
        maxLength={512}
        required
      />

      <span className={notesStyles.charCount}>{content.length}/512</span>

      <button
        type="submit"
        disabled={loading}
        className={`${notesStyles.saveButton} ${notesStyles.actionButton}`}
      >
        {loading ? <FaSpinner className={adminStyles.spin} /> : <FaCheck />}
      </button>
    </form>
  );
}
