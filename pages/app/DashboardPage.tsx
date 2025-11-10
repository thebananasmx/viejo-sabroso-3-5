import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { firebaseService } from '../../services/firebaseService';
import { Order, OrderStatus } from '../../types';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.businessId) {
            setLoading(true);
            const unsubscribe = firebaseService.onAllOrdersUpdate(user.businessId, (updatedOrders) => {
                // Sort orders to show recent ones first in the table
                const sortedOrders = updatedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(sortedOrders);
                setLoading(false); // Set loading to false once we have the initial data
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        } else if (user) {
            // User is loaded but has no businessId
            setLoading(false);
        }
    }, [user]);


    const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED);
    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;

    // Process orders to generate dynamic sales data for the last 7 days
    const salesByDay = completedOrders.reduce((acc, order) => {
        const orderDate = new Date(order.createdAt);
        const day = orderDate.toISOString().split('T')[0]; // Use YYYY-MM-DD as key
        acc[day] = (acc[day] || 0) + order.total;
        return acc;
    }, {} as Record<string, number>);

    const salesData = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayKey = date.toISOString().split('T')[0];

        let name = '';
        if (i === 0) {
            name = 'Hoy';
        } else if (i === 1) {
            name = 'Ayer';
        } else {
            name = date.toLocaleDateString('es-MX', { weekday: 'short' });
        }

        salesData.push({
            name,
            sales: salesByDay[dayKey] || 0,
        });
    }

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <Spinner size="lg" />
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-light mb-6">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-400">Ingresos Totales</h3>
                    <p className="mt-2 text-3xl font-bold text-brand-light">${totalRevenue.toFixed(2)}</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-400">Pedidos Totales</h3>
                    <p className="mt-2 text-3xl font-bold text-brand-light">{totalOrders}</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-400">Pedidos Pendientes</h3>
                    <p className="mt-2 text-3xl font-bold text-brand-primary">{pendingOrders}</p>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-8">
                <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-brand-light">Resumen de Ventas</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: '#112b26', border: '1px solid #374151' }} />
                                <Legend />
                                <Bar dataKey="sales" fill="#D4FF4F" name="Ventas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-brand-light">Pedidos Recientes</h3>
                <Card className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-brand-dark-accent/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nº Pedido</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mesa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-brand-dark-accent divide-y divide-gray-700">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-light">
                                        #{order.id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{order.tableNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.status === OrderStatus.COMPLETED ? 'bg-green-900 text-green-300' :
                                            order.status === OrderStatus.PENDING ? 'bg-yellow-900 text-yellow-300' :
                                            order.status === OrderStatus.IN_PREPARATION ? 'bg-blue-900 text-blue-300' :
                                            order.status === OrderStatus.READY ? 'bg-indigo-900 text-indigo-300' :
                                            'bg-gray-700 text-gray-300'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${order.total.toFixed(2)}</td>
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