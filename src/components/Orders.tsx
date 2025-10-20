import React, { useEffect, useState, useMemo } from 'react';
import { supabase, localStorageHelpers, useLocalStorage, type Order, type Customer, type Product } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Eye, Search, Clock, CheckCircle, XCircle, Package, ShoppingCart, Printer, CreditCard } from 'lucide-react';

export default function Orders() {
  const { theme, themeColors } = useTheme();
  const [orders, setOrders] = useState<(Order & { customer?: Customer })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<(Order & { customer?: Customer }) | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    payment_method: 'cash',
    payment_status: 'pending',
    subtotal: '',
    tax: '',
    discount: '',
    total: '',
    notes: '',
    delivery_address: '',
  });

  const [orderItems, setOrderItems] = useState<Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>>([]);

  // Get theme-specific classes for Orders
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
          border: 'border-emerald-200'
        };
      case 'blue':
        return {
          primary: 'from-blue-600 to-cyan-600',
          accent: 'blue-600',
          focus: 'focus:ring-blue-500',
          hover: 'hover:bg-blue-700',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200'
        };
      case 'purple':
        return {
          primary: 'from-purple-600 to-pink-600',
          accent: 'purple-600',
          focus: 'focus:ring-purple-500',
          hover: 'hover:bg-purple-700',
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200'
        };
      case 'orange':
        return {
          primary: 'from-orange-600 to-red-600',
          accent: 'orange-600',
          focus: 'focus:ring-orange-500',
          hover: 'hover:bg-orange-700',
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200'
        };
      default:
        return {
          primary: 'from-emerald-600 to-teal-600',
          accent: 'emerald-600',
          focus: '${classes.focus}',
          hover: 'hover:bg-emerald-700',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200'
        };
    }
  };

  const classes = getThemeClasses();

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  function fetchOrders() {
    try {
      // Always use local storage since Supabase is not configured
      console.log('Fetching orders from local storage');
      const ordersData = localStorageHelpers.getOrders();
      const customersData = localStorageHelpers.getCustomers();
      
      const customersMap = new Map(customersData.map((c) => [c.id, c]));

      const ordersWithCustomers = ordersData.map((order) => ({
        ...order,
        customer: order.customer_id ? customersMap.get(order.customer_id) : undefined,
      }));

      setOrders(ordersWithCustomers);
      console.log('Orders loaded from local storage:', ordersWithCustomers.length);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function updateOrderStatus(orderId: string, status: string) {
    try {
      // Always use local storage since Supabase is not configured
      console.log('Updating order status in local storage:', orderId, status);
      const orders = localStorageHelpers.getOrders();
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) throw new Error('Order not found');
      
      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
        updated_at: new Date().toISOString()
      };
      
      localStorageHelpers.saveOrders(orders);
      console.log('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  }

  function updatePaymentStatus(orderId: string, paymentStatus: string) {
    try {
      console.log('Updating payment status in local storage:', orderId, paymentStatus);
      const orders = localStorageHelpers.getOrders();
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) throw new Error('Order not found');
      
      orders[orderIndex] = {
        ...orders[orderIndex],
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      };
      
      localStorageHelpers.saveOrders(orders);
      console.log('Payment status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again.');
    }
  }

  function openInvoiceModal(order: Order & { customer?: Customer }) {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  }

  function closeInvoiceModal() {
    setShowInvoiceModal(false);
    setSelectedOrder(null);
  }

  function openViewModal(order: Order & { customer?: Customer }) {
    setSelectedOrder(order);
    setShowViewModal(true);
  }

  function closeViewModal() {
    setShowViewModal(false);
    setSelectedOrder(null);
  }

  function printInvoice() {
    const printWindow = window.open('', '_blank');
    if (printWindow && selectedOrder) {
      const invoiceHTML = generateInvoiceHTML(selectedOrder);
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.print();
    }
  }

  function generateInvoiceHTML(order: Order & { customer?: Customer }) {
    const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${order.order_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background: white;
          color: #333;
          line-height: 1.4;
        }
        .invoice-container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 15mm;
          min-height: 297mm;
          display: flex;
          flex-direction: column;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
        }
        .company-info h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }
        .company-info p {
          color: #6b7280;
          font-size: 14px;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-details h2 {
          font-size: 20px;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .invoice-details p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 3px;
        }
        .invoice-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .billing-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 25px;
        }
        .bill-to, .invoice-info {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        .bill-to h3, .invoice-info h3 {
          color: #1f2937;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .bill-to p, .invoice-info p {
          color: #4b5563;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .order-items {
          margin-bottom: 20px;
        }
        .order-items h3 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 15px;
          text-align: center;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table th {
          background: #3b82f6;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }
        .items-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        .items-table tr:nth-child(even) {
          background: #f9fafb;
        }
        .items-table tr:hover {
          background: #f3f4f6;
        }
        .totals-section {
          background: #1f2937;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-top: auto;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .total-row.final {
          font-size: 20px;
          font-weight: 700;
          border-top: 2px solid #4b5563;
          padding-top: 10px;
          margin-top: 10px;
        }
        .invoice-footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 12px;
          text-transform: uppercase;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #dbeafe; color: #1e40af; }
        .status-delivered { background: #d1fae5; color: #065f46; }
        .payment-pending { background: #fef3c7; color: #92400e; }
        .payment-paid { background: #d1fae5; color: #065f46; }
        @media print {
          body { background: white; }
          .invoice-container { 
            box-shadow: none; 
            border-radius: 0;
            padding: 10mm;
            min-height: auto;
          }
          .invoice-header { page-break-inside: avoid; }
          .billing-info { page-break-inside: avoid; }
          .order-items { page-break-inside: avoid; }
          .totals-section { page-break-inside: avoid; }
        }
        @page {
          size: A4;
          margin: 10mm;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="company-info">
            <h1>PicklePro</h1>
            <p>Premium Pickle Products & Services</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${order.order_number}</p>
            <p><strong>Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            <p><strong>Payment:</strong> <span class="status-badge payment-${order.payment_status}">${order.payment_status}</span></p>
          </div>
        </div>
        
        <div class="invoice-body">
          <div class="billing-info">
            <div class="bill-to">
              <h3>Bill To</h3>
              <p><strong>${order.customer?.name || 'N/A'}</strong></p>
              <p>${order.customer?.phone || 'N/A'}</p>
              <p>${order.customer?.email || 'N/A'}</p>
              <p>${order.customer?.address || 'N/A'}</p>
              <p>${order.customer?.city || ''}, ${order.customer?.state || ''} - ${order.customer?.pincode || ''}</p>
            </div>
            
            <div class="invoice-info">
              <h3>Payment Details</h3>
              <p><strong>Method:</strong> ${order.payment_method}</p>
              <p><strong>Delivery:</strong> ${order.delivery_address || 'N/A'}</p>
              <p><strong>Notes:</strong> ${order.notes || 'N/A'}</p>
            </div>
          </div>
          
          <div class="order-items">
            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 50%;">Product</th>
                  <th style="width: 15%;">Qty</th>
                  <th style="width: 17.5%;">Price</th>
                  <th style="width: 17.5%;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.order_items ? order.order_items.map((item: any) => `
                  <tr>
                    <td>${item.product_name}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">₹${item.unit_price}</td>
                    <td style="text-align: right;">₹${item.total_price}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="4" style="text-align: center; color: #6b7280;">No items available</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
          
          <div class="totals-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${order.subtotal}</span>
            </div>
            <div class="total-row">
              <span>Tax (18%):</span>
              <span>₹${order.tax}</span>
            </div>
            <div class="total-row">
              <span>Discount:</span>
              <span>-₹${order.discount}</span>
            </div>
            <div class="total-row final">
              <span>Total Amount:</span>
              <span>₹${order.total}</span>
            </div>
          </div>
        </div>
        
        <div class="invoice-footer">
          <p>Thank you for choosing PicklePro!</p>
          <p>For any queries, contact us at business@picklepro.com</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  function fetchCustomers() {
    try {
      console.log('Fetching customers from local storage');
      const data = localStorageHelpers.getCustomers();
      setCustomers(data);
      console.log('Customers loaded from local storage:', data.length);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  }

  function fetchProducts() {
    try {
      console.log('Fetching products from local storage');
      const data = localStorageHelpers.getProducts();
      setProducts(data);
      console.log('Products loaded from local storage:', data.length);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (orderItems.length === 0) {
      alert('Please add at least one product to the order.');
      return;
    }

    const orderData = {
      order_number: `ORD-${Date.now()}`,
      customer_id: formData.customer_id,
      status: 'pending',
      payment_status: formData.payment_status,
      payment_method: formData.payment_method,
      subtotal: parseFloat(formData.subtotal) || 0,
      tax: parseFloat(formData.tax) || 0,
      discount: parseFloat(formData.discount) || 0,
      total: parseFloat(formData.total) || 0,
      notes: formData.notes,
      delivery_address: formData.delivery_address,
      order_items: orderItems, // Include order items
    };

    try {
      console.log('Creating order in local storage');
      const orders = localStorageHelpers.getOrders();
      const newOrder = {
        ...orderData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      orders.push(newOrder);
      localStorageHelpers.saveOrders(orders);
      
      // Update customer statistics
      localStorageHelpers.updateCustomerStats(formData.customer_id, parseFloat(formData.total));
      
      // Update product stock
      localStorageHelpers.updateProductStock(orderItems);
      
      console.log('Order created successfully:', newOrder);
      
      fetchOrders();
      closeModal();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  }

  function openModal() {
    setFormData({
      customer_id: '',
      payment_method: 'cash',
      payment_status: 'pending',
      subtotal: '',
      tax: '',
      discount: '',
      total: '',
      notes: '',
      delivery_address: '',
    });
    setOrderItems([]);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setOrderItems([]);
  }

  function addProductToOrder(product: Product) {
    const existingItem = orderItems.find(item => item.product_id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + 1;
    
    // Check if we have enough stock
    if (newQuantity > product.stock_quantity) {
      alert(`Not enough stock! Only ${product.stock_quantity} ${product.unit} available for ${product.name}`);
      return;
    }
    
    if (existingItem) {
      // Update quantity if product already exists
      setOrderItems(prev => prev.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: newQuantity, total_price: newQuantity * item.unit_price }
          : item
      ));
    } else {
      // Add new product to order
      const newItem = {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        total_price: product.price
      };
      setOrderItems(prev => [...prev, newItem]);
    }
  }

  function updateProductQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.product_id !== productId));
    } else {
      // Find the product to check stock
      const product = products.find(p => p.id === productId);
      if (product && quantity > product.stock_quantity) {
        alert(`Not enough stock! Only ${product.stock_quantity} ${product.unit} available for ${product.name}`);
        return;
      }
      
      setOrderItems(prev => prev.map(item => 
        item.product_id === productId 
          ? { ...item, quantity, total_price: quantity * item.unit_price }
          : item
      ));
    }
  }

  function removeProductFromOrder(productId: string) {
    setOrderItems(prev => prev.filter(item => item.product_id !== productId));
  }

  // Calculate totals when order items change
  React.useEffect(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
    const tax = subtotal * 0.18; // 18% tax
    const discount = 0; // No discount by default
    const total = subtotal + tax - discount;

    setFormData(prev => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    }));
  }, [orderItems]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      preparing: 'bg-purple-100 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

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
          <h2 className="text-3xl font-bold text-gray-800">Orders</h2>
          <p className="text-gray-600 mt-1">Manage and track your pickle orders</p>
        </div>
        <button 
          onClick={openModal}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Order</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${classes.focus} focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${classes.focus} focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-600">Orders will appear here once customers start placing them.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-emerald-700">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer?.name || 'Guest'}</p>
                        <p className="text-sm text-gray-500">{order.customer?.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">₹{order.total.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.payment_status}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        } focus:outline-none focus:ring-2 ${classes.focus}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(
                          order.status
                        )} focus:outline-none focus:ring-2 ${classes.focus}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openInvoiceModal(order)}
                          className={`${classes.text} hover:${classes.hover.replace('hover:', '')} flex items-center space-x-1 px-2 py-1 rounded hover:${classes.bg} transition-colors`}
                        >
                          <Printer className="w-4 h-4" />
                          <span className="text-sm font-medium">Print</span>
                        </button>
                        <button 
                          onClick={() => openViewModal(order)}
                          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                {orders.filter((o) => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Processing</p>
              <p className="text-2xl font-bold text-blue-900">
                {orders.filter((o) => ['confirmed', 'preparing', 'shipped'].includes(o.status)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">Delivered</p>
              <p className="text-2xl font-bold text-green-900">
                {orders.filter((o) => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-red-700 font-medium">Cancelled</p>
              <p className="text-2xl font-bold text-red-900">
                {orders.filter((o) => o.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${classes.primary} p-6 text-white`}>
              <h3 className="text-2xl font-bold">Create New Order</h3>
              <p className="text-white/90 mt-1">Enter order details for your customer</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Selection Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Products to Order</label>
                  <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {products.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No products available. Add products first.</p>
                    ) : (
                      <div className="space-y-2">
                        {products.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-2 border border-gray-100 rounded hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">₹{product.price} • Stock: {product.stock_quantity} {product.unit}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => addProductToOrder(product)}
                              className={`ml-2 ${classes.bg} ${classes.text} px-3 py-1 rounded text-sm hover:${classes.hover.replace('hover:', '')} transition-colors`}
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Products */}
                {orderItems.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selected Products</label>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="space-y-2">
                        {orderItems.map((item) => (
                          <div key={item.product_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.product_name}</div>
                              <div className="text-sm text-gray-500">₹{item.unit_price} each</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => updateProductQuantity(item.product_id, item.quantity - 1)}
                                className="w-6 h-6 bg-gray-200 text-gray-600 rounded flex items-center justify-center hover:bg-gray-300"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateProductQuantity(item.product_id, item.quantity + 1)}
                                className="w-6 h-6 bg-gray-200 text-gray-600 rounded flex items-center justify-center hover:bg-gray-300"
                              >
                                +
                              </button>
                              <span className="w-16 text-right font-medium">₹{item.total_price.toFixed(2)}</span>
                              <button
                                type="button"
                                onClick={() => removeProductFromOrder(item.product_id)}
                                className="w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center hover:bg-red-200"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="upi">UPI Payment</option>
                    <option value="card">Card Payment</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal (₹)</label>
                  <input
                    type="number"
                    value={formData.subtotal}
                    onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax (₹)</label>
                  <input
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total (₹) *</label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                <textarea
                  value={formData.delivery_address}
                  onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                  placeholder="Enter delivery address..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}"
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className={`flex-1 bg-gradient-to-r ${classes.primary} text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium`}
                >
                  Create Order
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

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${classes.primary} p-6 text-white`}>
              <h3 className="text-2xl font-bold">Invoice Preview</h3>
              <p className="text-white/90 mt-1">Order #{selectedOrder.order_number}</p>
            </div>
            
            <div className="p-6">
              <div className={`bg-gradient-to-br ${classes.bg} rounded-xl p-6 mb-6 border ${classes.border}`}>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Invoice Preview</h4>
                <p className="text-gray-600 mb-4">This is a preview of your beautiful invoice. Click "Print Invoice" to open the print dialog.</p>
                <div className="flex space-x-3">
                  <button
                    onClick={printInvoice}
                    className={`bg-gradient-to-r ${classes.primary} text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center space-x-2`}
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={closeInvoiceModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3">Invoice Details</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <span className="ml-2 font-medium">{selectedOrder.customer?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-2 font-medium">₹{selectedOrder.total}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium">{selectedOrder.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment:</span>
                    <span className="ml-2 font-medium">{selectedOrder.payment_status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${classes.primary} p-6 text-white`}>
              <h3 className="text-2xl font-bold">Order Details</h3>
              <p className="text-white/90 mt-1">Order #{selectedOrder.order_number}</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${classes.bg} rounded-xl p-6 border ${classes.border}`}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{selectedOrder.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedOrder.payment_status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedOrder.payment_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">{selectedOrder.payment_method}</span>
                    </div>
                  </div>
                </div>

                <div className={`${classes.bg} rounded-xl p-6 border ${classes.border}`}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedOrder.customer?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{selectedOrder.customer?.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{selectedOrder.customer?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <span className="ml-2 font-medium">{selectedOrder.customer?.address || 'N/A'}</span>
                    </div>
                    {selectedOrder.delivery_address && (
                      <div>
                        <span className="text-gray-600">Delivery Address:</span>
                        <span className="ml-2 font-medium">{selectedOrder.delivery_address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className={`${classes.bg} rounded-xl p-6 border ${classes.border}`}>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-medium text-gray-700">Product</th>
                          <th className="text-center py-2 font-medium text-gray-700">Quantity</th>
                          <th className="text-right py-2 font-medium text-gray-700">Unit Price</th>
                          <th className="text-right py-2 font-medium text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.order_items.map((item: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 font-medium text-gray-900">{item.product_name}</td>
                            <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                            <td className="py-3 text-right text-gray-600">₹{item.unit_price}</td>
                            <td className="py-3 text-right font-medium text-gray-900">₹{item.total_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No items available</p>
                )}
              </div>

              {/* Order Totals */}
              <div className={`${classes.bg} rounded-xl p-6 border ${classes.border}`}>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%):</span>
                    <span className="font-medium">₹{selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium">-₹{selectedOrder.discount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className={`${classes.bg} rounded-xl p-6 border ${classes.border}`}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Notes</h4>
                  <p className="text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    closeViewModal();
                    openInvoiceModal(selectedOrder);
                  }}
                  className={`bg-gradient-to-r ${classes.primary} text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center space-x-2`}
                >
                  <Printer className="w-5 h-5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={closeViewModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
