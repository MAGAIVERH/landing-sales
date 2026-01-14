'use client';

import { Section } from '../section';
import { BULLETS,STEPS } from './how-it-works.data';
import { HowItWorksHeader } from './how-it-works-header';
import { HowItWorksPractice } from './how-it-works-practice';
import { HowItWorksSteps } from './how-it-works-steps';

export const HowItWorks = () => {
  return (
    <Section id='como-funciona' className='bg-background py-4 md:py-8'>
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
