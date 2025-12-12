import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/bookings/verify/${id}`);
        setTicket(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    verify();
  }, [id]);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '400px', width: '100%' }}>
        
        {/* HEADER: STATUS */}
        <div className={`p-4 text-center text-white ${error ? 'bg-danger' : 'bg-success'}`}>
          <div className="mb-2" style={{ fontSize: '4rem' }}>
            {error ? <i className="bi bi-x-circle-fill"></i> : <i className="bi bi-check-circle-fill"></i>}
          </div>
          <h2 className="fw-bold mb-0">{error ? 'INVALID TICKET' : 'VERIFIED'}</h2>
          <small>{error ? 'This ticket does not exist' : 'Official Event Ticket'}</small>
        </div>

        {/* BODY: DETAILS */}
        {!error && ticket && (
          <div className="card-body p-4 bg-white">
            <div className="text-center mb-4">
              <h4 className="fw-bold text-dark mb-1">{ticket.event.title}</h4>
              <p className="text-muted small">
                {new Date(ticket.event.date).toDateString()} • {new Date(ticket.event.date).toLocaleTimeString()}
              </p>
            </div>

            <div className="border-top border-bottom py-3 my-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Ticket ID</span>
                <span className="fw-bold font-monospace">{ticket.ticketId}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Guest Name</span>
                <span className="fw-bold">{ticket.user.name}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Quantity</span>
                <span className="badge bg-primary rounded-pill px-3">{ticket.count} Admit</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Total Paid</span>
                <span className="fw-bold text-success">${ticket.totalCost}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="small text-muted mb-0">Venue</p>
              <p className="fw-bold text-dark">{ticket.event.location}</p>
            </div>
          </div>
        )}
        
        {/* FOOTER */}
        <div className="bg-light p-3 text-center border-top">
          <small className="text-muted">Scanned by Event Manager Verifier</small>
        </div>
      </div>
    </div>
  );
};

export default VerifyTicket;