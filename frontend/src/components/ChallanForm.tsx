import { useEffect, useState } from 'react';
import api from '../lib/api';
import type {
  Customer,
  Product
} from '../types';

interface ChallanItemDraft {
  product_id: string;
  product_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
}

interface ChallanFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ChallanForm({
  onSuccess,
  onCancel
}: ChallanFormProps) {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [customerId, setCustomerId] =
    useState('');

  const [selectedProductId, setSelectedProductId] =
    useState('');

  const [quantity, setQuantity] =
    useState('');

  const [items, setItems] =
    useState<ChallanItemDraft[]>([]);

  const [loadingData, setLoadingData] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function loadFormData() {
      try {
        setLoadingData(true);
        setError('');

        const [
          customersResponse,
          productsResponse
        ] = await Promise.all([
          api.get('/customers'),
          api.get('/products')
        ]);

        const customerData =
          customersResponse.data;

        const productData =
          productsResponse.data;

        let customerList: Customer[] = [];

        let productList: Product[] = [];

        if (Array.isArray(customerData)) {
          customerList = customerData;
        } else if (
          Array.isArray(customerData?.data)
        ) {
          customerList = customerData.data;
        }

        if (Array.isArray(productData)) {
          productList = productData;
        } else if (
          Array.isArray(productData?.data)
        ) {
          productList = productData.data;
        }

        setCustomers(customerList);
        setProducts(productList);
      } catch (error: any) {
        setError(
          error.response?.data?.message ??
            'Unable to load customers and products.'
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadFormData();
  }, []);

  function handleAddItem() {
    setError('');

    if (!selectedProductId) {
      setError('Please select a product.');
      return;
    }

    const amount = Number(quantity);

    if (
      !Number.isInteger(amount) ||
      amount <= 0
    ) {
      setError(
        'Quantity must be a positive whole number.'
      );
      return;
    }

    const product = products.find(
      (item) =>
        item.id === selectedProductId
    );

    if (!product) {
      setError('Selected product was not found.');
      return;
    }

    const existingItem = items.find(
      (item) =>
        item.product_id === selectedProductId
    );

    if (existingItem) {
      setError(
        'This product is already added. Update its quantity instead.'
      );
      return;
    }

    if (amount > product.current_stock) {
      setError(
        `Insufficient stock for ${product.name}. Available stock: ${product.current_stock}.`
      );
      return;
    }

    setItems([
      ...items,
      {
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        unit_price: Number(
          product.unit_price
        ),
        quantity: amount
      }
    ]);

    setSelectedProductId('');
    setQuantity('');
  }

  function handleRemoveItem(
    productId: string
  ) {
    setItems(
      items.filter(
        (item) =>
          item.product_id !== productId
      )
    );
  }

  function handleQuantityChange(
    productId: string,
    value: string
  ) {
    const amount = Number(value);

    setItems(
      items.map((item) => {
        if (
          item.product_id !== productId
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            Number.isInteger(amount) &&
            amount > 0
              ? amount
              : 0
        };
      })
    );
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError('');

    if (!customerId) {
      setError('Please select a customer.');
      return;
    }

    if (items.length === 0) {
      setError(
        'Please add at least one product.'
      );
      return;
    }

    const invalidItem = items.find(
      (item) =>
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
    );

    if (invalidItem) {
      setError(
        'All product quantities must be positive whole numbers.'
      );
      return;
    }

    try {
      setSaving(true);

      await api.post('/challans', {
        customer_id: customerId,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      });

      onSuccess();
    } catch (error: any) {
      const fieldErrors =
        error.response?.data?.errors;

      if (fieldErrors) {
        const firstError =
          Object.values(fieldErrors)[0];

        if (Array.isArray(firstError)) {
          setError(String(firstError[0]));
        } else {
          setError(String(firstError));
        }
      } else {
        setError(
          error.response?.data?.message ??
            'Unable to create challan.'
        );
      }
    } finally {
      setSaving(false);
    }
  }

  const totalQuantity = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const selectedProduct = products.find(
    (product) =>
      product.id === selectedProductId
  );

  return (
    <form
      className="customer-form"
      onSubmit={handleSubmit}
    >
      <div className="modal-header">
        <div>
          <h2>Create Sales Challan</h2>

          <p>
            Create a new challan as a draft.
          </p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onCancel}
          disabled={saving}
        >
          ×
        </button>
      </div>

      {error && (
        <div
          className="error"
          role="alert"
        >
          {error}
        </div>
      )}

      {loadingData ? (
        <div className="card">
          <p>
            Loading customers and products...
          </p>
        </div>
      ) : (
        <>
          <div className="form-grid">
            <label className="full-width">
              Customer *
              <select
                value={customerId}
                onChange={(event) =>
                  setCustomerId(
                    event.target.value
                  )
                }
                disabled={saving}
              >
                <option value="">
                  Select customer
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name}
                      {customer.business_name
                        ? ` — ${customer.business_name}`
                        : ''}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          <div className="card">
            <h3>Add Products</h3>

            <div className="form-grid">
              <label>
                Product *
                <select
                  value={
                    selectedProductId
                  }
                  onChange={(event) =>
                    setSelectedProductId(
                      event.target.value
                    )
                  }
                  disabled={saving}
                >
                  <option value="">
                    Select product
                  </option>

                  {products.map(
                    (product) => (
                      <option
                        key={product.id}
                        value={product.id}
                      >
                        {product.name} (
                        {product.sku}) — Stock:{' '}
                        {product.current_stock}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                Quantity *
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                  placeholder="Enter quantity"
                  disabled={saving}
                />
              </label>
            </div>

            {selectedProduct && (
              <div className="dashboard-role">
                <span>
                  Available Stock
                </span>

                <strong>
                  {
                    selectedProduct.current_stock
                  }
                </strong>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handleAddItem}
                disabled={saving}
              >
                + Add Product
              </button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="table-card">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map(
                      (item) => (
                        <tr
                          key={
                            item.product_id
                          }
                        >
                          <td>
                            <strong>
                              {
                                item.product_name
                              }
                            </strong>
                          </td>

                          <td>
                            {item.sku}
                          </td>

                          <td>
                            ₹
                            {item.unit_price.toFixed(
                              2
                            )}
                          </td>

                          <td>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={
                                item.quantity
                              }
                              onChange={(
                                event
                              ) =>
                                handleQuantityChange(
                                  item.product_id,
                                  event.target
                                    .value
                                )
                              }
                              disabled={
                                saving
                              }
                              style={{
                                width: '90px'
                              }}
                            />
                          </td>

                          <td>
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() =>
                                handleRemoveItem(
                                  item.product_id
                                )
                              }
                              disabled={
                                saving
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card">
            <div className="dashboard-role">
              <span>
                Total Products
              </span>

              <strong>
                {items.length}
              </strong>
            </div>

            <div className="dashboard-role">
              <span>
                Total Quantity
              </span>

              <strong>
                {totalQuantity}
              </strong>
            </div>

            <p>
              The challan will be created as
              <strong> DRAFT</strong>.
              Stock will not be reduced until
              the challan is confirmed.
            </p>
          </div>
        </>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            loadingData ||
            items.length === 0 ||
            !customerId
          }
        >
          {saving
            ? 'Creating...'
            : 'Create Draft Challan'}
        </button>
      </div>
    </form>
  );
}