import type { Customer } from '../types';

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  loading,
  onEdit,
  onView
}: CustomerTableProps) {
  if (loading) {
    return (
      <div className="card">
        <p>Loading customers...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="card">
        <p>No customers found.</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Business</th>
              <th>Type</th>
              <th>Status</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <strong>{customer.name}</strong>
                </td>

                <td>{customer.mobile}</td>

                <td>
                  {customer.business_name || '—'}
                </td>

                <td>
                  {customer.customer_type}
                </td>

                <td>
                  <span
                    className={`status-badge status-${customer.status.toLowerCase()}`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td>
                  {customer.follow_up_date
                    ? new Date(
                        customer.follow_up_date
                      ).toLocaleDateString()
                    : '—'}
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => onView(customer)}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => onEdit(customer)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}