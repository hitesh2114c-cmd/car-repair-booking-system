import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch appointments when component loads
  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        customer_name,
        appointment_date,
        status,
        services ( name, base_price )
      `)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data || []);
    }
  }

  // Handle updating the status in Supabase
  async function handleStatusChange(appointmentId, newStatus) {
    setUpdatingId(appointmentId); // Show a loading state for this row
    
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update appointment status.');
    } else {
      // Update the local React state so the UI updates immediately
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status: newStatus } : appt
      ));
    }
    
    setUpdatingId(null);
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2>Admin Dashboard - Appointments</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '15px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px' }}>Customer</th>
            <th style={{ padding: '10px' }}>Service</th>
            <th style={{ padding: '10px' }}>Date</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr><td colSpan="4" style={{ padding: '10px' }}>No appointments found.</td></tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt.id} style={{ borderBottom: '1px solid #eee', opacity: updatingId === appt.id ? 0.5 : 1 }}>
                <td style={{ padding: '10px' }}>{appt.customer_name}</td>
                <td style={{ padding: '10px' }}>{appt.services?.name}</td>
                <td style={{ padding: '10px' }}>{appt.appointment_date}</td>
                <td style={{ padding: '10px' }}>
                  <select 
                    value={appt.status} 
                    onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                    disabled={updatingId === appt.id}
                    style={{ padding: '5px', borderRadius: '4px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
