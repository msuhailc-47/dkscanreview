'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QRStudio() {
  const [outletName, setOutletName] = useState('Dorek International Showroom');
  const [counterName, setCounterName] = useState('Billing Counter 01');
  const [deptName, setDeptName] = useState('Customer Support & Billing');
  const [tagline, setTagline] = useState('Scan to Rate Service or Call Staff Instantly');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dorek.in';
  const qrUrl = `${baseUrl}/scan?outlet=${encodeURIComponent(outletName)}&counter=${encodeURIComponent(counterName)}&dept=${encodeURIComponent(deptName)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', padding: '32px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" className="btn-outline" style={{ padding: '8px 12px' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
              Dorek QR Studio • Printable Counter Stand Generator
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>
              Create and print high-resolution Table Tent & Counter QR stands for physical outlets
            </p>
          </div>
        </div>

        <button onClick={handlePrint} className="btn-gold">
          <Printer size={16} />
          <span>Print Counter Stand</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
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
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  padding: '10px 12px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Counter / Desk / Table Name
              </label>
              <input
                type="text"
                value={counterName}
                onChange={(e) => setCounterName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(6, 28, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  padding: '10px 12px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Department / Section
              </label>
              <input
                type="text"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(6, 28, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  padding: '10px 12px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Call to Action Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(6, 28, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  padding: '10px 12px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <span style={{ fontSize: '11px', color: '#CBD5E1', display: 'block', wordBreak: 'break-all' }}>
                <strong>Generated URL:</strong> {qrUrl}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            id="printable-stand"
            style={{
              width: '320px',
              background: '#FFFFFF',
              color: '#061C3B',
              borderRadius: '24px',
              padding: '28px 24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              textAlign: 'center',
              border: '4px solid #D4AF37',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <img src="/logo.png" alt="Dorek Logo" style={{ height: '28px', width: 'auto' }} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '1px', color: '#0A2E5D' }}>DOREK</div>
                <div style={{ fontSize: '8px', fontWeight: '800', letterSpacing: '2px', color: '#D4AF37' }}>INTERNATIONAL</div>
              </div>
            </div>

            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {outletName}
            </div>

            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0A2E5D', margin: '4px 0 16px' }}>
              {counterName}
            </div>

            <div style={{
              background: '#F8FAFC',
              padding: '16px',
              borderRadius: '18px',
              border: '2px dashed #CBD5E1',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              <QRCodeSVG
                value={qrUrl}
                size={180}
                level="H"
                fgColor="#0A2E5D"
                bgColor="#F8FAFC"
              />
            </div>

            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0A2E5D', marginBottom: '4px' }}>
              {tagline}
            </h4>

            <p style={{ fontSize: '10px', color: '#64748B', margin: '0 0 12px' }}>
              Scan with phone camera or Google Lens
            </p>

            <div style={{
              background: '#0A2E5D',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: '20px',
              display: 'inline-block'
            }}>
              www.dorek.in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
