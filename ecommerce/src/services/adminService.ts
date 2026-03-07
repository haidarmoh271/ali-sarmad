import { supabase } from '../lib/supabase';
import type { Admin } from '../types';

export const adminService = {
  async login(email: string, password: string): Promise<Admin | null> {
    console.log('🔎 adminService.login called:', { email, password: '***' });
    
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error) {
      console.error('❌ Admin login error:', error);
      return null;
    }
    
    if (!data) {
      console.error('❌ No admin found with these credentials');
      return null;
    }

    console.log('✅ Admin found:', { id: data.id, email: data.email });
    return data as Admin;
  },

  async getById(id: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Admin;
  },

  async getAll(): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as Admin[];
  },

  async create(admin: Omit<Admin, 'id' | 'created_at'>): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .insert([admin])
      .select()
      .single();

    if (error || !data) {
      console.error('Create admin error:', error);
      return null;
    }

    return data as Admin;
  },

  async update(id: string, updates: Partial<Admin>): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Update admin error:', error);
      return null;
    }

    return data as Admin;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    return !error;
  },
};
