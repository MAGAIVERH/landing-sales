'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { ShowcaseSegment } from './showcase.types';
import { ShowcaseSegmentContent } from './showcase-segment-content';

export const ShowcaseTabs = ({ segments }: { segments: ShowcaseSegment[] }) => {
  return (
    <Tabs defaultValue='barbearia' className=' w-full'>
      <TabsList className='w-full justify-start overflow-x-auto'>
        <TabsTrigger value='barbearia'>Barbearia</TabsTrigger>
        <TabsTrigger value='tattoo'>Tattoo</TabsTrigger>
        <TabsTrigger value='personal'>Personal</TabsTrigger>
      </TabsList>

      {segments.map((seg) => (
        <ShowcaseSegmentContent key={seg.id} segment={seg} />
      ))}
    </Tabs>
  );
};
