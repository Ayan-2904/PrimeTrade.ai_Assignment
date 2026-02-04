import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);
    
    if (!result.success) {
      setErrors({ server: result.error });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Create Account</h2>
        
        {errors.server && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            {errors.server}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <span style={{ color: '#dc2626', fontSize: '14px' }}>{errors.name}</span>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
            />
            {errors.email && (
              <span style={{ color: '#dc2626', fontSize: '14px' }}>{errors.email}</span>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
            />
            {errors.password && (
              <span style={{ color: '#dc2626', fontSize: '14px' }}>{errors.password}</span>
            )}
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span style={{ color: '#dc2626', fontSize: '14px' }}>{errors.confirmPassword}</span>
            )}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;