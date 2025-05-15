// src/hooks/useBibleBooks.ts
import { useState, useEffect } from 'react';
import { BibleBook } from '../types/bible';
import { getBooks } from '../services/bibleApi';

export const useBibleBooks = () => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);

  return { books, loading, error };
};