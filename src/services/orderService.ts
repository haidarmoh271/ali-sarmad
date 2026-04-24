import { supabase } from '../lib/supabase';
import type { Order } from '../types';

export const orderService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Order;
  },

  async create(order: {
    user_id: string;
    total_price: number;
    payment_method: 'cod' | 'electronic';
    payment_type?: 'paypal' | 'mastercard';
    items: Array<{ product_id: string; quantity: number; price: number }>;
  }) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: order.user_id,
        total_price: order.total_price,
        status: 'pending',
        payment_method: order.payment_method,
        payment_type: order.payment_type ?? null,
      }])
      .select()
      .single();
    
    if (orderError) throw orderError;

    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;

    return orderData as Order;
  },

  async updateStatus(id: string, status: Order['status']) {
    const updates: Record<string, unknown> = { status };

    if (status === 'processing') {
      updates.completed_at = new Date().toISOString();
    }
    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Order;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
