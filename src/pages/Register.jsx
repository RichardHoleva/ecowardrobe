import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import RegisterInput from '../components/RegisterInput';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Try Supabase authentication if configured
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          console.warn('Supabase signup failed:', error.message);
        }
      }
      
      // Navigate to goal setup after registration
      navigate('/goal-setup');
    } catch (err) {
      console.error('Registration error:', err);
      // Still navigate to goal setup even if there's an error (for development)
      navigate('/goal-setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Sign up</h1>
        
        <form onSubmit={handleRegister} className="login-form">
          <RegisterInput
            label="Email"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <RegisterInput
            label="Password"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <RegisterInput
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button 
            type="submit" 
            className="lgn"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <p className="login-footer">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="auth-switch-button"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}