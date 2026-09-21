import React, { useState } from 'react';
import TechTags from './TechTags';

export default function Projects({ 
  projects, 
  matchingProjectIds, 
  searchQuery, 
  onSelectTag 
}) {
  const [showAll, setShowAll] = useState(false);

  // If search query matches a hidden project, auto-expand
  const hasHiddenMatch = !showAll && projects.slice(3).some(p => matchingProjectIds.has(p.id));
  const isExpanded = showAll || hasHiddenMatch;

  const displayedProjects = isExpanded ? projects : projects.slice(0, 3);

  return (
    <section id="projects" className="section-block">
      <div className="section-header">
        <div>
          <h2 className="section-title">Projects & Open Source</h2>
          <p className="section-subtitle">Multi-agent systems, computer vision, quant trading, and systems kernels</p>
        </div>
      </div>

      <div className="card-stack">
        {displayedProjects.map((proj) => {
          const isMatched = matchingProjectIds.has(proj.id);

          return (
            <article 
              key={proj.id} 
              id={proj.id}
              className={`card animate-fade-in ${isMatched ? 'is-matched' : ''}`}
            >
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <span>{proj.title}</span>
                    {proj.badge && <span className="badge-tag">{proj.badge}</span>}
                  </h3>
                  <div className="card-subtitle">{proj.subtitle}</div>
                </div>

                <div className="card-meta">
                  {proj.liveUrl && (
                    <a 
                      href={proj.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>

              <p className="card-desc">
                {proj.description}
              </p>

              {/* Technical highlights */}
              <ul className="card-bullets">
                {proj.highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              {/* Technology Tags (Top 5 with Show More) */}
              <TechTags
                tags={proj.technologies}
                searchQuery={searchQuery}
                onSelectTag={onSelectTag}
                limit={5}
              />

              {/* Links Hub */}
              <div className="card-links">
                {proj.githubUrl && (
                  <a 
                    href={proj.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-item"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    GitHub Repo ↗
                  </a>
                )}

                {proj.linkedinPostUrl && (
                  <a 
                    href={proj.linkedinPostUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-item"
                    style={{ color: 'var(--text-accent)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    LinkedIn Announcement ↗
                  </a>
                )}

                {proj.liveUrl && (
                  <a 
                    href={proj.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-item"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Production Deployment ↗
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Show More / Show Less Toggle Button */}
      {projects.length > 3 && (
        <div className="expand-container">
          <button
            type="button"
            className="btn btn-secondary expand-btn"
            onClick={() => setShowAll(prev => !prev)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>Show Less Projects ↑</>
            ) : (
              <>Show All GitHub Projects ({projects.length - 3} more) ↓</>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
