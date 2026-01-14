'use client';

import { Section } from '../section';
import { BULLETS, SEGMENTS } from './showcase.data';
import { ShowcaseCopy } from './showcase-copy';
import { ShowcasePreview } from './showcase-preview';

export const Showcase = () => {
  return (
    <Section className='py-4 md:py-10'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='grid gap-10 md:grid-cols-2 md:items-center'>
          {/* Copy */}
          <ShowcaseCopy bullets={BULLETS} />

          {/* Preview */}
          <ShowcasePreview segments={SEGMENTS} />
        </div>
      </div>
    </Section>
  );
};
