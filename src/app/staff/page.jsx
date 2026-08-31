'use client';
import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { playChime } from '../../utils/soundAlerts';
import { 
  Bell, CheckCircle2, Clock, Volume2, VolumeX, Star, 
  AlertTriangle, Filter, ShoppingBag, MapPin, User, Phone, Check, RefreshCw
} from 'lucide-react';

export default function StaffPortal() {
  const [tickets, setTickets] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState('all');
  const [activeTab, setActiveTab] = useState('active');
  const prevTicketCount = useRef(0);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const q = query(collection(db, 'dorek_pulse_tickets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const activeCount = list.filter(t => t.status === 'new').length;
      if (!isFirstLoad.current && activeCount > prevTicketCount.current && soundEnabled) {
        playChime('new_ticket');
      }
      
      prevTicketCount.current = activeCount;
      isFirstLoad.current = false;
      setTickets(list);
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const ticketRef = doc(db, 'dorek_pulse_tickets', ticketId);
      const updates = { status: newStatus };
      if (newStatus === 'resolved') {
        const ticket = tickets.find(t => t.id === ticketId);
        updates.resolvedAt = Date.now();
        if (ticket && ticket.createdAt) {
          updates.resolutionTimeSeconds = Math.round((Date.now() - ticket.createdAt) / 1000);
        }
        if (soundEnabled) playChime('resolved');
      }
      await updateDoc(ticketRef, updates);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const outlets = ['all', ...Array.from(new Set(tickets.map(t => t.outlet || 'Dorek Retail Outlet')))];
  
  const filteredTickets = tickets.filter(t => {
    if (selectedOutlet !== 'all' && t.outlet !== selectedOutlet) return false;
    if (activeTab === 'active') return t.status === 'new' || t.status === 'attending';
    if (activeTab === 'resolved') return t.status === 'resolved' && t.type === 'service_call';
    if (activeTab === 'reviews') return t.type === 'review';
    return true;
  });

  const pendingServiceCalls = tickets.filter(t => t.status === 'new' && t.type === 'service_call');
  const lowRatingAlerts = tickets.filter(t => t.status === 'new' && t.type === 'review' && t.rating <= 2);

  return (
    <div style={{ minHeight: '100vh', padding: '24px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/logo.png" alt="Dorek Logo" style={{ height: '32px', width: 'auto' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
              Dorek Pulse • Staff Live Operations Board
            </h1>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Real-time Customer Service Requests & Inquiries
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-outline"
            style={{ padding: '8px 14px', fontSize: '12px' }}
            title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
          >
            {soundEnabled ? <Volume2 size={16} style={{ color: '#10B981' }} /> : <VolumeX size={16} style={{ color: '#EF4444' }} />}
            <span>{soundEnabled ? 'Sound On' : 'Sound Muted'}</span>
          </button>

          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            style={{
              background: 'rgba(6, 28, 59, 0.9)',
              color: '#FFFFFF',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '13px',
              outline: 'none'
            }}
          >
            {outlets.map(o => (
              <option key={o} value={o}>
                {o === 'all' ? '🏢 All Outlets' : `📍 ${o}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid #EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>Active Service Calls</span>
            <Bell size={20} style={{ color: '#EF4444' }} className={pendingServiceCalls.length > 0 ? 'anim-pulse' : ''} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', marginTop: '6px' }}>
            {pendingServiceCalls.length}
          </div>
          <span style={{ fontSize: '11px', color: pendingServiceCalls.length > 0 ? '#F87171' : '#10B981' }}>
            {pendingServiceCalls.length > 0 ? '⚠️ Immediate assistance needed' : 'All counters attended'}
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>Urgent Feedback / Complaints</span>
            <AlertTriangle size={20} style={{ color: '#F59E0B' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', marginTop: '6px' }}>
            {lowRatingAlerts.length}
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            1-2 Star Reviews needing follow-up
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>Total Reviews Today</span>
            <Star size={20} style={{ color: '#D4AF37' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#FFFFFF', marginTop: '6px' }}>
            {tickets.filter(t => t.type === 'review').length}
          </div>
          <span style={{ fontSize: '11px', color: '#10B981' }}>
            Avg Rating: {
              (tickets.filter(t => t.type === 'review' && t.rating).reduce((acc, curr) => acc + curr.rating, 0) /
              (tickets.filter(t => t.type === 'review' && t.rating).length || 1)).toFixed(1)
            } / 5.0 ⭐
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            background: activeTab === 'active' ? 'var(--secondary)' : 'transparent',
            color: activeTab === 'active' ? '#061C3B' : '#94A3B8',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          🚨 Live Service Tasks ({tickets.filter(t => t.status === 'new' || t.status === 'attending').length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          style={{
            background: activeTab === 'reviews' ? 'var(--secondary)' : 'transparent',
            color: activeTab === 'reviews' ? '#061C3B' : '#94A3B8',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          ⭐ Customer Reviews ({tickets.filter(t => t.type === 'review').length})
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          style={{
            background: activeTab === 'resolved' ? 'var(--secondary)' : 'transparent',
            color: activeTab === 'resolved' ? '#061C3B' : '#94A3B8',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          ✅ Resolved History
        </button>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', color: '#94A3B8' }}>
          <CheckCircle2 size={48} style={{ color: '#10B981', margin: '0 auto 12px' }} />
          <h3 style={{ color: '#FFFFFF', marginBottom: '4px' }}>All Clear! No Pending Tickets</h3>
          <p style={{ fontSize: '13px' }}>Customer service calls and new inquiries will appear here in real-time with sound alerts.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filteredTickets.map((ticket) => {
            const isNew = ticket.status === 'new';
            const isAttending = ticket.status === 'attending';
            const elapsedMinutes = Math.floor((Date.now() - ticket.createdAt) / 60000);
            
            return (
              <div 
                key={ticket.id} 
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderTop: isNew ? '4px solid #EF4444' : (isAttending ? '4px solid #F59E0B' : '4px solid #10B981'),
                  background: isNew ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{
                      background: isNew ? 'rgba(239, 68, 68, 0.2)' : (isAttending ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'),
                      color: isNew ? '#F87171' : (isAttending ? '#FBBF24' : '#34D399'),
                      border: `1px solid ${isNew ? '#EF4444' : (isAttending ? '#F59E0B' : '#10B981')}`,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }}>
                      {isNew ? '● ATTENTION NEEDED' : (isAttending ? '● IN PROGRESS' : '✓ RESOLVED')}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', marginTop: '8px' }}>
                      {ticket.requestType || (ticket.type === 'review' ? `${ticket.rating} Star Review` : 'Assistance')}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '11px', color: '#94A3B8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                      <Clock size={12} /> {elapsedMinutes}m ago
                    </div>
                    {ticket.resolutionTimeSeconds && (
                      <span style={{ color: '#10B981', fontWeight: '700' }}>Resolved in {ticket.resolutionTimeSeconds}s</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#D4AF37', fontWeight: '700', marginBottom: '10px' }}>
                  <MapPin size={15} />
                  <span>{ticket.counter}</span>
                  <span style={{ color: '#64748B', fontWeight: 'normal' }}>• {ticket.outlet}</span>
                </div>

                {ticket.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={ticket.rating >= s ? '#D4AF37' : 'none'} color={ticket.rating >= s ? '#D4AF37' : 'rgba(255,255,255,0.2)'} />
                    ))}
                  </div>
                )}

                {ticket.tags && ticket.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {ticket.tags.map((tag, idx) => (
                      <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', color: '#CBD5E1' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {ticket.message && (
                  <p style={{ background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: '#E2E8F0', lineHeight: '1.4', marginBottom: '12px' }}>
                    "{ticket.message}"
                  </p>
                )}

                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>
                  <span>Customer: <strong>{ticket.customerName || 'Walk-in Customer'}</strong></span>
                  {ticket.customerPhone && <span style={{ marginLeft: '10px' }}>📞 {ticket.customerPhone}</span>}
                </div>

                {ticket.status !== 'resolved' && (
                  <div style={{ display: 'grid', gridTemplateColumns: isNew ? '1fr 1fr' : '1fr', gap: '8px' }}>
                    {isNew && (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, 'attending')}
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#FBBF24',
                          border: '1px solid #F59E0B',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Attend Counter
                      </button>
                    )}

                    <button
                      onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                      style={{
                        background: '#10B981',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Check size={14} /> Mark Completed
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
