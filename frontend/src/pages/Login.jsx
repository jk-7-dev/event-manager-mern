import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      {/* Use matte-card and padding */}
      <div className="matte-card p-5" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center fw-bold text-navy mb-4">Welcome Back</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="form-label fw-semibold text-muted">Email Address</label>
            <input 
              type="email" 
              className="form-control form-control-lg bg-light border-0"
              placeholder="name@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold text-muted">Password</label>
            <input 
              type="password" 
              className="form-control form-control-lg bg-light border-0"
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {/* Use gradient button */}
          <button type="submit" className="btn btn-gradient-primary w-100 btn-lg mb-3">Sign In</button>
        </form>
        <p className="text-center text-muted">
            Don't have an account? <Link to="/register" className="text-accent fw-semibold text-decoration-none">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;