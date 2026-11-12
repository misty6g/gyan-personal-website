import React, { useEffect, useRef } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { ArrowUpRight, DownloadSimple, X } from '@phosphor-icons/react';
import { lockScroll } from '../lib/smoothScroll';

export default function ResumeModal({ isOpen, onClose, pdfUrl }) {
  const reduce = useReducedMotion();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const returnTo = document.activeElement;
    const onKey = (e) => e.key === 'Escape' && onClose();
    lockScroll(true);
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 40);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      returnTo?.focus?.({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <m.div
            className="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Resume viewer"
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            data-lenis-prevent
          >
            <div className="modal-header">
              <p className="modal-title">Gyan Mistry, resume</p>
              <div className="modal-actions">
                <a href={pdfUrl} download="Gyan_Mistry_Resume.pdf" className="btn btn-primary btn-sm modal-action-btn">
                  <DownloadSimple size={16} weight="bold" aria-hidden="true" />
                  Download
                </a>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm modal-action-btn">
                  Open in new tab
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </a>
                <button ref={closeRef} type="button" className="icon-btn modal-close-btn" onClick={onClose} aria-label="Close resume">
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>
            <div className="modal-body">
              <iframe src={`${pdfUrl}#toolbar=1&navpanes=0`} title="Gyan Mistry resume PDF" className="modal-iframe" />
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
