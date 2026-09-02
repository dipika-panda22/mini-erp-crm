import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

import type {
  Challan,
  Customer,
  Product
} from '../types';

interface DashboardStats {
  customers: number;
  products: number;
  lowStockProducts: number;
  challans: number;
  confirmedChallans: number;
  draftChallans: number;
  cancelledChallans: number;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] =
    useState<DashboardStats>({
      customers: 0,
      products: 0,
      lowStockProducts: 0,
      challans: 0,
      confirmedChallans: 0,
      draftChallans: 0,
      cancelledChallans: 0
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const canViewCustomers =
    user?.role === 'ADMIN' ||
    user?.role === 'SALES';

  const canViewInventory =
    user?.role === 'ADMIN' ||
    user?.role === 'WAREHOUSE';

  const canViewChallans =
    user?.role === 'ADMIN' ||
    user?.role === 'SALES' ||
    user?.role === 'WAREHOUSE';

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        setLoading(true);
        setError('');

        const requests: Promise<any>[] = [];

        if (canViewCustomers) {
          requests.push(
            api.get('/customers')
          );
        }

        if (canViewInventory) {
          requests.push(
            api.get('/products')
          );
        }

        if (canViewChallans) {
          requests.push(
            api.get('/challans')
          );
        }

        const responses =
          await Promise.all(requests);

        let customerList: Customer[] = [];
        let productList: Product[] = [];
        let challanList: Challan[] = [];

        let responseIndex = 0;

        if (canViewCustomers) {
          const customerData =
            responses[responseIndex].data;

          responseIndex++;

          if (Array.isArray(customerData)) {
            customerList = customerData;
          } else if (
            Array.isArray(customerData?.data)
          ) {
            customerList = customerData.data;
          }
        }

        if (canViewInventory) {
          const productData =
            responses[responseIndex].data;

          responseIndex++;

          if (Array.isArray(productData)) {
            productList = productData;
          } else if (
            Array.isArray(productData?.data)
          ) {
            productList = productData.data;
          }
        }

        if (canViewChallans) {
          const challanData =
            responses[responseIndex].data;

          if (Array.isArray(challanData)) {
            challanList = challanData;
          } else if (
            Array.isArray(challanData?.data)
          ) {
            challanList = challanData.data;
          }
        }

        setStats({
          customers: customerList.length,

          products: productList.length,

          lowStockProducts:
            productList.filter(
              (product) =>
                product.low_stock ??
                product.current_stock <=
                  product.minimum_stock
            ).length,

          challans: challanList.length,

          confirmedChallans:
            challanList.filter(
              (challan) =>
                challan.status === 'CONFIRMED'
            ).length,

          draftChallans:
            challanList.filter(
              (challan) =>
                challan.status === 'DRAFT'
            ).length,

          cancelledChallans:
            challanList.filter(
              (challan) =>
                challan.status === 'CANCELLED'
            ).length
        });
      } catch (error: any) {
        setError(
          error.response?.data?.message ??
            'Unable to load dashboard statistics.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardStats();
  }, [
    canViewCustomers,
    canViewInventory,
    canViewChallans
  ]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, {user?.name ?? 'User'}.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="error"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        {canViewCustomers && (
          <Link
            to="/customers"
            className="dashboard-card"
          >
            <div className="dashboard-card-icon">
              CRM
            </div>

            <div>
              <h3>Customers</h3>

              <p>
                Manage customers, contacts and
                follow-ups.
              </p>

              <strong className="dashboard-stat">
                {loading
                  ? '...'
                  : stats.customers}{' '}
                Customers
              </strong>
            </div>
          </Link>
        )}

        {canViewInventory && (
          <Link
            to="/products"
            className="dashboard-card"
          >
            <div className="dashboard-card-icon">
              INV
            </div>

            <div>
              <h3>Products & Inventory</h3>

              <p>
                View products, stock and stock
                movements.
              </p>

              <strong className="dashboard-stat">
                {loading
                  ? '...'
                  : stats.products}{' '}
                Products
              </strong>
            </div>
          </Link>
        )}

        {canViewChallans && (
          <Link
            to="/challans"
            className="dashboard-card"
          >
            <div className="dashboard-card-icon">
              SAL
            </div>

            <div>
              <h3>Sales Challans</h3>

              <p>
                Create, confirm and manage sales
                challans.
              </p>

              <strong className="dashboard-stat">
                {loading
                  ? '...'
                  : stats.challans}{' '}
                Challans
              </strong>
            </div>
          </Link>
        )}

        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            ROL
          </div>

          <div>
            <h3>Your Role</h3>

            <p>
              Currently signed in as{' '}
              <strong>{user?.role}</strong>.
            </p>
          </div>
        </div>
      </div>

      {!loading && canViewInventory && (
        <div className="card">
          <h2>Inventory Overview</h2>

          <div className="dashboard-role">
            <span>Total Products</span>

            <strong>
              {stats.products}
            </strong>
          </div>

          <div className="dashboard-role">
            <span>Low Stock Products</span>

            <strong>
              {stats.lowStockProducts}
            </strong>
          </div>
        </div>
      )}

      {!loading && canViewChallans && (
        <div className="card">
          <h2>Challan Overview</h2>

          <div className="dashboard-role">
            <span>Total Challans</span>

            <strong>
              {stats.challans}
            </strong>
          </div>

          <div className="dashboard-role">
            <span>Confirmed</span>

            <strong>
              {stats.confirmedChallans}
            </strong>
          </div>

          <div className="dashboard-role">
            <span>Draft</span>

            <strong>
              {stats.draftChallans}
            </strong>
          </div>

          <div className="dashboard-role">
            <span>Cancelled</span>

            <strong>
              {stats.cancelledChallans}
            </strong>
          </div>
        </div>
      )}

      <div className="card dashboard-info">
        <h2>Operations Overview</h2>

        <p>
          Use the navigation menu to access the
          modules available for your role.
        </p>

        <div className="dashboard-role">
          <span>Logged in user</span>

          <strong>{user?.name}</strong>
        </div>

        <div className="dashboard-role">
          <span>Email</span>

          <strong>{user?.email}</strong>
        </div>

        <div className="dashboard-role">
          <span>Role</span>

          <strong>{user?.role}</strong>
        </div>
      </div>
    </div>
  );
}