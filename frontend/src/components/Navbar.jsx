import { Link, useNavigate } from 'react-router-dom';
// Ensure you have a logo image at this path, or update the path
import logoImg from '../assets/logo.png'; 

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    // Using custom-navbar class from index.css
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar mb-4">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Logo Image */}
          <img 
            src={logoImg} 
            alt="Logo" 
            style={{ height: '40px', marginRight: '12px' }} 
            onError={(e) => { e.target.style.display = 'none'; }} // Hide if image missing
          />
          <span className="navbar-brand-text fs-4">Event Manager</span>
        </Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item ms-2">
                  {/* Using the gradient button style for Register */}
                  <Link className="btn btn-gradient-primary btn-sm px-4" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                {user.isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" style={{color: 'var(--soft-purple)'}} to="/admin">Admin Panel</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">My Bookings</Link>
                </li>
                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                  <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;