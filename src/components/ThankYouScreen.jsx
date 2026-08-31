'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, MessageCircle, RotateCcw, Heart, Star, Sparkles } from 'lucide-react';

export default function ThankYouScreen({ type, outlet, counter, pageContent = {}, onReset }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#0A2E5D', '#38BDF8', '#F59E0B']
      });
    } catch (e) {
      console.log('Confetti trigger:', e);
    }
  }, []);

  const isReview = type === 'review';
  const websiteUrl = pageContent.websiteUrl || 'https://dorek.in';
  const websiteBtnText = pageContent.websiteBtnText || 'Visit Dorek International (dorek.in) →';
  const whatsappUrl = pageContent.whatsappUrl || 'https://wa.me/919747522000';
  const whatsappBtnText = pageContent.whatsappBtnText || '💬 Chat with Outlet Support (+91 97475 22000)';

  return (
    <div className="glass-panel animate-fadeIn" style={{ padding: '36px 24px', textAlign: 'center', maxWidth: '440px', margin: '0 auto' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(212, 175, 55, 0.15)',
        border: '2px solid #D4AF37',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        color: '#D4AF37'
      }}>
        {isReview ? <Star size={32} fill="#D4AF37" /> : <Sparkles size={32} />}
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
        {isReview 
          ? (pageContent.thankYouReviewTitle || 'Thank You for Your Feedback!') 
          : (pageContent.thankYouServiceTitle || 'Staff Alerted Successfully!')}
      </h2>

      <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '28px' }}>
        {isReview 
          ? (pageContent.thankYouReviewMessage || 'Your feedback helps us provide the best engineering and retail experience across all our outlets.') 
          : (pageContent.thankYouServiceMessage || `Our counter supervisor is on their way to assist you at ${counter}.`)}
      </p>

      {/* Cross-Promotion Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(10,46,93,0.8) 0%, rgba(22,66,125,0.8) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        padding: '20px 16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#D4AF37', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
          Explore Our Engineering & Products
        </div>
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 14px 0' }}>
          Discover Dorek International Online
        </h4>

        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#D4AF37',
            color: '#0A2E5D',
            padding: '12px 18px',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
            transition: 'transform 0.15s ease'
          }}
        >
          <span>{websiteBtnText}</span>
          <ArrowRight size={16} />
        </a>

        <div style={{ marginTop: '12px' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38BDF8',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            <MessageCircle size={15} />
            <span>{whatsappBtnText}</span>
          </a>
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#94A3B8',
          padding: '10px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <RotateCcw size={14} />
        <span>Submit Another Response</span>
      </button>
    </div>
  );
}
