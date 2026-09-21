import React, { useState } from 'react';
import TechTags from './TechTags';

export default function Experience({ 
  experiences, 
  matchingExperienceIds, 
  searchQuery, 
  onSelectTag 
}) {
  const [showAll, setShowAll] = useState(false);

  // If a search query is active and matches any hidden experience, automatically expand
  const hasHiddenMatch = !showAll && experiences.slice(2).some(e => matchingExperienceIds.has(e.id));
  const isExpanded = showAll || hasHiddenMatch;

  const displayedExperiences = isExpanded ? experiences : experiences.slice(0, 2);

  return (
    <section id="experience" className="section-block">
      <div className="section-header">
        <div>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">Production engineering at Lockheed Martin and Redis</p>
        </div>
      </div>

      <div className="card-stack">
        {displayedExperiences.map((exp) => {
          const isMatched = matchingExperienceIds.has(exp.id);

          return (
            <article 
              key={exp.id} 
              id={exp.id}
              className={`card animate-fade-in ${isMatched ? 'is-matched' : ''}`}
            >
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <span>{exp.company}</span>
                    {exp.id === 'lockheed-martin' && (
                      <span className="badge-tag">DoD Clearance / F-16</span>
                    )}
                    {exp.id === 'redis' && (
                      <span className="badge-tag">Production Automation</span>
                    )}
                  </h3>
                  {exp.tagline && <div className="card-tagline">{exp.tagline}</div>}
                </div>

                <div className="card-meta">
                  <span>📍 {exp.location}</span>
                </div>
              </div>

              {/* Roles timeline */}
              <div className="roles-timeline">
                {exp.roles.map((role, idx) => (
                  <div key={idx} className="role-row">
                    <strong className="role-title">
                      {role.title}
                    </strong>
                    <span className="mono role-period">
                      {role.period}
                    </span>
                  </div>
                ))}
              </div>

              {/* Impact Bullet Points */}
              <ul className="card-bullets">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>

              {/* Tech Stack Pills (Top 5 with Show More) */}
              <TechTags
                tags={exp.technologies}
                searchQuery={searchQuery}
                onSelectTag={onSelectTag}
                limit={5}
              />
            </article>
          );
        })}
      </div>

      {/* Show More / Show Less Toggle Button */}
      {experiences.length > 2 && (
        <div className="expand-container">
          <button
            type="button"
            className="btn btn-secondary expand-btn"
            onClick={() => setShowAll(prev => !prev)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>Show Less Experience ↑</>
            ) : (
              <>Show More Experience ({experiences.length - 2} more) ↓</>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
