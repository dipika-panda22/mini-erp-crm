import { useEffect, useState } from 'react';
import api from '../lib/api';
import type { Customer } from '../types';

interface CustomerFormProps {
  customer?: Customer | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface CustomerFormData {
  name: string;
  mobile: string;
  email: string;
  business_name: string;
  gst_number: string;
  customer_type: Customer['customer_type'];
  address: string;
  status: Customer['status'];
  follow_up_date: string;
  notes: string;
}

const emptyForm: CustomerFormData = {
  name: '',
  mobile: '',
  email: '',
  business_name: '',
  gst_number: '',
  customer_type: 'RETAIL',
  address: '',
  status: 'LEAD',
  follow_up_date: '',
  notes: ''
};

export default function CustomerForm({
  customer,
  onSuccess,
  onCancel
}: CustomerFormProps) {
  const [form, setForm] =
    useState<CustomerFormData>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(customer);

  useEffect(() => {
    if (!customer) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email ?? '',
      business_name:
        customer.business_name ?? '',
      gst_number: customer.gst_number ?? '',
      customer_type: customer.customer_type,
      address: customer.address,
      status: customer.status,
      follow_up_date: customer.follow_up_date
        ? customer.follow_up_date.slice(0, 10)
        : '',
      notes: customer.notes ?? ''
    });
  }, [customer]);

  function updateField(
    field: keyof CustomerFormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');

    if (!form.name.trim()) {
      setError('Customer name is required.');
      return;
    }

    if (!form.mobile.trim()) {
      setError('Mobile number is required.');
      return;
    }

    if (!form.address.trim()) {
      setError('Address is required.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim() || undefined,
        business_name:
          form.business_name.trim() || undefined,
        gst_number:
          form.gst_number.trim() || undefined,
        customer_type: form.customer_type,
        address: form.address.trim(),
        status: form.status,
        follow_up_date:
          form.follow_up_date || undefined,
        notes: form.notes.trim() || undefined
      };

      if (isEditing && customer) {
        await api.put(
          `/customers/${customer.id}`,
          payload
        );
      } else {
        await api.post('/customers', payload);
      }

      onSuccess();
    } catch (error: any) {
      const fieldErrors =
        error.response?.data?.errors;

      if (fieldErrors) {
        const firstError =
          Object.values(fieldErrors)[0];

        setError(
          Array.isArray(firstError)
            ? String(firstError[0])
            : String(firstError)
        );
      } else {
        setError(
          error.response?.data?.message ??
            'Unable to save customer.'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>
              {isEditing
                ? 'Edit Customer'
                : 'Add Customer'}
            </h2>

            <p>
              {isEditing
                ? 'Update customer information.'
                : 'Enter the customer details.'}
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <form
          className="customer-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <label>
              Customer Name *
              <input
                value={form.name}
                onChange={(event) =>
                  updateField(
                    'name',
                    event.target.value
                  )
                }
                placeholder="Customer name"
              />
            </label>

            <label>
              Mobile *
              <input
                value={form.mobile}
                onChange={(event) =>
                  updateField(
                    'mobile',
                    event.target.value
                  )
                }
                placeholder="Mobile number"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    'email',
                    event.target.value
                  )
                }
                placeholder="Email address"
              />
            </label>

            <label>
              Business Name
              <input
                value={form.business_name}
                onChange={(event) =>
                  updateField(
                    'business_name',
                    event.target.value
                  )
                }
                placeholder="Business name"
              />
            </label>

            <label>
              GST Number
              <input
                value={form.gst_number}
                onChange={(event) =>
                  updateField(
                    'gst_number',
                    event.target.value
                  )
                }
                placeholder="GST number"
              />
            </label>

            <label>
              Customer Type *
              <select
                value={form.customer_type}
                onChange={(event) =>
                  updateField(
                    'customer_type',
                    event.target.value
                  )
                }
              >
                <option value="RETAIL">
                  Retail
                </option>

                <option value="WHOLESALE">
                  Wholesale
                </option>

                <option value="DISTRIBUTOR">
                  Distributor
                </option>
              </select>
            </label>

            <label>
              Status *
              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    'status',
                    event.target.value
                  )
                }
              >
                <option value="LEAD">Lead</option>
                <option value="ACTIVE">
                  Active
                </option>
                <option value="INACTIVE">
                  Inactive
                </option>
              </select>
            </label>

            <label>
              Follow-up Date
              <input
                type="date"
                value={form.follow_up_date}
                onChange={(event) =>
                  updateField(
                    'follow_up_date',
                    event.target.value
                  )
                }
              />
            </label>

            <label className="full-width">
              Address *
              <textarea
                value={form.address}
                onChange={(event) =>
                  updateField(
                    'address',
                    event.target.value
                  )
                }
                placeholder="Customer address"
                rows={3}
              />
            </label>

            <label className="full-width">
              Notes
              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    'notes',
                    event.target.value
                  )
                }
                placeholder="Customer notes"
                rows={3}
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : isEditing
                  ? 'Update Customer'
                  : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}