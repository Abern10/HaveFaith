// src/types/bible.ts

// Bible translation type
export type BibleTranslation = 'ESV' | 'NIV' | 'KJV' | 'NKJV' | 'NLT';

// Bible book structure
export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  abbreviation: string;
}

// Chapter structure
export interface Chapter {
  number: number;
  verses: Verse[];
}

// Verse structure
export interface Verse {
  number: number;
  text: string;
}

// Bible reference structure
export interface BibleReference {
  book: string;
  chapter: number;
  verse?: number;
  endVerse?: number;
}

// User's Bible interaction data
export interface UserBibleData {
  lastRead: BibleReference;
  bookmarks: BibleReference[];
  highlights: {
    reference: BibleReference;
    color: string;
    note?: string;
  }[];
  readingPlans: {
    id: string;
    name: string;
    progress: number;
  }[];
}