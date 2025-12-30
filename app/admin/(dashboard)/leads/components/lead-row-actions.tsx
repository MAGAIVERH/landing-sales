'use client';

import * as React from 'react';
import { Copy, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

type LeadRowActionsProps = {
  lead: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    message: string | null;
    landingPath: string | null;
    source: string | null;
    createdAt: string; // ISO
  };
};

const onlyDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

const buildWhatsAppLink = (phone: string, text: string) => {
  const digits = onlyDigits(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const LeadRowActions = ({ lead }: LeadRowActionsProps) => {
  const [copied, setCopied] = React.useState(false);

  const whatsappText =
    `Olá! Vi sua solicitação de plataforma de gestão para profissional liberal e vou te enviar os próximos passos.\n\n` +
    `Nome: ${lead.name ?? '-'}\n` +
    `E-mail: ${lead.email ?? '-'}\n` +
    `WhatsApp: ${lead.phone ?? '-'}\n\n` +
    `Você consegue me confirmar seu segmento e o principal objetivo da plataforma?`;

  const wa = buildWhatsAppLink(lead.phone ?? '', whatsappText);

  const copy = async () => {
    const text =
      `Lead (${lead.id})\n` +
      `Nome: ${lead.name ?? '-'}\n` +
      `E-mail: ${lead.email ?? '-'}\n` +
      `WhatsApp: ${lead.phone ?? '-'}\n` +
      `Origem: ${lead.source ?? '-'}\n` +
      `Landing: ${lead.landingPath ?? '-'}\n` +
      `Criado: ${new Date(lead.createdAt).toLocaleString('pt-BR')}\n\n` +
      `Mensagem:\n${lead.message ?? '-'}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className='flex items-center justify-end gap-2'>
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
