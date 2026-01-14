'use client';

import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const AiChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='fixed bottom-6 right-6 z-50'>
        {/* MOBILE: só ícone */}
        <Button
          type='button'
          size='icon'
          aria-label='Abrir chat de ajuda'
          onClick={() => setOpen(true)}
          className='h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 md:hidden'
        >
          <MessageCircle className='h-5 w-5' />
        </Button>

        {/* DESKTOP: ícone + texto */}
        <Button
          type='button'
          onClick={() => setOpen(true)}
          className='hidden h-11 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 md:flex'
        >
          <MessageCircle className='mr-2 h-4 w-4' />
          Precisa de ajuda?
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* opcional: no mobile ocupa a largura certa sem “estourar” */}
        <DialogContent className='w-[calc(100vw-2rem)] sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Assistente</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground'>
              Me diga seu segmento (barbearia, clínica, personal trainer,
              restaurante) e eu recomendo o melhor plano.
            </div>

            <div className='flex gap-2'>
              <Input placeholder='Digite sua pergunta...' />
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
                Enviar
              </Button>
            </div>

            <p className='text-xs text-muted-foreground'>
              (Stub) Próximo passo: integrar AI SDK + salvar leads no Postgres
              (Prisma).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
