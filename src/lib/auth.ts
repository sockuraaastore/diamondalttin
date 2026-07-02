import { supabase } from './supabase';
import { User } from '@/types';

const ADMIN_CODE = '13911400';
const USER_STORAGE_KEY = 'diamond_altin_user';
const FIRST_VISIT_KEY = 'diamond_altin_first_visit';

export async function register(email: string, password: string, fullName: string, adminCode?: string): Promise<{ user: User | null; error: string | null }> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { user: null, error: authError.message };
  }

  if (authData.user) {
    const isAdmin = adminCode === ADMIN_CODE;

    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      is_admin: isAdmin,
    });

    if (profileError) {
      return { user: null, error: profileError.message };
    }

    const user: User = {
      id: authData.user.id,
      email,
      full_name: fullName,
      is_admin: isAdmin,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(FIRST_VISIT_KEY, 'true');

    return { user, error: null };
  }

  return { user: null, error: 'Registration failed' };
}

export async function login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { user: null, error: authError.message };
  }

  if (authData.user) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profile) {
      const user: User = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        is_admin: profile.is_admin,
        created_at: profile.created_at,
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return { user, error: null };
    }
  }

  return { user: null, error: 'Login failed' };
}

export function logout(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  supabase.auth.signOut();
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
}

export function isFirstVisit(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(FIRST_VISIT_KEY) === 'true';
}

export function markVisitComplete(): void {
  localStorage.removeItem(FIRST_VISIT_KEY);
}

export async function activateAdmin(userId: string, code: string): Promise<boolean> {
  if (code !== ADMIN_CODE) return false;

  const { error } = await supabase
    .from('users')
    .update({ is_admin: true })
    .eq('id', userId);

  if (error) return false;

  const user = getStoredUser();
  if (user) {
    user.is_admin = true;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  return true;
}
