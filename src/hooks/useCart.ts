'use client';

import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/types';
import { getCartItems, addToCart as apiAddToCart, updateCartQuantity, removeFromCart, getCartCount } from '@/lib/api';
import { useAuth } from './useAuth';

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setCount(0);
      return;
    }

    setLoading(true);
    const data = await getCartItems(user.id);
    setItems(data);
    const cartCount = await getCartCount(user.id);
    setCount(cartCount);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    if (!user) return false;

    if (product.stock < quantity) return false;

    const success = await apiAddToCart(user.id, product.id, quantity);
    if (success) {
      await loadCart();
    }
    return success;
  }, [user, loadCart]);

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    const success = await updateCartQuantity(cartItemId, quantity);
    if (success) {
      await loadCart();
    }
    return success;
  }, [loadCart]);

  const removeItem = useCallback(async (cartItemId: string) => {
    const success = await removeFromCart(cartItemId);
    if (success) {
      await loadCart();
    }
    return success;
  }, [loadCart]);

  const total = items.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  return {
    items,
    count,
    loading,
    total,
    addItem,
    updateQuantity,
    removeItem,
    refresh: loadCart,
  };
}
