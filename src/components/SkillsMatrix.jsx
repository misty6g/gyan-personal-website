import React from 'react';

export default function SkillsMatrix({ skills, searchQuery, onSelectSkill }) {
  const isSkillActive = (skillName) => {
    if (!searchQuery.trim()) return false;
    return skillName.toLowerCase() === searchQuery.toLowerCase().trim();
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
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="skill-category">
            <h3 className="skill-cat-title mono">{category}</h3>
            <div className="skill-pills">
              {items.map((skill) => (
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
