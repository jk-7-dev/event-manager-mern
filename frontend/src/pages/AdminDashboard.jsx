import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', location: '', price: '', totalTickets: '', image: ''
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  // Define Palette Constants
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

  const handleEdit = (event) => {
    setEditId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      price: event.price,
      totalTickets: event.totalTickets,
      image: event.image
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({ title: '', description: '', date: '', location: '', price: '', totalTickets: '', image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/events/${editId}`, formData, config);
        alert('Event Updated Successfully!');
        handleCancel();
      } else {
        await axios.post('http://localhost:5000/api/events', formData, config);
        alert('Event Created Successfully!');
        handleCancel();
      }
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving event');
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
      
      {/* --- CREATE / EDIT FORM --- */}
      <div className="card border-0 shadow-sm mb-5 matte-card">
        <div className="card-header text-white p-3" style={{ backgroundColor: colors.darkNavy }}>
          <h5 className="mb-0 fw-bold">{editId ? 'Edit Event' : 'Create New Event'}</h5>
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
              {/* FIXED: Label uses Rs. */}
              <label className="form-label fw-bold text-secondary">Price (Rs.)</label>
              <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-6 col-md-2">
              <label className="form-label fw-bold text-secondary">Tickets</label>
              <input type="number" name="totalTickets" className="form-control" value={formData.totalTickets} onChange={handleChange} required 
                style={{ borderColor: colors.primaryBlue }} />
            </div>
            
            <div className="col-12 mt-4 d-flex gap-2">
              <button type="submit" className="btn fw-bold text-white flex-grow-1 py-2" 
                style={{ backgroundColor: editId ? '#FFC107' : colors.darkNavy, color: editId ? '#000' : '#fff' }}
              >
                {editId ? 'Update Event' : '+ Create Event'}
              </button>
              
              {editId && (
                <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={handleCancel}>
                  Cancel
                </button>
              )}
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
              <th className="py-3 ps-4">Title</th>
              <th className="py-3">Date</th>
              <th className="py-3">Location</th>
              <th className="py-3">Price</th>
              <th className="py-3">Stock</th>
              <th className="py-3 text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {events.map((event) => (
              <tr key={event._id}>
                <td className="fw-bold ps-4" style={{ color: colors.darkNavy }}>{event.title}</td>
                <td className="text-muted">{new Date(event.date).toLocaleDateString()}</td>
                <td className="text-muted">{event.location}</td>
                {/* FIXED: Value uses Rs. */}
                <td className="fw-bold" style={{ color: colors.primaryBlue }}>Rs. {event.price}</td>
                <td>
                  <span className="badge" style={{ backgroundColor: colors.purple, color: 'white' }}>
                    {event.availableTickets} / {event.totalTickets}
                  </span>
                </td>
                <td className="text-end pe-4">
                  {/* Edit Button - Solid Icon */}
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(event)}
                    title="Edit Event"
                    style={{ borderRadius: '8px', padding: '6px 10px' }}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  
                  {/* Delete Button - Solid Icon */}
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => handleDelete(event._id)}
                    title="Delete Event"
                    style={{ borderRadius: '8px', padding: '6px 10px' }}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;