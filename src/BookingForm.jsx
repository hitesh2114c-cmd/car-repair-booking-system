import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function BookingForm() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  // Fetch repair services from Supabase on component mount
  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    }

    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService) {
      setStatus('Please select a service.');
      return;
    }

    setStatus('Submitting...');

    // Insert new appointment into Supabase
    const { error } = await supabase
      .from('appointments')
      .insert([
        { 
          customer_name: name, 
          service_id: selectedService, 
          appointment_date: date 
        }
      ]);

    if (error) {
      console.error(error);
      setStatus('Error booking appointment.');
    } else {
      setStatus('Booking confirmed!');
      setName('');
      setDate('');
      setSelectedService('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '320px', gap: '12px' }}>
      <h2>Book a Repair</h2>

      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Full Name:</label>
        <input 
          type="text" 
          placeholder="John Doe" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Service Required:</label>
        <select 
          value={selectedService} 
          onChange={(e) => setSelectedService(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="" disabled>-- Select a Service --</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} (${service.base_price})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Appointment Date:</label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
        Book Appointment
      </button>

      {status && <p>{status}</p>}
    </form>
  );
}
