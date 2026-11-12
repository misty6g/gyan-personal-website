import React from 'react';
import { Volleyball } from '@phosphor-icons/react';

export default function Marquee({ items }) {
  const group = (copy) => (
    <div className="marquee-group" key={copy} aria-hidden={copy > 0 ? 'true' : undefined}>
      {items.map((item) => (
        <span className="marquee-item" key={`${copy}-${item}`}>
          <Volleyball size={22} weight="fill" aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <section className="marquee" aria-label="Highlights">
      <div className="marquee-track">{[0, 1].map(group)}</div>
    </section>
  );
}
