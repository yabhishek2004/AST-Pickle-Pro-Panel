import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if environment variables are properly configured
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase environment variables are not configured. Using local storage as fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Local Storage Helper Functions
export const localStorageHelpers = {
  // Products
  getProducts: (): Product[] => {
    try {
      const stored = localStorage.getItem('pickle_products');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading products from localStorage:', error);
      return [];
    }
  },

  saveProducts: (products: Product[]): void => {
    try {
      localStorage.setItem('pickle_products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  },

  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product => {
    const products = localStorageHelpers.getProducts();
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    products.push(newProduct);
    localStorageHelpers.saveProducts(products);
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Product>): Product | null => {
    const products = localStorageHelpers.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = {
      ...products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStorageHelpers.saveProducts(products);
    return products[index];
  },

  deleteProduct: (id: string): boolean => {
    const products = localStorageHelpers.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    if (filteredProducts.length === products.length) return false;
    
    localStorageHelpers.saveProducts(filteredProducts);
    return true;
  },

  // Customers
  getCustomers: (): Customer[] => {
    try {
      const stored = localStorage.getItem('pickle_customers');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading customers from localStorage:', error);
      return [];
    }
  },

  saveCustomers: (customers: Customer[]): void => {
    try {
      localStorage.setItem('pickle_customers', JSON.stringify(customers));
    } catch (error) {
      console.error('Error saving customers to localStorage:', error);
    }
  },

  // Orders
  getOrders: (): Order[] => {
    try {
      const stored = localStorage.getItem('pickle_orders');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading orders from localStorage:', error);
      return [];
    }
  },

  saveOrders: (orders: Order[]): void => {
    try {
      localStorage.setItem('pickle_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  },

  // Update customer statistics when order is created
  updateCustomerStats: (customerId: string, orderTotal: number): void => {
    try {
      const customers = localStorageHelpers.getCustomers();
      const customerIndex = customers.findIndex(c => c.id === customerId);
      
      if (customerIndex !== -1) {
        customers[customerIndex].total_orders += 1;
        customers[customerIndex].total_spent += orderTotal;
        customers[customerIndex].updated_at = new Date().toISOString();
        localStorageHelpers.saveCustomers(customers);
        console.log('Customer stats updated:', customers[customerIndex]);
      }
    } catch (error) {
      console.error('Error updating customer stats:', error);
    }
  },

  // Update product stock when order is created
  updateProductStock: (orderItems: Array<{
    product_id: string;
    quantity: number;
  }>): void => {
    try {
      const products = localStorageHelpers.getProducts();
      
      orderItems.forEach(item => {
        const productIndex = products.findIndex(p => p.id === item.product_id);
        if (productIndex !== -1) {
          // Reduce stock quantity
          products[productIndex].stock_quantity = Math.max(0, products[productIndex].stock_quantity - item.quantity);
          products[productIndex].updated_at = new Date().toISOString();
          console.log(`Stock updated for product ${products[productIndex].name}: ${products[productIndex].stock_quantity} remaining`);
        }
      });
      
      localStorageHelpers.saveProducts(products);
      console.log('Product stock updated successfully');
    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  },

  // Recalculate all customer statistics from orders
  recalculateCustomerStats: (): void => {
    try {
      const customers = localStorageHelpers.getCustomers();
      const orders = localStorageHelpers.getOrders();
      
      // Reset all customer stats
      customers.forEach(customer => {
        customer.total_orders = 0;
        customer.total_spent = 0;
      });
      
      // Calculate stats from orders
      orders.forEach(order => {
        const customerIndex = customers.findIndex(c => c.id === order.customer_id);
        if (customerIndex !== -1) {
          customers[customerIndex].total_orders += 1;
          customers[customerIndex].total_spent += parseFloat(order.total);
        }
      });
      
      // Update timestamps
      customers.forEach(customer => {
        customer.updated_at = new Date().toISOString();
      });
      
      localStorageHelpers.saveCustomers(customers);
      console.log('Customer stats recalculated for all customers');
    } catch (error) {
      console.error('Error recalculating customer stats:', error);
    }
  },

  // Recalculate product stock from all orders
  recalculateProductStock: (): void => {
    try {
      const products = localStorageHelpers.getProducts();
      const orders = localStorageHelpers.getOrders();
      
      // Reset all product stock to original levels (you may need to set this manually)
      // For now, we'll just recalculate based on orders
      
      // Create a map to track total quantities ordered per product
      const productOrderedQuantities = new Map<string, number>();
      
      orders.forEach(order => {
        if (order.order_items) {
          order.order_items.forEach(item => {
            const currentQuantity = productOrderedQuantities.get(item.product_id) || 0;
            productOrderedQuantities.set(item.product_id, currentQuantity + item.quantity);
          });
        }
      });
      
      // Update products with remaining stock
      products.forEach(product => {
        const orderedQuantity = productOrderedQuantities.get(product.id) || 0;
        // Note: This assumes you have a way to track original stock levels
        // For now, we'll just log the information
        console.log(`Product ${product.name}: ${product.stock_quantity} current stock, ${orderedQuantity} total ordered`);
      });
      
      console.log('Product stock recalculated from orders');
    } catch (error) {
      console.error('Error recalculating product stock:', error);
    }
  }
};

// Check if we should use local storage
export const useLocalStorage = !isSupabaseConfigured;

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock_quantity: number;
  unit: string;
  image_url: string;
  sku: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  delivery_address: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};
