import React, { useEffect } from 'react';

export default function ResumeModal({ isOpen, onClose, pdfUrl }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Resume PDF Viewer"
    >
      <div className="modal-dialog">
        <div className="modal-header">
          <div className="modal-title">📄 Gyan_Mistry_Resume.pdf</div>
          <div className="modal-actions">
            <a 
              href={pdfUrl} 
              download="Gyan_Mistry_Resume.pdf" 
              className="btn btn-primary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              ⬇ Download
            </a>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              ↗ Open Tab
            </a>
            <button 
              type="button" 
              className="btn-icon" 
              onClick={onClose}
              aria-label="Close modal"
              title="Close modal (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="modal-body">
          <iframe 
            src={`${pdfUrl}#toolbar=1&navpanes=0`} 
            title="Gyan Mistry Resume" 
            className="modal-iframe"
          />
        </div>
      </div>
    </div>
  );
}
