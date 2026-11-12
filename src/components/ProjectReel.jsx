import React, { useLayoutEffect, useRef, useState } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, GithubLogo, Globe, LinkedinLogo } from '@phosphor-icons/react';
import { useMediaQuery } from '../lib/useMediaQuery';

function ReelCard({ project, onSelectTag }) {
  return (
    <article className="reel-card" id={project.id}>
      <div className="reel-media">
        <img
          src={project.image}
          alt={project.imageAlt}
          width="1152"
          height="864"
          loading="lazy"
          decoding="async"
          style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
        />
      </div>
      <div className="reel-body">
        <p className="reel-badge">{project.badge}</p>
        <h3 className="reel-title">{project.title}</h3>
        <p className="reel-subtitle">{project.subtitle}</p>
        <p className="reel-desc">{project.description}</p>
        <ul className="reel-highlights">
          {project.highlights.slice(0, 2).map((h) => <li key={h}>{h}</li>)}
        </ul>
        <div className="chip-list">
          {project.technologies.slice(0, 5).map((t) => (
            <button key={t} type="button" className="chip" onClick={() => onSelectTag(t)}>{t}</button>
          ))}
        </div>
        <div className="reel-links">
          {project.liveUrl && (
            <a className="btn btn-primary btn-sm" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Globe size={16} weight="bold" aria-hidden="true" />
              Live app
            </a>
          )}
          {project.githubUrl && (
            <a className="btn btn-ghost btn-sm" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <GithubLogo size={16} weight="bold" aria-hidden="true" />
              Source code
            </a>
          )}
          {project.linkedinPostUrl && (
            <a className="text-link" href={project.linkedinPostUrl} target="_blank" rel="noopener noreferrer">
              <LinkedinLogo size={16} weight="bold" aria-hidden="true" />
              Read the announcement
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectReel({ projects, onSelectTag }) {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 960px) and (min-height: 700px)');
  const horizontal = wide && !reduce;
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const featured = projects.filter((p) => p.featured);

  useLayoutEffect(() => {
    if (!horizontal || !trackRef.current) {
      setDistance(0);
      return;
    }
    const measure = () => {
      const track = trackRef.current;
      setDistance(Math.max(track.scrollWidth - window.innerWidth, 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [horizontal]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section
      ref={sectionRef}
      className={`reel ${horizontal ? 'is-horizontal' : 'is-stacked'}`}
      id="projects"
      aria-labelledby="projects-heading"
      data-horizontal={horizontal ? 'true' : 'false'}
      data-count={featured.length}
      style={horizontal ? { height: `calc(100dvh + ${distance}px)` } : undefined}
    >
      <div className="reel-sticky">
        <div className="container section-head reel-head">
          <h2 className="section-title" id="projects-heading">Things I've built</h2>
          <p className="section-lede">
            A competition-winning agent OS, a live computer vision app, and a trading engine in Python and Rust.
          </p>
        </div>
        <m.div className="reel-track" ref={trackRef} style={horizontal ? { x } : undefined}>
          {featured.map((p) => (
            <ReelCard key={p.id} project={p} onSelectTag={onSelectTag} />
          ))}
        </m.div>
      </div>
    </section>
  );
}
