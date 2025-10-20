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
  const { classes } = useTheme();
  const { getProducts, getOrders, getCustomers } = localStorageHelpers;

  const stats = useMemo((): Stats => {
    const products = getProducts();
    const orders = getOrders();
    const customers = getCustomers();

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const lowStockProducts = products.filter(product => product.stock < 10).length;
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => new Date(order.created_at).toDateString() === today).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalRevenue,
      lowStockProducts,
      todayOrders
    };
  }, [getProducts, getOrders, getCustomers]);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+22%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Low Stock Products',
      value: stats.lowStockProducts,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: stats.lowStockProducts > 0 ? 'Needs Attention' : 'All Good',
      changeColor: stats.lowStockProducts > 0 ? 'text-orange-600' : 'text-green-600'
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+5%',
      changeColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your pickle business management</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`${card.bgColor} rounded-xl p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className={`text-sm font-medium ${card.changeColor} mt-1`}>
                    {card.change}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg bg-white/50`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className={`${classes.bgPrimary} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}>
            <Package className="w-5 h-5" />
            <span>Add Product</span>
          </button>
          <button className={`${classes.bgPrimary} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}>
            <ShoppingCart className="w-5 h-5" />
            <span>Create Order</span>
          </button>
          <button className={`${classes.bgPrimary} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}>
            <Users className="w-5 h-5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">New order received</p>
              <p className="text-xs text-gray-500">Order #12345 - ₹2,500</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Product added</p>
              <p className="text-xs text-gray-500">Mango Pickle - 50 units</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Customer registered</p>
              <p className="text-xs text-gray-500">John Doe - New customer</p>
            </div>
            <span className="text-xs text-gray-400 ml-auto">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}