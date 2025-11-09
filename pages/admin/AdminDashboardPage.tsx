
import React, { useEffect, useState } from 'react';
import { firebaseService } from '../../services/firebaseService';
import { Business } from '../../types';
import Card from '../../components/ui/Card';

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

  if (loading) return <div>Loading businesses...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Registered Businesses</h1>
      <Card>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {businesses.map((biz) => (
                <tr key={biz.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{biz.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{biz.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(biz.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{biz.metrics.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${biz.metrics.totalRevenue.toFixed(2)}</td>
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
