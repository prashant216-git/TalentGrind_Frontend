// src/routes/_authenticated.tsx

import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '../lib/auth';
import NavBar from '../components/NavBar';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login', replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '2rem' }}>
        <div className="editorial-label" style={{ animation: 'sparkle-glow 1.5s infinite ease-in-out' }}>
          Decrypting Security Nodes...
        </div>
        <div style={{ width: '200px', height: '2px', background: 'var(--border-default)', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
          <div 
            style={{ 
              position: 'absolute', 
              height: '100%', 
              width: '40%', 
              background: 'var(--text-primary)', 
              boxShadow: 'var(--shadow-glow)',
              animation: 'skeleton-loading 1.2s infinite ease-in-out' 
            }} 
          />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <main style={{ flex: 1 }} className="fade-in">
        <Outlet />
      </main>
    </div>
  );
}
