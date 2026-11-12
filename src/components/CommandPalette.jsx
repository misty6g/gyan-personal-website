import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { MagnifyingGlass, ArrowElbowDownLeft, X } from '@phosphor-icons/react';
import { QUICK_QUERIES, flattenResults, searchPortfolio } from '../lib/search';
import { lockScroll } from '../lib/smoothScroll';

export default function CommandPalette({ isOpen, initialQuery, data, onClose, onJump }) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocusRef = useRef(null);

  const results = useMemo(() => searchPortfolio(data, query), [data, query]);
  const items = useMemo(() => flattenResults(results), [results]);

  useEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement;
    setQuery(initialQuery || '');
    setActive(0);
    lockScroll(true);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      returnFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, initialQuery]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (item) => {
    if (!item) return;
    onClose();
    onJump(item.id);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(items.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(items[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <m.div
            layoutId={reduce ? undefined : 'search-surface'}
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Search skills, projects, and coursework"
            onKeyDown={onKeyDown}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <m.div
              className="palette-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.12, duration: 0.18 } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
            >
              <div className="palette-input-row">
                <MagnifyingGlass size={22} weight="bold" aria-hidden="true" />
                <input
                  ref={inputRef}
                  className="palette-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a skill, like Rust or computer vision"
                  aria-label="Search skills and technologies"
                  aria-controls="palette-results"
                  aria-activedescendant={items[active] ? `palette-opt-${items[active].id}` : undefined}
                  role="combobox"
                  aria-expanded={items.length > 0}
                  autoComplete="off"
                  spellCheck="false"
                />
                <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
                  <X size={18} weight="bold" />
                </button>
              </div>

              {!query.trim() && (
                <div className="palette-empty">
                  <p>Type any technology to see where I used it. Try one of these:</p>
                  <div className="chip-list">
                    {QUICK_QUERIES.map((q) => (
                      <button key={q} type="button" className="chip" onClick={() => setQuery(q)}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && items.length === 0 && (
                <div className="palette-empty">
                  <p>
                    Nothing matches "{query}". Check the spelling, or try a broader term like "Python" or "agents".
                  </p>
                </div>
              )}

              {items.length > 0 && (
                <>
                  <p className="palette-count" aria-live="polite">
                    {results.total} {results.total === 1 ? 'match' : 'matches'} for "{query.trim()}"
                  </p>
                  <ul id="palette-results" className="palette-list" role="listbox" ref={listRef} data-lenis-prevent>
                    {items.map((item, i) => {
                      const header = item.group !== lastGroup ? item.group : null;
                      lastGroup = item.group;
                      return (
                        <React.Fragment key={`${item.group}-${item.id}`}>
                          {header && <li className="palette-group" role="presentation">{header}</li>}
                          <li
                            id={`palette-opt-${item.id}`}
                            role="option"
                            aria-selected={i === active}
                            data-index={i}
                            className={`palette-option ${i === active ? 'is-active' : ''}`}
                            onMouseMove={() => setActive(i)}
                            onClick={() => choose(item)}
                          >
                            <span className="palette-option-title">{item.title}</span>
                            <span className="palette-option-detail">{item.detail}</span>
                            {i === active && <ArrowElbowDownLeft size={16} weight="bold" aria-hidden="true" />}
                          </li>
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </>
              )}

              <div className="palette-foot" aria-hidden="true">
                <span><kbd>Up</kbd><kbd>Down</kbd> to move</span>
                <span><kbd>Enter</kbd> to jump</span>
                <span><kbd>Esc</kbd> to close</span>
              </div>
            </m.div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
