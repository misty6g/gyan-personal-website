import React from 'react';
import { ArrowUp } from '@phosphor-icons/react';
import { scrollToY } from '../lib/smoothScroll';

export default function Footer({ name }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-copy">
          {name}. Built with React, Motion, and matter-js.
        </p>
        <button type="button" className="text-link footer-top" onClick={() => scrollToY(0)}>
          <ArrowUp size={16} weight="bold" aria-hidden="true" />
          Back to top
        </button>
      </div>
    </footer>
  );
}
