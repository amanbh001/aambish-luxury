// app/privacy-policy/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'Read Aambish Luxury\'s privacy policy to understand how we collect, use, and protect your personal information.' };
export default function PrivacyPage() { return <PolicyPage title="Privacy Policy" lastUpdated="1 April 2025" content={PRIVACY_CONTENT} />; }

// app/terms/page.tsx — merged for brevity, split in actual project
function PolicyPage({ title, lastUpdated, content }: { title: string; lastUpdated: string; content: { heading: string; body: string }[] }) {
  return (
    <div className="page-content">
      <div style={{ background: 'var(--ivory-deep)', borderBottom: '1px solid var(--border)', padding: '60px 0 40px' }}>
        <div className="container-narrow">
          <span className="section-label">Legal</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>{title}</h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '13px' }}>Last updated: {lastUpdated}</p>
        </div>
      </div>
      <div className="container-narrow section-pad">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {content.map((section, i) => (
            <div key={i}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '14px', color: 'var(--forest)' }}>{section.heading}</h3>
              <p style={{ color: 'var(--forest-mid)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PRIVACY_CONTENT = [
  { heading: '1. Information We Collect', body: 'We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email address, phone number, delivery address, and payment information (processed securely via Razorpay).\n\nWe also automatically collect browsing data such as IP address, browser type, and pages visited to improve our services.' },
  { heading: '2. How We Use Your Information', body: 'Your information is used to process orders and payments, send order confirmations and shipping updates, respond to your enquiries, send promotional emails (with your consent), improve our website and personalise your experience, and comply with legal obligations.' },
  { heading: '3. Data Sharing', body: 'We do not sell your personal data. We share data only with trusted service providers (payment gateways, delivery partners) strictly to fulfil your orders, and with legal authorities when required by law.' },
  { heading: '4. Cookies', body: 'We use cookies for essential site functionality (cart, login), analytics (Google Analytics), and advertising (Meta Pixel). You can manage cookie preferences through our cookie consent banner.' },
  { heading: '5. Your Rights', body: 'You have the right to access, correct, or delete your personal data. You may also withdraw consent for marketing communications at any time. Contact us at privacy@aambish.com to exercise these rights.' },
  { heading: '6. Contact', body: 'For privacy-related concerns, email us at privacy@aambish.com. We will respond within 7 business days.' },
];
