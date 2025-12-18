export type ShowcaseSlide = {
  label: string;
  src: string;
};

export type ShowcaseSegment = {
  id: 'barbearia' | 'tattoo' | 'personal';
  slides: ShowcaseSlide[];
};
