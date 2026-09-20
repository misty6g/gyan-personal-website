import React, { useRef, useEffect } from 'react';

export default function RecruiterSearch({ 
  searchQuery, 
  setSearchQuery, 
  matches, 
  onJumpToItem 
}) {
  const inputRef = useRef(null);

  // Keyboard shortcut listener: press '/' to focus search, 'Escape' to clear
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchQuery]);

  const quickPills = [
    "Python", "Rust", "React", "Docker", "PyTorch", "SQL", "OpenAI", "MediaPipe", "Tableau", "TypeScript"
  ];

  const totalMatches = 
    matches.projects.length + 
    matches.experiences.length + 
    matches.courses.length;

  return (
    <div className="search-container" role="search" aria-label="Recruiter Technology Search">
      <div className="search-input-wrapper">
        <svg 
          className="search-icon" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Recruiter Search: Type any technology (e.g. Python, Rust, React, Docker, MediaPipe, SQL)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search skills and technologies"
        />

        <div className="search-meta">
          {searchQuery ? (
            <button 
              type="button" 
              className="clear-search-btn" 
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕ Clear
            </button>
          ) : (
            <span className="kbd-badge" title="Press '/' anywhere to search">/ to search</span>
          )}
        </div>
      </div>

      {/* Quick click filters */}
      <div className="quick-filters">
        <span className="quick-filter-label">Quick filter:</span>
        {quickPills.map((pill) => {
          const isActive = searchQuery.toLowerCase().trim() === pill.toLowerCase();
          return (
            <button
              key={pill}
              type="button"
              className={`quick-tag ${isActive ? 'active' : ''}`}
              onClick={() => setSearchQuery(isActive ? '' : pill)}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {/* Live Match Summary & Jump Targets */}
      {searchQuery.trim() && (
        <div className="search-feedback">
          <span className="search-matches-count">
            {totalMatches === 0 ? (
              <span>No direct matches found for "{searchQuery}"</span>
            ) : (
              <span>
                Found {totalMatches} {totalMatches === 1 ? 'match' : 'matches'} for "{searchQuery}"
                {matches.projects.length > 0 && ` / ${matches.projects.length} Project${matches.projects.length > 1 ? 's' : ''}`}
                {matches.experiences.length > 0 && ` / ${matches.experiences.length} Experience${matches.experiences.length > 1 ? 's' : ''}`}
                {matches.courses.length > 0 && ` / ${matches.courses.length} Course${matches.courses.length > 1 ? 's' : ''}`}
              </span>
            )}
          </span>

          {totalMatches > 0 && (
            <div className="search-jumps">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jump to:</span>
              {matches.projects.map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  className="jump-chip"
                  onClick={() => onJumpToItem(proj.id)}
                >
                  🚀 {proj.title}
                </button>
              ))}
              {matches.experiences.map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  className="jump-chip"
                  onClick={() => onJumpToItem(exp.id)}
                >
                  💼 {exp.company}
                </button>
              ))}
              {matches.courses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  className="jump-chip"
                  onClick={() => onJumpToItem(course.id)}
                >
                  📚 {course.code}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
