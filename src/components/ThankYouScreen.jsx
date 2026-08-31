'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, MessageCircle, RotateCcw, Heart, Star, Sparkles, ExternalLink } from 'lucide-react';

export default function ThankYouScreen({ type, outlet, counter, pageContent = {}, onReset }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#0A2E5D', '#38BDF8', '#10B981', '#F59E0B']
      });
    } catch (e) {
      console.log('Confetti trigger:', e);
    }
  }, []);

  const isReview = type === 'review';
  const websiteUrl = pageContent.websiteUrl || 'https://dorek.in';
  const websiteBtnText = pageContent.websiteBtnText || 'Visit Dorek International (dorek.in) →';
  
  // WhatsApp Pretext & Clean Phone Number
  const rawPhone = pageContent.whatsappPhone || '919747522000';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const defaultPretext = `Hi Dorek International, I visited your ${outlet} (${counter}) and would like to connect with your team.`;
  const customPretext = pageContent.whatsappPretext || defaultPretext;
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customPretext)}`;
  const whatsappBtnText = pageContent.whatsappBtnText || '💬 Chat with Outlet on WhatsApp';

  return (
    <div className="glass-panel animate-fadeIn" style={{ padding: '36px 22px', textAlign: 'center', maxWidth: '450px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* Top Delight Icon */}
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
        color: '#D4AF37',
        boxShadow: '0 0 20px rgba(212, 175, 55, 0.25)'
      }}>
        {isReview ? <Star size={32} fill="#D4AF37" /> : <Sparkles size={32} />}
      </div>

      <h2 style={{ fontSize: '23px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px', lineHeight: '1.3' }}>
        {isReview 
          ? (pageContent.thankYouReviewTitle || 'Thank You for Your Feedback!') 
          : (pageContent.thankYouServiceTitle || 'Staff Alerted Successfully!')}
      </h2>

      <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '24px' }}>
        {isReview 
          ? (pageContent.thankYouReviewMessage || 'Your feedback helps us provide the best engineering and retail experience across all our outlets.') 
          : (pageContent.thankYouServiceMessage || `Our counter supervisor is on their way to assist you at ${counter}.`)}
      </p>

      {/* Cross-Promotion & Connect Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(10,46,93,0.95) 0%, rgba(22,66,125,0.95) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '16px',
        padding: '20px 18px',
        marginBottom: '22px',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#D4AF37', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
          {pageContent.promoBadge || 'Explore Our Engineering & Products'}
        </div>
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 16px 0' }}>
          {pageContent.promoTitle || 'Discover Dorek International Online'}
        </h4>

        {/* 1. Website Redirect Button */}
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
            color: '#0A2E5D',
            padding: '12px 18px',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
            transition: 'transform 0.15s ease',
            marginBottom: '12px',
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <span>{websiteBtnText}</span>
          <ArrowRight size={16} />
        </a>

        {/* 2. WhatsApp Direct Connect Button (Solid WhatsApp Green UI with Pretext) */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#25D366',
            color: '#FFFFFF',
            padding: '11px 18px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '13px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
            transition: 'all 0.15s ease',
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <MessageCircle size={17} />
          <span>{whatsappBtnText}</span>
        </a>
      </div>

      {/* Reset / Another Response Button */}
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
        <span>{pageContent.resetBtnText || 'Submit Another Response'}</span>
      </button>
    </div>
  );
}
