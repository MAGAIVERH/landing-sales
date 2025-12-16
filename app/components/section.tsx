import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const Section = ({ id, className, children }: SectionProps) => {
  return (
    <section id={id} className={cn('my-8 md:my-6', className)}>
      <div className='mx-auto w-full max-w-6xl px-6'>{children}</div>
    </section>
  );
};
