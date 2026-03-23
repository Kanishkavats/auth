"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMe = async (token) => {
    try {
      const res = await fetch('/api/auth/get-me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setUser(data.user);
    } catch(err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    try {
      const res = await fetch('/api/auth/refresh-token');
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        fetchMe(data.accessToken);
        alert("Refresh token processed successfully. New Access Token received!");
      } else {
        router.push('/auth');
      }
    } catch(err) {
      router.push('/auth');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    localStorage.removeItem('accessToken');
    router.push('/auth');
  };

  const handleLogoutAll = async () => {
    await fetch('/api/auth/logout-all');
    localStorage.removeItem('accessToken');
    router.push('/auth');
  };

  if (loading) return <div style={{padding: 20, textAlign: 'center', fontFamily: 'sans-serif'}}>Loading...</div>;

  return (
    <div style={{fontFamily: 'Montserrat, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f6f5f7'}}>
      <div style={{background: 'white', padding: "40px", borderRadius: "10px", marginTop: "100px", boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)", textAlign: "center", width: "100%", maxWidth: "600px"}}>
        <h1 style={{color: "#8b5cf6", margin: "0 0 20px 0", fontWeight: "bold"}}>Dashboard</h1>
        {user ? (
          <>
            <p style={{fontSize: "20px", margin: "0 0 10px 0"}}>Welcome back, <b>{user.username}</b>!</p>
            <p style={{color: "#666", fontSize: "14px", margin: "0 0 30px 0"}}>{user.email}</p>
            <div style={{display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center"}}>
               <button onClick={handleRefresh} style={{padding: "12px 20px", cursor: "pointer", background: "#10b981", color: "white", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase"}}>Verify Refresh Token Flow</button>
               <button onClick={handleLogout} style={{padding: "12px 20px", cursor: "pointer", background: "#f59e0b", color: "white", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase"}}>Logout</button>
               <button onClick={handleLogoutAll} style={{padding: "12px 20px", cursor: "pointer", background: "#ef4444", color: "white", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase"}}>Logout All Devices</button>
            </div>
          </>
        ) : (
          <>
            <p style={{color: "#333", marginBottom: "20px"}}>You are not logged in or your session expired.</p>
            <button onClick={() => router.push('/auth')} style={{padding: "12px 30px", cursor: "pointer", background: "#8b5cf6", color: "white", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase"}}>Go to Login</button>
          </>
        )}
      </div>
    </div>
  );
}
