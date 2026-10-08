import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from './pages/CustomerLogin';
import OwnerLogin from './pages/OwnerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login/customer" replace />} />
        <Route path="/login/customer" element={<CustomerLogin />} />
        <Route path="/login/owner" element={<OwnerLogin />} />
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        {/* Catch-all route prevents blank screens */}
        <Route path="*" element={<Navigate to="/login/customer" replace />} />
      </Routes>
    </Router>
  );
}
