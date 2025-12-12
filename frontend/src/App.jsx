import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import VerifyTicket from './pages/VerifyTicket'; // <-- NEW VERIFICATION PAGE

function App() {
  const [user, setUser] = useState(null);

  // Check if user is already logged in (from LocalStorage)
  useEffect(() => {
    const loggedUser = localStorage.getItem('userInfo');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  // Define a simple header for the Verification page since it should be standalone
  const isVerificationPage = window.location.pathname.startsWith('/verify');

  return (
    <Router>
      
      {/* Do NOT show the Navbar on the standalone verification page */}
      {!isVerificationPage && <Navbar user={user} setUser={setUser} />}
      
      {/* The main container is also omitted for the standalone page */}
      <main className={!isVerificationPage ? "container mt-4" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/event/:id" element={<EventDetails user={user} />} />

          {/* New Public Route for QR Code Scanners */}
          <Route path="/verify/:id" element={<VerifyTicket />} /> 
          
          {/* Protected Routes: Redirect to Login if not logged in */}
          <Route 
            path="/my-bookings" 
            element={user ? <MyBookings /> : <Navigate to="/login" />} 
          />
          
          {/* Admin Protected Route */}
          <Route 
            path="/admin" 
            element={user && user.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;