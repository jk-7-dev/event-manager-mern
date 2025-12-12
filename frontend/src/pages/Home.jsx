import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events');
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: '50vh'}}>
        <div className="spinner-border text-accent" role="status"></div>
    </div>
  );

  if (error) return <div className="alert alert-danger text-center my-5 mx-auto container" style={{maxWidth:'600px'}}>{error}</div>;

  return (
    <div className="container pb-5">
      <h2 className="section-title">Upcoming Experiences</h2>
      
      {events.length === 0 ? (
        <div className="text-center py-5 text-muted">
            <h4>No events currently scheduled.</h4>
            <p>Check back soon for exciting updates!</p>
        </div>
      ) : (
        <div className="row g-4">
          {events.map((event) => (
            <div className="col-12 col-sm-6 col-lg-4" key={event._id}>
              {/* Using custom matte-card class */}
              <div className="card h-100 matte-card border-0">
                
                <div className="card-img-wrapper position-relative">
                   <img 
                     src={event.image || 'https://placehold.co/600x400?text=Event+Image'} 
                     className="card-img-top" 
                     alt={event.title}
                   />
                   <div className="position-absolute top-0 end-0 m-3 badge bg-white text-navy shadow-sm py-2 px-3 rounded-pill">
                     {new Date(event.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                   </div>
                </div>
                
                <div className="card-body d-flex flex-column p-4">
                  <h5 className="card-title fw-bold mb-3 text-navy">{event.title}</h5>
                  
                  <div className="mb-4">
                    <p className="card-text text-muted mb-2 d-flex align-items-center">
                      <i className="bi bi-geo-alt-fill text-accent me-2"></i>
                      {event.location}
                    </p>
                    <p className="card-text text-muted small d-flex align-items-center">
                        <i className="bi bi-clock-fill text-accent me-2"></i>
                        {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div>
                        <span className="text-muted small d-block">ab</span>
                        <h4 className="text-accent fw-bold mb-0">
                          ${event.price}
                        </h4>
                    </div>
                    
                    <Link to={`/event/${event._id}`} className="btn btn-gradient-primary px-4">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;