import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { firebaseService } from '../../services/firebaseService';
import { Order, OrderStatus } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const statusConfig = {
    [OrderStatus.PENDING]: { title: "New Orders", color: "bg-yellow-400", next: OrderStatus.IN_PREPARATION, nextText: "Start Preparing" },
    [OrderStatus.IN_PREPARATION]: { title: "In Preparation", color: "bg-blue-400", next: OrderStatus.READY, nextText: "Mark as Ready" },
    [OrderStatus.READY]: { title: "Ready for Pickup", color: "bg-green-400", next: OrderStatus.COMPLETED, nextText: "Complete Order" },
    [OrderStatus.COMPLETED]: { title: "Completed", color: "bg-gray-400", next: null, nextText: null },
    [OrderStatus.CANCELED]: { title: "Canceled", color: "bg-red-400", next: null, nextText: null },
};

const KitchenPage: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.businessId) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        const unsubscribe = firebaseService.onOrdersUpdate(user.businessId, (updatedOrders) => {
            setOrders(updatedOrders);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [user]);

    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await firebaseService.updateOrderStatus(orderId, newStatus);
            // Firestore's onSnapshot will handle the UI update automatically
        } catch (error) {
            console.error("Failed to update order status", error);
            alert("Failed to update order status.");
        }
    };
    
    const columns: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.IN_PREPARATION, OrderStatus.READY];

    if (loading) return <div className="text-center p-10">Loading kitchen orders...</div>

    return (
        <div className="h-[calc(100vh-4rem)] bg-gray-100 flex flex-col">
            <div className="p-4">
                <h1 className="text-3xl font-bold text-gray-900">Kitchen Display</h1>
            </div>
            <div className="flex-1 overflow-x-auto p-4">
                <div className="flex space-x-4 min-w-max h-full">
                    {columns.map(status => (
                        <div key={status} className="bg-gray-200 rounded-lg w-80 md:w-96 flex flex-col">
                            <div className={`p-3 rounded-t-lg flex items-center justify-between ${statusConfig[status].color}`}>
                                <h2 className="font-bold text-white text-lg">{statusConfig[status].title}</h2>
                                <span className="bg-white text-black text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                    {orders.filter(o => o.status === status).length}
                                </span>
                            </div>
                            <div className="p-2 space-y-3 overflow-y-auto">
                                {orders.filter(o => o.status === status).map(order => (
                                    <Card key={order.id} className="p-4 bg-white">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-lg">Table {order.tableNumber}</h3>
                                            <p className="text-sm text-gray-500">#{order.id.slice(-4)}</p>
                                        </div>
                                        <ul className="mt-2 space-y-1 border-t pt-2">
                                            {order.items.map((item, index) => (
                                                <li key={`${item.menuItemId}-${index}`} className="flex justify-between text-gray-700">
                                                    <span>{item.quantity}x {item.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {statusConfig[status].next && (
                                            <Button 
                                                onClick={() => handleUpdateStatus(order.id, statusConfig[status].next!)}
                                                className="w-full mt-4"
                                            >
                                                {statusConfig[status].nextText}
                                            </Button>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KitchenPage;