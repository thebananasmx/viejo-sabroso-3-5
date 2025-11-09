import firebase from 'firebase/app';
import 'firebase/firestore';

import { db, auth, storage, Timestamp } from '../firebaseConfig';
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
    const userCredential = await auth.signInWithEmailAndPassword(email, pass);
    const userDocRef = db.collection('users').doc(userCredential.user!.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      throw new Error("User data not found in Firestore.");
    }
    return { id: userDoc.id, ...userDoc.data() } as User;
  },

  registerBusiness: async (businessName: string, email: string, pass: string): Promise<{user: User, business: Business}> => {
      const slug = businessName.toLowerCase().replace(/\s+/g, '-');
      
      const businessesRef = db.collection("businesses");
      const q = businessesRef.where("slug", "==", slug).limit(1);
      const querySnapshot = await q.get();
      if (!querySnapshot.empty) {
          throw new Error('Business name already taken.');
      }
      
      const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
      const user = userCredential.user!;

      const batch = db.batch();
      
      const businessDocRef = db.collection("businesses").doc();
      const newBusinessData = { 
          name: businessName, 
          slug, 
          ownerId: user.uid, 
          createdAt: new Date().toISOString() 
      };
      batch.set(businessDocRef, newBusinessData);

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

  logout: (): Promise<void> => auth.signOut(),

  getUserProfile: async (uid: string): Promise<User | null> => {
      const userDocRef = db.collection('users').doc(uid);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
          return { id: uid, ...userDoc.data() } as User;
      }
      return null;
  },
  
  // Image Upload
  uploadImage: async (file: File, path: string): Promise<string> => {
      const storageRef = storage.ref(path);
      const snapshot = await storageRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
  },

  // Business Data
  getBusinessBySlug: async (slug: string): Promise<Business | null> => {
      const q = db.collection("businesses").where("slug", "==", slug).limit(1);
      const snapshot = await q.get();
      if (snapshot.empty) return null;
      const docData = snapshot.docs[0].data();
      return { id: snapshot.docs[0].id, ...convertDocTimestamps(docData) } as Business;
  },
  
  getMenu: async (businessId: string): Promise<{ categories: Category[], items: MenuItem[] }> => {
      const categoriesQuery = db.collection("categories").where("businessId", "==", businessId);
      const itemsQuery = db.collection("menuItems").where("businessId", "==", businessId);

      const [categoriesSnapshot, itemsSnapshot] = await Promise.all([
          categoriesQuery.get(),
          itemsQuery.get()
      ]);

      const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      
      return { categories, items };
  },

  addMenuItem: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
      const docRef = await db.collection("menuItems").add(item);
      return { ...item, id: docRef.id };
  },

  updateMenuItem: async (item: MenuItem): Promise<MenuItem> => {
      const { id, ...itemData } = item;
      const docRef = db.collection("menuItems").doc(id);
      await docRef.update({ ...itemData });
      return item;
  },

  deleteMenuItem: (itemId: string): Promise<void> => {
      const docRef = db.collection("menuItems").doc(itemId);
      return docRef.delete();
  },

  // Orders
  onOrdersUpdate: (businessId: string, callback: (orders: Order[]) => void): () => void => {
    const q = db.collection("orders").where("businessId", "==", businessId)
        .where("status", "in", [OrderStatus.PENDING, OrderStatus.IN_PREPARATION, OrderStatus.READY])
        .orderBy("createdAt", "asc");

    const unsubscribe = q.onSnapshot((querySnapshot) => {
        const orders = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...convertDocTimestamps(data) } as Order;
        });
        callback(orders);
    });

    return unsubscribe;
  },
  
  getOrders: async (businessId: string): Promise<Order[]> => {
      const q = db.collection("orders").where("businessId", "==", businessId).orderBy("createdAt", "desc");
      const snapshot = await q.get();
      return snapshot.docs.map(d => ({id: d.id, ...convertDocTimestamps(d.data())} as Order));
  },
  
  placeOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
      const orderPayload = {
          ...orderData,
          status: OrderStatus.PENDING,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      const docRef = await db.collection("orders").add(orderPayload);
      return { ...orderData, id: docRef.id, status: OrderStatus.PENDING, createdAt: new Date().toISOString() };
  },

  updateOrderStatus: (orderId: string, status: OrderStatus): Promise<void> => {
      const docRef = db.collection("orders").doc(orderId);
      return docRef.update({ status });
  },
  
  // Admin
  getAllBusinesses: async (): Promise<Business[]> => {
      const snapshot = await db.collection('businesses').get();
      return snapshot.docs.map(d => ({id: d.id, ...convertDocTimestamps(d.data())} as Business));
  },

  getBusinessMetrics: async (businessId: string): Promise<{totalOrders: number, totalRevenue: number}> => {
      const q = db.collection("orders")
          .where("businessId", "==", businessId)
          .where("status", "==", OrderStatus.COMPLETED);
      const snapshot = await q.get();
      const orders = snapshot.docs.map(d => d.data() as Order);
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      return { totalOrders: orders.length, totalRevenue };
  }
};