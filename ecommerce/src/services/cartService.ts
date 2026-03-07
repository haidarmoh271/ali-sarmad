import { supabase } from '../lib/supabase';
import type { CartItem, WishlistItem } from '../types';

export const cartService = {
  async get(userId: string) {
    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        product:products(
          *,
          images:product_images(*)
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as CartItem[];
  },

  async add(userId: string, productId: string, quantity: number) {
    const { data, error } = await supabase
      .from('cart')
      .insert([{ user_id: userId, product_id: productId, quantity }])
      .select()
      .single();
    
    if (error) throw error;
    return data as CartItem;
  },

  async update(id: string, quantity: number) {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as CartItem;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async clear(userId: string) {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  },
};

export const wishlistService = {
  async get(userId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:products(
          *,
          images:product_images(*)
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as WishlistItem[];
  },

  async add(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ user_id: userId, product_id: productId }])
      .select()
      .single();
    
    if (error) throw error;
    return data as WishlistItem;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
