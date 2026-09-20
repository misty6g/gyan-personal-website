import React from 'react';

export default function Extracurriculars({ extracurriculars }) {
  const { leadership, memberships, languages, personalInterests } = extracurriculars;

  return (
    <section id="extracurriculars" className="section-block">
      <div className="section-header">
        <div>
          <h2 className="section-title">Leadership & Interests</h2>
          <p className="section-subtitle">Athletics, campus organizations, and life beyond the terminal</p>
        </div>
      </div>

      <div className="extracurricular-grid">
        {/* Athletic Leadership */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            Athletic Leadership
          </h3>

          {leadership.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <div className="role-row" style={{ marginBottom: '0.35rem' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                  {item.role}, {item.organization}
                </strong>
                <span className="mono role-period">
                  {item.period}
                </span>
              </div>
              <div style={{ color: 'var(--text-accent)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                {item.highlight}
              </div>
              <p className="card-desc">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Campus Organizations */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            Campus Organizations & Affiliations
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {memberships.map((mem, idx) => (
              <span key={idx} className="badge-item">
                {mem.name} ({mem.institution})
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
            Languages
          </h3>
          <div className="languages-list">
            {languages.map((l, idx) => (
              <div key={idx} className="lang-badge">
                <strong>{l.language}</strong>
                <span>/ {l.fluency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Beyond the Code - Personal Interests */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            Personal Interests
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            What drives and inspires me outside of software and engineering.
          </p>
          <div className="interests-grid">
            {personalInterests.map((interest, idx) => (
              <div key={idx} className="interest-item">
                <div className="interest-name">{interest.name}</div>
                <div className="interest-desc">{interest.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
