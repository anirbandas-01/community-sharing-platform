import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Package, X, Plus, Minus,
  CheckCircle, Store, MapPin,Star
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

// ─── Cart Drawer ─────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClose, onUpdateQty, onRemove, onCheckout, placing, deliveryAddress, onAddressChange }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            <span className="ml-1 text-sm text-gray-500">({cart.length} items)</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  {item.photo ? (
                    <img src={item.photo} alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Package className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{item.business_name}</p>
                    <p className="text-primary-600 font-bold">₹{Number(item.price).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        disabled={item.qty >= item.stock}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Delivery Address */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => onAddressChange(e.target.value)}
                  rows={3}
                  placeholder="Enter your full delivery address: flat/house no, street, area, city, pincode..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                />
                {!deliveryAddress.trim() && (
                  <p className="text-xs text-red-500 mt-1">Delivery address is required to place an order.</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">
              Each item from the same business will be placed as a separate order.
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={onCheckout}
              loading={placing}
              disabled={placing || !deliveryAddress.trim()}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {placing ? 'Placing Orders...' : 'Place Order'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Order Success Modal ──────────────────────────────────────────────────────
function OrderSuccessModal({ orders, onClose, onViewOrders }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-600 mb-1">
          {orders.length} order{orders.length > 1 ? 's' : ''} placed successfully.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          The business will process your order shortly.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Continue Shopping
          </Button>
          <Button variant="primary" className="flex-1" onClick={onViewOrders}>
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, inCart }) {
  const outOfStock = product.stock === 0;

  return (
    <Card hover className="flex flex-col">
      <div className="relative -mt-6 -mx-6 mb-4 h-48 bg-gray-100 rounded-t-xl overflow-hidden">
        {product.photo ? (
          <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="default" size="sm">{product.category}</Badge>
        </div>
        {inCart && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{product.name}</h3>

        {/* Product rating */}
        <div className="flex items-center gap-1 mb-1">
          {product.rating ? (
            <>
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviews_count})</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">No reviews yet</span>
          )}
        </div>

        {/* Business + store rating */}
        <div className="flex items-center gap-1 mb-3">
          <Store className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 truncate">{product.business?.name}</span>
          {product.business?.city && (
            <span className="text-xs text-gray-400">· {product.business.city}</span>
          )}
          {product.business?.rating && (
            <span className="flex items-center gap-0.5 ml-1 text-xs text-amber-600 font-medium">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {product.business.rating}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              ₹{Number(product.price).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {outOfStock ? (
                <span className="text-red-500">Out of stock</span>
              ) : (
                <span className={product.stock <= 10 ? 'text-orange-500' : 'text-green-600'}>
                  {product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock} in stock`}
                </span>
              )}
            </p>
          </div>
          <Button
            variant={inCart ? 'outline' : 'primary'}
            size="sm"
            disabled={outOfStock}
            onClick={() => onAddToCart(product)}
          >
            {inCart ? (
              <><CheckCircle className="w-4 h-4 mr-1" />In Cart</>
            ) : (
              <><ShoppingCart className="w-4 h-4 mr-1" />Add</>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main ProductStore — shared for resident & professional
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProductStore({ menuItems, userType, DashboardLayout: Layout }) {
  const navigate = useNavigate();

  const [products, setProducts]           = useState([]);
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [cart, setCart]                   = useState([]);
  const [showCart, setShowCart]           = useState(false);
  const [placing, setPlacing]             = useState(false);
  const [successOrders, setSuccessOrders] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => { fetchProducts(); }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const res = await api.get('/store/products', { params });
      setProducts(res.data.products || []);
      if (res.data.categories) setCategories(res.data.categories);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.business?.name?.toLowerCase().includes(q)
    );
  });

  const addToCart = (product) => {
    setCart((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [
        ...prev,
        {
          id:            product.id,
          name:          product.name,
          photo:         product.photo,
          price:         product.price,
          stock:         product.stock,
          qty:           1,
          business_name: product.business?.name ?? 'Business',
          business_id:   product.business?.id,
        },
      ];
    });
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) { removeFromCart(id); return; }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.min(newQty, i.stock) } : i))
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0 || !deliveryAddress.trim()) return;
    setPlacing(true);

    const results = [];
    const failed  = [];

    for (const item of cart) {
      try {
        const res = await api.post('/store/orders', {
          product_id:       item.id,
          quantity:         item.qty,
          delivery_address: deliveryAddress.trim(),
        });
        results.push(res.data.order);
      } catch (err) {
        failed.push(item.name);
      }
    }

    setPlacing(false);

    if (results.length > 0) {
      setCart([]);
      setDeliveryAddress('');
      setShowCart(false);
      setSuccessOrders(results);
      fetchProducts();
    }

    if (failed.length > 0) {
      alert(`Failed to order: ${failed.join(', ')}. Please try again.`);
    }
  };

  return (
    <Layout menuItems={menuItems} userType={userType}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Shop</h1>
          <p className="text-gray-600">Browse products from local verified businesses</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <Input
          icon={Search}
          placeholder="Search products, categories, or businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0
            ${selectedCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'}`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0
              ${selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Product Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="text-center py-16">
          <Store className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No products are available right now. Check back later!'}
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              inCart={cart.some((i) => i.id === product.id)}
            />
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          placing={placing}
          deliveryAddress={deliveryAddress}
          onAddressChange={setDeliveryAddress}
        />
      )}

      {/* Order Success Modal */}
      {successOrders && (
        <OrderSuccessModal
          orders={successOrders}
          onClose={() => setSuccessOrders(null)}
          onViewOrders={() => {
            setSuccessOrders(null);
            navigate(`/${userType}/my-orders`);
          }}
        />
      )}
    </Layout>
  );
}