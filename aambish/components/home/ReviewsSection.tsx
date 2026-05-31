// components/home/ReviewsSection.tsx
const reviews = [
  { name: 'Priya Sharma',   city: 'Mumbai',      rating: 5, text: 'Got my order in just 2 days — I couldn\'t believe it! The Celestial ring is so beautiful in person. Packaging felt genuinely luxury. Worth every rupee.' },
  { name: 'Ananya Verma',   city: 'Delhi',       rating: 5, text: 'Gifted my mummy the Bloom set for her birthday. She literally had tears in her eyes — said it\'s the most beautiful jewellery she\'s ever received. The design is stunning.' },
  { name: 'Riya Mehta',     city: 'Bangalore',   rating: 5, text: 'Ordered a customised combo for my sister\'s wedding — ring, earrings and bracelet all from Aambish. They made it happen so beautifully. My sister was absolutely speechless!' },
  { name: 'Kavya Nair',     city: 'Chennai',     rating: 5, text: 'Delivery in 2 days and the quality is honestly better than anything I\'ve seen in offline jewellery stores — at almost half the price. Already placed a second order.' },
  { name: 'Simran Kaur',    city: 'Chandigarh',  rating: 5, text: 'The minimalist necklace is exactly what I\'d been searching for everywhere. So elegant, so graceful. Wore it to a wedding and got non-stop compliments all evening.' },
  { name: 'Meghna Joshi',   city: 'Pune',        rating: 5, text: 'Gifted my best friend a surprise from Aambish. She called me the moment she opened the box — the design, the packaging, everything screamed luxury. So proud I chose this.' },
  { name: 'Divya Reddy',    city: 'Hyderabad',   rating: 5, text: 'My mother was so happy when she saw the earrings I gifted her. She said no one has ever given her something this beautiful. Aambish made that moment truly special.' },
  { name: 'Pooja Agarwal',  city: 'Jaipur',      rating: 5, text: 'Genuinely better prices than any shop in my city. Came in 2 days, design is gorgeous, quality is real. The gold tone hasn\'t faded even after 3 months of daily wear.' },
  { name: 'Neha Gupta',     city: 'Lucknow',     rating: 5, text: 'I\'ve worn the stacking rings every single day for 4 months — zero tarnish, zero discolouration. Such beautiful lasting quality. Truly luxury that everyone can afford.' },
  { name: 'Shreya Patel',   city: 'Ahmedabad',   rating: 5, text: 'Bought the Heirloom bangle set for my mom and she showed it off to every relative at the family function. Everyone kept asking where I bought it. Best purchase ever!' },
  { name: 'Tanvi Rao',      city: 'Kolkata',     rating: 5, text: 'The packaging alone made me feel special before I even opened the box. Inside — even more beautiful. Fast 2-day delivery to Kolkata. Absolutely recommend Aambish.' },
  { name: 'Aditi Singh',    city: 'Noida',       rating: 5, text: 'Was skeptical about ordering jewellery online but Aambish completely changed my mind. The ring looked exactly like the photo, fit perfectly, arrived super fast. 10/10.' },
  { name: 'Kritika Arora',  city: 'Amritsar',    rating: 5, text: 'Gifted myself a little treat and I don\'t regret it one bit. The Grace collection necklace is so minimalist and elegant — perfect for office and evening wear both.' },
  { name: 'Sanya Malhotra', city: 'Gurgaon',     rating: 5, text: 'My husband ordered this for our anniversary and I genuinely thought it was from some fancy store. The design, the weight, the finish — all premium. Thank you Aambish!' },
  { name: 'Ishita Bose',    city: 'Bhopal',      rating: 5, text: 'Came in 2 days to Bhopal which I wasn\'t expecting at all. The earrings are so delicate and beautiful. My sister immediately asked me to order the same for her too.' },
  { name: 'Pallavi Desai',  city: 'Surat',       rating: 5, text: 'Price is unbeatable compared to local shops and the quality is so much better. Ordered a customised set for my friend\'s bridal shower — it was the highlight of the party!' },
  { name: 'Ridhi Kapoor',   city: 'Indore',      rating: 5, text: 'I was looking for something minimalist and graceful for everyday wear. Found exactly that with Aambish. The Minimal collection is just breathtaking. So understated and luxurious.' },
  { name: 'Monika Tiwari',  city: 'Nagpur',      rating: 5, text: 'Gifted mummy on her birthday and she couldn\'t stop smiling. She said the design reminds her of something she\'d see in a big city boutique. Really made her day.' },
  { name: 'Nidhi Sharma',   city: 'Patna',       rating: 5, text: 'Honestly couldn\'t believe the price. I\'ve bought "fine jewellery" from offline stores at 3x the cost that looked half as good. Aambish is the real deal. Never going back.' },
  { name: 'Varsha Iyer',    city: 'Kochi',       rating: 5, text: 'Surprised my sister on her graduation with a customised Aambish combo — she wore it to her ceremony and cried happy tears. The design, the packaging — everything was perfect.' },
];

export default function ReviewsSection() {
  // Show 3 rows × 3 = 9 visible, rest hidden via CSS
  const visible = reviews.slice(0, 9);
  const hidden  = reviews.slice(9);

  return (
    <section style={{ background: 'linear-gradient(to bottom, #FAFAF7, #F8F7F3)', padding: '100px 0' }}>
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A96E', display: 'block', marginBottom: '12px' }}>Real Stories</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, color: '#1A1A18', marginBottom: '12px' }}>Loved by Thousands</h2>
          <div style={{ width: '48px', height: '1px', background: 'linear-gradient(to right, transparent, #C9A96E, transparent)', margin: '0 auto 20px' }} />
          {/* Overall rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#C9A96E">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', color: '#2C3528' }}>4.9 / 5.0</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#8A8A7A' }}>· {reviews.length} verified reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {[...visible, ...hidden].map((r, i) => (
            <article
              key={i}
              style={{
                background: 'linear-gradient(145deg, #FFFFFE 0%, #F8F7F3 100%)',
                border: '1px solid rgba(201,169,110,0.15)',
                borderRadius: '2px',
                padding: '26px 24px',
                position: 'relative',
                boxShadow: '0 2px 16px rgba(201,169,110,0.07)',
                display: i >= 9 ? 'none' : undefined,
              }}
              className={i >= 9 ? 'review-hidden' : ''}
            >
              {/* Big quote mark */}
              <span style={{ position: 'absolute', top: '14px', right: '18px', fontFamily: 'Georgia, serif', fontSize: '44px', color: 'rgba(201,169,110,0.12)', lineHeight: 1 }}>"</span>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= r.rating ? '#C9A96E' : '#E8E8E0'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              {/* Review text */}
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '15px', fontStyle: 'italic', color: '#2C3528', lineHeight: 1.75, marginBottom: '18px' }}>
                "{r.text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1A1A18' }}>{r.name}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#8A8A7A', marginTop: '2px' }}>{r.city}</div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#22c55e' }}>
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Show more */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            id="show-more-reviews"
            onClick={() => {
              document.querySelectorAll('.review-hidden').forEach(el => {
                (el as HTMLElement).style.display = 'block';
              });
              const btn = document.getElementById('show-more-reviews');
              if (btn) btn.style.display = 'none';
            }}
            style={{ padding: '13px 36px', background: 'transparent', border: '1px solid rgba(201,169,110,0.5)', borderRadius: '2px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A96E', cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C9A96E'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#C9A96E'; }}
          >
            Show All {reviews.length} Reviews
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
