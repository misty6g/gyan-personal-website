import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { GraduationCap } from '@phosphor-icons/react';

const CATEGORY_LABELS = {
  'Artificial Intelligence & ML': 'AI and ML',
  'Software Engineering': 'Software',
  'Mathematics & Statistics': 'Math',
  'Quantitative & Finance': 'Quant',
  'Data & Visualization': 'Data viz',
  'Computer Science': 'CS',
  'Industry Experience': 'Co-op',
  'Sign Language & Humanities': 'ASL',
  'Liberal Arts & Social Sciences': 'Liberal arts'
};

export default function Credentials({ education, skills, coursework, memberships, onSelectTag, revealId }) {
  const reduce = useReducedMotion();
  const categories = useMemo(() => [...new Set(coursework.map((c) => c.category))], [coursework]);
  const [active, setActive] = useState(categories[0]);
  const [rit, highSchool] = education;

  useEffect(() => {
    const course = coursework.find((c) => c.id === revealId);
    if (course) setActive(course.category);
  }, [revealId, coursework]);

  const courses = coursework.filter((c) => c.category === active);

  return (
    <section className="section-block credentials" id="credentials" aria-labelledby="credentials-heading">
      <div className="container">
        <h2 className="section-title section-head" id="credentials-heading">School, skills, and coursework</h2>

        <div className="cred-grid">
          <div className="cred-edu">
            <GraduationCap size={40} weight="duotone" aria-hidden="true" className="cred-edu-icon" />
            <h3 className="cred-school">{rit.institution.replace(' (RIT)', '')}</h3>
            <p className="cred-degree">{rit.degree}, {rit.graduation.replace('Anticipated ', 'expected ')}</p>
            <p className="cred-note">{rit.note}.</p>
            <dl className="cred-facts">
              <div><dt>Minors</dt><dd>{rit.minors}</dd></div>
              <div><dt>Immersion</dt><dd>{rit.immersion}</dd></div>
              <div><dt>Honors</dt><dd>{rit.honors.join(', ')}</dd></div>
            </dl>
            <p className="cred-hs">
              {highSchool.institution}, {highSchool.honors.join(', ')}
            </p>
            <div className="cred-clubs">
              <h4>Clubs</h4>
              <p>{memberships.map((m) => m.name.replace(/ \(.+\)/, '')).join(', ')}</p>
            </div>
          </div>

          <div className="cred-skills">
            {Object.entries(skills).map(([group, items]) => (
              <div className="cred-skill-group" key={group}>
                <h3>{group}</h3>
                <div className="chip-list">
                  {items.map((s) => (
                    <button key={s} type="button" className="chip" onClick={() => onSelectTag(s)}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="coursework" id="coursework">
          <h3 className="coursework-title">Coursework at RIT</h3>
          <div className="course-tabs" role="tablist" aria-label="Course categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                id={`tab-${cat}`}
                aria-selected={active === cat}
                aria-controls="course-panel"
                className={`course-tab ${active === cat ? 'is-active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {active === cat && (
                  <m.span
                    layoutId={reduce ? undefined : 'course-tab-pill'}
                    className="course-tab-pill"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                  />
                )}
                <span className="course-tab-label">{CATEGORY_LABELS[cat] || cat}</span>
              </button>
            ))}
          </div>

          <div id="course-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
            <AnimatePresence mode="wait" initial={false}>
              <m.ul
                key={active}
                className="course-list"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {courses.map((c) => (
                  <li className="course-row" id={c.id} key={c.id}>
                    <span className="course-code">{c.code}</span>
                    <span className="course-name">{c.title}</span>
                    <span className="course-term">
                      {c.status === 'In Progress' ? 'In progress' : c.term}
                    </span>
                  </li>
                ))}
              </m.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
