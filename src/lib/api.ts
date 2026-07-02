import { supabase } from './supabase';
import { Product, Category, Banner, SupportTicket, Blog, CartItem, Order, OrderItem } from '@/types';

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function createCategory(name: string, name_fa: string, slug: string): Promise<boolean> {
  const { error } = await supabase.from('categories').insert({ name, name_fa, slug });
  return !error;
}

export async function updateCategory(id: string, name: string, name_fa: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .update({ name, name_fa })
    .eq('id', id);

  return !error;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  return !error;
}

// ==================== PRODUCTS ====================

export async function getProducts(categoryId?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,name_fa.ilike.%${query}%,description_fa.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase.from('products').insert({
    name: product.name,
    name_fa: product.name_fa,
    description: product.description,
    description_fa: product.description_fa,
    price: product.price,
    stock: product.stock,
    category_id: product.category_id,
    image_url: product.image_url,
    is_featured: product.is_featured,
  });

  return !error;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id);

  return !error;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  return !error;
}

export async function decreaseStock(productId: string, quantity: number): Promise<boolean> {
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', productId)
    .single();

  if (fetchError || !product) return false;

  const newStock = product.stock - quantity;
  if (newStock < 0) return false;

  const { error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId);

  return !error;
}

// ==================== BANNERS ====================

export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching banners:', error);
    return [];
  }

  return data || [];
}

export async function getAllBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching banners:', error);
    return [];
  }

  return data || [];
}

export async function createBanner(imageUrl: string): Promise<boolean> {
  const { error } = await supabase.from('banners').insert({ image_url: imageUrl, is_active: true });
  return !error;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);

  return !error;
}

export async function toggleBanner(id: string, isActive: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('banners')
    .update({ is_active: isActive })
    .eq('id', id);

  return !error;
}

export async function uploadImage(file: File, bucket: string): Promise<string | null> {
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// ==================== CART ====================

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cart:', error);
    return [];
  }

  return data || [];
}

export async function addToCart(userId: string, productId: string, quantity: number = 1): Promise<boolean> {
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
    return !error;
  }

  const { error } = await supabase.from('cart_items').insert({
    user_id: userId,
    product_id: productId,
    quantity,
  });

  return !error;
}

export async function updateCartQuantity(cartItemId: string, quantity: number): Promise<boolean> {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId);

  return !error;
}

export async function removeFromCart(cartItemId: string): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  return !error;
}

export async function clearCart(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  return !error;
}

export async function getCartCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) return 0;
  return count || 0;
}

// ==================== ORDERS ====================

export async function createOrder(
  userId: string,
  phone: string,
  address: string,
  zipCode: string,
  receiptImageUrl: string,
  items: { product_id: string; quantity: number; price: number }[]
): Promise<string | null> {
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      phone,
      address,
      zip_code: zipCode,
      receipt_image_url: receiptImageUrl,
      total_amount: totalAmount,
      status: 'pending',
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Error creating order:', orderError);
    return null;
  }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return null;
  }

  await clearCart(userId);

  return order.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

export async function getUserPurchases(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .eq('user_id', userId)
    .in('status', ['approved', 'delivered'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching purchases:', error);
    return [];
  }

  return data || [];
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, user:users(*), items:order_items(*, product:products(*))')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }

  return data || [];
}

export async function updateOrderStatus(
  orderId: string,
  status: 'approved' | 'rejected' | 'delivered',
  adminNote?: string,
  deliveryDate?: string
): Promise<boolean> {
  const updateData: Record<string, unknown> = {
    status,
    admin_note: adminNote || null,
    delivery_date: deliveryDate || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order:', error);
    return false;
  }

  if (status === 'approved') {
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', orderId);

    if (orderItems) {
      for (const item of orderItems) {
        await decreaseStock(item.product_id, item.quantity);
      }
    }
  }

  return true;
}

// ==================== SUPPORT TICKETS ====================

export async function createTicket(userId: string, subject: string, description: string): Promise<boolean> {
  const { error } = await supabase.from('support_tickets').insert({
    user_id: userId,
    subject,
    description,
    status: 'open',
  });

  return !error;
}

export async function getUserTickets(userId: string): Promise<SupportTicket[]> {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }

  return data || [];
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, user:users(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }

  return data || [];
}

export async function replyToTicket(ticketId: string, reply: string): Promise<boolean> {
  const { error } = await supabase
    .from('support_tickets')
    .update({ admin_reply: reply, status: 'closed' })
    .eq('id', ticketId);

  return !error;
}

// ==================== BLOGS ====================

export async function getBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*, author:users(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }

  return data || [];
}
