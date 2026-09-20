import React, { useState, useMemo } from 'react';

export default function Coursework({ 
  coursework, 
  matchingCourseIds, 
  searchQuery, 
  onSelectTag 
}) {
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories extracted dynamically
  const categories = useMemo(() => {
    const cats = ['All'];
    coursework.forEach(c => {
      if (!cats.includes(c.category)) {
        cats.push(c.category);
      }
    });
    return cats;
  }, [coursework]);

  // If search query matches a hidden course, auto-expand
  const hasHiddenMatch = !showAll && coursework.slice(8).some(c => matchingCourseIds.has(c.id));
  const isExpanded = showAll || hasHiddenMatch || selectedCategory !== 'All';

  const displayedCourses = useMemo(() => {
    let list = isExpanded ? coursework : coursework.filter(c => c.featured);
    if (selectedCategory !== 'All') {
      list = list.filter(c => c.category === selectedCategory);
    }
    return list;
  }, [coursework, isExpanded, selectedCategory]);

  const isTagMatched = (tech) => {
    if (!searchQuery.trim()) return false;
    return tech.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <section id="coursework" className="section-block">
      <div className="section-header">
        <div>
          <h2 className="section-title">Academic Coursework</h2>
          <p className="section-subtitle">Foundations in Artificial Intelligence, Software Engineering, and Mathematics at RIT</p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="course-categories-scroll">
        <div className="course-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`quick-tag ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
                if (cat !== 'All') setShowAll(true);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="course-grid">
        {displayedCourses.map((course) => {
          const isMatched = matchingCourseIds.has(course.id);

          return (
            <div 
              key={course.id} 
              id={course.id}
              className={`course-card animate-fade-in ${isMatched ? 'is-matched' : ''}`}
            >
              <div>
                <div className="course-top-row">
                  <span className="course-code mono">{course.code}</span>
                  <span className={`course-status ${course.status === 'Taken' || course.status === 'Transferred' ? 'completed' : 'in-progress'}`}>
                    {course.status}
                  </span>
                </div>

                <h3 className="course-title">{course.title}</h3>
                <div className="course-meta-tag">{course.category} / {course.term}</div>
                <p className="course-desc">{course.description}</p>
              </div>

              {/* Technologies / Extrapolated Skills */}
              <div className="tag-list" style={{ marginTop: '0.75rem' }}>
                {course.technologies.map((tech) => (
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less Toggle Button */}
      {selectedCategory === 'All' && (
        <div className="expand-container">
          <button
            type="button"
            className="btn btn-secondary expand-btn"
            onClick={() => setShowAll(prev => !prev)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>Show Core Coursework (8 classes) ↑</>
            ) : (
              <>Show Full Coursework Catalog ({coursework.length - 8} more classes) ↓</>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
