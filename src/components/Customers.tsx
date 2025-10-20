import React, { useEffect, useState } from 'react';
import { supabase, localStorageHelpers, useLocalStorage, type Customer } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Edit2, Trash2, Search, Users, Phone, Mail, MapPin, TrendingUp, Star, Gift, Crown, Zap } from 'lucide-react';

export default function Customers() {
  const { theme, themeColors } = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Calculate customer loyalty level and points
  const getCustomerLoyaltyInfo = (customer: Customer) => {
    const orders = localStorageHelpers.getOrders();
    const customerOrders = orders.filter(order => order.customer_id === customer.id);
    const totalSpent = customerOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const points = Math.floor(totalSpent / 100); // 1 point per ₹100 spent
    
    let level = 'Bronze';
    let levelColor = 'text-amber-600';
    let levelIcon = Star;
    
    if (points >= 1000) {
      level = 'Diamond';
      levelColor = 'text-blue-600';
      levelIcon = Crown;
    } else if (points >= 500) {
      level = 'Gold';
      levelColor = 'text-yellow-600';
      levelIcon = Gift;
    } else if (points >= 100) {
      level = 'Silver';
      levelColor = 'text-gray-600';
      levelIcon = Zap;
    }
    
    return { points, level, levelColor, levelIcon, totalSpent, orderCount: customerOrders.length };
  };

  // Get theme-specific classes for Customers
  const getThemeClasses = () => {
    switch (theme) {
      case 'emerald':
        return {
          primary: 'from-emerald-600 to-teal-600',
          accent: 'emerald-600',
          focus: '${classes.focus}',
          hover: 'hover:bg-emerald-700',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          cardHeader: 'from-emerald-600 to-teal-600',
          avatar: 'bg-emerald-600',
          button: 'bg-emerald-600 hover:bg-emerald-700',
          editButton: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
          deleteButton: 'bg-red-100 text-red-700 hover:bg-red-200'
        };
      case 'blue':
        return {
          primary: 'from-blue-600 to-cyan-600',
          accent: 'blue-600',
          focus: 'focus:ring-blue-500',
          hover: 'hover:bg-blue-700',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          cardHeader: 'from-blue-600 to-cyan-600',
          avatar: 'bg-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          editButton: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
          deleteButton: 'bg-red-100 text-red-700 hover:bg-red-200'
        };
      case 'purple':
        return {
          primary: 'from-purple-600 to-pink-600',
          accent: 'purple-600',
          focus: 'focus:ring-purple-500',
          hover: 'hover:bg-purple-700',
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          cardHeader: 'from-purple-600 to-pink-600',
          avatar: 'bg-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700',
          editButton: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
          deleteButton: 'bg-red-100 text-red-700 hover:bg-red-200'
        };
      case 'orange':
        return {
          primary: 'from-orange-600 to-red-600',
          accent: 'orange-600',
          focus: 'focus:ring-orange-500',
          hover: 'hover:bg-orange-700',
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          cardHeader: 'from-orange-600 to-red-600',
          avatar: 'bg-orange-600',
          button: 'bg-orange-600 hover:bg-orange-700',
          editButton: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
          deleteButton: 'bg-red-100 text-red-700 hover:bg-red-200'
        };
      default:
        return {
          primary: 'from-emerald-600 to-teal-600',
          accent: 'emerald-600',
          focus: '${classes.focus}',
          hover: 'hover:bg-emerald-700',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          cardHeader: 'from-emerald-600 to-teal-600',
          avatar: 'bg-emerald-600',
          button: 'bg-emerald-600 hover:bg-emerald-700',
          editButton: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
          deleteButton: 'bg-red-100 text-red-700 hover:bg-red-200'
        };
    }
  };

  const classes = getThemeClasses();

  useEffect(() => {
    fetchCustomers();
  }, []);

  function fetchCustomers() {
    try {
      // Always use local storage since Supabase is not configured
      console.log('Fetching customers from local storage');
      
      // Recalculate customer statistics from orders
      localStorageHelpers.recalculateCustomerStats();
      
      const data = localStorageHelpers.getCustomers();
      setCustomers(data);
      console.log('Customers loaded from local storage:', data.length);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const customerData = {
      ...formData,
      updated_at: new Date().toISOString(),
    };

    try {
      // Always use local storage since Supabase is not configured
      console.log('Saving customer to local storage');
      
      if (editingCustomer) {
        const customers = localStorageHelpers.getCustomers();
        const customerIndex = customers.findIndex(c => c.id === editingCustomer.id);
        
        if (customerIndex === -1) throw new Error('Customer not found');
        
        customers[customerIndex] = {
          ...customers[customerIndex],
          ...customerData,
          updated_at: new Date().toISOString()
        };
        
        localStorageHelpers.saveCustomers(customers);
        console.log('Customer updated successfully');
      } else {
        const newCustomer = {
          ...customerData,
          id: crypto.randomUUID(),
          total_orders: 0,
          total_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const customers = localStorageHelpers.getCustomers();
        customers.push(newCustomer);
        localStorageHelpers.saveCustomers(customers);
        console.log('Customer added successfully:', newCustomer);
      }

      fetchCustomers();
      closeModal();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    }
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      // Always use local storage since Supabase is not configured
      console.log('Deleting customer from local storage:', id);
      const customers = localStorageHelpers.getCustomers();
      const filteredCustomers = customers.filter(c => c.id !== id);
      
      if (filteredCustomers.length === customers.length) {
        throw new Error('Customer not found');
      }
      
      localStorageHelpers.saveCustomers(filteredCustomers);
      console.log('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer. Please try again.');
    }
  }

  function openModal(customer?: Customer) {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone,
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        pincode: customer.pincode || '',
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
      });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCustomer(null);
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Customers</h2>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              localStorageHelpers.recalculateCustomerStats();
              fetchCustomers();
              alert('Customer statistics recalculated successfully!');
            }}
            className={`bg-gradient-to-r ${classes.primary} text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Recalculate Stats</span>
          </button>
          <button
            onClick={() => openModal()}
            className={`bg-gradient-to-r ${classes.primary} text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Customer</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${classes.focus} focus:border-transparent`}
          />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No customers found</h3>
          <p className="text-gray-600 mb-6">Start building your customer base by adding your first customer.</p>
          <button
            onClick={() => openModal()}
            className={`${classes.button} text-white px-6 py-2 rounded-lg transition-colors`}
          >
            Add First Customer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => {
            const loyaltyInfo = getCustomerLoyaltyInfo(customer);
            const LevelIcon = loyaltyInfo.levelIcon;
            
            return (
              <div
                key={customer.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`bg-gradient-to-br ${classes.cardHeader} p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{customer.name}</h3>
                          <p className="text-white/80 text-sm">Customer #{customer.id.slice(0, 8)}</p>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center space-x-1 ${loyaltyInfo.levelColor}`}>
                            <LevelIcon className="w-5 h-5" />
                            <span className="text-sm font-bold">{loyaltyInfo.level}</span>
                          </div>
                          <p className="text-white/80 text-xs">{loyaltyInfo.points} points</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <Phone className={`w-5 h-5 ${classes.text} mt-0.5`} />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{customer.phone}</p>
                  </div>
                </div>

                {customer.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className={`w-5 h-5 ${classes.text} mt-0.5`} />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 text-sm">{customer.email}</p>
                    </div>
                  </div>
                )}

                {customer.city && (
                  <div className="flex items-start space-x-3">
                    <MapPin className={`w-5 h-5 ${classes.text} mt-0.5`} />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">
                        {customer.city}
                        {customer.state && `, ${customer.state}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Loyalty Stats */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Loyalty Status</h4>
                    <div className={`flex items-center space-x-1 ${loyaltyInfo.levelColor}`}>
                      <LevelIcon className="w-4 h-4" />
                      <span className="text-sm font-bold">{loyaltyInfo.level}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500">Points</p>
                      <p className="font-bold text-purple-600">{loyaltyInfo.points}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Orders</p>
                      <p className="font-bold text-purple-600">{loyaltyInfo.orderCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Spent</p>
                      <p className="font-bold text-purple-600">₹{loyaltyInfo.totalSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg Order</p>
                      <p className="font-bold text-purple-600">
                        ₹{loyaltyInfo.orderCount > 0 ? Math.round(loyaltyInfo.totalSpent / loyaltyInfo.orderCount) : 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className={`text-lg font-bold ${classes.text}`}>{loyaltyInfo.orderCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className={`text-lg font-bold ${classes.text}`}>
                      ₹{loyaltyInfo.totalSpent.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => openModal(customer)}
                    className={`flex-1 ${classes.editButton} px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className={`flex-1 ${classes.deleteButton} px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${classes.primary} p-6 text-white`}>
              <h3 className="text-2xl font-bold">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <p className="text-white/90 mt-1">
                {editingCustomer ? 'Update customer information' : 'Enter details for your new customer'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className={`flex-1 bg-gradient-to-r ${classes.primary} text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium`}
                >
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
