'use client';

import { useMemo, useState } from 'react';

import { Section } from '../section';
import {
  PLATFORM_PREVIEW_SRC,
  segments,
  testimonials,
} from './social-proof.data';
import { SocialProofBenefits } from './social-proof-benefits';
import { SocialProofHeader } from './social-proof-header';
import { SocialProofPreview } from './social-proof-preview';
import { SocialProofSegments } from './social-proof-segments';
import { SocialProofTestimonials } from './social-proof-testimonials';

export const SocialProof = () => {
  const [activeKey, setActiveKey] = useState<string>(
    segments[0]?.key ?? 'clinicas',
  );

  const activeSegment = useMemo(
    () => segments.find((s) => s.key === activeKey) ?? segments[0],
    [activeKey],
  );

  return (
    <Section
      id='social-proof'
      className='relative overflow-hidden bg-primary text-primary-foreground pt-14 pb-28 md:py-16 py-14'
    >
      {/* decoração */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-background/10 blur-3xl' />
        <div className='absolute -bottom-48 -left-40 h-130 w-130 rounded-full bg-background/10 blur-3xl' />
      </div>

      {/* header */}
      <SocialProofHeader />

      {/* bloco principal */}
      <div className='relative mt-10 rounded-3xl bg-background/95 p-6 text-foreground shadow-sm ring-1 ring-background/20 md:p-8'>
        <div className='grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start'>
          {/* coluna esquerda */}
          <SocialProofBenefits activeSegment={activeSegment} />

          {/* coluna direita: cards maiores + preview ao clicar */}
          <div className='order-1 md:order-2 overflow-hidden'>
            <SocialProofSegments
              segments={segments}
              activeKey={activeKey}
              onSelect={setActiveKey}
            />

            <SocialProofPreview
              activeSegment={activeSegment}
              platformPreviewSrc={PLATFORM_PREVIEW_SRC}
            />
          </div>
        </div>
      </div>

      {/* depoimentos */}
      <SocialProofTestimonials testimonials={testimonials} />
    </Section>
  );
};
