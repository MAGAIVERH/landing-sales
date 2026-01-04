// 'use client';

// import * as React from 'react';
// import Link from 'next/link';
// import { Copy, ExternalLink, MessageCircle } from 'lucide-react';

// import { Button } from '@/components/ui/button';

// type OrderRowActionsProps = {
//   order: {
//     id: string;
//     customerEmail: string | null;
//     leadPhone: string | null;
//     status: string;
//     createdAtISO: string;
//   };
// };

// const onlyDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

// const buildWhatsAppLink = (phone: string, text: string) => {
//   const digits = onlyDigits(phone);
//   if (!digits) return null;
//   return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
// };

// export const OrderRowActions = ({ order }: OrderRowActionsProps) => {
//   const [copied, setCopied] = React.useState(false);

//   const whatsappText =
//     `Olá! Vi seu pedido da plataforma e vou te orientar nos próximos passos.\n\n` +
//     `Pedido: ${order.id}\n` +
//     `E-mail: ${order.customerEmail ?? '-'}\n\n` +
//     `Você já conseguiu acessar o onboarding e enviar as informações iniciais?`;

//   const wa = buildWhatsAppLink(order.leadPhone ?? '', whatsappText);

//   const copy = async () => {
//     const text =
//       `Order (${order.id})\n` +
//       `Status: ${order.status}\n` +
//       `E-mail: ${order.customerEmail ?? '-'}\n` +
//       `WhatsApp: ${order.leadPhone ?? '-'}\n` +
//       `Criado: ${new Date(order.createdAtISO).toLocaleString('pt-BR')}`;

//     await navigator.clipboard.writeText(text);
//     setCopied(true);
//     window.setTimeout(() => setCopied(false), 1200);
//   };

//   return (
//     <div className='flex items-center justify-end gap-2'>
//       <Button asChild variant='outline' className='h-9'>
//         <Link
//           href={`/onboarding?orderId=${order.id}`}
//           className='inline-flex items-center gap-2'
//         >
//           <ExternalLink className='h-4 w-4' />
//           Onboarding
//         </Link>
//       </Button>

//       {wa ? (
//         <a href={wa} target='_blank' rel='noreferrer'>
//           <Button variant='outline' className='h-9'>
//             <MessageCircle className='h-4 w-4' />
//             WhatsApp
//           </Button>
//         </a>
//       ) : (
//         <Button variant='outline' className='h-9' disabled>
//           <MessageCircle className='h-4 w-4' />
//           WhatsApp
//         </Button>
//       )}

//       <Button variant='outline' className='h-9' onClick={copy}>
//         <Copy className='h-4 w-4' />
//         {copied ? 'Copiado' : 'Copiar'}
//       </Button>
//     </div>
//   );
// };

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Copy,
  ExternalLink,
  MessageCircle,
  MoreHorizontal,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const normalizeWhatsAppNumber = (value?: string | null) => {
  const digits = onlyDigits(value);
  if (!digits) return null;

  // Aceita número BR sem DDI e adiciona 55
  if (digits.startsWith('55')) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;

  // fallback: usa como está (para casos internacionais)
  return digits;
};

const buildWhatsAppLink = (phone: string, text: string) => {
  const digits = normalizeWhatsAppNumber(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

const buildEmailLink = (to: string, subject: string, body: string) => {
  const email = (to ?? '').trim();
  if (!email) return null;

  const params = new URLSearchParams();
  params.set('subject', subject);
  params.set('body', body);
  return `mailto:${encodeURIComponent(email)}?${params.toString()}`;
};

export const OrderRowActions = ({ order }: OrderRowActionsProps) => {
  const [copied, setCopied] = React.useState(false);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    'http://localhost:3000';

  const onboardingLink = `${appUrl}/onboarding?orderId=${order.id}`;

  const whatsappText =
    `Olá! Vi seu pedido da plataforma e vou te orientar nos próximos passos.\n\n` +
    `Pedido: ${order.id}\n` +
    `E-mail: ${order.customerEmail ?? '-'}\n\n` +
    `Você já conseguiu acessar o onboarding e enviar as informações iniciais?\n\n` +
    `Link: ${onboardingLink}`;

  const wa = buildWhatsAppLink(order.leadPhone ?? '', whatsappText);

  const to = (order.customerEmail ?? '').trim();
  const emailSubject = `Ação necessária: inicie seu briefing (pedido ${order.id})`;
  const emailBody =
    `Olá! Tudo bem?\n\n` +
    `Seu pedido foi confirmado, e precisamos que você inicie o briefing para começarmos a produção da sua plataforma.\n\n` +
    `Para iniciar agora, acesse:\n` +
    `${onboardingLink}\n\n` +
    `Pedido: ${order.id}`;

  const mailto = buildEmailLink(to, emailSubject, emailBody);

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='h-9 w-9 p-0' aria-label='Ações'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='min-w-56'>
          {/* WhatsApp */}
          <DropdownMenuItem asChild disabled={!wa}>
            {wa ? (
              <a
                href={wa}
                target='_blank'
                rel='noreferrer'
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className='mr-2 h-4 w-4' />
                WhatsApp
              </a>
            ) : (
              <span className='inline-flex items-center'>
                <MessageCircle className='mr-2 h-4 w-4' />
                WhatsApp indisponível
              </span>
            )}
          </DropdownMenuItem>

          {/* Email */}
          <DropdownMenuItem asChild disabled={!mailto}>
            {mailto ? (
              <a
                href={mailto}
                target='_blank'
                rel='noreferrer'
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className='mr-2 h-4 w-4' />
                E-mail
              </a>
            ) : (
              <span className='inline-flex items-center'>
                <Mail className='mr-2 h-4 w-4' />
                E-mail indisponível
              </span>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Copiar */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              void copy();
            }}
          >
            <Copy className='mr-2 h-4 w-4' />
            {copied ? 'Copiado' : 'Copiar detalhes'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
