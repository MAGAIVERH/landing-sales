'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Copy, MessageCircle, RotateCcw } from 'lucide-react';

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
  isDone: boolean;
};

const onlyDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

const normalizeWhatsAppNumber = (value?: string | null) => {
  let digits = onlyDigits(value);
  if (!digits) return null;

  // Se já veio com DDI do Brasil
  if (digits.startsWith('55')) return digits;

  // Se veio só com DDD + número (10 ou 11 dígitos), prefixa Brasil
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;

  // Caso já esteja num formato diferente, tenta usar como está
  return digits;
};

const buildWhatsAppLink = (phone: string, text: string) => {
  const digits = normalizeWhatsAppNumber(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const LeadRowActions = ({ lead, isDone }: LeadRowActionsProps) => {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const [loadingDone, setLoadingDone] = React.useState(false);

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

  const toggleDone = async () => {
    setLoadingDone(true);

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/done`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ done: !isDone }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) return;

      router.refresh();
    } finally {
      setLoadingDone(false);
    }
  };

  return (
    <div className='flex items-center justify-end gap-2'>
      <Button
        type='button'
        variant={isDone ? 'outline' : 'default'}
        className='h-9'
        onClick={toggleDone}
        disabled={loadingDone}
        title={isDone ? 'Reabrir lead' : 'Marcar como feito'}
      >
        {isDone ? (
          <RotateCcw className='h-4 w-4' />
        ) : (
          <CheckCircle2 className='h-4 w-4' />
        )}
        {isDone ? 'Reabrir' : 'Feito'}
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
