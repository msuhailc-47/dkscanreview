'use client';
import { useEffect } from 'react';
import { CheckCircle2, Globe, MessageCircle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThankYouScreen({ type, onReset, outlet, counter }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#0A2E5D', '#ffffff', '#F3D372']
      });
    } catch (e) {}
  }, []);

  return (
    <div className="glass-panel animate-fadeIn" style={{ padding: '36px 24px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(212, 175, 55, 0.3) 100%)',
        border: '2px solid #10B981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        color: '#10B981'
      }}>
        <CheckCircle2 size={40} />
      </div>

      <span className="gold-badge" style={{ marginBottom: '12px' }}>
        <Sparkles size={14} /> {type === 'service_call' ? 'Staff Notified Instantly' : 'Review Received'}
      </span>

      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
        {type === 'service_call' ? 'Help is on the way!' : 'Thank You For Your Feedback!'}
      </h2>

      <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
        {type === 'service_call' 
          ? `Our team at ${counter || 'your counter'} has received your request and is attending to you right now.`
          : 'Your review helps Dorek International maintain world-class quality and premium customer service across Kerala.'
        }
      </p>

      {/* Cross-Promotion & Website Invitation Card */}
      <div style={{
        background: 'rgba(10, 46, 93, 0.6)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Globe size={20} style={{ color: '#D4AF37' }} />
          <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '700', margin: 0 }}>
            Discover Dorek International
          </h4>
        </div>
        <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
          Explore our complete range of engineering solutions, retail products, franchise opportunities, and business divisions online.
        </p>

        <a 
          href="https://dorek.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-gold"
          style={{ width: '100%', textDecoration: 'none', boxSizing: 'border-box' }}
        >
          <span>Visit Official Website (dorek.in)</span>
          <ArrowRight size={16} />
        </a>
      </div>

      {/* Secondary Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a 
          href="https://wa.me/919876543210?text=Hi%20Dorek%2C%20I%20am%20at%20your%20outlet%20and%20need%20assistance" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-outline"
          style={{ width: '100%', color: '#25D366', borderColor: 'rgba(37, 211, 102, 0.3)' }}
        >
          <MessageCircle size={18} />
          <span>Chat on WhatsApp</span>
        </a>

        <button 
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={14} /> Submit another request / review
        </button>
      </div>
    </div>
  );
}
