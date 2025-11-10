
// FIX: Switched to Firebase v8 compatible imports
import { db, auth, Timestamp } from '../firebaseConfig';
import { Order, OrderStatus, Business, Category, MenuItem, User, UserRole } from '../types';

// Helper to convert Firestore Timestamps to serializable strings (ISO)
const convertDocTimestamps = (documentData: any) => {
    const data = { ...documentData };
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        }
    }
    return data;
}

export const firebaseService = {
  // Auth
  login: async (email: string, pass: string): Promise<User> => {
    // FIX: Use v8 signInWithEmailAndPassword
    const userCredential = await auth.signInWithEmailAndPassword(email, pass);
    // FIX: Use v8 doc and get
    const userDocRef = db.collection('users').doc(userCredential.user!.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      throw new Error("Datos del usuario no encontrados en Firestore.");
    }
    // FIX: Spread types may only be created from object types. Using Object.assign for robustness.
    return Object.assign({ id: userDoc.id }, userDoc.data()) as User;
  },

  registerBusiness: async (businessName: string, email: string, pass: string): Promise<{user: User, business: Business}> => {
      const slug = businessName.toLowerCase().replace(/\s+/g, '-');
      
      // FIX: Use v8 where, limit, and get
      const businessesRef = db.collection("businesses");
      const q = businessesRef.where("slug", "==", slug).limit(1);
      const querySnapshot = await q.get();
      if (!querySnapshot.empty) {
          throw new Error('El nombre del negocio ya está en uso.');
      }
      
      // FIX: Use v8 createUserWithEmailAndPassword
      const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
      const user = userCredential.user!;

      // FIX: Use v8 batch
      const batch = db.batch();
      
      // FIX: Use v8 doc() to create a new doc with an auto-generated ID
      const businessDocRef = db.collection("businesses").doc();
      const newBusinessData = { 
          name: businessName, 
          slug, 
          ownerId: user.uid, 
          createdAt: new Date().toISOString(),
      };
      batch.set(businessDocRef, newBusinessData);

      // FIX: Use v8 doc()
      const userDocRef = db.collection('users').doc(user.uid);
      const newUser: Omit<User, 'id'> = { 
          email: user.email!, 
          role: UserRole.BUSINESS, 
          businessId: businessDocRef.id 
      };
      batch.set(userDocRef, newUser);

      await batch.commit();

      const newBusiness: Business = { id: businessDocRef.id, ...newBusinessData };

      return {
          user: { id: user.uid, ...newUser },
          business: newBusiness
      };
  },

  registerAdmin: async (email: string, pass: string): Promise<User> => {
    // FIX: Use v8 createUserWithEmailAndPassword
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    const user = userCredential.user;

    // FIX: Use v8 doc and set
    const userDocRef = db.collection('users').doc(user.uid);
    const newUser: Omit<User, 'id'> = {
      email: user.email!,
      role: UserRole.ADMIN,
    };
    await userDocRef.set(newUser);

    return { id: user.uid, ...newUser };
  },

  // FIX: Use v8 signOut
  logout: (): Promise<void> => auth.signOut(),

  getUserProfile: async (uid: string): Promise<User | null> => {
      // FIX: Use v8 doc and get
      const userDocRef = db.collection('users').doc(uid);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
          // FIX: Spread types may only be created from object types. Using Object.assign for robustness.
          return Object.assign({ id: uid }, userDoc.data()) as User;
      }
      return null;
  },
  
  // Business Data
  getBusinessBySlug: async (slug: string): Promise<Business | null> => {
      // FIX: Use v8 query chain
      const q = db.collection("businesses").where("slug", "==", slug).limit(1);
      const snapshot = await q.get();
      if (snapshot.empty) return null;
      const docData = snapshot.docs[0].data();
      return { id: snapshot.docs[0].id, ...convertDocTimestamps(docData) } as Business;
  },
  
  getBusinessById: async (id: string): Promise<Business | null> => {
      // FIX: Use v8 doc and get
      const businessDocRef = db.collection('businesses').doc(id);
      const businessDoc = await businessDocRef.get();
      if (businessDoc.exists) {
          return { id, ...convertDocTimestamps(businessDoc.data()) } as Business;
      }
      return null;
  },

  updateBusinessDetails: async (businessId: string, details: Partial<Business>): Promise<void> => {
      // FIX: Use v8 doc and update
      const businessDocRef = db.collection('businesses').doc(businessId);
      await businessDocRef.update(details);
  },
  
  getMenu: async (businessId: string): Promise<{ categories: Category[], items: MenuItem[] }> => {
      // FIX: Use v8 query chain and get
      const categoriesQuery = db.collection("categories").where("businessId", "==", businessId);
      const itemsQuery = db.collection("menuItems").where("businessId", "==", businessId);

      const [categoriesSnapshot, itemsSnapshot] = await Promise.all([
          categoriesQuery.get(),
          itemsQuery.get()
      ]);

      // FIX: Spread types may only be created from object types. Using Object.assign for robustness.
      const categories = categoriesSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()) as Category);
      // FIX: Spread types may only be created from object types. Using Object.assign for robustness.
      const items = itemsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()) as MenuItem);
      
      return { categories, items };
  },

  addMenuItem: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
      // FIX: Use v8 add
      const docRef = await db.collection("menuItems").add(item);
      return { ...item, id: docRef.id };
  },

  updateMenuItem: async (item: MenuItem): Promise<MenuItem> => {
      const { id, ...itemData } = item;
      // FIX: Use v8 doc and update
      const docRef = db.collection("menuItems").doc(id);
      await docRef.update({ ...itemData });
      return item;
  },

  deleteMenuItem: (itemId: string): Promise<void> => {
      // FIX: Use v8 doc and delete
      const docRef = db.collection("menuItems").doc(itemId);
      return docRef.delete();
  },

  addCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
      // FIX: Use v8 add
      const docRef = await db.collection("categories").add(category);
      return { ...category, id: docRef.id };
  },

  updateCategory: async (category: Category): Promise<Category> => {
      const { id, ...categoryData } = category;
      // FIX: Use v8 doc and update
      const docRef = db.collection("categories").doc(id);
      await docRef.update({ ...categoryData });
      return category;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
      // FIX: Use v8 batch
      const batch = db.batch();

      // 1. Delete the category itself
      const categoryRef = db.collection("categories").doc(categoryId);
      batch.delete(categoryRef);

      // 2. Find and delete all menu items in that category
      // FIX: Use v8 query and get
      const itemsQuery = db.collection("menuItems").where("categoryId", "==", categoryId);
      const itemsSnapshot = await itemsQuery.get();
      itemsSnapshot.forEach(document => {
          batch.delete(document.ref);
      });

      // 3. Commit the batch
      await batch.commit();
  },

  // Orders
  onOrdersUpdate: (businessId: string, callback: (orders: Order[]) => void): () => void => {
    // This query is more efficient as it filters on the server.
    // NOTE: This may require a composite index in Firestore. If orders are not appearing,
    // check the browser's developer console for a Firestore error message with a link to create the required index.
    // FIX: Use v8 query chain
    const q = db.collection("orders")
        .where("businessId", "==", businessId)
        .where("status", "in", [OrderStatus.PENDING, OrderStatus.IN_PREPARATION, OrderStatus.READY]);

    // FIX: Use v8 onSnapshot
    const unsubscribe = q.onSnapshot(
        (querySnapshot) => {
            // No need to filter by status client-side anymore.
            const orders = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...convertDocTimestamps(doc.data()) } as Order))
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // oldest first
            
            callback(orders);
        },
        (error) => {
            // Log any errors from Firestore, which is helpful for debugging index issues.
            console.error("Error listening to kitchen orders: ", error);
        }
    );

    return unsubscribe;
  },

  onAllOrdersUpdate: (businessId: string, callback: (orders: Order[]) => void): () => void => {
    // FIX: Use v8 query chain
    const q = db.collection("orders")
        .where("businessId", "==", businessId);
    
    // FIX: Use v8 onSnapshot
    const unsubscribe = q.onSnapshot(
        (querySnapshot) => {
            const orders = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...convertDocTimestamps(doc.data()) } as Order));
            
            callback(orders);
        },
        (error) => {
            console.error("Error listening to all orders: ", error);
        }
    );

    return unsubscribe;
  },
  
  getOrders: async (businessId: string): Promise<Order[]> => {
      // FIX: Use v8 query chain and get
      const q = db.collection("orders").where("businessId", "==", businessId);
      const snapshot = await q.get();
      return snapshot.docs.map(d => ({id: d.id, ...convertDocTimestamps(d.data())} as Order));
  },
  
  placeOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const newOrderData = {
        ...orderData,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('orders').add(newOrderData);
    return {
        ...newOrderData,
        id: docRef.id,
    };
  },

  updateOrderStatus: (orderId: string, status: OrderStatus): Promise<void> => {
      // FIX: Use v8 doc and update
      const docRef = db.collection("orders").doc(orderId);
      return docRef.update({ status });
  },
  
  // Admin
  getAllBusinesses: async (): Promise<Business[]> => {
      // FIX: Use v8 get
      const snapshot = await db.collection('businesses').get();
      return snapshot.docs.map(d => ({id: d.id, ...convertDocTimestamps(d.data())} as Business));
  },

  getBusinessMetrics: async (businessId: string): Promise<{totalOrders: number, totalRevenue: number}> => {
      // FIX: Use v8 query chain and get
      const q = db.collection("orders")
          .where("businessId", "==", businessId)
          .where("status", "==", OrderStatus.COMPLETED);
      const snapshot = await q.get();
      const orders = snapshot.docs.map(d => d.data() as Order);
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      return { totalOrders: orders.length, totalRevenue };
  }
};