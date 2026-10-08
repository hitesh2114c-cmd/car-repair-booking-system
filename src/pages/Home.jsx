import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      
      {/* Top Badge */}
      <div style={{ display: 'inline-block', backgroundColor: '#f1f5f9', color: '#334155', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
        ✨ Next-Gen Workshop Management System
      </div>

      <h1 style={{ fontSize: '3rem', color: '#0f172a', margin: '0 0 16px', letterSpacing: '-1px', fontWeight: '800' }}>
        AutoRepair Pro Design System
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 40px' }}>
        Streamline your workshop appointments, manage client vehicles, and monitor maintenance workflows effortlessly.
      </p>

      {/* Floating Feature Card Container (Soft UI Style) */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '24px', 
        padding: '40px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        marginBottom: '40px',
        textAlign: 'left'
      }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 6px', fontWeight: '700' }}>100%</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Cloud-Synced Data via Supabase</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 6px', fontWeight: '700' }}>Role-Based</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Secure Customer & Admin Portals</p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 6px', fontWeight: '700' }}>Real-Time</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Instant Repair Status Tracking</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <Link to="/book-service" style={{ backgroundColor: '#0f172a', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}>
          Book a Repair
        </Link>
        <Link to="/dashboard" style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600' }}>
          Open Dashboard
        </Link>
      </div>

    </div>
  );
}
