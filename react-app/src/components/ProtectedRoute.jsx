import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession, onAuthStateChange } from '../lib/bookingApi';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking'); // checking | authed | anon

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // No backend to authenticate against yet -- let the dashboard through so
      // it can render in demo mode rather than dead-ending at a login that
      // can never succeed.
      setStatus('authed');
      return;
    }

    getSession()
      .then((session) => setStatus(session ? 'authed' : 'anon'))
      .catch(() => setStatus('anon'));

    const unsubscribe = onAuthStateChange((session) => setStatus(session ? 'authed' : 'anon'));
    return unsubscribe;
  }, []);

  if (status === 'checking') {
    return (
      <div className="admin-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
      </div>
    );
  }

  if (status === 'anon') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
