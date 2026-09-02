import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Challans from './pages/Challans';
import ChallanDetails from './pages/ChallanDetails';

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Public route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* All authenticated users */}
        <Route
          element={<ProtectedRoute />}
        >
          <Route element={<Layout />}>

            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* ADMIN + SALES */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'ADMIN',
                    'SALES'
                  ]}
                />
              }
            >
              <Route
                path="/customers"
                element={<Customers />}
              />
            </Route>

            {/* ADMIN + WAREHOUSE */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'ADMIN',
                    'WAREHOUSE'
                  ]}
                />
              }
            >
              <Route
                path="/products"
                element={<Products />}
              />
            </Route>

            {/* ADMIN + SALES + WAREHOUSE */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    'ADMIN',
                    'SALES',
                    'WAREHOUSE'
                  ]}
                />
              }
            >
              <Route
                path="/challans"
                element={<Challans />}
              />

              <Route
                path="/challans/:id"
                element={<ChallanDetails />}
              />
            </Route>

          </Route>
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </AuthProvider>
  );
}