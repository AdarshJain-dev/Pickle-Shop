'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../lib/store';
import { productsAPI } from '../../lib/api';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name_english: '',
    name_hindi: '',
    description: '',
    category: 'pickle',
    weight: '',
    price: '',
    stock_quantity: '',
    ingredients: '',
    shelf_life: '12 months',
    storage_instructions: 'Store in cool, dry place'
  });

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      toast.error('Access denied. Admin only.');
      router.push('/');
    } else {
      loadProducts();
    }
  }, [isAuthenticated, user, router]);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentProduct(null);
    setFormData({
      name_english: '',
      name_hindi: '',
      description: '',
      category: 'pickle',
      weight: '',
      price: '',
      stock_quantity: '',
      ingredients: '',
      shelf_life: '12 months',
      storage_instructions: 'Store in cool, dry place'
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setCurrentProduct(product);
    const variant = product.variants?.[0] || {};
    setFormData({
      name_english: product.name_english || '',
      name_hindi: product.name_hindi || '',
      description: product.description || '',
      category: product.category || 'pickle',
      weight: variant.weight || '',
      price: variant.price || '',
      stock_quantity: variant.stock_quantity || '',
      ingredients: product.ingredients || '',
      shelf_life: product.shelf_life || '12 months',
      storage_instructions: product.storage_instructions || 'Store in cool, dry place'
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name_english', formData.name_english);
      formDataToSend.append('name_hindi', formData.name_hindi);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('ingredients', formData.ingredients);
      formDataToSend.append('shelf_life', formData.shelf_life);
      formDataToSend.append('storage_instructions', formData.storage_instructions);

      const variants = JSON.stringify([{
        weight: formData.weight,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        sku: `${formData.category.toUpperCase()}-${formData.weight.replace(/\s/g, '')}`
      }]);
      formDataToSend.append('variants', variants);

      if (editMode && currentProduct) {
        const variantId = currentProduct.variants?.[0]?.id;
        if (variantId) {
          await productsAPI.updateVariant(variantId, {
            weight: formData.weight,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity),
            sku: `${formData.category.toUpperCase()}-${formData.weight.replace(/\s/g, '')}`
          });
        }
        await productsAPI.update(currentProduct.id, formDataToSend);
        toast.success('Product updated successfully!');
      } else {
        await productsAPI.create(formDataToSend);
        toast.success('Product created successfully!');
      }

      setShowModal(false);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.delete(productId);
      toast.success('Product deleted successfully!');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading && products.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* BIG Header with Add Button */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600 mt-1">Manage Your Products</p>
              </div>
              <button
                onClick={openAddModal}
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <Plus className="w-6 h-6" />
                <span className="font-bold">ADD NEW PRODUCT</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{products.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.variants?.[0]?.stock_quantity > 0).length}
              </div>
              <div className="text-sm text-gray-600">In Stock</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => (p.variants?.[0]?.stock_quantity || 0) === 0).length}
              </div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-accent-600">
                {products.filter(p => p.category === 'pickle').length}
              </div>
              <div className="text-sm text-gray-600">Pickles</div>
            </div>
          </div>

          {/* Products List - CARD STYLE with BIG BUTTONS */}
          <div className="space-y-4">
            {products.map((product) => {
              const variant = product.variants?.[0] || {};
              return (
                <div key={product.id} className="card p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {product.name_english}
                      </h3>
                      <p className="text-gray-600 mb-2">{product.name_hindi}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                          {product.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {variant.weight || 'N/A'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                          ₹{variant.price || 0}
                        </span>
                        <span className={`px-3 py-1 rounded-full font-semibold ${
                          (variant.stock_quantity || 0) > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          Stock: {variant.stock_quantity || 0}
                        </span>
                      </div>
                    </div>

                    {/* BIG ACTION BUTTONS */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        <Edit className="w-5 h-5" />
                        <span>EDIT</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {products.length === 0 && !loading && (
            <div className="card p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No products found</p>
              <button onClick={openAddModal} className="btn-primary">
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    name="name_english"
                    value={formData.name_english}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name (Hindi) *
                  </label>
                  <input
                    type="text"
                    name="name_hindi"
                    value={formData.name_hindi}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="pickle">Pickle</option>
                    <option value="masala">Achaar Masala</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight *
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 KG, 500g"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={2}
                  className="input-field"
                  placeholder="e.g., Mango, Mustard Oil, Salt, Spices"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 px-8 py-3 disabled:opacity-50 font-semibold"
                >
                  <Save className="w-5 h-5" />
                  <span>{editMode ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
