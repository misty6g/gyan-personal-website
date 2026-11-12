import React, { useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { Check, Copy } from '@phosphor-icons/react';

export default function CopyEmailButton({ email, className = 'btn btn-ghost', label = 'Copy email', onCopied }) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [bounces, setBounces] = useState(0);
  const timer = useRef(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    setBounces((n) => n + 1);
    onCopied?.(`Copied ${email}`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button type="button" className={`${className} copy-email-btn`} onClick={copy} title={`Copy ${email}`}>
      {copied ? <Check size={18} weight="bold" aria-hidden="true" /> : <Copy size={18} weight="bold" aria-hidden="true" />}
      <span>{copied ? 'Copied' : label}</span>
      <AnimatePresence>
        {!reduce && bounces > 0 && copied && (
          <m.span
            key={bounces}
            className="copy-ball"
            aria-hidden="true"
            initial={{ y: 0, opacity: 1, scale: 0.6 }}
            animate={{
              y: [0, -46, 0, -20, 0, -7, 0],
              scaleY: [1, 1, 0.75, 1, 0.85, 1, 1],
              scale: 1,
              opacity: 1
            }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 1.1, ease: 'easeOut', times: [0, 0.22, 0.42, 0.6, 0.76, 0.9, 1] }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
