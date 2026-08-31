'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Bell, MapPin } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CustomerFeedback from '../../components/CustomerFeedback';
import ServiceCall from '../../components/ServiceCall';
import ThankYouScreen from '../../components/ThankYouScreen';

const DEFAULT_CONTENT = {
  brandTitle: 'DOREK INTERNATIONAL',
  tagline: 'Official Outlet Customer System',
  rateTabLabel: 'Rate & Review',
  serviceTabLabel: 'Call Staff / Help',
  footerNotice: 'Powered by Dorek Pulse • Official Outlet Customer System'
};

function ScanPageContent() {
  const searchParams = useSearchParams();
  const outlet = searchParams.get('outlet') || 'Dorek Retail Outlet';
  const counter = searchParams.get('counter') || 'Customer Desk';
  const dept = searchParams.get('dept') || 'Retail Services';

  const [activeTab, setActiveTab] = useState('feedback');
  const [completedType, setCompletedType] = useState(null);
  const [pageContent, setPageContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'dorek_cms', 'pulse_page_content'), (snap) => {
      if (snap.exists()) {
        setPageContent(prev => ({ ...prev, ...snap.data() }));
      }
    }, (err) => console.log('CMS pulse content listener:', err));

    return () => unsub();
  }, []);

  if (completedType) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ThankYouScreen 
          type={completedType} 
          outlet={outlet}
          counter={counter}
          pageContent={pageContent}
          onReset={() => setCompletedType(null)} 
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '24px 16px 40px' }}>
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.08)', padding: '8px 18px', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)', marginBottom: '14px' }}>
          <img src="/logo.png" alt="Dorek Logo" style={{ height: '24px', width: 'auto' }} />
          <span style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '1px', color: '#D4AF37' }}>
            {pageContent.brandTitle || 'DOREK INTERNATIONAL'}
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
          Welcome to {outlet}
        </h1>
        <p style={{ fontSize: '13px', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <MapPin size={14} style={{ color: '#D4AF37' }} /> {counter} • {dept}
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        background: 'rgba(6, 28, 59, 0.6)',
        padding: '6px',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('feedback')}
          style={{
            background: activeTab === 'feedback' ? 'linear-gradient(135deg, #0A2E5D 0%, #16427D 100%)' : 'transparent',
            border: activeTab === 'feedback' ? '1px solid #D4AF37' : 'none',
            color: activeTab === 'feedback' ? '#FFFFFF' : '#94A3B8',
            borderRadius: '12px',
            padding: '12px 10px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Star size={16} fill={activeTab === 'feedback' ? '#D4AF37' : 'none'} color={activeTab === 'feedback' ? '#D4AF37' : 'currentColor'} />
          <span>{pageContent.rateTabLabel || 'Rate & Review'}</span>
        </button>

        <button
          onClick={() => setActiveTab('service')}
          style={{
            background: activeTab === 'service' ? 'linear-gradient(135deg, #0A2E5D 0%, #16427D 100%)' : 'transparent',
            border: activeTab === 'service' ? '1px solid #D4AF37' : 'none',
            color: activeTab === 'service' ? '#FFFFFF' : '#94A3B8',
            borderRadius: '12px',
            padding: '12px 10px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Bell size={16} color={activeTab === 'service' ? '#D4AF37' : 'currentColor'} />
          <span>{pageContent.serviceTabLabel || 'Call Staff / Help'}</span>
        </button>
      </div>

      {activeTab === 'feedback' ? (
        <CustomerFeedback
          outlet={outlet}
          counter={counter}
          dept={dept}
          pageContent={pageContent}
          onSuccess={(type) => setCompletedType(type)}
        />
      ) : (
        <ServiceCall
          outlet={outlet}
          counter={counter}
          dept={dept}
          pageContent={pageContent}
          onSuccess={(type) => setCompletedType(type)}
        />
      )}

      <footer style={{ textAlign: 'center', marginTop: '32px', color: '#64748B', fontSize: '12px' }}>
        {pageContent.footerNotice || 'Powered by Dorek Pulse • Official Outlet Customer System'}
      </footer>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#D4AF37' }}>Loading Dorek Smart QR...</div>}>
      <ScanPageContent />
    </Suspense>
  );
}
