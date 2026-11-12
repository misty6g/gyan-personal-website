import React, { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { GithubLogo, Plus } from '@phosphor-icons/react';

export default function ProjectIndex({ projects, onSelectTag, revealId }) {
  const reduce = useReducedMotion();
  const rest = projects.filter((p) => !p.featured);
  const [open, setOpen] = useState(() => new Set());

  useEffect(() => {
    if (revealId && rest.some((p) => p.id === revealId)) {
      setOpen((prev) => new Set(prev).add(revealId));
    }
  }, [revealId]);

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <section className="section-block project-index" aria-labelledby="more-projects-heading">
      <div className="container">
        <h2 className="index-heading" id="more-projects-heading">More projects</h2>
        <ul className="index-list">
          {rest.map((p) => {
            const isOpen = open.has(p.id);
            const panelId = `${p.id}-panel`;
            return (
              <li className={`index-item ${isOpen ? 'is-open' : ''}`} id={p.id} key={p.id}>
                <button
                  type="button"
                  className="index-row"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(p.id)}
                >
                  <span className="index-title">{p.title}</span>
                  <span className="index-subtitle">{p.subtitle}</span>
                  <span className="index-badge">{p.badge}</span>
                  <Plus size={20} weight="bold" className="index-icon" aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={panelId}
                      className="index-panel"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="index-panel-inner">
                        <p>{p.description}</p>
                        <ul className="index-highlights">
                          {p.highlights.map((h) => <li key={h}>{h}</li>)}
                        </ul>
                        <div className="chip-list">
                          {p.technologies.slice(0, 6).map((t) => (
                            <button key={t} type="button" className="chip" onClick={() => onSelectTag(t)}>{t}</button>
                          ))}
                        </div>
                        {p.githubUrl && (
                          <a className="text-link" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                            <GithubLogo size={16} weight="bold" aria-hidden="true" />
                            Source code
                          </a>
                        )}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
