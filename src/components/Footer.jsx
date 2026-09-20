import React from 'react';

export default function Footer({ socials }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-links">
          {socials.filter(s => s.url).map((item, idx) => (
            <a 
              key={idx} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '0.85rem' }}
            >
              {item.platform} ↗
            </a>
          ))}
          <button 
            type="button" 
            onClick={scrollToTop} 
            className="jump-chip mono"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            ↑ Back to Top
          </button>
        </div>

        <div className="footer-copy">
          <div>Gyan Atul Mistry / Artificial Intelligence at RIT</div>
          <div style={{ marginTop: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Minimalist frontend built with React and JavaScript
          </div>
        </div>
      </div>
    </footer>
  );
}
