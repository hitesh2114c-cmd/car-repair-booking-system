import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`id, customer_name, appointment_date, status, services(name, base_price)`)
      .order('appointment_date', { ascending: true });
    
    if (!error) {
      setAppointments(data || []);
    }
    setLoading(false);
  }

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setAppointments(appointments.map(appt => 
        appt.id === id ? { ...appt, status: newStatus } : appt
      ));
    }
  };

  if (loading) {
    return <p style={{ padding: '20px', textAlign: 'center' }}>Loading admin panel...</p>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 20px' }}>
      <h2>Admin Dashboard - Service Management</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Manage and update customer repair appointments below.</p>

      {appointments.length === 0 ? (
        <p>No appointments found in the system.</p>
      ) : (
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '12px' }}>Customer</th>
              <th style={{ padding: '12px' }}>Service</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Price</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{appt.customer_name}</td>
                <td style={{ padding: '12px' }}>{appt.services?.name || 'Standard Service'}</td>
                <td style={{ padding: '12px' }}>{appt.appointment_date}</td>
                <td style={{ padding: '12px' }}>${appt.services?.base_price || '0.00'}</td>
                <td style={{ padding: '12px', textTransform: 'capitalize', fontWeight: 'bold' }}>
                  <span style={{ 
                    color: appt.status === 'completed' ? 'green' : appt.status === 'in_progress' ? 'orange' : '#555' 
                  }}>
                    {appt.status || 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <select 
                    value={appt.status || 'pending'} 
                    onChange={(e) => updateStatus(appt.id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
