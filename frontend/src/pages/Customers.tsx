import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import type { Customer } from '../types';
import CustomerForm from '../components/CustomerForm';
import CustomerTable from '../components/CustomerTable';

interface CustomerResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function Customers() {
  const { user } = useAuth();

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0
    });

  const [showForm, setShowForm] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const loadCustomers = useCallback(
    async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await api.get<CustomerResponse>(
            '/customers',
            {
              params: {
                search: search || undefined,
                page,
                limit: 10
              }
            }
          );

        setCustomers(response.data.data);

        setPagination(
          response.data.pagination
        );
      } catch (error: any) {
        setError(
          error.response?.data?.message ??
            'Unable to load customers.'
        );
      } finally {
        setLoading(false);
      }
    },
    [search, page]
  );

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  function handleSearch(
    value: string
  ) {
    setSearch(value);
    setPage(1);
  }

  function openCreateForm() {
    setEditingCustomer(null);
    setShowForm(true);
  }

  function openEditForm(
    customer: Customer
  ) {
    setEditingCustomer(customer);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingCustomer(null);
    loadCustomers();
  }

  const canManageCustomers =
    user?.role === 'ADMIN' ||
    user?.role === 'SALES';

  const totalPages =
    Math.ceil(
      pagination.total /
        pagination.limit
    ) || 1;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Customers</h1>

          <p>
            Manage customer relationships,
            contacts and follow-ups.
          </p>
        </div>

        {canManageCustomers && (
          <button
            type="button"
            onClick={openCreateForm}
          >
            + Add Customer
          </button>
        )}
      </div>

      <div className="toolbar card">
        <input
          className="search-input"
          value={search}
          onChange={(event) =>
            handleSearch(
              event.target.value
            )
          }
          placeholder="Search customers..."
        />

        <span className="result-count">
          {pagination.total} customer
          {pagination.total === 1
            ? ''
            : 's'}
        </span>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <CustomerTable
        customers={customers}
        loading={loading}
        onEdit={openEditForm}
        onView={setSelectedCustomer}
      />

      <div className="pagination">
        <button
          type="button"
          className="secondary-button"
          disabled={page <= 1}
          onClick={() =>
            setPage((current) =>
              Math.max(
                1,
                current - 1
              )
            )
          }
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          className="secondary-button"
          disabled={
            page >= totalPages
          }
          onClick={() =>
            setPage((current) =>
              Math.min(
                totalPages,
                current + 1
              )
            )
          }
        >
          Next
        </button>
      </div>

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSuccess={
            handleFormSuccess
          }
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {selectedCustomer && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>
                  Customer Details
                </h2>

                <p>
                  {selectedCustomer.name}
                </p>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                ×
              </button>
            </div>

            <div className="details-grid">
              <div>
                <span>Name</span>
                <strong>
                  {selectedCustomer.name}
                </strong>
              </div>

              <div>
                <span>Mobile</span>
                <strong>
                  {selectedCustomer.mobile}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selectedCustomer.email ||
                    '—'}
                </strong>
              </div>

              <div>
                <span>Business</span>
                <strong>
                  {selectedCustomer.business_name ||
                    '—'}
                </strong>
              </div>

              <div>
                <span>Customer Type</span>
                <strong>
                  {selectedCustomer.customer_type}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedCustomer.status}
                </strong>
              </div>

              <div>
                <span>Follow-up</span>
                <strong>
                  {selectedCustomer.follow_up_date
                    ? new Date(
                        selectedCustomer.follow_up_date
                      ).toLocaleDateString()
                    : '—'}
                </strong>
              </div>

              <div className="full-width">
                <span>Address</span>
                <strong>
                  {selectedCustomer.address}
                </strong>
              </div>

              <div className="full-width">
                <span>Notes</span>
                <strong>
                  {selectedCustomer.notes ||
                    '—'}
                </strong>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}