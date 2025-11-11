import React, { useState } from 'react';
import { updateProfile } from '../services/api';
import './Onboarding.css';

function Onboarding({ user, onComplete }) {
  const [name, setName] = useState('');
  const [unitSystem, setUnitSystem] = useState('kg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setError('');
    setLoading(true);

    console.log('Updating profile:', { name, unit_system: unitSystem });

    try {
      await updateProfile({ 
        name: name.trim(), 
        unit_system: unitSystem,
        timezone: 'UTC'
      });
      
      const updatedUser = { 
        ...user, 
        name: name.trim(), 
        unit_system: unitSystem,
        timezone: 'UTC',
        needs_onboarding: false
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Profile updated successfully!');
      onComplete(updatedUser);
    } catch (err) {
      console.error('Update profile error:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1>👋 Welcome!</h1>
        <p className="subtitle">Let's set up your profile</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
              minLength="2"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Units *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="kg"
                  checked={unitSystem === 'kg'}
                  onChange={(e) => setUnitSystem(e.target.value)}
                  disabled={loading}
                />
                Kilograms (kg)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="lb"
                  checked={unitSystem === 'lb'}
                  onChange={(e) => setUnitSystem(e.target.value)}
                  disabled={loading}
                />
                Pounds (lb)
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading || name.trim().length < 2}>
            {loading ? 'Saving...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
