export interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  name_fa: string;
  description: string;
  description_fa: string;
  price: number;
  stock: number;
  category_id: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
  category?: Category;
}

export interface Banner {
  id: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Blog {
  id: string;
  title: string;
  title_fa: string;
  content: string;
  content_fa: string;
  image_url: string;
  author_id: string;
  created_at: string;
  author?: User;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  phone: string;
  address: string;
  zip_code: string;
  receipt_image_url: string;
  admin_note: string | null;
  delivery_date: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
  user?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export type Locale = 'en' | 'fa';
