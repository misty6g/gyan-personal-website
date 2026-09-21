import React, { useState } from 'react';

export default function SkillsMatrix({ skills, searchQuery, onSelectSkill }) {
  const [showAllGlobal, setShowAllGlobal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const isSkillActive = (skillName) => {
    if (!searchQuery.trim()) return false;
    return skillName.toLowerCase() === searchQuery.toLowerCase().trim();
  };

  const isSkillMatched = (skillName) => {
    if (!searchQuery.trim()) return false;
    return skillName.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <section id="skills" className="section-block">
      <div className="section-header">
        <div>
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">Click any technology to filter related projects, experience, and coursework</p>
        </div>
      </div>

      <div className="skills-matrix">
        {Object.entries(skills).map(([category, items]) => {
          // Check if any hidden skill matches the search query
          const hasHiddenMatch = items.slice(5).some(s => isSkillMatched(s));
          const isExpanded = showAllGlobal || expandedCategories[category] || hasHiddenMatch;
          const displayedSkills = isExpanded ? items : items.slice(0, 5);
          const remainingCount = items.length - 5;

          return (
            <div key={category} className="skill-category">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 className="skill-cat-title mono" style={{ marginBottom: 0 }}>{category}</h3>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {displayedSkills.length}/{items.length}
                </span>
              </div>

              <div className="skill-pills">
                {displayedSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`tag ${isSkillActive(skill) ? 'tag-matched' : ''}`}
                    onClick={() => onSelectSkill(skill)}
                    title={`Click to filter by ${skill}`}
                  >
                    {skill}
                  </button>
                ))}

                {remainingCount > 0 && (
                  <button
                    type="button"
                    className="tag tag-expand-btn"
                    onClick={() => toggleCategory(category)}
                    aria-expanded={isExpanded}
                    title={isExpanded ? "Show fewer skills" : `Show ${remainingCount} more skills`}
                  >
                    {isExpanded ? "Show less ↑" : `+${remainingCount} more`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Show All Skills Toggle Button */}
      <div className="expand-container">
        <button
          type="button"
          className="btn btn-secondary expand-btn"
          onClick={() => setShowAllGlobal(prev => !prev)}
          aria-expanded={showAllGlobal}
        >
          {showAllGlobal ? "Show Top 5 Skills per Category ↑" : "Show All Skills Across All Categories ↓"}
        </button>
      </div>
    </section>
  );
}
