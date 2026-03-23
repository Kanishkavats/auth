"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './auth.css';

export default function AuthPage() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const router = useRouter();

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      router.push(`/verify-email?email=${encodeURIComponent(registerEmail)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message === "Email not verified") {
           router.push(`/verify-email?email=${encodeURIComponent(loginEmail)}`);
           return;
        }
        throw new Error(data.message || 'Login failed');
      }
      
      // Save access token to local storage for quick access in client (dashboard)
      localStorage.setItem('accessToken', data.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
      {/* Sign Up */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f">f</i></a>
            <a href="#" className="social"><i className="fab fa-google">G</i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in">in</i></a>
          </div>
          <span>or use your email for registration</span>
          <input 
            type="text" 
            placeholder="Name" 
            required 
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
      </div>

      {/* Sign In */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f">f</i></a>
            <a href="#" className="social"><i className="fab fa-google">G</i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in">in</i></a>
          </div>
          <span>or use your account</span>
          <input 
            type="email" 
            placeholder="Email" 
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <a href="#">Forgot your password?</a>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
