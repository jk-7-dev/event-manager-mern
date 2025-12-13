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
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

  // 1. Open Payment Modal instead of direct booking
  const initiateBooking = () => {
    if (!user) {
      alert('Please login to book tickets.');
      return navigate('/login');
    }
    if (ticketCount > 5) return alert('Maximum 5 tickets per booking.');
    
    // Open the Stub/Payment Modal
    setShowPaymentModal(true);
  };

  // 2. Process "Fake" Payment & Book
  const handlePaymentAndBooking = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    // Simulate Network Delay for realism
    setTimeout(async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.post('http://localhost:5000/api/bookings', { eventId: id, count: Number(ticketCount) }, config);
        
        setPaymentProcessing(false);
        setShowPaymentModal(false);
        alert('Payment Successful! Booking Confirmed. 🎟️');
        navigate('/my-bookings');
      } catch (err) {
        setPaymentProcessing(false);
        alert(err.response?.data?.message || 'Booking Failed');
      }
    }, 1500); // 1.5 second simulated delay
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-accent"></div></div>;
  if (error || !event) return <div className="alert alert-danger container mt-5">{error}</div>;

  const totalPrice = event.price * ticketCount;

  return (
    <div className="container mb-5">
      <button className="btn btn-outline-matte mb-4 d-flex align-items-center" onClick={() => navigate('/')}>
        <i className="bi bi-arrow-left me-2"></i> Back to Events
      </button>

      {/* Main Content Card */}
      <div className="matte-card p-0 overflow-hidden">
        <div className="row g-0">
          <div className="col-12 col-lg-6 bg-light">
            <img 
              src={event.image || 'https://placehold.co/800x600'} 
              className="w-100 h-100 object-fit-cover"
              style={{minHeight: '400px'}}
              alt={event.title} 
            />
          </div>

          <div className="col-12 col-lg-6 p-4 p-md-5 d-flex flex-column">
            <h2 className="fw-bold text-navy mb-3">{event.title}</h2>
            
            <div className="d-flex flex-wrap gap-3 text-muted mb-4">
                <span className="d-flex align-items-center"><i className="bi bi-geo-alt-fill text-accent me-2"></i>{event.location}</span>
                <span className="d-flex align-items-center"><i className="bi bi-calendar-event-fill text-accent me-2"></i>{new Date(event.date).toLocaleDateString()}</span>
            </div>

            <h5 className="fw-bold text-navy mb-3">Event Details</h5>
            <p className="text-muted mb-5" style={{lineHeight: '1.7'}}>{event.description}</p>
            
            <div className="mt-auto p-4 rounded-4" style={{background: 'var(--off-white)', border: 'var(--card-border)'}}>
                 <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <small className="text-muted d-block mb-1">Price per ticket</small>
                        <h3 className="text-accent fw-bold mb-0">Rs. {event.price}</h3>
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
                    <span className="fs-4">Rs. {totalPrice}</span>
                  </div>

                  <button className="btn btn-gradient-primary w-100 btn-lg" onClick={initiateBooking}>
                    Book Ticket
                  </button>
                </>
              ) : (
                 <button className="btn btn-secondary w-100 btn-lg" disabled>Event Sold Out</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- PAYMENT STUB MODAL --- */}
      {showPaymentModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(5, 15, 42, 0.7)', zIndex: 2000 }}>
          <div className="bg-white rounded-4 shadow-lg p-0 overflow-hidden animate__animated animate__fadeInUp" style={{ maxWidth: '400px', width: '90%' }}>
            
            {/* Header */}
            <div className="p-4 text-white" style={{ background: 'var(--dark-navy)' }}>
                <h5 className="mb-0 fw-bold"><i className="bi bi-credit-card me-2"></i> Payment Gateway</h5>
                <small className="text-white-50">Complete your transaction</small>
            </div>

            {/* Body */}
            <div className="p-4">
                {/* Stub Summary */}
                <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: 'var(--off-white)', border: '1px dashed var(--soft-purple)' }}>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">{event.title}</span>
                        <span className="fw-bold text-navy">Rs. {event.price} x {ticketCount}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fs-5 fw-bold text-navy">
                        <span>Total Pay</span>
                        <span>Rs. {totalPrice}</span>
                    </div>
                </div>

                {/* Fake Payment Form */}
                <form onSubmit={handlePaymentAndBooking}>
                    <div className="mb-3">
                        <label className="form-label small text-muted fw-bold">CARD NUMBER</label>
                        <input type="text" className="form-control" placeholder="0000 0000 0000 0000" required maxLength="19" />
                    </div>
                    <div className="row">
                        <div className="col-6 mb-3">
                            <label className="form-label small text-muted fw-bold">EXPIRY</label>
                            <input type="text" className="form-control" placeholder="MM/YY" required maxLength="5" />
                        </div>
                        <div className="col-6 mb-3">
                            <label className="form-label small text-muted fw-bold">CVV</label>
                            <input type="password" className="form-control" placeholder="123" required maxLength="3" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success w-100 py-2 fw-bold" disabled={paymentProcessing}>
                        {paymentProcessing ? (
                           <span><span className="spinner-border spinner-border-sm me-2"></span>Processing...</span>
                        ) : (
                           `Pay Rs. ${totalPrice}`
                        )}
                    </button>
                    <button type="button" className="btn btn-link text-muted w-100 mt-2 text-decoration-none" onClick={() => setShowPaymentModal(false)}>
                        Cancel Transaction
                    </button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;