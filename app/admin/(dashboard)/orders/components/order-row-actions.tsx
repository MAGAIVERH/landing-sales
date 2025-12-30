'use client';

import * as React from 'react';
import Link from 'next/link';
import { Copy, ExternalLink, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

type OrderRowActionsProps = {
  order: {
    id: string;
    customerEmail: string | null;
    leadPhone: string | null;
    status: string;
    createdAtISO: string;
  };
};

const onlyDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

const buildWhatsAppLink = (phone: string, text: string) => {
  const digits = onlyDigits(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const OrderRowActions = ({ order }: OrderRowActionsProps) => {
  const [copied, setCopied] = React.useState(false);

  const whatsappText =
    `Olá! Vi seu pedido da plataforma e vou te orientar nos próximos passos.\n\n` +
    `Pedido: ${order.id}\n` +
    `E-mail: ${order.customerEmail ?? '-'}\n\n` +
    `Você já conseguiu acessar o onboarding e enviar as informações iniciais?`;

  const wa = buildWhatsAppLink(order.leadPhone ?? '', whatsappText);

  const copy = async () => {
    const text =
      `Order (${order.id})\n` +
      `Status: ${order.status}\n` +
      `E-mail: ${order.customerEmail ?? '-'}\n` +
      `WhatsApp: ${order.leadPhone ?? '-'}\n` +
      `Criado: ${new Date(order.createdAtISO).toLocaleString('pt-BR')}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className='flex items-center justify-end gap-2'>
      <Button asChild variant='outline' className='h-9'>
        <Link
          href={`/onboarding?orderId=${order.id}`}
          className='inline-flex items-center gap-2'
        >
          <ExternalLink className='h-4 w-4' />
          Onboarding
        </Link>
      </Button>

      {wa ? (
        <a href={wa} target='_blank' rel='noreferrer'>
          <Button variant='outline' className='h-9'>
            <MessageCircle className='h-4 w-4' />
            WhatsApp
          </Button>
        </a>
      ) : (
        <Button variant='outline' className='h-9' disabled>
          <MessageCircle className='h-4 w-4' />
          WhatsApp
        </Button>
      )}

      <Button variant='outline' className='h-9' onClick={copy}>
        <Copy className='h-4 w-4' />
        {copied ? 'Copiado' : 'Copiar'}
      </Button>
    </div>
  );
};
