import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Home, ShoppingCart, BarChart3, MessageCircle, Settings, User as UserIcon } from 'lucide-react';

const BusinessInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'in_stock', 'low_stock', 'out_of_stock'
  const [showAddModal, setShowAddModal] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/business/dashboard' },
    { icon: Package, label: 'Inventory', path: '/business/inventory', badge: '45' },
    { icon: ShoppingCart, label: 'Orders', path: '/business/orders', badge: '12' },
    { icon: TrendingUp, label: 'Sales', path: '/business/sales' },
    { icon: MessageCircle, label: 'Messages', path: '/business/messages', badge: '8' },
    { icon: BarChart3, label: 'Analytics', path: '/business/analytics' },
    { icon: UserIcon, label: 'Profile', path: '/business/profile' },
    { icon: Settings, label: 'Settings', path: '/business/settings' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business/inventory');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/business/inventory/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const getStockStatus = (current, minimum) => {
    if (current === 0) return { status: 'out_of_stock', color: 'danger', text: 'Out of Stock' };
    if (current <= minimum) return { status: 'low_stock', color: 'warning', text: 'Low Stock' };
    return { status: 'in_stock', color: 'success', text: 'In Stock' };
  };

  // Demo data
  const demoProducts = [
    {
      id: 1,
      name: 'Organic Rice (5kg)',
      category: 'Grains',
      sku: 'RICE-ORG-5K',
      price: 300,
      cost: 200,
      stock: 45,
      min_stock: 20,
      sold_this_month: 67,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Fresh Vegetables Pack',
      category: 'Vegetables',
      sku: 'VEG-PACK',
      price: 150,
      cost: 100,
      stock: 15,
      min_stock: 20,
      sold_this_month: 89,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop',
      trend: 'up'
    },
    {
      id: 3,
      name: 'Dairy Products Combo',
      category: 'Dairy',
      sku: 'DAIRY-COMBO',
      price: 250,
      cost: 180,
      stock: 8,
      min_stock: 15,
      sold_this_month: 54,
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
      trend: 'down'
    },
    {
      id: 4,
      name: 'Cooking Oil (2L)',
      category: 'Oil',
      sku: 'OIL-2L',
      price: 350,
      cost: 250,
      stock: 52,
      min_stock: 30,
      sold_this_month: 43,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
      trend: 'up'
    },
    {
      id: 5,
      name: 'Wheat Flour (10kg)',
      category: 'Flour',
      sku: 'FLOUR-WHT-10K',
      price: 400,
      cost: 300,
      stock: 0,
      min_stock: 15,
      sold_this_month: 38,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop',
      trend: 'down'
    },
    {
      id: 6,
      name: 'Sugar (1kg)',
      category: 'Sweeteners',
      sku: 'SUGAR-1K',
      price: 50,
      cost: 35,
      stock: 120,
      min_stock: 50,
      sold_this_month: 95,
      image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=200&h=200&fit=crop',
      trend: 'up'
    },
  ];

  const displayProducts = products.length > 0 ? products : demoProducts;

  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const stockStatus = getStockStatus(product.stock, product.min_stock).status;
    return matchesSearch && stockStatus === filterStatus;
  });

  // Calculate stats
  const totalValue = displayProducts.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const lowStockCount = displayProducts.filter(p => p.stock > 0 && p.stock <= p.min_stock).length;
  const outOfStockCount = displayProducts.filter(p => p.stock === 0).length;
  const totalProducts = displayProducts.length;

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product inventory</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{(totalValue / 1000).toFixed(1)}k</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All', count: displayProducts.length },
              { id: 'in_stock', label: 'In Stock', count: displayProducts.filter(p => p.stock > p.min_stock).length },
              { id: 'low_stock', label: 'Low Stock', count: lowStockCount },
              { id: 'out_of_stock', label: 'Out of Stock', count: outOfStockCount },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${filterStatus === filter.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Add your first product to get started'}
          </p>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </Card>
      ) : (
        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock, product.min_stock);
                  const profit = ((product.price - product.cost) / product.cost * 100).toFixed(0);

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">Profit: {profit}%</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="default" size="sm">{product.category}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{product.stock} units</div>
                        <div className="text-xs text-gray-500">Min: {product.min_stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={stockStatus.color}>{stockStatus.text}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <span>{product.sold_this_month}</span>
                          {product.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Product Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Product Name" placeholder="E.g., Organic Rice" required />
                <Input label="SKU" placeholder="E.g., RICE-ORG-5K" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Category" placeholder="E.g., Grains" required />
                <Input label="Price (₹)" type="number" placeholder="300" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Cost (₹)" type="number" placeholder="200" required />
                <Input label="Stock Quantity" type="number" placeholder="50" required />
              </div>
              <Input label="Minimum Stock Level" type="number" placeholder="20" required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <input type="file" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Add Product
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BusinessInventory;