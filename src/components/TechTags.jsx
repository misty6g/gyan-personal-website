import React, { useState } from 'react';

export default function TechTags({ tags, searchQuery = '', onSelectTag, limit = 5 }) {
  const [expanded, setExpanded] = useState(false);

  const isTagMatched = (tech) => {
    if (!searchQuery.trim()) return false;
    return tech.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  // If search query matches a hidden tag, automatically expand so recruiter sees it
  const hasHiddenMatch = !expanded && tags.slice(limit).some(t => isTagMatched(t));
  const isShowingAll = expanded || hasHiddenMatch;

  const displayedTags = isShowingAll ? tags : tags.slice(0, limit);
  const remainingCount = tags.length - limit;

  return (
    <div className="tag-list">
      {displayedTags.map((tech) => (
        <button
          key={tech}
          type="button"
          className={`tag ${isTagMatched(tech) ? 'tag-matched' : ''}`}
          onClick={() => onSelectTag(tech)}
          title={`Filter by ${tech}`}
        >
          {tech}
        </button>
      ))}

      {remainingCount > 0 && (
        <button
          type="button"
          className="tag tag-expand-btn"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={isShowingAll}
          title={isShowingAll ? "Show fewer skills" : `Show ${remainingCount} more skills`}
        >
          {isShowingAll ? "Show less ↑" : `+${remainingCount} more`}
        </button>
      )}
    </div>
  );
}
