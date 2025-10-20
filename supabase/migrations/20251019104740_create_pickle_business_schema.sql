/*
  # Pickle Business Management System Schema

  ## Overview
  Complete database schema for managing a pickle business including products, inventory, orders, customers, and analytics.

  ## New Tables

  ### 1. `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name (e.g., "Mango Pickle", "Lemon Pickle")
  - `description` (text) - Detailed product description
  - `category` (text) - Product category
  - `price` (decimal) - Selling price per unit
  - `cost` (decimal) - Cost price per unit
  - `stock_quantity` (integer) - Current stock level
  - `unit` (text) - Unit of measurement (kg, g, jar, etc.)
  - `image_url` (text) - Product image URL
  - `sku` (text) - Stock keeping unit code
  - `is_active` (boolean) - Product availability status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `customers`
  - `id` (uuid, primary key) - Unique customer identifier
  - `name` (text) - Customer full name
  - `email` (text) - Customer email address
  - `phone` (text) - Contact phone number
  - `address` (text) - Delivery address
  - `city` (text) - City
  - `state` (text) - State/Province
  - `pincode` (text) - Postal code
  - `total_orders` (integer) - Total number of orders placed
  - `total_spent` (decimal) - Total amount spent
  - `created_at` (timestamptz) - Customer registration date
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `orders`
  - `id` (uuid, primary key) - Unique order identifier
  - `order_number` (text) - Human-readable order number
  - `customer_id` (uuid, foreign key) - Reference to customers table
  - `status` (text) - Order status (pending, confirmed, preparing, shipped, delivered, cancelled)
  - `payment_status` (text) - Payment status (pending, paid, refunded)
  - `payment_method` (text) - Payment method used
  - `subtotal` (decimal) - Order subtotal
  - `tax` (decimal) - Tax amount
  - `discount` (decimal) - Discount amount
  - `total` (decimal) - Total order amount
  - `notes` (text) - Order notes
  - `delivery_address` (text) - Delivery address
  - `created_at` (timestamptz) - Order creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `order_items`
  - `id` (uuid, primary key) - Unique order item identifier
  - `order_id` (uuid, foreign key) - Reference to orders table
  - `product_id` (uuid, foreign key) - Reference to products table
  - `product_name` (text) - Product name snapshot
  - `quantity` (integer) - Quantity ordered
  - `unit_price` (decimal) - Price per unit at time of order
  - `total_price` (decimal) - Total price for this item
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Add policies for authenticated access to all business data
  - Policies ensure data can only be accessed by authenticated business users

  ## Notes
  1. All monetary values use decimal type for precision
  2. Timestamps use timestamptz for timezone awareness
  3. Foreign key constraints ensure data integrity
  4. Default values provided for boolean and timestamp fields
  5. Indexes will be added for frequently queried fields in future migrations
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'General',
  price decimal(10,2) NOT NULL DEFAULT 0,
  cost decimal(10,2) NOT NULL DEFAULT 0,
  stock_quantity integer NOT NULL DEFAULT 0,
  unit text DEFAULT 'jar',
  image_url text DEFAULT '',
  sku text UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  address text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  pincode text DEFAULT '',
  total_orders integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'pending',
  payment_method text DEFAULT 'cash',
  subtotal decimal(10,2) DEFAULT 0,
  tax decimal(10,2) DEFAULT 0,
  discount decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  notes text DEFAULT '',
  delivery_address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for customers
CREATE POLICY "Authenticated users can view customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for order_items
CREATE POLICY "Authenticated users can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);