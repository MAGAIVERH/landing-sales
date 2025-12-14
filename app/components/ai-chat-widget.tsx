'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MessageCircle } from 'lucide-react';

export const AiChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='fixed bottom-6 right-6 z-50'>
        <Button
          onClick={() => setOpen(true)}
          className='h-11 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
        >
          <MessageCircle className='mr-2 h-4 w-4' />
          Precisa de ajuda?
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-lg'>
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
