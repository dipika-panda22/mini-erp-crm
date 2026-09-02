import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');

    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      navigate('/', { replace: true });
    } catch (error: any) {
      setError(
        error.response?.data?.message ??
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <div className="brand-mark">ERP</div>

          <h1>Mini ERP + CRM</h1>

          <p>Operations Portal</p>
        </div>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <label>
          Email
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}