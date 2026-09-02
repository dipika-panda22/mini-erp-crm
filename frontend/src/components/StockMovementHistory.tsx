import { useEffect, useState } from 'react';
import api from '../lib/api';
import type {
  Product,
  StockMovement
} from '../types';

interface StockMovementHistoryProps {
  product: Product;
  onClose: () => void;
}

export default function StockMovementHistory({
  product,
  onClose
}: StockMovementHistoryProps) {
  const [movements, setMovements] =
    useState<StockMovement[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadMovements() {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `/products/${product.id}/stock-movements`
      );

      const responseData = response.data;

      let movementList: StockMovement[] = [];

      if (Array.isArray(responseData)) {
        movementList = responseData;
      } else if (
        Array.isArray(responseData?.data)
      ) {
        movementList = responseData.data;
      }

      setMovements(movementList);
    } catch (error: any) {
      setError(
        error.response?.data?.message ??
          'Unable to load stock movements.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
  }, [product.id]);

  return (
    <div className="customer-form">
      <div className="modal-header">
        <div>
          <h2>Stock Movement History</h2>

          <p>
            {product.name} · {product.sku}
          </p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card">
          <p>
            Loading stock movements...
          </p>
        </div>
      ) : movements.length === 0 ? (
        <div className="card">
          <p>
            No stock movements found for this
            product.
          </p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                  <th>Created By</th>
                </tr>
              </thead>

              <tbody>
                {movements.map(
                  (movement) => (
                    <tr key={movement.id}>
                      <td>
                        {new Date(
                          movement.created_at
                        ).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            movement.movement_type ===
                            'IN'
                              ? 'status-active'
                              : 'status-inactive'
                          }`}
                        >
                          {movement.movement_type}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {movement.quantity}
                        </strong>
                      </td>

                      <td>
                        {movement.reason}
                      </td>

                      <td>
                        {movement.created_by_name ??
                          movement.created_by}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}