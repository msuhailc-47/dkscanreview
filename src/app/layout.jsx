import './globals.css';

export const metadata = {
  title: 'Dorek Pulse | Smart QR & Live Outlet Service Engine',
  description: 'Enterprise Real-Time Customer Experience, Feedback & Live Staff Service Dispatch for Dorek Outlets',
  icons: {
    icon: '/logo.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
