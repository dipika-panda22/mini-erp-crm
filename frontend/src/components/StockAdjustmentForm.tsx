import { useState } from 'react';
import api from '../lib/api';
import type { Product } from '../types';

interface StockAdjustmentFormProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StockAdjustmentForm({
  product,
  onSuccess,
  onCancel
}: StockAdjustmentFormProps) {
  const [movementType, setMovementType] =
    useState<'IN' | 'OUT'>('IN');

  const [quantity, setQuantity] = useState('');

  const [reason, setReason] = useState('');

  const [error, setError] = useState('');

  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError('');

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

    if (!reason.trim()) {
      setError('Reason is required.');
      return;
    }

    if (
      movementType === 'OUT' &&
      amount > product.current_stock
    ) {
      setError(
        `Insufficient stock. Available stock: ${product.current_stock}.`
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * The existing backend uses PUT /products/:id
       * for stock adjustments. The backend automatically
       * creates the corresponding stock movement.
       */

      const nextStock =
        movementType === 'IN'
          ? product.current_stock + amount
          : product.current_stock - amount;

      await api.put(
        `/products/${product.id}`,
        {
          current_stock: nextStock
        }
      );

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
            'Unable to adjust stock.'
        );
      }
    } finally {
      setSaving(false);
    }
  }

  const resultingStock =
    quantity &&
    Number.isInteger(Number(quantity))
      ? movementType === 'IN'
        ? product.current_stock +
          Number(quantity)
        : product.current_stock -
          Number(quantity)
      : product.current_stock;

  return (
    <form
      className="customer-form"
      onSubmit={handleSubmit}
    >
      <div className="modal-header">
        <div>
          <h2>Stock Adjustment</h2>

          <p>
            {product.name} · {product.sku}
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

      <div className="card">
        <div className="dashboard-role">
          <span>Current Stock</span>

          <strong>
            {product.current_stock}
          </strong>
        </div>

        <div className="dashboard-role">
          <span>Minimum Stock</span>

          <strong>
            {product.minimum_stock}
          </strong>
        </div>

        <div className="dashboard-role">
          <span>Resulting Stock</span>

          <strong>
            {resultingStock}
          </strong>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Movement Type *
          <select
            value={movementType}
            onChange={(event) =>
              setMovementType(
                event.target.value as
                  | 'IN'
                  | 'OUT'
              )
            }
          >
            <option value="IN">
              IN — Add Stock
            </option>

            <option value="OUT">
              OUT — Remove Stock
            </option>
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
              setQuantity(event.target.value)
            }
            placeholder="Enter quantity"
          />
        </label>

        <label className="full-width">
          Reason *
          <textarea
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            placeholder="e.g. New stock received, damaged stock, manual adjustment"
            rows={3}
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
            : 'Adjust Stock'}
        </button>
      </div>
    </form>
  );
}