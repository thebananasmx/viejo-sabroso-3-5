import { 
    collection, getDocs, doc, getDoc, query, where, limit, writeBatch, 
    addDoc, updateDoc, deleteDoc, onSnapshot, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { 
    signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut 
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, 'users', userCredential.user!.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User data not found in Firestore.");
    }
    // FIX: Spread types may only be created from object types. Using Object.assign for robustness.
    return Object.assign({ id: userDoc.id }, userDoc.data()) as User;
  },

  registerBusiness: async (businessName: string, email: string, pass: string): Promise<{user: User, business: Business}> => {
      const slug = businessName.toLowerCase().replace(/\s+/g, '-');
      
      const businessesRef = collection(db, "businesses");
      const q = query(businessesRef, where("slug", "==", slug), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          throw new Error('Business name already taken.');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user!;

      const batch = writeBatch(db);
      
      const businessDocRef = doc(collection(db, "businesses"));
      const newBusinessData = { 
          name: businessName, 
          slug, 
          ownerId: user.uid, 
          createdAt: new Date().toISOString() 
      };
      batch.set(businessDocRef, newBusinessData);

      const userDocRef = doc(db, 'users', user.uid);
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

  logout: (): Promise<void> => signOut(auth),

  getUserProfile: async (uid: string): Promise<User | null> => {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
          // FIX: Spread types may only be created from object types. Using Object.assign for robustness.
          return Object.assign({ id: uid }, userDoc.data()) as User;
      }
      return null;
  },
  
  // Image Upload
  uploadImage: async (file: File, path: string): Promise<string> => {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
  },

  // Business Data
  getBusinessBySlug: async (slug: string): Promise<Business | null> => {
      const q = query(collection(db, "businesses"), where("slug", "==", slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docData = snapshot.docs[0].data();
      return { id: snapshot.docs[0].id, ...convertDocTimestamps(docData) } as Business;
  },
  
  getMenu: async (businessId: string): Promise<{ categories: Category[], items: MenuItem[] }> => {
      const categoriesQuery = query(collection(db, "categories"), where("businessId", "==", businessId));
      const itemsQuery = query(collection(db, "menuItems"), where("businessId", "==", businessId));

      const [categoriesSnapshot, itemsSnapshot] = await Promise.all([
          getDocs(categoriesQuery),
          getDocs(itemsQuery)
      ]);

      // FIX: Spread types may only be created from object types. Using Object.assign for robustness.
      const categories = categoriesSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()) as Category);
      // FIX: Spread types may only be created from object types. Using Object.assign for robustness.
      const items = itemsSnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()) as MenuItem);
      
      return { categories, items };
  },

  addMenuItem: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
      const docRef = await addDoc(collection(db, "menuItems"), item);
      return { ...item, id: docRef.id };
  },

  updateMenuItem: async (item: MenuItem): Promise<MenuItem> => {
      const { id, ...itemData } = item;
      const docRef = doc(db, "menuItems", id);
      await updateDoc(docRef, { ...itemData });
      return item;
  },

  deleteMenuItem: (itemId: string): Promise<void> => {
      const docRef = doc(db, "menuItems", itemId);
      return deleteDoc(docRef);
  },

  // Orders
  onOrdersUpdate: (businessId: string, callback: (orders: Order[]) => void): () => void => {
    const q = query(collection(db, "orders"), 
        where("businessId", "==", businessId),
        where("status", "in", [OrderStatus.PENDING, OrderStatus.IN_PREPARATION, OrderStatus.READY]),
        orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // FIX: Property 'docs' does not exist on type 'DocumentSnapshot'. Adding a type guard to ensure we have a QuerySnapshot.
        if ('docs' in querySnapshot) {
            const orders = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...convertDocTimestamps(data) } as Order;
            });
            callback(orders);
        }
    });

    return unsubscribe;
  },
  
  getOrders: async (businessId: string): Promise<Order[]> => {
      const q = query(collection(db, "orders"), where("businessId", "==", businessId), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({id: d.id, ...convertDocTimestamps(d.data())} as Order));
  },
  
  placeOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
      const orderPayload = {
          ...orderData,
          status: OrderStatus.PENDING,
          createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "orders"), orderPayload as any);
      return { ...orderData, id: docRef.id, status: OrderStatus.PENDING, createdAt: new Date().toISOString() };
  },

  updateOrderStatus: (orderId: string, status: OrderStatus): Promise<void> => {
      const docRef = doc(db, "orders", orderId);
      return updateDoc(docRef, { status });
  },
  
  // Admin
  getAllBusinesses: async (): Promise<Business[]> => {
      const snapshot = await getDocs(collection(db, 'businesses'));
      return snapshot.docs.map(d => ({id: d.id, ...convertDocTimestamps(d.data())} as Business));
  },

  getBusinessMetrics: async (businessId: string): Promise<{totalOrders: number, totalRevenue: number}> => {
      const q = query(collection(db, "orders"),
          where("businessId", "==", businessId),
          where("status", "==", OrderStatus.COMPLETED));
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(d => d.data() as Order);
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      return { totalOrders: orders.length, totalRevenue };
  }
};