import { supabase } from '../lib/supabase';
import type { Category } from '../types';

export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Category[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async create(category: Omit<Category, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async update(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async checkProductsExist(categoryId: string): Promise<{ hasProducts: boolean; count: number }> {
    const { error, count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: false })
      .eq('category_id', categoryId);
    
    if (error) {
      console.error('Error checking products:', error);
      return { hasProducts: false, count: 0 };
    }
    
    return {
      hasProducts: (count || 0) > 0,
      count: count || 0
    };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
