import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import type { Challan } from '../types';
import ChallanForm from '../components/ChallanForm';

export default function Challans() {
  const navigate = useNavigate();

  const [challans, setChallans] =
    useState<Challan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] =
    useState('');

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  async function loadChallans() {
    try {
      setLoading(true);
      setError('');

      const response =
        await api.get('/challans');

      const responseData = response.data;

      let challanList: Challan[] = [];

      if (Array.isArray(responseData)) {
        challanList = responseData;
      } else if (
        Array.isArray(responseData?.data)
      ) {
        challanList = responseData.data;
      }

      setChallans(challanList);
    } catch (error: any) {
      setError(
        error.response?.data?.message ??
          'Unable to load challans.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChallans();
  }, []);

  const filteredChallans =
    challans.filter((challan) => {
      if (!statusFilter) {
        return true;
      }

      return (
        challan.status === statusFilter
      );
    });

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

  function handleChallanCreated() {
    setShowCreateForm(false);
    loadChallans();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Sales Challans</h1>

          <p>
            Create and manage sales challans.
          </p>
        </div>

        <button
          onClick={() =>
            setShowCreateForm(true)
          }
        >
          + Create Challan
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="card">
        <div className="toolbar">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="">
              All Statuses
            </option>

            <option value="DRAFT">
              Draft
            </option>

            <option value="CONFIRMED">
              Confirmed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <span className="result-count">
            {filteredChallans.length}{' '}
            challan
            {filteredChallans.length !== 1
              ? 's'
              : ''}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p>Loading challans...</p>
        </div>
      ) : filteredChallans.length ===
        0 ? (
        <div className="card">
          <h2>No Challans Found</h2>

          <p>
            There are no sales challans matching
            the selected filter.
          </p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Challan Number</th>
                  <th>Customer</th>
                  <th>Total Quantity</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredChallans.map(
                  (challan) => (
                    <tr key={challan.id}>
                      <td>
                        <strong>
                          {
                            challan.challan_number
                          }
                        </strong>
                      </td>

                      <td>
                        {challan.customer_name ??
                          challan.customer_id}
                      </td>

                      <td>
                        {challan.total_quantity}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            challan.status
                          )}`}
                        >
                          {challan.status}
                        </span>
                      </td>

                      <td>
                        {challan.created_by_name ??
                          challan.created_by}
                      </td>

                      <td>
                        {new Date(
                          challan.created_at
                        ).toLocaleString()}
                      </td>

                      <td>
                        <button
                          className="secondary-button"
                          onClick={() =>
                            navigate(
                              `/challans/${challan.id}`
                            )
                          }
                        >
                          View
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

      {showCreateForm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <ChallanForm
              onSuccess={
                handleChallanCreated
              }
              onCancel={() =>
                setShowCreateForm(false)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}