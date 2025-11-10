

import React, { useEffect, useState } from 'react';
import { firebaseService } from '../../services/firebaseService';
import { Business } from '../../types';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

interface BusinessWithMetrics extends Business {
  metrics: {
    totalOrders: number;
    totalRevenue: number;
  };
}

const AdminDashboardPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<BusinessWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const allBusinesses = await firebaseService.getAllBusinesses();
        const businessesWithMetrics: BusinessWithMetrics[] = await Promise.all(
          allBusinesses.map(async (business) => {
            const metrics = await firebaseService.getBusinessMetrics(business.id);
            return { ...business, metrics };
          })
        );
        setBusinesses(businessesWithMetrics);
      } catch (error) {
        console.error("Failed to fetch businesses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  if (loading) return (
      <div className="flex justify-center items-center h-96">
          <Spinner size="lg" />
      </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-light mb-6">Negocios Registrados</h1>
      <Card>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-brand-dark-accent/50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre del Negocio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha de Registro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pedidos Totales</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ingresos Totales</th>
                </tr>
            </thead>
            <tbody className="bg-brand-dark-accent divide-y divide-gray-700">
                {businesses.map((biz) => (
                <tr key={biz.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-light">{biz.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{biz.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(biz.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{biz.metrics.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${biz.metrics.totalRevenue.toFixed(2)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;