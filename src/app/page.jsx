'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, Users, Printer, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DEFAULT_LANDING_CONTENT = {
  landingBadge: 'DOREK PULSE PLATFORM',
  landingMainTitle: 'Smart QR Customer Experience & Live Service Dispatch',
  landingSubtitle: 'Real-time customer feedback, instant staff service calls, table/counter dispatching, and analytics for Dorek physical outlets.',
  landingCard1Title: 'Customer Mobile View',
  landingCard1Desc: 'What customers see when scanning table/counter QR codes: 5-star ratings, sentiment tags, and instant staff assistance calls.',
  landingCard1Btn: 'Test Customer View',
  landingCard2Title: 'Staff Operations Board',
  landingCard2Desc: 'Real-time dispatch board for outlet staff with audible chimes, active response SLA timer, and task completion buttons.',
  landingCard2Btn: 'Open Staff Board',
  landingCard3Title: 'Printable QR Stand Studio',
  landingCard3Desc: 'Generate and print high-resolution Table Tent cards and counter display stickers customized for any store department.',
  landingCard3Btn: 'Launch QR Studio',
  landingFooterBannerTitle: 'Connected with Dorek Central Admin',
  landingFooterBannerDesc: 'All incoming customer feedback, service response speeds, and analytics sync live to the Dorek Admin Dashboard.'
};

export default function HomePage() {
  const [content, setContent] = useState(DEFAULT_LANDING_CONTENT);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'dorek_cms', 'pulse_page_content'), (snap) => {
      if (snap.exists()) {
        setContent(prev => ({ ...prev, ...snap.data() }));
      }
    }, (err) => console.log('Landing page CMS listener:', err));

    return () => unsub();
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '8px 20px', borderRadius: '50px', marginBottom: '18px' }}>
          <img src="/logo.png" alt="Dorek Logo" style={{ height: '24px', width: 'auto' }} />
          <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '1.5px', color: '#D4AF37' }}>
            {content.landingBadge || 'DOREK PULSE PLATFORM'}
          </span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.25' }}>
          {content.landingMainTitle || 'Smart QR Customer Experience & Live Service Dispatch'}
        </h1>
        <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
          {content.landingSubtitle || 'Real-time customer feedback, instant staff service calls, table/counter dispatching, and analytics for Dorek physical outlets.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid #D4AF37' }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(212, 175, 55, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37',
              marginBottom: '16px'
            }}>
              <Smartphone size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
              {content.landingCard1Title || 'Customer Mobile View'}
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', marginBottom: '20px' }}>
              {content.landingCard1Desc || 'What customers see when scanning table/counter QR codes: 5-star ratings, sentiment tags, and instant staff assistance calls.'}
            </p>
          </div>
          <Link href="/scan?outlet=Dorek+Main+Showroom&counter=Billing+Counter+01&dept=Retail+Sales" className="btn-gold" style={{ width: '100%', boxSizing: 'border-box' }}>
            <span>{content.landingCard1Btn || 'Test Customer View'}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid #10B981' }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
              marginBottom: '16px'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
              {content.landingCard2Title || 'Staff Operations Board'}
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', marginBottom: '20px' }}>
              {content.landingCard2Desc || 'Real-time dispatch board for outlet staff with audible chimes, active response SLA timer, and task completion buttons.'}
            </p>
          </div>
          <Link href="/staff" className="btn-outline" style={{ width: '100%', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)', boxSizing: 'border-box' }}>
            <span>{content.landingCard2Btn || 'Open Staff Board'}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid #38BDF8' }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8',
              marginBottom: '16px'
            }}>
              <Printer size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
              {content.landingCard3Title || 'Printable QR Stand Studio'}
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', marginBottom: '20px' }}>
              {content.landingCard3Desc || 'Generate and print high-resolution Table Tent cards and counter display stickers customized for any store department.'}
            </p>
          </div>
          <Link href="/qr-studio" className="btn-outline" style={{ width: '100%', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.3)', boxSizing: 'border-box' }}>
            <span>{content.landingCard3Btn || 'Launch QR Studio'}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            {content.landingFooterBannerTitle || 'Connected with Dorek Central Admin'}
          </h4>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
            {content.landingFooterBannerDesc || 'All incoming customer feedback, service response speeds, and analytics sync live to the Dorek Admin Dashboard.'}
          </p>
        </div>
        <a href={content.websiteUrl || 'https://dorek.in'} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: '13px' }}>
          <span>dorek.in</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
