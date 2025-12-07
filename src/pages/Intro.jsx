import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import google from '../assets/google.png';
import apple from '../assets/apple.png';

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <div>
        <div className="logo-circle" aria-label="EcoWardrobe logo">
          <img src={logo} alt="EcoWardrobe Logo" loading="eager" width="100" height="100" fetchpriority="high" />
        </div>

        <h2 className="auth-subtitle">Welcome to the</h2>
        <p className="auth-title">
          <span className="auth-title-eco">Eco</span>{' '}
          <span className="auth-title-wardrobe">Wardrobe</span>
        </p>

        <button
          type="button"
          className="btn btn-primary btn-full"
          onClick={() => navigate('/login')}
        >
          Continue with email
        </button>

        <div className="divider">
          <span className="divider-line" />
          <span className="divider-text">OR</span>
          <span className="divider-line" />
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-full"
          aria-disabled="true"
        >
          <img src={google} alt="" />
          Sign in with Google
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-full"
          aria-disabled="true"
        >
          <img src={apple} alt=""/>
          Sign in with Apple
        </button>

        <p className="auth-switch-text">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="auth-switch-button"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}