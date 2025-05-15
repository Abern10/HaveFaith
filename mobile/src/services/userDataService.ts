// src/services/userDataService.ts
import { supabase } from './supabase';
import { BibleReference, UserBibleData } from '../types/bible';

// Get user's Bible data
export const getUserBibleData = async (userId: string): Promise<UserBibleData | null> => {
  try {
    const { data, error } = await supabase
      .from('user_bible_data')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user Bible data:', error);
    return null;
  }
};

// Update last read position
export const updateLastRead = async (
  userId: string, 
  reference: BibleReference
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_bible_data')
      .update({ last_read: reference })
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating last read:', error);
    throw error;
  }
};

// Add bookmark
export const addBookmark = async (
  userId: string, 
  reference: BibleReference
): Promise<void> => {
  try {
    const { data: userData } = await supabase
      .from('user_bible_data')
      .select('bookmarks')
      .eq('user_id', userId)
      .single();
    
    const bookmarks = userData?.bookmarks || [];
    
    const { error } = await supabase
      .from('user_bible_data')
      .update({ 
        bookmarks: [...bookmarks, reference] 
      })
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

// Remove bookmark
export const removeBookmark = async (
  userId: string, 
  reference: BibleReference
): Promise<void> => {
  try {
    const { data: userData } = await supabase
      .from('user_bible_data')
      .select('bookmarks')
      .eq('user_id', userId)
      .single();
    
    const bookmarks = userData?.bookmarks || [];
    const filtered = bookmarks.filter((b: BibleReference) => 
    !(b.book === reference.book && 
        b.chapter === reference.chapter && 
        b.verse === reference.verse)
    );
    
    const { error } = await supabase
      .from('user_bible_data')
      .update({ bookmarks: filtered })
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

// Add highlight
export const addHighlight = async (
  userId: string,
  reference: BibleReference,
  color: string,
  note?: string
): Promise<void> => {
  try {
    const { data: userData } = await supabase
      .from('user_bible_data')
      .select('highlights')
      .eq('user_id', userId)
      .single();
    
    const highlights = userData?.highlights || [];
    
    const { error } = await supabase
      .from('user_bible_data')
      .update({ 
        highlights: [...highlights, { reference, color, note }] 
      })
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error adding highlight:', error);
    throw error;
  }
};