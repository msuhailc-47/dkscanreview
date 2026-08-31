'use client';
import { useState } from 'react';
import { Star, Send, ThumbsUp, MessageSquare, Phone, User, Check, AlertCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const TAG_MAP = {
  high: ['🌟 Excellent Service', '🛍️ Great Product Quality', '⚡ Fast Checkout', '🤝 Helpful Staff', '✨ Clean & Organized', '💎 Best Value'],
  medium: ['👍 Good Service', '📦 Good Variety', '💳 Fair Pricing', '⌛ Normal Wait Time'],
  low: ['⏳ Slow Service', '📉 Out of Stock', '🧾 Billing Delay', '👤 Staff Assistance Needed', '🛠️ Quality Issue', '📢 Needs Management Attention']
};

export default function CustomerFeedback({ outlet, counter, dept, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const activeTags = rating >= 4 ? TAG_MAP.high : (rating === 3 ? TAG_MAP.medium : TAG_MAP.low);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const ticketData = {
        type: 'review',
        outlet: outlet || 'Dorek Main Outlet',
        counter: counter || 'General Counter',
        dept: dept || 'Retail Sales',
        rating: rating,
        tags: selectedTags,
        message: message.trim(),
        customerName: customerName.trim() || 'Anonymous Customer',
        customerPhone: customerPhone.trim() || '',
        status: rating <= 2 ? 'new' : 'resolved',
        priority: rating <= 2 ? 'high' : 'normal',
        createdAt: Date.now(),
        source: 'QR Scan'
      };

      await addDoc(collection(db, 'dorek_pulse_tickets'), ticketData);
      onSuccess('review');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Unable to submit right now. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel animate-fadeIn" style={{ padding: '28px 20px', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
          Rate Your Shopping Experience
        </h3>
        <p style={{ fontSize: '13px', color: '#94A3B8' }}>
          {outlet} • {counter}
        </p>
      </div>

      {/* Star Rating Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverRating || rating) >= star;
          return (
            <button
              type="button"
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => {
                setRating(star);
                setSelectedTags([]);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                transition: 'transform 0.15s ease',
                transform: (hoverRating || rating) === star ? 'scale(1.2)' : 'scale(1)'
              }}
            >
              <Star 
                size={34} 
                fill={isFilled ? '#D4AF37' : 'none'} 
                color={isFilled ? '#D4AF37' : 'rgba(255,255,255,0.25)'} 
              />
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: '700', color: '#D4AF37', marginBottom: '20px' }}>
        {rating === 5 && '🌟 Outstanding Experience!'}
        {rating === 4 && '😊 Very Good Experience'}
        {rating === 3 && '😐 Average Experience'}
        {rating === 2 && '😕 Needs Improvement'}
        {rating === 1 && '⚠️ Poor Experience'}
      </div>

      {/* Sentiment Tags */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
          What stood out to you?
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {activeTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  background: isSelected ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#FFFFFF' : '#CBD5E1',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: isSelected ? '700' : '500',
                  transition: 'all 0.15s ease'
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments Box */}
      <div style={{ marginBottom: '18px' }}>
        <textarea
          placeholder="Share any additional comments or suggestions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(6, 28, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            color: '#FFFFFF',
            padding: '12px',
            fontSize: '14px',
            resize: 'none',
            outline: 'none'
          }}
        />
      </div>

      {/* Customer Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
        <div>
          <input
            type="text"
            placeholder="Name (Optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(6, 28, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              color: '#FFFFFF',
              padding: '10px 12px',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone (Optional)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(6, 28, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              color: '#FFFFFF',
              padding: '10px 12px',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {error && (
        <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>
          <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} /> {error}
        </div>
      )}

      <button
        type="submit"
        className="btn-gold"
        disabled={isSubmitting}
        style={{ width: '100%', boxSizing: 'border-box' }}
      >
        <Send size={16} />
        <span>{isSubmitting ? 'Submitting Review...' : 'Submit Feedback'}</span>
      </button>
    </form>
  );
}
