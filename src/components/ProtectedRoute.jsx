import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Verifying session...</div>;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}
