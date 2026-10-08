import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Updated path

export default function BookService() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase.from('services').select('*');
      if (!error) setServices(data || []);
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return setStatus('Please select a service.');
    setStatus('Submitting...');

    const { error } = await supabase.from('appointments').insert([
      { customer_name: name, service_id: selectedService, appointment_date: date }
    ]);

    if (error) {
      setStatus('Error booking appointment.');
    } else {
      setStatus('Booking confirmed!');
      setName(''); setDate(''); setSelectedService('');
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Book a Repair</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px' }} />
        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required style={{ padding: '8px' }}>
          <option value="" disabled>-- Select a Service --</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name} (${s.base_price})</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Book Appointment</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
