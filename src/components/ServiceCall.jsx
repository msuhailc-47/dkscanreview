'use client';
import { useState } from 'react';
import { Bell, ShoppingBag, Tag, CreditCard, Package, AlertTriangle, Send } from 'lucide-react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SERVICE_OPTIONS = [
  { id: 'assistance', label: 'Product Assistance', desc: 'Need help finding an item or product specs', icon: ShoppingBag, color: '#38BDF8' },
  { id: 'price_check', label: 'Price / Offer Check', desc: 'Verify price, stock, or promotional discounts', icon: Tag, color: '#FBBF24' },
  { id: 'billing_help', label: 'Billing / Payment Help', desc: 'Assistance with checkout, UPI, or billing speed', icon: CreditCard, color: '#34D399' },
  { id: 'packaging', label: 'Packaging / Delivery', desc: 'Need gift wrapping, carry bag, or delivery info', icon: Package, color: '#A78BFA' },
  { id: 'manager', label: 'Speak with Store Manager', desc: 'Direct escalation to outlet supervisor', icon: AlertTriangle, color: '#F87171' }
];

export default function ServiceCall({ outlet, counter, dept, pageContent = {}, onSuccess }) {
  const [selectedService, setSelectedService] = useState('assistance');
  const [customerNote, setCustomerNote] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const chosen = SERVICE_OPTIONS.find(s => s.id === selectedService);

    const ticketData = {
      type: 'service_call',
      outlet: outlet || 'Dorek Main Outlet',
      counter: counter || 'General Counter',
      dept: dept || 'Retail Sales',
      requestType: chosen ? chosen.label : 'General Assistance',
      message: customerNote.trim() || `${chosen?.label} requested at ${counter || 'counter'}.`,
      customerName: customerName.trim() || 'Store Visitor',
      customerPhone: customerPhone.trim() || '',
      status: 'new',
      priority: selectedService === 'manager' ? 'urgent' : 'high',
      createdAt: Date.now(),
      source: 'QR Service Call'
    };

    try {
      if (db) {
        await addDoc(collection(db, 'dorek_pulse_tickets'), ticketData);
      }

      // Check notification settings from Firestore and dispatch email
      try {
        let notificationEmails = [];
        if (db) {
          const settingsSnap = await getDoc(doc(db, 'dorek_cms', 'notification_settings'));
          if (settingsSnap.exists()) {
            const data = settingsSnap.data();
            notificationEmails = data.emails || [];
          }
        }

        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ticketData, notificationEmails })
        }).catch(err => console.log('Notification dispatch background error:', err));
      } catch (notifyErr) {
        console.log('Notification trigger skipped:', notifyErr);
      }

      onSuccess('service_call');
    } catch (err) {
      console.error('Error creating service call ticket:', err);
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketData)
        });
        onSuccess('service_call');
      } catch (fallbackErr) {
        setError('Unable to notify staff right now. Please notify the counter staff directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel animate-fadeIn" style={{ padding: '28px 20px', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.15)',
          border: '1px solid #D4AF37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          color: '#D4AF37'
        }}>
          <Bell size={26} className="anim-pulse" />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
          {pageContent.callStaffHeaderTitle || 'Call Staff to Your Counter'}
        </h3>
        <p style={{ fontSize: '13px', color: '#94A3B8' }}>
          {outlet} • {counter}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {SERVICE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedService === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedService(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '14px',
                background: isSelected ? 'rgba(10, 46, 93, 0.9)' : 'rgba(255, 255, 255, 0.04)',
                border: isSelected ? `2px solid ${opt.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: `${opt.color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: opt.color,
                flexShrink: 0
              }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? '#FFFFFF' : '#E2E8F0' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  {opt.desc}
                </div>
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: isSelected ? `5px solid ${opt.color}` : '2px solid rgba(255, 255, 255, 0.3)',
                background: isSelected ? '#FFFFFF' : 'transparent',
                flexShrink: 0
              }} />
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder={pageContent.callStaffNotePlaceholder || 'Add a note (e.g. Inquiring about solar battery warranty)...'}
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(6, 28, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            color: '#FFFFFF',
            padding: '10px 12px',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Your Name (Optional)"
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
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="tel"
          placeholder="Phone Number (Optional)"
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
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {error && (
        <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '14px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn-gold"
        disabled={isSubmitting}
        style={{ width: '100%', boxSizing: 'border-box' }}
      >
        <Bell size={18} />
        <span>{isSubmitting ? 'Sending Alert to Staff...' : (pageContent.callStaffBtnText || 'Call Staff Now')}</span>
      </button>
    </form>
  );
}
