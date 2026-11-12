import React, { useEffect, useRef } from 'react';
import { m, useInView, useReducedMotion, useSpring, useTransform } from 'motion/react';

const format = (n) => Math.round(n).toLocaleString('en-US');

export default function CountUp({ value, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const spring = useSpring(reduce ? value : 0, { stiffness: 55, damping: 18, restDelta: 0.5 });
  const text = useTransform(spring, (v) => format(v) + suffix);

  useEffect(() => {
    if (inView || reduce) spring.set(value);
  }, [inView, reduce, spring, value]);

  return (
    <span ref={ref}>
      <span className="sr-only">{format(value) + suffix}</span>
      <m.span aria-hidden="true">{text}</m.span>
    </span>
  );
}
