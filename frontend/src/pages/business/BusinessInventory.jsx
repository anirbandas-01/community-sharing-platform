import { useState, useEffect } from "react";
import BusinessLayout from "../../components/business/BusinessLayout";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const BusinessInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    photo: null,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}/business/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load products");

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("category", formData.category);
    fd.append("price", formData.price);
    fd.append("stock", formData.stock);
    if (formData.photo) {
      fd.append("photo", formData.photo);
    }

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}/business/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: fd,
      });

      if (!response.ok) throw new Error("Failed to add product");

      alert("Product added successfully!");
      setShowModal(false);
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        photo: null,
      });
      loadProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE}/business/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      alert("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: "Out of Stock", class: "out-of-stock" };
    if (stock <= 5) return { status: "Low Stock", class: "low-stock" };
    return { status: "In Stock", class: "in-stock" };
  };

  return (
    <BusinessLayout>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Inventory Management</h3>
          <button
            className="ob"
            onClick={() => setShowModal(true)}
            style={{
              padding: "0.7rem 1.5rem",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const { status, class: statusClass } = getStockStatus(
                    product.stock
                  );
                  return (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <strong>₹{parseFloat(product.price).toFixed(2)}</strong>
                      </td>
                      <td>{product.stock} units</td>
                      <td>
                        <span className={`badge ${statusClass}`}>{status}</span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn edit">✏️</button>
                          <button
                            className="icon-btn delete"
                            onClick={() => deleteProduct(product.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="mo" style={{ display: "flex" }}>
          <div className="mc">
            <button className="cl" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <h3 className="mh">Add New Product</h3>

            <form onSubmit={handleSubmit}>
              <div className="fg">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Fresh Apples"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="fg">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="gr">
                <div className="fg">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="120"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="fg">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="50"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="fg">
                <label>Product Photo *</label>
                <input
                  type="file"
                  name="photo"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="bg">
                <button
                  type="button"
                  className="bc"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bs">
                  💾 Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BusinessLayout>
  );
};

export default BusinessInventory;