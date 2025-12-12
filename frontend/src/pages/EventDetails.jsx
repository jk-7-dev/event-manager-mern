import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError('Event not found');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
        // Using standard alert for now, could be a nice modal later
      alert('Please login to book tickets.');
      return navigate('/login');
    }

    if (ticketCount > 5) return alert('Maximum 5 tickets per booking.');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/bookings', { eventId: id, count: Number(ticketCount) }, config);
      alert('Booking Successful!');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking Failed');
    }
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-accent"></div></div>;
  if (error || !event) return <div className="alert alert-danger container mt-5">{error}</div>;

  return (
    <div className="container mb-5">
      <button className="btn btn-outline-matte mb-4 d-flex align-items-center" onClick={() => navigate('/')}>
        <i className="bi bi-arrow-left me-2"></i> Back to Events
      </button>

      {/* Using the matte-card style for the main container */}
      <div className="matte-card p-0 overflow-hidden">
        <div className="row g-0">
          {/* Left Column: Image */}
          <div className="col-12 col-lg-6 bg-light">
            <img 
              src={event.image || 'https://placehold.co/800x600'} 
              className="w-100 h-100 object-fit-cover"
              style={{minHeight: '400px'}}
              alt={event.title} 
            />
          </div>

          {/* Right Column: Details */}
          <div className="col-12 col-lg-6 p-4 p-md-5 d-flex flex-column">
            <h2 className="fw-bold text-navy mb-3">{event.title}</h2>
            
            <div className="d-flex flex-wrap gap-3 text-muted mb-4">
                <span className="d-flex align-items-center"><i className="bi bi-geo-alt-fill text-accent me-2"></i>{event.location}</span>
                <span className="d-flex align-items-center"><i className="bi bi-calendar-event-fill text-accent me-2"></i>{new Date(event.date).toLocaleDateString()}</span>
                <span className="d-flex align-items-center"><i className="bi bi-clock-fill text-accent me-2"></i>{new Date(event.date).toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})}</span>
            </div>

            <h5 className="fw-bold text-navy mb-3">Event Details</h5>
            <p className="text-muted mb-5" style={{lineHeight: '1.7'}}>{event.description}</p>
            
            <div className="mt-auto p-4 rounded-4" style={{background: 'var(--off-white)', border: 'var(--card-border)'}}>
                 <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <small className="text-muted d-block mb-1">Price per ticket</small>
                        <h3 className="text-accent fw-bold mb-0">${event.price}</h3>
                    </div>
                    <div className="text-end">
                         <small className="text-muted d-block mb-1">Availability</small>
                         <span className={`badge rounded-pill py-2 px-3 ${event.availableTickets > 0 ? 'bg-success' : 'bg-danger'}`}>
                             {event.availableTickets > 0 ? `${event.availableTickets} Seats Left` : 'Sold Out'}
                         </span>
                    </div>
                 </div>

              {event.availableTickets > 0 ? (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-2 rounded-pill border">
                    <button className="btn btn-link text-navy text-decoration-none fs-4 px-3" onClick={() => setTicketCount(c => Math.max(1, c - 1))}>-</button>
                    <span className="fw-bold fs-5 text-navy">{ticketCount}</span>
                    <button className="btn btn-link text-navy text-decoration-none fs-4 px-3" onClick={() => setTicketCount(c => Math.min(5, event.availableTickets, c + 1))}>+</button>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3 fw-bold text-navy">
                    <span>Total:</span>
                    <span className="fs-4">${(event.price * ticketCount).toFixed(2)}</span>
                  </div>

                  <button className="btn btn-gradient-primary w-100 btn-lg" onClick={handleBooking}>
                    Confirm Booking
                  </button>
                </>
              ) : (
                 <button className="btn btn-secondary w-100 btn-lg" disabled>Event Sold Out</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;