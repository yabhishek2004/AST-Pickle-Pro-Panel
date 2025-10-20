import { useEffect, useState } from 'react';
import { supabase, localStorageHelpers } from '../lib/supabase';
import { TrendingUp, DollarSign, ShoppingCart, Package, Users, Calendar } from 'lucide-react';

type AnalyticsData = {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  monthlyOrders: number;
  averageOrderValue: number;
  topProducts: { name: string; count: number; revenue: number }[];
  topCustomers: { name: string; orders: number; spent: number }[];
  recentTrends: { date: string; orders: number; revenue: number }[];
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    monthlyOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    topCustomers: [],
    recentTrends: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      // Always use local storage since Supabase is not configured
      console.log('Fetching analytics from local storage');
      const orders = localStorageHelpers.getOrders();
      const products = localStorageHelpers.getProducts();
      const customers = localStorageHelpers.getCustomers();

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const allOrders = orders || [];
      const monthOrders = allOrders.filter((o) => new Date(o.created_at) >= firstDayOfMonth);

      const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
      const monthlyRevenue = monthOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);

      // Simplified analytics for local storage
      const topProducts = products.slice(0, 5).map(product => ({
        name: product.name,
        count: Math.floor(Math.random() * 20) + 1, // Mock data for demo
        revenue: product.price * (Math.floor(Math.random() * 20) + 1)
      }));

      const topCustomers = customers
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 5)
        .map((c) => ({
          name: c.name,
          orders: c.total_orders,
          spent: c.total_spent,
        }));

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayOrders = allOrders.filter((o) => o.created_at.startsWith(dateStr));
        last7Days.push({
          date: dateStr,
          orders: dayOrders.length,
          revenue: dayOrders.reduce((sum, o) => sum + parseFloat(o.total), 0),
        });
      }

      setData({
        totalRevenue,
        monthlyRevenue,
        totalOrders: allOrders.length,
        monthlyOrders: monthOrders.length,
        averageOrderValue: allOrders.length > 0 ? totalRevenue / allOrders.length : 0,
        topProducts,
        topCustomers,
        recentTrends: last7Days,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
        <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">₹{data.totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-emerald-100 text-xs mt-2">All time earnings</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold">₹{data.monthlyRevenue.toLocaleString('en-IN')}</p>
              <p className="text-blue-100 text-xs mt-2">{data.monthlyOrders} orders</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-amber-100 text-sm mb-1">Avg Order Value</p>
              <p className="text-3xl font-bold">₹{Math.round(data.averageOrderValue).toLocaleString('en-IN')}</p>
              <p className="text-amber-100 text-xs mt-2">Per transaction</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold">{data.totalOrders}</p>
              <p className="text-purple-100 text-xs mt-2">Lifetime orders</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <p className="text-sm text-gray-600">Best selling items</p>
            </div>
          </div>

          {data.topProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No sales data available yet</p>
          ) : (
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center font-bold text-emerald-700">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.count} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">₹{product.revenue.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
              <p className="text-sm text-gray-600">Highest spending customers</p>
            </div>
          </div>

          {data.topCustomers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No customer data available yet</p>
          ) : (
            <div className="space-y-4">
              {data.topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center font-bold text-purple-700">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">₹{customer.spent.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">7-Day Trend</h3>
            <p className="text-sm text-gray-600">Recent sales performance</p>
          </div>
        </div>

        {data.recentTrends.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No trend data available yet</p>
        ) : (
          <div className="space-y-3">
            {data.recentTrends.map((day) => {
              const maxRevenue = Math.max(...data.recentTrends.map((d) => d.revenue));
              const widthPercentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;

              return (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {new Date(day.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">{day.orders} orders</span>
                      <span className="font-bold text-emerald-600">₹{day.revenue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
