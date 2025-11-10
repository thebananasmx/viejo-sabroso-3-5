export enum UserRole {
  BUSINESS = 'business',
  ADMIN = 'admin',
}

export interface User {
  id: string; // This will be the Firebase Auth UID
  email: string;
  role: UserRole;
  businessId?: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerId: string; // Firebase Auth UID of the owner
  createdAt: string; // ISO string date
  logoUrl?: string;
  orderCounter?: number;
}

export interface Category {
  id: string;
  name: string;
  businessId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  businessId: string;
}

export enum OrderStatus {
  PENDING = 'PENDIENTE',
  IN_PREPARATION = 'EN PREPARACIÓN',
  READY = 'LISTO',
  COMPLETED = 'COMPLETADO',
  CANCELED = 'CANCELADO',
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  businessId: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string date
  orderNumber: number;
}
