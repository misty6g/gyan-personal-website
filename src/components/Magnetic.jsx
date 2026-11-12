import React, { useRef } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useMediaQuery } from '../lib/useMediaQuery';

const SPRING = { stiffness: 220, damping: 18, mass: 0.6 };

export default function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  if (reduce || !finePointer) {
    return <span className={`magnetic ${className}`}>{children}</span>;
  }

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </m.span>
  );
}
