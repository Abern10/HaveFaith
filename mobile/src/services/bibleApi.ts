// src/services/bibleApi.ts
import axios from 'axios';
import { BIBLE_API_KEY, BIBLE_API_URL, DEFAULT_BIBLE_ID } from '@env';
import { BibleReference, Verse, Chapter, BibleBook } from '../types/bible';

// Default Bible version (ESV)
const bibleApi = axios.create({
  baseURL: BIBLE_API_URL,
  headers: {
    'api-key': BIBLE_API_KEY,
  },
});

// Get all available Bible versions
export const getBibleVersions = async () => {
  try {
    const response = await bibleApi.get('/bibles');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Bible versions:', error);
    throw error;
  }
};

// Get all books for a specific Bible version
export const getBooks = async (bibleId = DEFAULT_BIBLE_ID) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/books`);
    
    const books: BibleBook[] = [];
    
    for (const book of response.data.data) {
      try {
        const bookDetails = await bibleApi.get(
          `/bibles/${bibleId}/books/${book.id}/chapters`
        );
        
        books.push({
          id: book.id,
          name: book.name,
          abbreviation: book.abbreviation || '',
          chapters: bookDetails.data.data.length - 1
        });
      } catch (err) {
        console.error(`Error getting chapters for ${book.name}:`, err);
        books.push({
          id: book.id,
          name: book.name,
          abbreviation: book.abbreviation || '',
          chapters: 0
        });
      }
    }
    
    return books;
  } catch (error) {
    console.error('Error fetching Bible books:', error);
    throw error;
  }
};

// Get chapter content
export const getChapter = async (
  bookId: string,
  chapterNumber: number,
  bibleId = DEFAULT_BIBLE_ID
) => {
  try {
    // First try the chapter endpoint
    const response = await bibleApi.get(
      `/bibles/${bibleId}/chapters/${bookId}.${chapterNumber}`
    );
    
    // Parse content
    const chapterData = response.data.data;
    
    // We need to get the content, which is a separate call
    const contentResponse = await bibleApi.get(
      `/bibles/${bibleId}/chapters/${bookId}.${chapterNumber}/verses`
    );
    
    // Format verses
    const verses = contentResponse.data.data.map((v: any) => ({
      number: parseInt(v.id.split('.')[2]),
      text: v.content
    }));
    
    return {
      number: chapterNumber,
      verses
    };
  } catch (error) {
    console.error('Error fetching chapter:', error);
    throw error;
  }
};

// Get a specific verse from a Bible version
export const getVerse = async (
  bibleId = DEFAULT_BIBLE_ID,
  bookId: string,
  chapterNumber: number,
  verseNumber: number
) => {
  try {
    const response = await bibleApi.get(
      `/bibles/${bibleId}/verses/${bookId}.${chapterNumber}.${verseNumber}`
    );
    return response.data.data as Verse;
  } catch (error) {
    console.error('Error fetching verse:', error);
    throw error;
  }
};

// Search Bible
export const searchBible = async (
  query: string,
  bibleId = DEFAULT_BIBLE_ID,
  limit = 20
) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/search`, {
      params: { query, limit }
    });
    return response.data.data.verses;
  } catch (error) {
    console.error('Error searching Bible:', error);
    throw error;
  }
};