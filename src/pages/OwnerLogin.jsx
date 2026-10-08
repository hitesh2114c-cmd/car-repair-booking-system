import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profile?.role === 'owner') {
      navigate('/dashboard/owner');
    } else {
      await supabase.auth.signOut();
      setError('Access denied: This portal is for owners only.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#efece7', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Announcement Bar */}
      <div style={{ backgroundColor: '#000', color: '#fff', fontSize: '0.75rem', padding: '0.5rem 2rem', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <span>Administrative Access &middot; Secure Portal</span>
        <span>Management &middot; Control Center</span>
      </div>

      {/* Header Bar */}
      <header style={{ backgroundColor: '#fff', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>
          AUTOCARE
        </div>
        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>
          Owner Administration
        </div>
      </header>

      {/* Main Login Container */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#fff', padding: '3rem', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 'normal', fontStyle: 'italic', marginBottom: '0.5rem', textAlign: 'center' }}>
            Owner <span style={{ fontStyle: 'normal' }}>Portal</span>
          </h1>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.85rem', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Management Authentication
          </p>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', fontSize: '0.85rem', marginBottom: '1.5rem', borderRadius: '4px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>
                Admin Email
              </label>
              <input
                type="email"
                placeholder="owner@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.85rem', border: '1px solid #ccc', backgroundColor: '#fafafa', fontFamily: 'system-ui', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.85rem', border: '1px solid #ccc', backgroundColor: '#fafafa', fontFamily: 'system-ui', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '1rem', backgroundColor: '#000', color: '#fff', border: 'none', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1.5rem' }}
            >
              Log In as Owner
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            Are you a customer?{' '}
            <Link to="/login/customer" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'underline' }}>
              Switch to Customer Login
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
}
