import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', location: '', price: '', totalTickets: '', image: ''
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // Define Palette Constants for Inline Styles (to ensure exact match)
  const colors = {
    primaryBlue: '#7BBBFF',
    darkNavy: '#050F2A',
    lightBg: '#F2FDFF',
    purple: '#B8A9FF'
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    } else {
      fetchEvents();
    }
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events');
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/events', formData, config);
      alert('Event Created Successfully!');
      setFormData({ title: '', description: '', date: '', location: '', price: '', totalTickets: '', image: '' });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/events/${id}`, config);
        fetchEvents();
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  return (
    <div className="container py-4" style={{ backgroundColor: colors.lightBg, minHeight: '100vh' }}>
      <h2 className="mb-4 fw-bold" style={{ color: colors.darkNavy }}>
        <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
      </h2>
      
      {/* --- CREATE EVENT FORM --- */}
      <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <div className="card-header text-white p-3" style={{ backgroundColor: colors.darkNavy }}>
          <h5 className="mb-0 fw-bold">Create New Event</h5>
        </div>
        <div className="card-body p-4 bg-white">
          <form onSubmit={handleSubmit} className="row g-4">
            
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold text-secondary">Event Title</label>
              <input name="title" className="form-control" value={formData.title} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold text-secondary">Image URL</label>
              <input name="image" className="form-control" placeholder="https://..." value={formData.image} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-12">
              <label className="form-label fw-bold text-secondary">Description</label>
              <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold text-secondary">Date & Time</label>
              <input type="datetime-local" name="date" className="form-control" value={formData.date} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold text-secondary">Location</label>
              <input name="location" className="form-control" value={formData.location} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-6 col-md-2">
              <label className="form-label fw-bold text-secondary">Price ($)</label>
              <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-6 col-md-2">
              <label className="form-label fw-bold text-secondary">Tickets</label>
              <input type="number" name="totalTickets" className="form-control" value={formData.totalTickets} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-12 mt-4">
              <button type="submit" className="btn w-100 fw-bold text-white py-2" 
                style={{ backgroundColor: colors.darkNavy, borderRadius: '8px', transition: '0.3s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.purple}
                onMouseOut={(e) => e.target.style.backgroundColor = colors.darkNavy}
              >
                + Create Event
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- EVENT LIST --- */}
      <h4 className="mb-3 fw-bold" style={{ color: colors.darkNavy }}>Manage Events</h4>
      <div className="table-responsive shadow-sm" style={{ borderRadius: '15px' }}>
        <table className="table table-hover mb-0 align-middle">
          <thead className="text-white" style={{ backgroundColor: colors.darkNavy }}>
            <tr>
              <th className="py-3">Title</th>
              <th className="py-3">Date</th>
              <th className="py-3">Location</th>
              <th className="py-3">Price</th>
              <th className="py-3">Stock</th>
              <th className="py-3 text-end pe-4">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {events.map((event) => (
              <tr key={event._id}>
                <td className="fw-bold" style={{ color: colors.darkNavy }}>{event.title}</td>
                <td className="text-muted">{new Date(event.date).toLocaleDateString()}</td>
                <td className="text-muted">{event.location}</td>
                <td className="fw-bold" style={{ color: colors.primaryBlue }}>${event.price}</td>
                <td>
                  <span className="badge" style={{ backgroundColor: colors.purple, color: 'white' }}>
                    {event.availableTickets} / {event.totalTickets}
                  </span>
                </td>
                <td className="text-end pe-4">
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => handleDelete(event._id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No events found. Create one above!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;