// src/hooks/useBibleContent.ts
import { useState, useEffect } from 'react';
import { BibleReference, Chapter } from '../types/bible';
import { getChapter } from '../services/bibleApi';
import { useAppStore } from '../store';

export const useBibleContent = (reference: BibleReference) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const currentTranslation = useAppStore(state => state.currentTranslation);
  
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO:
        // API.Bible uses abbreviations for book IDs
        // This is a simplified example - you'll need a mapping function
        const bookId = reference.book.toLowerCase();
        
        const chapterData = await getChapter(
          undefined, // Use default Bible ID
          bookId,
          reference.chapter
        );
        
        setChapter(chapterData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [reference, currentTranslation]);
  
  return { chapter, loading, error };
};