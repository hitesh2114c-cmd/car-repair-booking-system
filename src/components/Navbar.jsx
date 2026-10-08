import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', position: 'sticky', top: '20px', zIndex: 1000, padding: '0 20px' }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '900px',
        padding: '12px 28px', 
        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(12px)',
        borderRadius: '50px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}>
        <div style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
          <Link to="/" style={{ color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔧</span> AutoRepair Pro
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
          <Link to="/book-service" style={{ color: '#475569', textDecoration: 'none' }}>Book Service</Link>
          <Link to="/dashboard" style={{ color: '#475569', textDecoration: 'none' }}>My Dashboard</Link>
          <Link to="/admin" style={{ color: '#475569', textDecoration: 'none' }}>Admin</Link>

          {/* Conditional Auth Button */}
          {user ? (
            <button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: '#f1f5f9', 
                color: '#ef4444', 
                padding: '8px 16px', 
                borderRadius: '20px', 
                border: 'none',
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '0.85rem'
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" style={{ 
              backgroundColor: '#0f172a', 
              color: 'white', 
              padding: '8px 18px', 
              borderRadius: '20px', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '0.85rem',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}>
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
