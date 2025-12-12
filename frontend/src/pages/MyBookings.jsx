import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null); // State for the zoomed QR modal

  // Colors from your palette
  const colors = {
    accent: "#7BBBFF",
    dark: "#050F2A",
    offWhite: "#F2FDFF",
    purple: "#B8A9FF"
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
        setTickets(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading your tickets...</div>;

  return (
    <div
      className="container-fluid py-5"
      style={{ background: "linear-gradient(180deg,#F2FDFF 0%, #EAF6FF 100%)", minHeight: "85vh" }}
    >
      <div className="container">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h2 className="fw-bold mb-0" style={{ color: colors.dark }}>My Tickets</h2>
                <small style={{ color: colors.accent }}>Tap on QR code to enlarge & scan</small>
            </div>
            <Link to="/" className="btn btn-outline-primary rounded-pill px-4">Book More</Link>
        </div>

        {/* Tickets List */}
        {tickets.length === 0 ? (
           <div className="text-center py-5">
             <h4 className="text-muted">No tickets found 🎟️</h4>
             <Link to="/" className="btn btn-primary mt-3">Browse Events</Link>
           </div>
        ) : (
          <div className="row g-4">
            {tickets.map((booking) => (
              <div className="col-12 col-lg-6" key={booking._id}>
                <TicketCard 
                  ticket={booking} 
                  colors={colors} 
                  onQRClick={(url) => setSelectedQR(url)} 
                />
              </div>
            ))}
          </div>
        )}
      
        <footer className="mt-5 text-center text-muted small">
          Event Manager • Digital Tickets
        </footer>
      </div>

      {/* --- QR ZOOM MODAL --- */}
      {selectedQR && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(5, 15, 42, 0.85)', zIndex: 1050 }}
          onClick={() => setSelectedQR(null)}
        >
          <div 
            className="bg-white p-4 rounded-4 shadow-lg text-center animate__animated animate__zoomIn"
            style={{ maxWidth: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3" style={{ color: colors.dark }}>Scan Ticket</h5>
            <div className="bg-white p-2 rounded border mx-auto" style={{ width: '260px', height: '260px' }}>
              <img src={selectedQR} alt="Large QR" className="w-100 h-100" />
            </div>
            <p className="text-muted small mt-3 mb-0">Show this code at the venue entrance</p>
            <button 
              className="btn btn-danger btn-sm mt-3 px-4 rounded-pill"
              onClick={() => setSelectedQR(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------- Ticket Card Component ----------------- */

function TicketCard({ ticket, colors, onQRClick }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const event = ticket.event || {};

  useEffect(() => {
    let cancelled = false;
    import("qrcode")
      .then((QRCode) => {
        // ----------------------------------------------------------------
        // CRITICAL UPDATE: 
        // Generates a URL like: http://localhost:5173/verify/TKT-123456
        // ----------------------------------------------------------------
        const verificationUrl = `${window.location.origin}/verify/${ticket.ticketId}`;
        
        return QRCode.toDataURL(verificationUrl, { 
          margin: 1, 
          width: 300, 
          color: { dark: '#000000', light: '#ffffff' },
          errorCorrectionLevel: 'M'
        });
      })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch((err) => console.error("QR Error", err));
    return () => (cancelled = true);
  }, [ticket]);

  return (
    <article
      className="d-flex position-relative rounded-4 overflow-hidden p-3 h-100 bg-white"
      style={{
        border: "1px solid rgba(11,26,60,0.06)",
        boxShadow: "0 10px 30px rgba(5,15,42,0.08)",
      }}
    >
      {/* 1. Poster Image (Hidden on very small screens) */}
      <div
        className="flex-shrink-0 rounded-3 overflow-hidden shadow-sm d-none d-sm-block"
        style={{ width: "120px", background: "#f6fbff" }}
      >
        <img 
            src={event.image || "https://placehold.co/120x160?text=No+Image"} 
            alt={event.title} 
            className="w-100 h-100 object-fit-cover" 
        />
      </div>

      {/* 2. Details Section */}
      <div className="flex-grow-1 d-flex flex-column justify-content-between px-3 py-1" style={{ minWidth: 0 }}>
        <div>
          <h5 className="fw-bold mb-1 text-truncate" style={{ color: colors.dark }}>
            {event.title || "Event Cancelled"}
          </h5>
          <p className="small mb-2" style={{ color: "#555" }}>
            {new Date(event.date).toDateString()} • {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
          <p className="small text-muted mb-2 text-truncate">
            <i className="bi bi-geo-alt-fill me-1"></i> {event.location}
          </p>

          <div className="d-flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded text-nowrap" style={{ background: "#E8F0FE", color: "#1967D2", fontSize: "0.75rem", fontWeight: 600 }}>
              General Entry
            </span>
            <div
              className="px-2 py-1 rounded border text-muted small"
              style={{ borderColor: "rgba(11,26,60,0.06)", fontSize: "0.75rem" }}
            >
              Qty: {ticket.count}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="small text-muted">
            ID: <span className="fw-bold font-monospace" style={{ color: colors.dark }}>{ticket.ticketId}</span>
          </div>
        </div>
      </div>

      {/* 3. Clickable QR Code Stub */}
      <div
        className="d-flex flex-column align-items-center justify-content-center ps-3"
        style={{
          borderLeft: "2px dashed rgba(5,15,42,0.1)",
          cursor: "pointer"
        }}
        onClick={() => onQRClick(qrDataUrl)}
        title="Click to enlarge"
      >
        <div
          className="bg-white p-1 rounded-3 d-flex align-items-center justify-content-center shadow-sm border"
          style={{ width: "85px", height: "85px" }}
        >
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR" className="w-100 h-100" />
          ) : (
             <span className="spinner-border spinner-border-sm text-secondary"></span>
          )}
        </div>
        <div className="mt-2 text-center">
             <small className="d-block fw-bold text-primary" style={{ fontSize: '0.65rem' }}>
               <i className="bi bi-zoom-in me-1"></i>Enlarge
             </small>
        </div>
      </div>
    </article>
  );
}