"use client";
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './verify.css';

function VerifyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-email', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to verify");
      
      alert('Email verified successfully! You can now login.');
      router.push('/auth');
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
         <h2>Verify Email</h2>
         <p>Enter the OTP sent to <b>{email}</b></p>
         <form onSubmit={handleVerify}>
           <input 
             type="text" 
             placeholder="Enter 6-digit OTP" 
             value={otp} 
             onChange={e => setOtp(e.target.value)} 
             required 
           />
           {error && <p className="error">{error}</p>}
           <button type="submit" disabled={loading}>
             {loading ? 'Verifying...' : 'Verify'}
           </button>
         </form>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
}
