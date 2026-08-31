'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect customer to the clean scan & rating interface
    router.replace('/scan?outlet=Dorek%20International%20Showroom&counter=Billing%20Counter%2001&dept=Customer%20Support%20%26%20Billing');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#061C3B', color: '#D4AF37' }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/logo.png" alt="Dorek Logo" style={{ height: '40px', width: 'auto', marginBottom: '14px', opacity: 0.9 }} />
        <div style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px' }}>Loading Dorek Customer Portal...</div>
      </div>
    </div>
  );
}
