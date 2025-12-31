'use client';

import * as React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
};

export const HorizontalCards = ({
  children,
  className = '',
  itemClassName = '',
}: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isDown = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    isDown.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (!isDown.current) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX.current;
    el.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className={[
        // container horizontal
        'flex gap-4 overflow-x-auto scroll-smooth',
        // snap pra “parar certinho”
        'snap-x snap-mandatory',
        // permite arrastar no trackpad/touch
        'touch-pan-x',
        // esconde a scrollbar
        '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        // UX
        'cursor-grab active:cursor-grabbing select-none',
        className,
      ].join(' ')}
    >
      {React.Children.map(children, (child, idx) => (
        <div
          key={idx}
          className={[
            'shrink-0 snap-start',
            // 3 visíveis no desktop, 1~2 no mobile
            'w-[88%] sm:w-[70%] lg:w-[calc((100%-2rem)/3)]',
            itemClassName,
          ].join(' ')}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
