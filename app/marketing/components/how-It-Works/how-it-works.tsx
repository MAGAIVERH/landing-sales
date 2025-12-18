'use client';

import { Section } from '../section';

import { STEPS, BULLETS } from './how-it-works.data';
import { HowItWorksHeader } from './how-it-works-header';
import { HowItWorksSteps } from './how-it-works-steps';
import { HowItWorksPractice } from './how-it-works-practice';

export const HowItWorks = () => {
  return (
    <Section id='como-funciona' className='bg-background py-16 md:py-20'>
      <div className='mx-auto max-w-6xl px-6'>
        {/* Cabeçalho */}
        <HowItWorksHeader />

        {/* Etapas */}
        <HowItWorksSteps steps={STEPS} />

        {/* Bloco “na prática” */}
        <HowItWorksPractice bullets={BULLETS} />
      </div>
    </Section>
  );
};
