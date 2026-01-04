'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

type Props = {
  fallbackHref?: string;
  className?: string;
};

export const BackButton = ({
  fallbackHref = '/admin/orders',
  className,
}: Props) => {
  const router = useRouter();

  return (
    <Button
      type='button'
      variant='outline'
      className={className}
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push(fallbackHref);
      }}
    >
      Voltar
    </Button>
  );
};
