'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  baseValue: number;
  dailyIncrement?: number;
  suffix?: string;
}

export const Counter = ({
  baseValue,
  dailyIncrement = 2,
  suffix = '+',
}: CounterProps) => {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [value, setValue] = useState(baseValue);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const STORAGE_KEY = 'projects-counter';
    const now = Date.now();

    const stored = localStorage.getItem(STORAGE_KEY);

    let calculatedValue = baseValue;

    if (stored) {
      const parsed = JSON.parse(stored);
      const daysPassed = Math.floor(
        (now - parsed.timestamp) / (1000 * 60 * 60 * 24),
      );

      calculatedValue = parsed.base + daysPassed * dailyIncrement;
    } else {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          base: baseValue,
          timestamp: now,
        }),
      );
    }

    setValue(calculatedValue);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const target = calculatedValue + 1;
          const duration = 2000; // ⏱️ duração da animação (ms)
          const steps = 20; // quantos “frames” visíveis
          const stepTime = duration / steps;
          let current = calculatedValue;
          let step = 0;

          const interval = setInterval(() => {
            step += 1;
            current =
              calculatedValue +
              Math.round((step / steps) * (target - calculatedValue));

            setValue(current);

            if (step >= steps) {
              clearInterval(interval);
              setValue(target);
            }
          }, stepTime);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [baseValue, dailyIncrement]);

  return (
    <p ref={ref} className='text-4xl font-semibold text-white transition-all'>
      {value}
      {suffix}
    </p>
  );
};
