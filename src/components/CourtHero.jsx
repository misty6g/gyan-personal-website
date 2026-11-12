import React, { useEffect, useRef } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { FileText, Volleyball } from '@phosphor-icons/react';
import Magnetic from './Magnetic';
import CopyEmailButton from './CopyEmailButton';

const LETTER_SPRING = { type: 'spring', stiffness: 520, damping: 22, mass: 0.9 };

function BouncyName({ lines, reduce }) {
  let index = 0;
  return (
    <h1 className="hero-name" id="hero-heading" aria-label={lines.join(' ')}>
      {lines.map((line) => (
        <span className="hero-name-line" key={line} aria-hidden="true">
          {line.split('').map((char) => {
            const i = index++;
            return (
              <m.span
                key={`${line}-${i}`}
                className="hero-letter"
                initial={reduce ? false : { y: '-0.9em', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...LETTER_SPRING, delay: 0.08 + i * 0.045 }}
                whileHover={reduce ? undefined : { scaleY: 0.82, scaleX: 1.12, y: '0.06em' }}
              >
                {char}
              </m.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export default function CourtHero({ personal, onOpenResume, onCopied }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef(null);
  const [first, ...rest] = personal.preferredName.split(' ');

  useEffect(() => {
    let court = null;
    let cancelled = false;
    const start = async () => {
      const [{ default: Matter }, { createCourt }] = await Promise.all([
        import('matter-js'),
        import('../lib/courtPhysics'),
        document.fonts?.ready
      ]);
      if (cancelled || !canvasRef.current) return;
      court = createCourt(Matter, canvasRef.current, {
        skills: personal.heroSkills,
        reduceMotion: Boolean(reduce)
      });
    };
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 120));
    const handle = idle(() => start(), { timeout: 600 });
    return () => {
      cancelled = true;
      (window.cancelIdleCallback || clearTimeout)(handle);
      court?.destroy();
    };
  }, [personal.heroSkills, reduce]);

  const rise = (delay) => ({
    initial: reduce ? false : { y: 18, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }
  });

  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <m.p className="hero-status" {...rise(0)}>
            <Volleyball size={18} weight="fill" aria-hidden="true" />
            {personal.statusBadge}
          </m.p>

          <BouncyName lines={[first, rest.join(' ')]} reduce={reduce} />

          <div className="hero-bio">
            <p>{personal.about[0]}</p>
          </div>

          <m.div className="hero-actions" {...rise(0.68)}>
            <Magnetic>
              <button type="button" className="btn btn-primary" onClick={onOpenResume}>
                <FileText size={18} weight="bold" aria-hidden="true" />
                View resume
              </button>
            </Magnetic>
            <Magnetic>
              <CopyEmailButton email={personal.email} onCopied={onCopied} />
            </Magnetic>
          </m.div>
        </div>

        <m.div
          className="court-panel"
          initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.25 }}
        >
          <canvas ref={canvasRef} className="court-canvas" aria-hidden="true" />
          <p className="court-hint" aria-hidden="true">
            {reduce ? 'Some of what I build with' : 'Drag the ball, or tap the court to spike it'}
          </p>
        </m.div>
      </div>
    </section>
  );
}
