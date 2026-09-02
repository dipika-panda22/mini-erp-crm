import {
  NavLink,
  Outlet,
  useNavigate
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const isAdmin = user?.role === 'ADMIN';
  const isSales = user?.role === 'SALES';
  const isWarehouse = user?.role === 'WAREHOUSE';

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <h2>ERP Portal</h2>

          {user && (
            <div className="user-info">
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          )}
        </div>

        <nav className="nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>

          {(isAdmin || isSales) && (
            <NavLink to="/customers">
              Customers
            </NavLink>
          )}

          {(isAdmin || isWarehouse) && (
            <NavLink to="/products">
              Products & Inventory
            </NavLink>
          )}

          {(isAdmin || isSales || isWarehouse) && (
            <NavLink to="/challans">
              Sales Challans
            </NavLink>
          )}
        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}