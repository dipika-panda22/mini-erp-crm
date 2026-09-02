import { useEffect, useState } from 'react';
import api from '../lib/api';
import type { Product } from '../types';

interface ProductEditFormProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductEditForm({
  product,
  onSuccess,
  onCancel
}: ProductEditFormProps) {
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [category, setCategory] = useState(
    product.category
  );
  const [unitPrice, setUnitPrice] = useState(
    String(product.unit_price)
  );
  const [currentStock, setCurrentStock] = useState(
    String(product.current_stock)
  );
  const [minimumStock, setMinimumStock] = useState(
    String(product.minimum_stock)
  );
  const [warehouseLocation, setWarehouseLocation] =
    useState(product.warehouse_location);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(product.name);
    setSku(product.sku);
    setCategory(product.category);
    setUnitPrice(String(product.unit_price));
    setCurrentStock(String(product.current_stock));
    setMinimumStock(String(product.minimum_stock));
    setWarehouseLocation(product.warehouse_location);
  }, [product]);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError('');

    if (
      !name.trim() ||
      !sku.trim() ||
      !category.trim() ||
      !unitPrice ||
      !currentStock ||
      !minimumStock ||
      !warehouseLocation.trim()
    ) {
      setError('Please fill in all fields.');
      return;
    }

    const price = Number(unitPrice);
    const stock = Number(currentStock);
    const minimum = Number(minimumStock);

    if (
      Number.isNaN(price) ||
      price < 0
    ) {
      setError('Unit price must be 0 or greater.');
      return;
    }

    if (
      Number.isNaN(stock) ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        'Current stock must be a whole number of 0 or greater.'
      );
      return;
    }

    if (
      Number.isNaN(minimum) ||
      !Number.isInteger(minimum) ||
      minimum < 0
    ) {
      setError(
        'Minimum stock must be a whole number of 0 or greater.'
      );
      return;
    }

    try {
      setSaving(true);

      await api.put(`/products/${product.id}`, {
        name: name.trim(),
        sku: sku.trim(),
        category: category.trim(),
        unit_price: price,
        current_stock: stock,
        minimum_stock: minimum,
        warehouse_location:
          warehouseLocation.trim()
      });

      onSuccess();
    } catch (error: any) {
      const fieldErrors =
        error.response?.data?.errors;

      if (fieldErrors) {
        const firstError = Object.values(
          fieldErrors
        )[0];

        if (Array.isArray(firstError)) {
          setError(String(firstError[0]));
        } else {
          setError(String(firstError));
        }
      } else {
        setError(
          error.response?.data?.message ??
            'Unable to update product.'
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="customer-form"
      onSubmit={handleSubmit}
    >
      <div className="modal-header">
        <div>
          <h2>Edit Product</h2>

          <p>
            Update product and inventory information.
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
        <div className="error">
          {error}
        </div>
      )}

      <div className="form-grid">
        <label>
          Product Name *
          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </label>

        <label>
          SKU *
          <input
            type="text"
            value={sku}
            onChange={(event) =>
              setSku(event.target.value)
            }
          />
        </label>

        <label>
          Category *
          <input
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          />
        </label>

        <label>
          Unit Price *
          <input
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(event) =>
              setUnitPrice(event.target.value)
            }
          />
        </label>

        <label>
          Current Stock *
          <input
            type="number"
            min="0"
            step="1"
            value={currentStock}
            onChange={(event) =>
              setCurrentStock(event.target.value)
            }
          />
        </label>

        <label>
          Minimum Stock *
          <input
            type="number"
            min="0"
            step="1"
            value={minimumStock}
            onChange={(event) =>
              setMinimumStock(event.target.value)
            }
          />
        </label>

        <label className="full-width">
          Warehouse Location *
          <input
            type="text"
            value={warehouseLocation}
            onChange={(event) =>
              setWarehouseLocation(
                event.target.value
              )
            }
          />
        </label>
      </div>

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
          disabled={saving}
        >
          {saving
            ? 'Updating...'
            : 'Update Product'}
        </button>
      </div>
    </form>
  );
}