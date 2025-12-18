export type Segment = {
  key: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  previewSrc?: string;
  previewVariant?: 'desktop' | 'mobile';
};

export type ProofChip = {
  label: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
  initials: string;
};
