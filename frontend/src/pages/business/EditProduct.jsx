import { useState, useEffect } from 'react';
import { Package, Upload, ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import {
  Home, ShoppingCart, TrendingUp, MessageCircle, BarChart3, Settings, User as UserIcon, Star
} from 'lucide-react';

const menuItems = [
  { icon: Home,         label: 'Dashboard', path: '/business/dashboard' },
  { icon: Package,      label: 'Inventory',  path: '/business/inventory' },
  { icon: ShoppingCart, label: 'Orders',     path: '/business/orders' },
  { icon: TrendingUp,   label: 'Sales',      path: '/business/sales' },
  { icon: MessageCircle,label: 'Messages',   path: '/business/messages' },
  { icon: BarChart3,    label: 'Analytics',  path: '/business/analytics' },
  { icon: UserIcon,     label: 'Profile',    path: '/business/profile' },
  { icon: Settings,     label: 'Settings',   path: '/business/settings' },
  { icon: Star, label: 'Reviews', path: '/business/reviews' },
];

const categories = [
  'Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden',
  'Sports & Outdoors', 'Books & Media', 'Health & Beauty', 'Toys & Games',
  'Automotive', 'Office Supplies', 'Other',
];

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData]         = useState({
    name: '', category: '', price: '', stock: '', min_stock: '', photo: null,
  });
  const [existingPhoto, setExistingPhoto] = useState(null); // URL from server

  // Load existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/business/products/${id}`);
        const p   = res.data;
        setFormData({
          name:      p.name      ?? '',
          category:  p.category  ?? '',
          price:     p.price     ?? '',
          stock:     p.stock     ?? '',
          min_stock: p.min_stock ?? 10,
          photo:     null, // only set if user picks a new file
        });
        if (p.photo) setExistingPhoto(p.photo);
      } catch (err) {
        console.error('Error loading product:', err);
        alert('Failed to load product details.');
        navigate('/business/inventory');
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    setFormData({ ...formData, photo: file });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Use FormData so we can optionally include a new photo
      const data = new FormData();
      data.append('name',      formData.name);
      data.append('category',  formData.category);
      data.append('price',     formData.price);
      data.append('stock',     formData.stock);
      data.append('min_stock', formData.min_stock);
      if (formData.photo) data.append('photo', formData.photo);

      // Laravel requires _method spoofing for PUT with FormData
      data.append('_method', 'PUT');

      await api.post(`/business/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Product updated successfully!');
      navigate('/business/inventory');
    } catch (err) {
      console.error('Error updating product:', err);
      alert(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  // Active photo to display: new preview > existing server photo > nothing
  const displayPhoto = imagePreview || existingPhoto;

  if (fetching) {
    return (
      <DashboardLayout menuItems={menuItems} userType="business">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} userType="business">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/business/inventory')} className="mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Inventory
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update the details for this product</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: product details ── */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Product Information</h2>
              <div className="space-y-6">

                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="Price (₹)"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                  <Input
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                  <Input
                    label="Min Stock Alert"
                    name="min_stock"
                    type="number"
                    min="0"
                    value={formData.min_stock}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>

              </div>
            </Card>
          </div>

          {/* ── Right: image + actions ── */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Product Image</h2>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                onClick={() => document.getElementById('photo-upload').click()}
              >
                {displayPhoto ? (
                  <div>
                    <img
                      src={displayPhoto}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p className="text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload a new image</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="hidden"
              />
              {existingPhoto && !imagePreview && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Current image will be kept if you don't upload a new one.
                </p>
              )}
            </Card>

            <Card>
              <div className="space-y-3">
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/business/inventory')}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </form>
    </DashboardLayout>
  );
};

export default EditProduct;