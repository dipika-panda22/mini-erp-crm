import { useEffect, useState } from 'react';

import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

import type { Product } from '../types';

import ProductForm from '../components/ProductForm';
import ProductEditForm from '../components/ProductEditForm';
import StockAdjustmentForm from '../components/StockAdjustmentForm';
import StockMovementHistory from '../components/StockMovementHistory';

export default function Products() {
  const { user } = useAuth();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] = useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [adjustingProduct, setAdjustingProduct] =
    useState<Product | null>(null);

  const [historyProduct, setHistoryProduct] =
    useState<Product | null>(null);

  const canManageInventory =
    user?.role === 'ADMIN' ||
    user?.role === 'WAREHOUSE';

  async function loadProducts() {
    try {
      setLoading(true);
      setError('');

      const response =
        await api.get('/products');

      const responseData = response.data;

      let productList: Product[] = [];

      if (Array.isArray(responseData)) {
        productList = responseData;
      } else if (
        Array.isArray(responseData?.data)
      ) {
        productList = responseData.data;
      }

      setProducts(productList);
    } catch (error: any) {
      setError(
        error.response?.data?.message ??
          'Unable to load products.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts =
    products.filter((product) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.sku
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText) ||
        product.warehouse_location
          .toLowerCase()
          .includes(searchText)
      );
    });

  function handleProductAdded() {
    setShowAddForm(false);
    loadProducts();
  }

  function handleProductUpdated() {
    setEditingProduct(null);
    loadProducts();
  }

  function handleStockAdjusted() {
    setAdjustingProduct(null);
    loadProducts();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products & Inventory</h1>

          <p>
            Manage products, stock and
            warehouse inventory.
          </p>
        </div>

        {canManageInventory && (
          <button
            onClick={() =>
              setShowAddForm(true)
            }
          >
            + Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card">
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="toolbar">
              <input
                className="search-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

              <span className="result-count">
                {filteredProducts.length}{' '}
                product
                {filteredProducts.length !==
                1
                  ? 's'
                  : ''}
              </span>
            </div>
          </div>

          {filteredProducts.length ===
          0 ? (
            <div className="card">
              <p>
                No products match your
                search.
              </p>
            </div>
          ) : (
            <div className="table-card">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Current Stock</th>
                      <th>Minimum Stock</th>
                      <th>Stock Status</th>
                      <th>Warehouse</th>

                      {canManageInventory && (
                        <th>Actions</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map(
                      (product) => {
                        const isLowStock =
                          product.low_stock ??
                          product.current_stock <=
                            product.minimum_stock;

                        return (
                          <tr
                            key={product.id}
                          >
                            <td>
                              <strong>
                                {product.name}
                              </strong>
                            </td>

                            <td>
                              {product.sku}
                            </td>

                            <td>
                              {product.category}
                            </td>

                            <td>
                              ₹
                              {Number(
                                product.unit_price
                              ).toFixed(2)}
                            </td>

                            <td>
                              <strong>
                                {
                                  product.current_stock
                                }
                              </strong>
                            </td>

                            <td>
                              {
                                product.minimum_stock
                              }
                            </td>

                            <td>
                              <span
                                className={`status-badge ${
                                  isLowStock
                                    ? 'status-inactive'
                                    : 'status-active'
                                }`}
                              >
                                {isLowStock
                                  ? 'Low Stock'
                                  : 'Stock OK'}
                              </span>
                            </td>

                            <td>
                              {
                                product.warehouse_location
                              }
                            </td>

                            {canManageInventory && (
                              <td>
                                <div className="table-actions">
                                  <button
                                    className="secondary-button"
                                    onClick={() =>
                                      setEditingProduct(
                                        product
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="secondary-button"
                                    onClick={() =>
                                      setAdjustingProduct(
                                        product
                                      )
                                    }
                                  >
                                    Adjust Stock
                                  </button>

                                  <button
                                    className="secondary-button"
                                    onClick={() =>
                                      setHistoryProduct(
                                        product
                                      )
                                    }
                                  >
                                    View Movements
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {showAddForm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <ProductForm
              onSuccess={
                handleProductAdded
              }
              onCancel={() =>
                setShowAddForm(false)
              }
            />
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <ProductEditForm
              product={editingProduct}
              onSuccess={
                handleProductUpdated
              }
              onCancel={() =>
                setEditingProduct(null)
              }
            />
          </div>
        </div>
      )}

      {adjustingProduct && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <StockAdjustmentForm
              product={adjustingProduct}
              onSuccess={
                handleStockAdjusted
              }
              onCancel={() =>
                setAdjustingProduct(null)
              }
            />
          </div>
        </div>
      )}

      {historyProduct && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <StockMovementHistory
              product={historyProduct}
              onClose={() =>
                setHistoryProduct(null)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}