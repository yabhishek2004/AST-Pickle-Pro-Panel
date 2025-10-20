import { useMemo } from 'react';
import { supabase, localStorageHelpers, useLocalStorage } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStockProducts: number;
  todayOrders: number;
};

export default function Dashboard() {
  const { theme, themeColors } = useTheme();




  const stats = useMemo(() => {
    try {
      // Always use local storage since Supabase is not configured
      console.log('Fetching dashboard stats from local storage');
      
      const products = localStorageHelpers.getProducts();
      const orders = localStorageHelpers.getOrders();
      const customers = localStorageHelpers.getCustomers();

      const lowStock = products?.filter((p) => p.stock_quantity < 10).length || 0;
      const today = new Date().toISOString().split('T')[0];
      const todayOrdersCount = orders?.filter((o) => o.created_at.startsWith(today)).length || 0;
      const revenue = orders?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;

      const calculatedStats = {
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        totalCustomers: customers?.length || 0,
        totalRevenue: revenue,
        lowStockProducts: lowStock,
        todayOrders: todayOrdersCount,
      };
      
      console.log('Dashboard stats loaded from local storage:', {
        products: products?.length || 0,
        orders: orders?.length || 0,
        customers: customers?.length || 0,
        revenue
      });
      
      return calculatedStats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        lowStockProducts: 0,
        todayOrders: 0,
      };
    }
  }, []); // Empty dependency array since we want this to run once

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: themeColors.primary,
      bgColor: themeColors.primaryBg,
      textColor: themeColors.primaryText,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      subtitle: `${stats.todayOrders} today`,
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your pickle business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    {card.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                    )}
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stats.lowStockProducts > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-1">Low Stock Alert</h3>
              <p className="text-amber-800">
                {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? 's' : ''} running low on stock.
                Consider restocking soon to avoid shortages.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              <p className="text-sm text-gray-600">Business performance metrics</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold text-gray-900">
                ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('en-IN') : 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Orders per Customer</span>
              <span className="font-semibold text-gray-900">
                {stats.totalCustomers > 0 ? (stats.totalOrders / stats.totalCustomers).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Active Products</span>
              <span className="font-semibold text-gray-900">{stats.totalProducts}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-3">Growing Your Business</h3>
          <p className="text-emerald-100 mb-6 leading-relaxed">
            Keep track of your inventory, manage orders efficiently, and build lasting relationships with your customers.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">✓</span>
              </div>
              <span className="text-emerald-50">Real-time inventory tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">✓</span>
              </div>
              <span className="text-emerald-50">Streamlined order management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">✓</span>
              </div>
              <span className="text-emerald-50">Customer insights & analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
