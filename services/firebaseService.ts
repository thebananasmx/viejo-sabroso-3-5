import { Order, OrderStatus, Business, Category, MenuItem, User, UserRole } from '../types';

// --- MOCK DATABASE ---
let mockUsers: User[] = [
    { id: 'admin1', email: 'admin@viejosabroso.com', role: UserRole.ADMIN },
    { id: 'biz1', email: 'burger-palace@test.com', role: UserRole.BUSINESS, businessId: 'b1' },
];

let mockBusinesses: Business[] = [
    { id: 'b1', name: 'Burger Palace', slug: 'burger-palace', ownerId: 'biz1', createdAt: new Date() },
];

let mockCategories: Category[] = [
    { id: 'c1', name: 'Burgers', businessId: 'b1' },
    { id: 'c2', name: 'Sides', businessId: 'b1' },
    { id: 'c3', name: 'Drinks', businessId: 'b1' },
];

let mockMenuItems: MenuItem[] = [
    { id: 'm1', name: 'Classic Burger', description: 'A juicy beef patty with lettuce, tomato, and our special sauce.', price: 12.99, imageUrl: 'https://picsum.photos/400/300?random=1', categoryId: 'c1', businessId: 'b1' },
    { id: 'm2', name: 'Cheese Burger', description: 'Our classic burger with a slice of sharp cheddar cheese.', price: 13.99, imageUrl: 'https://picsum.photos/400/300?random=2', categoryId: 'c1', businessId: 'b1' },
    { id: 'm3', name: 'French Fries', description: 'Crispy golden french fries, lightly salted.', price: 4.99, imageUrl: 'https://picsum.photos/400/300?random=3', categoryId: 'c2', businessId: 'b1' },
    { id: 'm4', name: 'Cola', description: 'A refreshing can of cola.', price: 2.50, imageUrl: 'https://picsum.photos/400/300?random=4', categoryId: 'c3', businessId: 'b1' },
];

let mockOrders: Order[] = [
    { id: 'o1', businessId: 'b1', tableNumber: 5, items: [{ menuItemId: 'm1', name: 'Classic Burger', quantity: 2, price: 12.99 }], total: 25.98, status: OrderStatus.PENDING, createdAt: new Date(Date.now() - 5 * 60000) },
    { id: 'o2', businessId: 'b1', tableNumber: 2, items: [{ menuItemId: 'm2', name: 'Cheese Burger', quantity: 1, price: 13.99 }, { menuItemId: 'm3', name: 'French Fries', quantity: 1, price: 4.99 }], total: 18.98, status: OrderStatus.IN_PREPARATION, createdAt: new Date(Date.now() - 3 * 60000) },
    { id: 'o3', businessId: 'b1', tableNumber: 8, items: [{ menuItemId: 'm4', name: 'Cola', quantity: 4, price: 2.50 }], total: 10.00, status: OrderStatus.READY, createdAt: new Date(Date.now() - 1 * 60000) },
];
// --- END MOCK DATABASE ---

const mockApi = <T,>(data: T, delay = 500): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

const mockApiError = (message: string, delay = 500): Promise<any> =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delay));

// --- MOCK SERVICES ---
export const firebaseService = {
  // Auth
  login: (email: string, pass: string): Promise<User> => {
    console.log(`Attempting login for ${email}`);
    const user = mockUsers.find(u => u.email === email);
    if (user) {
        return mockApi(user);
    }
    return mockApiError('User not found or password incorrect');
  },
  registerBusiness: (businessName: string, email: string, pass: string): Promise<{user: User, business: Business}> => {
      const slug = businessName.toLowerCase().replace(/\s+/g, '-');
      if (mockBusinesses.some(b => b.slug === slug)) {
          return mockApiError('Business name already taken.');
      }
      const newBusinessId = `b${mockBusinesses.length + 1}`;
      const newUserId = `biz${mockUsers.length + 1}`;

      const newUser: User = { id: newUserId, email, role: UserRole.BUSINESS, businessId: newBusinessId };
      const newBusiness: Business = { id: newBusinessId, name: businessName, slug, ownerId: newUserId, createdAt: new Date() };

      mockUsers.push(newUser);
      mockBusinesses.push(newBusiness);

      return mockApi({ user: newUser, business: newBusiness });
  },
  logout: (): Promise<void> => mockApi(undefined),
  getCurrentUser: (): Promise<User | null> => {
      // In a real app, this would check session/token. We'll simulate being logged in as the test business.
      const user = mockUsers.find(u => u.role === UserRole.BUSINESS);
      return mockApi(user || null);
  },

  // Business Data
  getBusinessBySlug: (slug: string): Promise<Business | null> => {
      const business = mockBusinesses.find(b => b.slug === slug);
      return mockApi(business || null);
  },
  getMenu: (businessId: string): Promise<{ categories: Category[], items: MenuItem[] }> => {
      const categories = mockCategories.filter(c => c.businessId === businessId);
      const items = mockMenuItems.filter(i => i.businessId === businessId);
      return mockApi({ categories, items });
  },
  addMenuItem: (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
      const newItem: MenuItem = { ...item, id: `m${mockMenuItems.length + 1}`};
      mockMenuItems.push(newItem);
      return mockApi(newItem);
  },
  updateMenuItem: (item: MenuItem): Promise<MenuItem> => {
      const index = mockMenuItems.findIndex(i => i.id === item.id);
      if (index > -1) {
        mockMenuItems[index] = item;
        return mockApi(item);
      }
      return mockApiError('Item not found');
  },
  deleteMenuItem: (itemId: string): Promise<void> => {
      mockMenuItems = mockMenuItems.filter(i => i.id !== itemId);
      return mockApi(undefined);
  },

  // Orders
  getOrders: (businessId: string): Promise<Order[]> => {
      const orders = mockOrders.filter(o => o.businessId === businessId);
      return mockApi(orders);
  },
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
      const newOrder: Order = {
          ...order,
          id: `o${mockOrders.length + 1}`,
          createdAt: new Date(),
          status: OrderStatus.PENDING,
      };
      mockOrders.push(newOrder);
      // Simulate real-time update for kitchen
      window.dispatchEvent(new CustomEvent('mock-order-added', { detail: newOrder }));
      return mockApi(newOrder);
  },
  updateOrderStatus: (orderId: string, status: OrderStatus): Promise<Order> => {
      const order = mockOrders.find(o => o.id === orderId);
      if (order) {
          order.status = status;
          // Simulate real-time update for kitchen
          window.dispatchEvent(new CustomEvent('mock-order-updated', { detail: order }));
          return mockApi(order);
      }
      return mockApiError('Order not found');
  },
  
  // Admin
  getAllBusinesses: (): Promise<Business[]> => mockApi(mockBusinesses),
  getBusinessMetrics: (businessId: string): Promise<{totalOrders: number, totalRevenue: number}> => {
      const orders = mockOrders.filter(o => o.businessId === businessId && o.status === OrderStatus.COMPLETED);
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      return mockApi({ totalOrders: orders.length, totalRevenue });
  }
};