'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/');
  }

  return (
    <header className="site-header">
      <div className="logo">Mini Property Platform</div>
      <nav>
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/admin" className="nav-link">Admin</Link>
        {token && (
          <button className="nav-link logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
