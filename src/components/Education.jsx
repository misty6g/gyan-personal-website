import React from 'react';

export default function Education({ education }) {
  return (
    <section id="education" className="section-block">
      <div className="section-header">
        <div>
          <h2 className="section-title">Education & Honors</h2>
          <p className="section-subtitle">Degrees, Minors, and Academic Honors</p>
        </div>
      </div>

      <div className="card-stack">
        {education.map((edu, idx) => (
          <article key={idx} className="card animate-fade-in">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <span>{edu.institution}</span>
                  {edu.gpa && <span className="badge-tag">{edu.gpa}</span>}
                </h3>
                <div className="card-subtitle" style={{ color: 'var(--text-accent)', fontWeight: 600 }}>
                  {edu.degree}
                </div>
                {edu.note && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', marginTop: '0.35rem' }}>
                    * {edu.note}
                  </div>
                )}
              </div>

              <div className="card-meta">
                <div>📍 {edu.location}</div>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {edu.graduation}
                </div>
              </div>
            </div>

            {edu.minors && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Minors:</strong> {edu.minors}
              </div>
            )}

            {edu.immersion && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Immersion:</strong> {edu.immersion}
              </div>
            )}

            {edu.honors && edu.honors.length > 0 && (
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                {edu.honors.map((honor, hIdx) => (
                  <span key={hIdx} className="badge-item badge-gold">
                    {honor}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
