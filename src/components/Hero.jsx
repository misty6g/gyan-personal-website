import React, { useState } from 'react';

export default function Hero({ personal, badges, socials, onOpenResume, onShowToast }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    onShowToast?.("Email copied to clipboard: " + personal.email);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleViewResume = () => {
    if (typeof window !== 'undefined' && (window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))) {
      window.open(personal.resumePdfUrl, '_blank');
    } else {
      onOpenResume?.();
    }
  };

  const getBadgeClass = (variant) => {
    switch (variant) {
      case 'defense': return 'badge-defense';
      case 'primary': return 'badge-primary';
      case 'gold': return 'badge-gold';
      case 'accent': return 'badge-accent';
      default: return '';
    }
  };

  return (
    <section className="hero-section" id="about">
      {/* Top recruiter badges */}
      <div className="hero-top-badges">
        {badges.map((badge, idx) => (
          <span key={idx} className={`badge-item ${getBadgeClass(badge.variant)}`}>
            <span>{badge.label}</span>
          </span>
        ))}
      </div>

      <div className="hero-split">
        <div className="hero-main">
          <h1 className="hero-name">{personal.name}</h1>

          {/* Recruiter Bio / Value Proposition */}
          <div className="hero-bio">
            <p>{personal.about[0]}</p>
          </div>

          {/* Quick Action Buttons */}
          <div className="hero-actions">
            <a 
              href={personal.resumePdfUrl} 
              download="Gyan_Mistry_Resume.pdf" 
              className="btn btn-primary"
              title="Download Gyan Mistry's Resume PDF"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Resume (PDF)
            </a>

            <button 
              type="button" 
              onClick={handleViewResume} 
              className="btn btn-secondary"
              title="Quick preview resume inside browser"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              View Resume
            </button>

            <button 
              type="button" 
              onClick={handleCopyEmail} 
              className="btn btn-outline mono"
              title="Copy email address"
            >
              {copied ? "✓ Copied!" : "📋 Copy Email"}
            </button>
          </div>
        </div>

        {personal.avatarUrl && (
          <div className="hero-image-wrapper">
            <div className="hero-image-card">
              <img 
                src={personal.avatarUrl} 
                alt={personal.preferredName || personal.name} 
                className="hero-image"
                width="240"
                height="240"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
