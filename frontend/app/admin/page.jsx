'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [form, setForm] = useState({ title: '', price: '', location: '', image: '', description: '' });
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login)
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      router.push('/admin'); // redirect after login
    } else {
      alert('Login failed');
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    if (res.ok) {
      alert('Property added');
      setForm({ title: '', price: '', location: '', image: '', description: '' });
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to add');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/');
  }

  if (!token) {
    return (
      <div className="admin-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} placeholder="Email" />
          <input type="password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-form">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Add Property</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
      <form onSubmit={handleAdd}>
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" />
        <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" />
        <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Location" />
        <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Image URL" />
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" />
        <button type="submit">Add Property</button>
      </form>
    </div>
  );
}
