// src/services/authService.ts
import { supabase } from './supabase';

export const signUp = async (email: string, password: string) => {
  try {
    const {user, session, error} = await supabase.auth.signUp({ 
      email, 
      password 
    });
    
    if (error) throw error;
    return {user, session};
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const {user, session, error} = await supabase.auth.signIn({ 
      email, 
      password 
    });
    
    if (error) throw error;
    return {user, password};
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // v1.35.7 uses this syntax
    const user = supabase.auth.user();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};