'use client';

import Image from 'next/image';

export const Avatar = ({
  src,
  alt,
  initials,
}: {
  src: string;
  alt: string;
  initials: string;
}) => {
  return (
    <div className='relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border'>
      <div className='absolute inset-0 flex items-center justify-center bg-muted text-xs font-semibold text-foreground'>
        {initials}
      </div>

      <Image
        src={src}
        alt={alt}
        fill
        sizes='40px'
        className='relative object-cover'
      />
    </div>
  );
};
