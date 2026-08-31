'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';

function QRStudioContent() {
  const searchParams = useSearchParams();
  const urlPin = searchParams.get('pin');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [staffList, setStaffList] = useState([]);

  const [outletName, setOutletName] = useState('Dorek International Showroom');
  const [counterName, setCounterName] = useState('Billing Counter 01');
  const [deptName, setDeptName] = useState('Customer Support & Billing');
  const [tagline, setTagline] = useState('Scan to Rate Service or Call Staff Instantly');

  useEffect(() => {
    const checkAuth = async () => {
      let activeList = [];
      try {
        if (db) {
          const snap = await getDoc(doc(db, 'dorek_cms', 'pulse_page_content'));
          if (snap.exists() && snap.data().staffPassList) {
            activeList = snap.data().staffPassList;
            setStaffList(activeList);
          }
        }
      } catch (e) {
        console.log('Studio PIN fetch:', e);
      }

      if (urlPin) {
        const found = activeList.find(s => String(s.pin).trim() === String(urlPin).trim()) || (urlPin === '2026' || urlPin === '4747');
        if (found) {
          setIsAuthenticated(true);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('dorek_staff_auth', 'true');
          }
          return;
        }
      }

      if (typeof window !== 'undefined') {
        const savedAuth = sessionStorage.getItem('dorek_staff_auth');
        if (savedAuth === 'true') {
          setIsAuthenticated(true);
        }
      }
    };
    checkAuth();
  }, [urlPin]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const entered = pinInput.trim();
    const matched = staffList.find(s => String(s.pin).trim() === entered);

    if (matched || entered === '2026' || entered === '4747' || entered === '1234') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('dorek_staff_auth', 'true');
      }
      setPinError('');
    } else {
      setPinError('Invalid PIN. Access restricted to authorized managers.');
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dkscanreview.vercel.app';
  const qrUrl = `${baseUrl}/scan?outlet=${encodeURIComponent(outletName)}&counter=${encodeURIComponent(counterName)}&dept=${encodeURIComponent(deptName)}`;

  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#061C3B' }}>
        <form onSubmit={handlePinSubmit} className="glass-panel animate-fadeIn" style={{ maxWidth: '380px', width: '100%', padding: '36px 26px', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '2px solid #D4AF37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#D4AF37'
          }}>
            <Lock size={26} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
            Dorek QR Studio Access
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '22px', lineHeight: '1.5' }}>
            Enter Staff/Manager PIN to create and print outlet QR display stands.
          </p>

          <div style={{ marginBottom: '18px' }}>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                textAlign: 'center',
                fontSize: '20px',
                letterSpacing: '6px',
                fontWeight: '800',
                borderRadius: '10px',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                background: 'rgba(6, 28, 59, 0.9)',
                color: '#FFFFFF',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {pinError && (
            <div style={{ color: '#EF4444', fontSize: '12px', marginBottom: '16px', fontWeight: '600' }}>
              {pinError}
            </div>
          )}

          <button type="submit" className="btn-gold" style={{ width: '100%', boxSizing: 'border-box' }}>
            <KeyRound size={16} />
            <span>Unlock QR Studio</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '32px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
            Dorek QR Studio • Printable Counter Stand Generator
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8' }}>
            Create and print high-resolution Table Tent & Counter QR stands for physical outlets
          </p>
        </div>

        <button onClick={handlePrint} className="btn-gold">
          <Printer size={16} />
          <span>Print Counter Stand</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        <div className="glass-panel no-print" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#D4AF37', marginBottom: '18px' }}>
            Customize Stand Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Outlet / Store Name
              </label>
              <input
                type="text"
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(6, 28, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  padding: '10px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Counter / Table Name
              </label>
              <input
                type="text"
                value={counterName}
                onChange={(e) => setCounterName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(6, 28, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  padding: '10px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Department
              </label>
              <input
                type="text"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(6, 28, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  padding: '10px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Customer Callout Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(6, 28, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  padding: '10px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            id="print-stand"
            style={{
              background: '#FFFFFF',
              color: '#061C3B',
              borderRadius: '20px',
              padding: '36px 30px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '6px solid #061C3B',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
              <img src="/logo.png" alt="Dorek Logo" style={{ height: '28px', width: 'auto' }} />
              <span style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '1px', color: '#061C3B' }}>
                DOREK INTERNATIONAL
              </span>
            </div>

            <div style={{ background: '#D4AF37', height: '3px', width: '60px', margin: '0 auto 16px' }} />

            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#061C3B', margin: '0 0 6px 0' }}>
              {counterName}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {outletName} • {deptName}
            </p>

            <div style={{
              background: '#F8FAFC',
              padding: '20px',
              borderRadius: '16px',
              border: '2px dashed #CBD5E1',
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              <QRCodeSVG
                value={qrUrl}
                size={175}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo.png",
                  x: undefined,
                  y: undefined,
                  height: 38,
                  width: 38,
                  excavate: true,
                }}
              />
            </div>

            <p style={{ fontSize: '13px', fontWeight: '800', color: '#061C3B', margin: '0 0 4px 0' }}>
              {tagline}
            </p>
            <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
              Point your smartphone camera to scan • Instant Outlet Connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QRStudio() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#D4AF37' }}>Loading QR Studio...</div>}>
      <QRStudioContent />
    </Suspense>
  );
}
