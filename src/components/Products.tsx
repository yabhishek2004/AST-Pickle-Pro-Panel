import React, { useEffect, useState } from 'react';
import { supabase, localStorageHelpers, useLocalStorage, type Product } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';

export default function Products() {
  const { theme, themeColors } = useTheme();
  
  // Optimized theme classes - memoized to prevent re-computation
  const classes = React.useMemo(() => {
    switch (theme) {
      case 'emerald':
        return {
          primary: 'from-emerald-600 to-teal-600',
          accent: 'emerald-600',
          focus: 'focus:ring-emerald-500',
          hover: 'hover:bg-emerald-700'
        };
      case 'blue':
        return {
          primary: 'from-blue-600 to-cyan-600',
          accent: 'blue-600',
          focus: 'focus:ring-blue-500',
          hover: 'hover:bg-blue-700'
        };
      case 'purple':
        return {
          primary: 'from-purple-600 to-pink-600',
          accent: 'purple-600',
          focus: 'focus:ring-purple-500',
          hover: 'hover:bg-purple-700'
        };
      case 'orange':
        return {
          primary: 'from-orange-600 to-red-600',
          accent: 'orange-600',
          focus: 'focus:ring-orange-500',
          hover: 'hover:bg-orange-700'
        };
      default:
        return {
          primary: 'from-emerald-600 to-teal-600',
          accent: 'emerald-600',
          focus: 'focus:ring-emerald-500',
          hover: 'hover:bg-emerald-700'
        };
    }
  }, [theme]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    stock_quantity: '',
    unit: 'jar',
    sku: '',
    image_url: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    try {
      // Always use local storage since Supabase is not configured
      console.log('Fetching products from local storage');
      const data = localStorageHelpers.getProducts();
      setProducts(data);
      console.log('Products loaded from local storage:', data.length);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock_quantity: parseInt(formData.stock_quantity),
      unit: formData.unit,
      sku: formData.sku,
      image_url: formData.image_url,
      is_active: true,
    };

    try {
      // Always use local storage since Supabase is not configured
      console.log('Using local storage for product save');
      
      if (editingProduct) {
        const updated = localStorageHelpers.updateProduct(editingProduct.id, productData);
        if (!updated) throw new Error('Product not found');
        console.log('Product updated successfully');
      } else {
        const newProduct = localStorageHelpers.addProduct(productData);
        console.log('Product added successfully:', newProduct);
      }

      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product to local storage. Please try again.');
    }
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      // Always use local storage since Supabase is not configured
      console.log('Deleting product from local storage:', id);
      const success = localStorageHelpers.deleteProduct(id);
      if (!success) throw new Error('Product not found');
      console.log('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product from local storage. Please try again.');
    }
  }

  function openModal(product?: Product) {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        cost: product.cost.toString(),
        stock_quantity: product.stock_quantity.toString(),
        unit: product.unit,
        sku: product.sku,
        image_url: product.image_url,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        cost: '',
        stock_quantity: '',
        unit: 'jar',
        sku: '',
        image_url: '',
      });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProduct(null);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-600 mt-1">Manage your pickle inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              localStorageHelpers.recalculateProductStock();
              fetchProducts();
              alert('Product stock recalculated successfully!');
            }}
            className={`bg-gradient-to-r ${classes.primary} text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Recalculate Stock</span>
          </button>
          <button
            onClick={() => openModal()}
            className={`bg-gradient-to-r ${classes.primary} text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${classes.focus} focus:border-transparent`}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Start by adding your first pickle product to the inventory.</p>
          <button
            onClick={() => openModal()}
            className={`bg-${classes.accent} text-white px-6 py-2 rounded-lg ${classes.hover} transition-colors`}
          >
            Add First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onLoad={() => {
                      console.log('Image loaded successfully:', product.image_url);
                    }}
                    onError={(e) => {
                      console.log('Image failed to load:', product.image_url);
                      // Fallback to emoji if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`text-6xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center w-full h-full ${product.image_url ? 'hidden' : 'flex'}`}>
                  🥒
                </div>
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                  product.stock_quantity < 10
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {product.stock_quantity} {product.unit}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description || 'No description'}</p>
                    <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-xl font-bold text-emerald-600">₹{product.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">SKU</p>
                    <p className="text-sm font-medium text-gray-700">{product.sku || '-'}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(product)}
                    className="flex-1 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${classes.primary} p-6 text-white`}>
              <h3 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-emerald-100 mt-1">
                {editingProduct ? 'Update product information' : 'Enter details for your new pickle product'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Mango Pickle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Traditional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="jar">Jar</option>
                    <option value="kg">Kilogram</option>
                    <option value="g">Gram</option>
                    <option value="bottle">Bottle</option>
                    <option value="packet">Packet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/product-image.jpg"
                  onPaste={(e) => {
                    // Handle paste events better and clean up concatenated URLs
                    const pastedText = e.clipboardData.getData('text');
                    // Clean up concatenated URLs by finding the first complete URL
                    const urlMatch = pastedText.match(/https?:\/\/[^\s]+/);
                    const cleanUrl = urlMatch ? urlMatch[0] : pastedText;
                    setFormData({ ...formData, image_url: cleanUrl });
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">Enter the URL of the product image</p>
                {formData.image_url && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Preview:</p>
                    <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs" style={{display: 'none'}}>
                        Invalid URL
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Clean up concatenated URLs
                          const urlMatch = formData.image_url.match(/https?:\/\/[^\s]+/);
                          if (urlMatch) {
                            setFormData({ ...formData, image_url: urlMatch[0] });
                          }
                        }}
                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                      >
                        Fix URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className={`flex-1 bg-gradient-to-r ${classes.primary} text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium`}
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
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
