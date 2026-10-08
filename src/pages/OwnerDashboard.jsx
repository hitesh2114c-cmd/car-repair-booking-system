import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [allBookings, setAllBookings] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchAllData();
      } else {
        navigate('/login/owner');
      }
      setLoading(false);
    };
    fetchOwnerData();
  }, [navigate]);

  const fetchAllData = async () => {
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*, vehicles(make, model, year, license_plate)')
      .order('preferred_date', { ascending: true });
    if (bookingsData) setAllBookings(bookingsData);

    const { data: vehiclesData } = await supabase.from('vehicles').select('*');
    if (vehiclesData) setAllVehicles(vehiclesData);
  };

    const handleUpdateStatus = async (bookingId, newStatus) => {
    // 1. Instantly update the local state so the UI changes immediately
    setAllBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );

    // 2. Send the update to Supabase in the background
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);
    
    if (error) {
      console.error('Error updating status:', error.message);
      // Re-fetch if there was an error to revert back
      fetchAllData();
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login/owner');
  };

  const getNavLinkStyle = (viewName) => ({
    color: '#1a1a1a',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: activeView === viewName ? 'bold' : 'normal',
    borderBottom: activeView === viewName ? '2px solid #000' : '2px solid transparent',
    paddingBottom: '4px'
  });

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>Loading administration...</div>;

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            {/* Owner Hero Section with Workshop Image */}
            <section style={{ position: 'relative', height: '550px', backgroundImage: 'url(https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=2000&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '0', backgroundColor: 'rgba(0,0,0,0.45)' }}></div>
              <div style={{ position: 'absolute', bottom: '15%', left: '5%', maxWidth: '500px', color: '#fff' }}>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '3.5rem', fontWeight: 'normal', marginBottom: '1rem', fontStyle: 'italic', lineHeight: '1.2' }}>
                  Workshop <span style={{ fontStyle: 'normal' }}>Control</span>
                </h1>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', opacity: 0.9 }}>
                  Manage incoming appointments, track vehicle diagnostics, and update client statuses across your facility in real-time.
                </p>
                <button 
                  onClick={() => setActiveView('appointments')}
                  style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', padding: '0.85rem 2.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                >
                  Manage Appointments
                </button>
              </div>
            </section>

            {/* Editorial Admin Grid Cards */}
            <main style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                
                <div onClick={() => setActiveView('appointments')} style={{ cursor: 'pointer', position: 'relative', height: '380px', borderRadius: '4px', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#fff' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'normal' }}>Client Appointments</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{allBookings.length} total bookings recorded.</p>
                  </div>
                </div>

                <div onClick={() => setActiveView('vehicles')} style={{ cursor: 'pointer', position: 'relative', height: '380px', borderRadius: '4px', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#fff' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'normal' }}>Registered Fleet</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{allVehicles.length} vehicles currently in the system.</p>
                  </div>
                </div>

                <div style={{ position: 'relative', height: '380px', borderRadius: '4px', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1517524208537-ab722d364a0e?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#fff' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 'normal' }}>Admin Profile</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{user?.email}</p>
                  </div>
                </div>

              </div>
            </main>
          </>
        );

      case 'appointments':
        return (
          <main style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 'normal' }}>Client Appointments & Vehicles</h1>
            {allBookings.length === 0 ? (
              <div style={{ backgroundColor: '#fff', padding: '3rem', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <p style={{ color: '#666' }}>No appointments booked by customers yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {allBookings.map((b) => (
                  <div key={b.id} style={{ backgroundColor: '#fff', padding: '1.5rem', border: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontFamily: 'Georgia, serif' }}>{b.service_type}</h3>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '0.95rem' }}>
                        Vehicle: <strong>{b.vehicles ? `${b.vehicles.year} ${b.vehicles.make} ${b.vehicles.model} (${b.vehicles.license_plate})` : 'Not specified'}</strong>
                      </p>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Date: <strong>{b.preferred_date}</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <select 
                        value={b.status} 
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        style={{ padding: '0.4rem 0.5rem', border: '1px solid #ccc', backgroundColor: '#fafafa', fontSize: '0.8rem', textTransform: 'uppercase', cursor: 'pointer' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        );

      case 'vehicles':
        return (
          <main style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 'normal' }}>All Registered Vehicles</h1>
            {allVehicles.length === 0 ? (
              <div style={{ backgroundColor: '#fff', padding: '3rem', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <p style={{ color: '#666' }}>No vehicles registered in the system yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {allVehicles.map((v) => (
                  <div key={v.id} style={{ backgroundColor: '#fff', padding: '1.5rem', border: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontFamily: 'Georgia, serif' }}>{v.year} {v.make} {v.model}</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Plate: <strong>{v.license_plate}</strong></p>
                    </div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', padding: '0.25rem 0.75rem', backgroundColor: '#e5e5e5', borderRadius: '4px' }}>Verified</span>
                  </div>
                ))}
              </div>
            )}
          </main>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#efece7', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a' }}>
      <div style={{ backgroundColor: '#000', color: '#fff', fontSize: '0.75rem', padding: '0.5rem 2rem', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <span>Administrative Control Center &middot; Workshop Management</span>
        <span>Secure Access</span>
      </div>

      <header style={{ backgroundColor: '#fff', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e5e5' }}>
        <div onClick={() => setActiveView('overview')} style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', letterSpacing: '1px', cursor: 'pointer' }}>
          AUTOCARE <span style={{ fontSize: '0.8rem', fontWeight: 'normal', fontStyle: 'italic', color: '#666' }}>[Admin]</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <button onClick={() => setActiveView('overview')} style={getNavLinkStyle('overview')}>Overview</button>
          <button onClick={() => setActiveView('appointments')} style={getNavLinkStyle('appointments')}>Appointments</button>
          <button onClick={() => setActiveView('vehicles')} style={getNavLinkStyle('vehicles')}>Vehicles</button>
        </nav>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: '#666' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sign Out</button>
        </div>
      </header>

      {renderContent()}
    </div>
  );
}
