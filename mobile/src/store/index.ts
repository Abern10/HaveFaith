// src/store/index.ts
import { create } from 'zustand';
import { BibleReference, UserBibleData, BibleTranslation } from '../types/bible';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  userId: string | null;
  
  // Bible reading state
  currentTranslation: BibleTranslation;
  currentReference: BibleReference;
  
  // User data
  userData: UserBibleData | null;
  
  // UI state
  fontSize: number;
  
  // Actions
  setAuthenticated: (isAuthenticated: boolean, userId: string | null) => void;
  setCurrentTranslation: (translation: BibleTranslation) => void;
  setCurrentReference: (reference: BibleReference) => void;
  setUserData: (userData: UserBibleData | null) => void;
  setFontSize: (size: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isAuthenticated: false,
  userId: null,
  currentTranslation: 'ESV',
  currentReference: {
    book: 'John',
    chapter: 1,
    verse: 1
  },
  userData: null,
  fontSize: 16,
  
  // Actions
  setAuthenticated: (isAuthenticated, userId) => 
    set({ isAuthenticated, userId }),
  
  setCurrentTranslation: (translation) => 
    set({ currentTranslation: translation }),
  
  setCurrentReference: (reference) => 
    set({ currentReference: reference }),
  
  setUserData: (userData) => 
    set({ userData }),
  
  setFontSize: (fontSize) => 
    set({ fontSize })
}));