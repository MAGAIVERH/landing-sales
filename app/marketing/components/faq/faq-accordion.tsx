'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import type { FaqItem } from './faq.types';

export const FaqAccordion = ({ items }: { items: FaqItem[] }) => {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className='border-b last:border-b-0'
        >
          <AccordionTrigger className='rounded-xl px-3 py-4 text-left text-sm font-semibold hover:bg-muted/40 md:px-4'>
            {item.question}
          </AccordionTrigger>

          <AccordionContent className='px-3 pb-4 text-sm text-muted-foreground md:px-4'>
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
