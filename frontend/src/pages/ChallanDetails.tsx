import { useEffect, useState } from 'react';
import {
  useNavigate,
  useParams
} from 'react-router-dom';

import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

import type { Challan } from '../types';

export default function ChallanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [challan, setChallan] =
    useState<Challan | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState('');

  const canConfirm =
    user?.role === 'ADMIN' ||
    user?.role === 'SALES' ||
    user?.role === 'WAREHOUSE';

  const canCancel =
    user?.role === 'ADMIN' ||
    user?.role === 'SALES';

  async function loadChallan() {
    if (!id) {
      setError('Challan ID is missing.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `/challans/${id}`
      );

      setChallan(response.data);
    } catch (error: any) {
      setError(
        error.response?.data?.message ??
          'Unable to load challan details.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChallan();
  }, [id]);

  function getStatusClass(
    status: Challan['status']
  ) {
    if (status === 'CONFIRMED') {
      return 'status-active';
    }

    if (status === 'CANCELLED') {
      return 'status-inactive';
    }

    return '';
  }

  async function handleConfirm() {
    if (!id) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to confirm this challan? Stock will be reduced.'
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');

      await api.post(
        `/challans/${id}/confirm`
      );

      await loadChallan();
    } catch (error: any) {
      setError(
        error.response?.data?.message ??
          'Unable to confirm challan.'
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!id) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to cancel this challan?'
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');

      await api.post(
        `/challans/${id}/cancel`
      );

      await loadChallan();
    } catch (error: any) {
      setError(
        error.response?.data?.message ??
          'Unable to cancel challan.'
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Challan Details</h1>

            <p>
              Loading challan information...
            </p>
          </div>
        </div>

        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !challan) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Challan Details</h1>

            <p>
              Unable to load this challan.
            </p>
          </div>
        </div>

        <div className="error">
          {error}
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            navigate('/challans')
          }
        >
          ← Back to Challans
        </button>
      </div>
    );
  }

  if (!challan) {
    return null;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>
            {challan.challan_number}
          </h1>

          <p>
            Sales challan details and items.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            navigate('/challans')
          }
        >
          ← Back to Challans
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

      <div className="card">
        <div className="dashboard-role">
          <span>Challan Number</span>

          <strong>
            {challan.challan_number}
          </strong>
        </div>

        <div className="dashboard-role">
          <span>Customer</span>

          <strong>
            {challan.customer_name ??
              challan.customer_id}
          </strong>
        </div>

        <div className="dashboard-role">
          <span>Status</span>

          <span
            className={`status-badge ${getStatusClass(
              challan.status
            )}`}
          >
            {challan.status}
          </span>
        </div>

        <div className="dashboard-role">
          <span>Total Quantity</span>

          <strong>
            {challan.total_quantity}
          </strong>
        </div>

        <div className="dashboard-role">
          <span>Created By</span>

          <strong>
            {challan.created_by_name ??
              challan.created_by}
          </strong>
        </div>

        <div className="dashboard-role">
          <span>Created At</span>

          <strong>
            {new Date(
              challan.created_at
            ).toLocaleString()}
          </strong>
        </div>

        <div className="dashboard-role">
          <span>Updated At</span>

          <strong>
            {new Date(
              challan.updated_at
            ).toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="table-card">
        <div className="card-section-header">
          <div>
            <h2>Challan Items</h2>

            <p>
              Products included in this challan.
            </p>
          </div>
        </div>

        {!challan.items ||
        challan.items.length === 0 ? (
          <div className="card">
            <p>
              No items found for this challan.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {challan.items.map(
                  (item, index) => (
                    <tr
                      key={
                        item.id ??
                        `${item.product_id}-${index}`
                      }
                    >
                      <td>
                        <strong>
                          {item.product_name_snapshot ??
                            item.product_id}
                        </strong>
                      </td>

                      <td>
                        {item.sku_snapshot ?? '—'}
                      </td>

                      <td>
                        {item.unit_price_snapshot !==
                          undefined &&
                        item.unit_price_snapshot !==
                          null
                          ? `₹${Number(
                              item.unit_price_snapshot
                            ).toFixed(2)}`
                          : '—'}
                      </td>

                      <td>
                        <strong>
                          {item.quantity}
                        </strong>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Challan Actions</h2>

        <p>
          Confirmation will reduce inventory stock.
          Cancellation will not reduce stock.
        </p>

        <div className="form-actions">
          {challan.status === 'DRAFT' &&
            canConfirm && (
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Processing...'
                  : 'Confirm Challan'}
              </button>
            )}

          {challan.status === 'DRAFT' &&
            canCancel && (
              <button
                className="secondary-button"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                Cancel Challan
              </button>
            )}

          {challan.status === 'DRAFT' &&
            !canConfirm &&
            !canCancel && (
              <p>
                You do not have permission to
                perform actions on this challan.
              </p>
            )}

          {challan.status ===
            'CONFIRMED' && (
            <p>
              This challan has already been
              confirmed.
            </p>
          )}

          {challan.status ===
            'CANCELLED' && (
            <p>
              This challan has been cancelled.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}