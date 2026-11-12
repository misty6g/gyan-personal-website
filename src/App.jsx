import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { LazyMotion } from 'motion/react';
import { portfolioData } from './data/portfolioData';
import Header from './components/Header';
import CourtHero from './components/CourtHero';
import Marquee from './components/Marquee';
import RallyTimeline from './components/RallyTimeline';
import ProjectReel from './components/ProjectReel';
import ProjectIndex from './components/ProjectIndex';
import AboutBento from './components/AboutBento';
import Credentials from './components/Credentials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import ResumeModal from './components/ResumeModal';
import { destroySmoothScroll, initSmoothScroll, scrollToY } from './lib/smoothScroll';

const NAV_OFFSET = 110;
const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default);

function flash(el) {
  el.classList.remove('is-flash');
  void el.offsetWidth;
  el.classList.add('is-flash');
  setTimeout(() => el.classList.remove('is-flash'), 1900);
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const [palette, setPalette] = useState({ open: false, query: '' });
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [revealId, setRevealId] = useState(null);
  const [status, setStatus] = useState('');
  const statusTimer = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gyan_theme', theme);
  }, [theme]);

  useEffect(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  const openSearch = useCallback((query = '') => setPalette({ open: true, query }), []);
  const closeSearch = useCallback(() => setPalette((p) => ({ ...p, open: false })), []);
  const closeResume = useCallback(() => setIsResumeOpen(false), []);

  // Android Chrome won't render a PDF in an iframe and iOS Safari shows only page one.
  const openResume = useCallback(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      window.open(portfolioData.personal.resumePdfUrl, '_blank', 'noopener');
    } else {
      setIsResumeOpen(true);
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((p) => ({ open: !p.open, query: '' }));
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        openSearch('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch]);

  const toggleTheme = (event) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) {
      setTheme(next);
      return;
    }
    const rect = event?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  };

  const announce = useCallback((msg) => {
    setStatus(msg);
    clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatus(''), 3000);
  }, []);

  const jumpTo = useCallback((id) => {
    setRevealId(id);
    // Wait for tabs or accordions to open the target before measuring it.
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const reel = document.getElementById('projects');
      const reelCards = reel ? [...reel.querySelectorAll('.reel-card')] : [];
      const reelIndex = reelCards.indexOf(el);

      let y;
      if (reel && reelIndex >= 0 && reel.dataset.horizontal === 'true') {
        const span = reel.offsetHeight - window.innerHeight;
        const steps = Math.max(reelCards.length - 1, 1);
        y = reel.getBoundingClientRect().top + window.scrollY + (span * reelIndex) / steps;
      } else {
        y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      }
      scrollToY(Math.max(y, 0));
      setTimeout(() => flash(el), 650);
    }, 120);
  }, []);

  const { personal, experiences, projects, extracurriculars, socials } = portfolioData;

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div className="app-layout">
        <a className="skip-link" href="#main">Skip to content</a>
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenResume={openResume}
          onOpenSearch={openSearch}
          searchOpen={palette.open}
        />

        <main id="main">
          <CourtHero personal={personal} onOpenResume={openResume} onCopied={announce} />
          <Marquee items={portfolioData.badges.map((b) => b.label)} />
          <RallyTimeline experiences={experiences} onSelectTag={openSearch} />
          <ProjectReel projects={projects} onSelectTag={openSearch} />
          <ProjectIndex projects={projects} onSelectTag={openSearch} revealId={revealId} />
          <AboutBento personal={personal} extracurriculars={extracurriculars} socials={socials} />
          <Credentials
            education={portfolioData.education}
            skills={portfolioData.skills}
            coursework={portfolioData.coursework}
            memberships={extracurriculars.memberships}
            onSelectTag={openSearch}
            revealId={revealId}
          />
          <Contact personal={personal} socials={socials} onCopied={announce} />
        </main>

        <Footer name={personal.name} />

        <CommandPalette
          isOpen={palette.open}
          initialQuery={palette.query}
          data={portfolioData}
          onClose={closeSearch}
          onJump={jumpTo}
        />
        <ResumeModal isOpen={isResumeOpen} onClose={closeResume} pdfUrl={personal.resumePdfUrl} />

        <p className="sr-only" role="status" aria-live="polite">{status}</p>
      </div>
    </LazyMotion>
  );
}
