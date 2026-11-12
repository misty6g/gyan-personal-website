import React from 'react';
import { m, useReducedMotion } from 'motion/react';
import { GithubLogo, LinkedinLogo, SpotifyLogo, XLogo } from '@phosphor-icons/react';
import CopyEmailButton from './CopyEmailButton';
import Magnetic from './Magnetic';

const ICONS = {
  LinkedIn: LinkedinLogo,
  GitHub: GithubLogo,
  'Twitter / X': XLogo,
  Spotify: SpotifyLogo
};

export default function Contact({ personal, socials, onCopied }) {
  const reduce = useReducedMotion();
  const links = socials.filter((s) => ICONS[s.platform]);

  return (
    <section className="section-block contact" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <m.div
          className="contact-panel"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        >
          <h2 className="contact-title" id="contact-heading">Have a role in mind?</h2>
          <p className="contact-lede">
            I'm looking for software and ML engineering internships for summer 2027. Email is the fastest way to reach me.
          </p>
          <a className="contact-email" href={`mailto:${personal.email}`}>{personal.email}</a>
          <div className="contact-actions">
            <Magnetic>
              <CopyEmailButton email={personal.email} className="btn btn-accent" onCopied={onCopied} />
            </Magnetic>
          </div>
          <ul className="contact-socials">
            {links.map((s) => {
              const Icon = ICONS[s.platform];
              return (
                <li key={s.platform}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <Icon size={20} weight="fill" aria-hidden="true" />
                    {s.platform === 'Twitter / X' ? 'X' : s.platform}
                  </a>
                </li>
              );
            })}
          </ul>
        </m.div>
      </div>
    </section>
  );
}
