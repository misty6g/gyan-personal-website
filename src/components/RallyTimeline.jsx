import React, { useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { CaretDown, MapPin } from '@phosphor-icons/react';
import CountUp from './CountUp';

const VISIBLE_BULLETS = 3;
const VISIBLE_TAGS = 8;

function ExperienceStop({ exp, onSelectTag }) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const extra = exp.bullets.slice(VISIBLE_BULLETS);

  return (
    <article className="rally-stop" id={exp.id}>
      <span className="rally-dot" aria-hidden="true" />
      <header className="rally-stop-head">
        <h3 className="rally-company">{exp.company}</h3>
        <p className="rally-location">
          <MapPin size={16} weight="bold" aria-hidden="true" />
          {exp.location}
        </p>
      </header>

      <ul className="rally-roles">
        {exp.roles.map((role) => (
          <li key={role.title}>
            <span className="rally-role-title">{role.title}</span>
            <span className="rally-role-period">
              {role.period}
              {role.current && <span className="now-badge">Now</span>}
            </span>
          </li>
        ))}
      </ul>

      {exp.metrics && (
        <dl className="rally-metrics">
          {exp.metrics.map((m) => (
            <div className="rally-metric" key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.text ?? <CountUp value={m.value} suffix={m.suffix} />}</dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="rally-bullets">
        {exp.bullets.slice(0, VISIBLE_BULLETS).map((b) => <li key={b}>{b}</li>)}
      </ul>
      <AnimatePresence initial={false}>
        {expanded && (
          <m.ul
            className="rally-bullets rally-bullets-extra"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {extra.map((b) => <li key={b}>{b}</li>)}
          </m.ul>
        )}
      </AnimatePresence>
      {extra.length > 0 && (
        <button
          type="button"
          className="text-link rally-more"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : `Show ${extra.length} more`}
          <CaretDown size={16} weight="bold" aria-hidden="true" className={expanded ? 'is-flipped' : ''} />
        </button>
      )}

      <div className="chip-list rally-tags">
        {exp.technologies.slice(0, VISIBLE_TAGS).map((t) => (
          <button key={t} type="button" className="chip" onClick={() => onSelectTag(t)}>{t}</button>
        ))}
      </div>
    </article>
  );
}

export default function RallyTimeline({ experiences, onSelectTag }) {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 65%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const ballY = useTransform(progress, [0, 1], ['0%', '100%']);
  const ballSpin = useTransform(progress, [0, 1], [0, 540]);

  const featured = experiences.filter((e) => e.featured);
  const others = experiences.filter((e) => !e.featured);

  return (
    <section className="section-block rally" id="work" aria-labelledby="work-heading">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title" id="work-heading">Two summers in production</h2>
          <p className="section-lede">
            AI agents for the F-16 program at Lockheed Martin, and incident automation for Cloud Ops at Redis.
          </p>
        </div>

        <div className="rally-track" ref={trackRef}>
          <div className="rally-rail" aria-hidden="true">
            <m.div className="rally-rail-fill" style={{ scaleY: reduce ? 1 : progress }} />
            {!reduce && (
              <m.div className="rally-ball-rider" style={{ y: ballY }}>
                <m.span className="rally-ball" style={{ rotate: ballSpin }} />
              </m.div>
            )}
          </div>

          {featured.map((exp) => (
            <ExperienceStop key={exp.id} exp={exp} onSelectTag={onSelectTag} />
          ))}
        </div>

        <div className="rally-also">
          <h3 className="rally-also-title">Campus and community roles</h3>
          <div className="rally-also-grid">
            {others.map((exp) => (
              <article className="rally-also-item" id={exp.id} key={exp.id}>
                <h4>{exp.company}</h4>
                <ul>
                  {exp.roles.map((r) => (
                    <li key={r.title}>
                      <span>{r.title}</span>
                      <span className="rally-role-period">{r.period}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
