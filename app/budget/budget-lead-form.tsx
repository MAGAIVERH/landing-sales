'use client';

import * as React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CheckCircle2, MessageCircle, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const budgetSchema = z.object({
  name: z.string().trim().min(2, 'Digite seu nome'),
  email: z.string().trim().email('Digite um e-mail válido'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  segment: z.string().trim().min(2, 'Informe seu segmento'),
  message: z
    .string()
    .trim()
    .min(10, 'Descreva um pouco melhor sua necessidade'),
});

type BudgetValues = z.infer<typeof budgetSchema>;

type BudgetLeadFormProps = {
  defaultName: string;
  defaultEmail: string;
  defaultPhone: string;
};

export const BudgetLeadForm = ({
  defaultName,
  defaultEmail,
  defaultPhone,
}: BudgetLeadFormProps) => {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<BudgetValues | null>(null);

  const form = useForm<BudgetValues>({
    resolver: zodResolver(budgetSchema),
    mode: 'onChange',
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      phone: defaultPhone,
      segment: '',
      message: '',
    },
  });

  const onSubmit = async (values: BudgetValues) => {
    setSubmitError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          landingPath: '/budget',
          // referrer: document.referrer, // se quiser, dá pra enviar também
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as any;
        throw new Error(payload?.error ?? 'Falha ao enviar');
      }
      setSubmitted(values);
      setSuccess(true);

      setSuccess(true);
      form.reset({
        name: values.name,
        email: values.email,
        phone: values.phone,
        segment: values.segment,
        message: values.message,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao enviar';
      setSubmitError(msg);
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const normalizePhone = (value: string) => value.replace(/\D/g, '');

  const lead = submitted;

  const whatsappHref =
    whatsappNumber && lead
      ? `https://wa.me/${normalizePhone(
          whatsappNumber,
        )}?text=${encodeURIComponent(
          `Olá! Acabei de solicitar uma plataforma de gestão para profissionais de alta performace.\n\nNome: ${
            lead.name
          }\nE-mail: ${lead.email}\nWhatsApp: ${
            lead.phone || 'Não informado'
          }\nSegmento: ${lead.segment}\nNecessidade: ${
            lead.message
          }\n\nPode me enviar os próximos passos e uma recomendação de plano?`,
        )}`
      : '';

  if (success) {
    return (
      <div className='grid gap-4'>
        <div className='rounded-lg border bg-background p-4'>
          <div className='flex items-start gap-3'>
            <span className='mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <CheckCircle2 className='h-4 w-4' />
            </span>

            <div className='space-y-1'>
              <p className='text-sm font-semibold'>Recebemos sua solicitação</p>
              <p className='text-sm text-muted-foreground'>
                Obrigado. Para agilizar, você pode falar comigo agora no
                WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {whatsappHref ? (
          <Button asChild className='h-11 w-full'>
            <a
              href={whatsappHref}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center gap-2'
            >
              <MessageCircle className='h-4 w-4' />
              Falar no WhatsApp agora
            </a>
          </Button>
        ) : (
          <p className='text-sm text-muted-foreground'>
            WhatsApp indisponível no momento. Em breve entraremos em contato.
          </p>
        )}

        <p className='text-xs text-muted-foreground'>
          Você pode fechar esta página ou{' '}
          <Link href='/' className='underline underline-offset-4'>
            voltar para a página inicial
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
      {/* Nome */}
      <div className='grid gap-2'>
        <Label htmlFor='name'>Nome</Label>
        <Input
          id='name'
          placeholder='Seu nome'
          className='h-11'
          {...form.register('name')}
        />
        {form.formState.errors.name?.message ? (
          <p className='text-xs text-destructive'>
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      {/* Email + Whats */}
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>E-mail</Label>
          <Input
            id='email'
            type='email'
            placeholder='seu@email.com'
            className='h-11'
            {...form.register('email')}
          />
          {form.formState.errors.email?.message ? (
            <p className='text-xs text-destructive'>
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='phone'>WhatsApp</Label>
          <Input
            id='phone'
            placeholder='(xx) xxxxx-xxxx'
            className='h-11'
            {...form.register('phone')}
          />
          <p className='text-xs text-muted-foreground'>
            Opcional, mas acelera o retorno.
          </p>
        </div>
      </div>

      {/* Segmento */}
      <div className='grid gap-2'>
        <Label htmlFor='segment'>Segmento</Label>
        <Input
          id='segment'
          placeholder='Ex.: Médicos / Clínica / Consultório'
          className='h-11'
          {...form.register('segment')}
        />
        {form.formState.errors.segment?.message ? (
          <p className='text-xs text-destructive'>
            {form.formState.errors.segment.message}
          </p>
        ) : null}
      </div>

      {/* Descrição */}
      <div className='grid gap-2'>
        <Label htmlFor='message'>O que você precisa?</Label>
        <Textarea
          id='message'
          placeholder='Explique o objetivo, funcionalidades desejadas e prazo.'
          className='min-h-35 resize-none'
          {...form.register('message')}
        />
        <p className='text-xs text-muted-foreground'>
          Ex.: agenda online, pagamentos, automações, área do cliente, etc.
        </p>
        {form.formState.errors.message?.message ? (
          <p className='text-xs text-destructive'>
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className='text-sm text-destructive'>
          Não foi possível enviar agora. Tente novamente.
        </p>
      ) : null}

      {/* rodapé */}
      <div className='flex justify-end'>
        <Button
          type='submit'
          className='h-10 px-6 w-full'
          disabled={!isValid || isSubmitting}
        >
          <Send className='h-4 w-4' />
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </form>
  );
};
