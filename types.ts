
export enum UserRole {
  BUSINESS = 'business',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  businessId?: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: Date;
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
  PENDING = 'PENDING',
  IN_PREPARATION = 'IN_PREPARATION',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
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
  createdAt: Date;
}
