import React, { useEffect, useState } from 'react';
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { FileText, List, MagnifyingGlass, Moon, Sun, Volleyball, X } from '@phosphor-icons/react';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' }
];

export default function Header({ theme, toggleTheme, onOpenResume, onOpenSearch, searchOpen }) {
  const reduce = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const goingDown = y > prev;
    setHidden(goingDown && y > 240 && !mobileMenuOpen);
  });

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <m.header
      className={`site-header ${mobileMenuOpen ? 'menu-open' : ''}`}
      animate={{ y: hidden && !reduce ? -96 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      <div className="container">
        <div className="nav-shell">
          <a href="#top" className="brand-logo" onClick={closeMenu} aria-label="Gyan Mistry, back to top">
            <Volleyball size={24} weight="fill" aria-hidden="true" />
            <span>Gyan Mistry</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary">
            <ul className="nav-links" onMouseLeave={() => setHovered(null)}>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onMouseEnter={() => setHovered(link.href)} onFocus={() => setHovered(link.href)}>
                    {hovered === link.href && !reduce && (
                      <m.span
                        layoutId="nav-hover"
                        className="nav-hover-pill"
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="nav-search"
              onClick={() => onOpenSearch('')}
              aria-label="Search skills and projects"
              aria-keyshortcuts="Meta+K Control+K /"
            >
              {!searchOpen && (
                <m.span
                  layoutId={reduce ? undefined : 'search-surface'}
                  className="nav-search-surface"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
              <span className="nav-search-label">Search skills</span>
              <kbd className="nav-search-label" aria-hidden="true">{isMac ? 'Cmd K' : 'Ctrl K'}</kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="icon-btn theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={theme}
                  initial={reduce ? false : { rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'inline-flex' }}
                >
                  {theme === 'dark' ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
                </m.span>
              </AnimatePresence>
            </button>

            <button type="button" onClick={onOpenResume} className="btn btn-primary btn-sm nav-resume-btn">
              <FileText size={16} weight="bold" aria-hidden="true" />
              View resume
            </button>

            <button
              type="button"
              className="icon-btn mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <m.div
                key="backdrop"
                className="mobile-nav-backdrop"
                onClick={closeMenu}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <m.nav
                key="drawer"
                id="mobile-nav"
                className="mobile-nav-drawer"
                aria-label="Mobile"
                initial={reduce ? false : { opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              >
                <ul className="mobile-nav-list">
                  {LINKS.map((link, i) => (
                    <m.li
                      key={link.href}
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.04 * i } }}
                    >
                      <a href={link.href} onClick={closeMenu}>{link.label}</a>
                    </m.li>
                  ))}
                  <li>
                    <button type="button" onClick={() => { closeMenu(); onOpenResume(); }}>
                      View resume
                    </button>
                  </li>
                </ul>
              </m.nav>
            </>
          )}
        </AnimatePresence>
      </div>
    </m.header>
  );
}
