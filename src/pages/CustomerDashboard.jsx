import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Vehicle form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleError, setVehicleError] = useState('');

  // Booking form state
  const [serviceType, setServiceType] = useState('General Maintenance');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchVehicles(session.user.id);
        fetchBookings(session.user.id);
      } else {
        navigate('/login/customer');
      }
      setLoading(false);
    };
    fetchUserData();
  }, [navigate]);

  const fetchVehicles = async (userId) => {
    const { data } = await supabase.from('vehicles').select('*').eq('user_id', userId);
    if (data) {
      setVehicles(data);
      if (data.length > 0) setSelectedVehicleId(data[0].id);
    }
  };

  const fetchBookings = async (userId) => {
    const { data } = await supabase
      .from('bookings')
      .select('*, vehicles(make, model, year, license_plate)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setBookings(data);
  };

  const handleRegisterVehicle = async (e) => {
    e.preventDefault();
    setVehicleError('');
    const { error } = await supabase.from('vehicles').insert([
      { user_id: user.id, make, model, year, license_plate: plate }
    ]);
    if (error) {
      setVehicleError(error.message);
    } else {
      setMake(''); setModel(''); setYear(''); setPlate('');
      fetchVehicles(user.id);
      setActiveView('vehicles');
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    const { error } = await supabase.from('bookings').insert([
      { 
        user_id: user.id, 
        service_type: serviceType, 
        preferred_date: bookingDate,
        vehicle_id: selectedVehicleId || null
      }
    ]);

    if (error) {
      setBookingError(error.message);
    } else {
      setBookingSuccess('Appointment booked successfully!');
      setBookingDate('');
      fetchBookings(user.id);
      setTimeout(() => setActiveView('history'), 1000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login/customer');
  };

  const getNavLinkStyle = (viewName) => ({
    color: '#1a1a1a',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: activeView === viewName ? 'bold' : 'normal',
    borderBottom: activeView === viewName ? '2px solid #000' : '2px solid transparent',
    paddingBottom: '4px',
    whiteSpace: 'nowrap'
  });

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>Loading...</div>;

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            {/* Hero Section */}
            <section style={{ position: 'relative', minHeight: '450px', backgroundImage: 'url(https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' }}></div>
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', color: '#fff' }}>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 'normal', marginBottom: '1rem', fontStyle: 'italic', lineHeight: '1.2' }}>
                  Precision <span style={{ fontStyle: 'normal' }}>Care</span>
                </h1>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', opacity: 0.9 }}>
                  Experience white-glove automotive maintenance. Schedule expert service and track your vehicle's health in real-time.
                </p>
                <button 
                  onClick={() => setActiveView('book')}
                  style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', padding: '0.85rem 2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                >
                  Schedule Service
                </button>
              </div>
            </section>

            {/* Grid Cards */}
            <main style={{ padding: '3rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div onClick={() => setActiveView('history')} style={{ cursor: 'pointer', position: 'relative', height: '320px', borderRadius: '4px', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#fff' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 'normal' }}>Service History</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{bookings.length > 0 ? `Latest: ${bookings[0].service_type}` : 'No active appointments recorded.'}</p>
                  </div>
                </div>

                <div onClick={() => setActiveView('vehicles')} style={{ cursor: 'pointer', position: 'relative', height: '320px', borderRadius: '4px', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#fff' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 'normal' }}>Your Garage</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{vehicles.length} vehicle(s) registered in your profile.</p>
                  </div>
                </div>

                <div onClick={() => setActiveView('book')} style={{ cursor: 'pointer', position: 'relative', height: '320px', borderRadius: '4px', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#fff' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 'normal' }}>Book Appointment</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Secure your priority slot for expert maintenance.</p>
                  </div>
                </div>
              </div>
            </main>
          </>
        );

      case 'vehicles':
        return (
          <main style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 'normal', margin: 0 }}>My Vehicles</h1>
              <button onClick={() => setActiveView('register-vehicle')} style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>+ Register New Vehicle</button>
            </div>
            {vehicles.length === 0 ? (
              <div style={{ backgroundColor: '#fff', padding: '2.5rem 1.5rem', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>You have not added any vehicles to your profile yet.</p>
                <button onClick={() => setActiveView('register-vehicle')} style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Register a Vehicle</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {vehicles.map((v) => (
                  <div key={v.id} style={{ backgroundColor: '#fff', padding: '1.25rem', border: '1px solid #e5e5e5', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.2rem 0', fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>{v.year} {v.make} {v.model}</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>License Plate: <strong>{v.license_plate}</strong></p>
                    </div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '0.2rem 0.6rem', backgroundColor: '#e5e5e5', borderRadius: '4px' }}>Active</span>
                  </div>
                ))}
              </div>
            )}
          </main>
        );

      case 'register-vehicle':
        return (
          <main style={{ padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>Register a Vehicle</h1>
            {vehicleError && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{vehicleError}</div>}
            <form onSubmit={handleRegisterVehicle} style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #e5e5e5' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Make</label>
                <input type="text" value={make} onChange={(e) => setMake(e.target.value)} required placeholder="Toyota" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', backgroundColor: '#fafafa', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Model</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required placeholder="Camry" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', backgroundColor: '#fafafa', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year</label>
                <input type="text" value={year} onChange={(e) => setYear(e.target.value)} required placeholder="2024" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', backgroundColor: '#fafafa', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>License Plate</label>
                <input type="text" value={plate} onChange={(e) => setPlate(e.target.value)} required placeholder="KA-01-AB-1234" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', backgroundColor: '#fafafa', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="submit" style={{ flex: 1, minWidth: '140px', padding: '0.85rem', backgroundColor: '#000', color: '#fff', border: 'none', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Save Vehicle</button>
                <button type="button" onClick={() => setActiveView('vehicles')} style={{ padding: '0.85rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #ccc', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </main>
        );

      case 'history':
        return (
          <main style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>Service History</h1>
            {bookings.length === 0 ? (
              <div style={{ backgroundColor: '#fff', padding: '2.5rem 1.5rem', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>No past services found for this account.</p>
                <button onClick={() => setActiveView('book')} style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Book an Appointment</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {bookings.map((b) => (
                  <div key={b.id} style={{ backgroundColor: '#fff', padding: '1.25rem', border: '1px solid #e5e5e5', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.2rem 0', fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>{b.service_type}</h3>
                      <p style={{ margin: '0 0 0.2rem 0', color: '#444', fontSize: '0.85rem' }}>
                        Vehicle: <strong>{b.vehicles ? `${b.vehicles.year} ${b.vehicles.make} ${b.vehicles.model} (${b.vehicles.license_plate})` : 'General Service'}</strong>
                      </p>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Date: <strong>{b.preferred_date}</strong></p>
                    </div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '0.2rem 0.6rem', backgroundColor: b.status === 'Completed' ? '#dcfce7' : b.status === 'In Progress' ? '#e0f2fe' : '#fef3c7', color: b.status === 'Completed' ? '#166534' : b.status === 'In Progress' ? '#0369a1' : '#92400e', borderRadius: '4px' }}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </main>
        );

      case 'book':
        return (
          <main style={{ padding: '3rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>Book an Appointment</h1>
            {bookingError && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{bookingError}</div>}
            {bookingSuccess && <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{bookingSuccess}</div>}
            
            <form onSubmit={handleCreateBooking} style={{ backgroundColor: '#fff', padding: '2rem', border: '1px solid #e5e5e5' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Vehicle</label>
                {vehicles.length === 0 ? (
                  <p style={{ color: '#b91c1c', fontSize: '0.8rem' }}>Please register a vehicle first before booking!</p>
                ) : (
                  <select value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', backgroundColor: '#fafafa', fontFamily: 'system-ui' }}>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} - {v.license_plate}</option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service Type</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', backgroundColor: '#fafafa', fontFamily: 'system-ui' }}>
                  <option>General Maintenance</option>
                  <option>Oil Change</option>
                  <option>Brake Inspection</option>
                  <option>Diagnostics</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preferred Date</label>
                <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', backgroundColor: '#fafafa', fontFamily: 'system-ui', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" disabled={vehicles.length === 0} style={{ width: '100%', padding: '0.85rem', backgroundColor: vehicles.length === 0 ? '#9ca3af' : '#000', color: '#fff', border: 'none', textTransform: 'uppercase', letterSpacing: '1px', cursor: vehicles.length === 0 ? 'not-allowed' : 'pointer' }}>
                Confirm Booking
              </button>
            </form>
          </main>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#efece7', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a' }}>
      <div style={{ backgroundColor: '#000', color: '#fff', fontSize: '0.7rem', padding: '0.4rem 1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <span>Keep your vehicle in peak condition. Book today.</span>
        <span>Premium Service &middot; Rewards</span>
      </div>

      <header style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e5e5e5' }}>
        <div onClick={() => setActiveView('overview')} style={{ fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'Georgia, serif', letterSpacing: '1px', cursor: 'pointer' }}>AUTOCARE</div>
        <nav style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveView('overview')} style={getNavLinkStyle('overview')}>Overview</button>
          <button onClick={() => setActiveView('vehicles')} style={getNavLinkStyle('vehicles')}>Vehicles</button>
          <button onClick={() => setActiveView('history')} style={getNavLinkStyle('history')}>History</button>
          <button onClick={() => setActiveView('book')} style={getNavLinkStyle('book')}>Book</button>
        </nav>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.8rem' }}>
          <span style={{ color: '#666', display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sign Out</button>
        </div>
      </header>

      {renderContent()}
    </div>
  );
}
