import React from 'react';
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, SpotifyLogo } from '@phosphor-icons/react';
import { useMediaQuery } from '../lib/useMediaQuery';

function TiltPhoto({ src, alt }) {
  const finePointer = useMediaQuery('(pointer: fine)');
  const reducedMotion = useReducedMotion();
  const reduce = reducedMotion || !finePointer;
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), spring);
  const glareX = useTransform(px, [0, 1], ['10%', '90%']);
  const glare = useTransform(glareX, (gx) => `radial-gradient(60% 60% at ${gx} 20%, rgba(255,255,255,0.28), transparent 60%)`);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <m.figure
      className="bento-cell bento-photo"
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={reduce ? undefined : reset}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
    >
      <img src={src} alt={alt} width="1024" height="1024" loading="lazy" decoding="async" />
      {!reduce && <m.span className="bento-glare" style={{ background: glare }} aria-hidden="true" />}
    </m.figure>
  );
}

export default function AboutBento({ personal, extracurriculars, socials }) {
  const captain = extracurriculars.leadership[0];
  const spotify = socials.find((s) => s.platform === 'Spotify');
  const interests = extracurriculars.personalInterests.filter((i) => !['Volleyball', 'Music'].includes(i.name));

  return (
    <section className="section-block about" id="about" aria-labelledby="about-heading">
      <div className="container">
        <h2 className="section-title section-head" id="about-heading">Off the keyboard</h2>

        <div className="bento">
          <TiltPhoto src={personal.avatarUrl} alt={`Portrait of ${personal.preferredName}`} />

          <div className="bento-cell bento-bio">
            <p className="bento-bio-lead">{personal.fullBio[0]}</p>
            <p>
              Outside internships I build trading engines, multi-agent systems, and computer vision models, mostly in
              Python, PyTorch, and TypeScript, with growing depth in Rust and C++.
            </p>
          </div>

          <figure className="bento-cell bento-volley">
            <img
              src="/img/volleyball-spike.jpg"
              alt="A volleyball player jumping to spike a yellow and blue ball over the net"
              width="864"
              height="1152"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <strong>{captain.role}, {captain.organization}</strong>
              <span>ECVA All-Star. Hosted 7 tournaments and grew the team's Instagram reach by 42%.</span>
            </figcaption>
          </figure>

          <div className="bento-cell bento-lang">
            <h3>Four languages, one of them signed</h3>
            <ul>
              {extracurriculars.languages.map((l) => (
                <li key={l.language}>
                  <span>{l.language.replace(' (ASL)', '')}</span>
                  <span>{l.fluency.split(' / ')[0]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bento-cell bento-music">
            <SpotifyLogo size={36} weight="fill" aria-hidden="true" />
            <h3>Usually listening to hip-hop and R&B</h3>
            {spotify && (
              <a className="text-link" href={spotify.url} target="_blank" rel="noopener noreferrer">
                Open my Spotify
                <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="bento-cell bento-interests">
            <h3>Also into</h3>
            <ul>
              {interests.map((i) => (
                <li key={i.name}>
                  <strong>{i.name}</strong>
                  <span>{i.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
