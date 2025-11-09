
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { firebaseService } from '../../services/firebaseService';
import { Order, OrderStatus } from '../../types';
import Card from '../../components/ui/Card';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.businessId) {
                try {
                    const fetchedOrders = await firebaseService.getOrders(user.businessId);
                    setOrders(fetchedOrders);
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrders();
    }, [user]);

    const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED);
    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;

    const salesData = [
      { name: 'Today', sales: totalRevenue },
      { name: 'Yesterday', sales: totalRevenue * 0.8 }, // Mock data
      { name: '2 days ago', sales: totalRevenue * 1.1 }, // Mock data
    ];

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{totalOrders}</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-500">Pending Orders</h3>
                    <p className="mt-2 text-3xl font-bold text-primary-600">{pendingOrders}</p>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-8">
                <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Sales Overview</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#F97316" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                <Card className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.tableNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                                            order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
