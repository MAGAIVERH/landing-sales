'use client';

import { TabsContent } from '@/components/ui/tabs';

import type { ShowcaseSegment } from './showcase.types';
import { ShowcasePhoneCarousel } from './showcase-phone-carousel';

export const ShowcaseSegmentContent = ({
  segment,
}: {
  segment: ShowcaseSegment;
}) => {
  return (
    <TabsContent value={segment.id}>
      {/* Wrapper para manter “cara de celular” e não estourar o layout */}
      <ShowcasePhoneCarousel slides={segment.slides} />
    </TabsContent>
  );
};
