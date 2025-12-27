'use client';

import * as React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const CONTACT_PREFERENCE = ['WHATSAPP', 'EMAIL', 'PHONE'] as const;

const BriefingSchema = z
  .object({
    // Identidade
    contactName: z.string().trim().min(2, 'Informe seu nome.'),
    businessName: z.string().trim().min(2, 'Informe o nome do negócio.'),
    niche: z.string().trim().optional(),

    // Zod v4: use "error" (não "required_error")
    contactPreference: z.enum(CONTACT_PREFERENCE, {
      error: 'Selecione uma preferência.',
    }),

    whatsapp: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: 'E-mail inválido.',
      }),
    phone: z.string().trim().optional(),

    // Local / Social
    cityState: z.string().trim().optional(),
    address: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
    currentWebsite: z.string().trim().optional(),

    // Marca
    logoUrl: z.string().trim().optional(),
    colors: z.string().trim().optional(),
    references: z.string().trim().optional(),

    // Conteúdo
    services: z.string().trim().optional(),
    extraNotes: z.string().trim().optional(),

    // Entrega
    domain: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.contactPreference === 'WHATSAPP' && !val.whatsapp?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['whatsapp'],
        message: 'Informe seu WhatsApp.',
      });
    }

    if (val.contactPreference === 'EMAIL' && !val.email?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Informe seu e-mail.',
      });
    }

    if (val.contactPreference === 'PHONE' && !val.phone?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Informe seu telefone.',
      });
    }
  });

type BriefingFormValues = z.infer<typeof BriefingSchema>;

const STEPS = [
  { id: 'identity', title: 'Identidade' },
  { id: 'brand', title: 'Marca' },
  { id: 'content', title: 'Conteúdo' },
  { id: 'delivery', title: 'Entrega' },
] as const;

// ✅ helper: textarea começa pequeno e cresce conforme digita (sem “min-h” gigante)
const autosizeTextarea = (el: HTMLTextAreaElement | null) => {
  if (!el) return;
  el.style.height = '0px';
  el.style.height = `${el.scrollHeight}px`;
};

export const OnboardingWizard = ({ orderId }: { orderId: string }) => {
  const canUse = orderId.trim().length > 0;

  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ✅ Guard para impedir submit “fantasma” ao trocar de passo
  // - 'next': usuário clicou em Continuar
  // - 'submit': usuário clicou em Enviar briefing
  const submitIntentRef = React.useRef<'next' | 'submit' | null>(null);

  const form = useForm<BriefingFormValues>({
    resolver: zodResolver(BriefingSchema),
    defaultValues: {
      contactName: '',
      businessName: '',
      niche: '',
      contactPreference: 'WHATSAPP',
      whatsapp: '',
      email: '',
      phone: '',
      cityState: '',
      address: '',
      instagram: '',
      currentWebsite: '',
      logoUrl: '',
      colors: '',
      references: '',
      services: '',
      extraNotes: '',
      domain: '',
    },
    mode: 'onBlur',
  });

  // Load existing draft
  React.useEffect(() => {
    const run = async () => {
      if (!canUse) {
        setLoading(false);
        setError('orderId ausente. Volte para a página de pagamento.');
        return;
      }

      try {
        const res = await fetch(
          `/api/briefing?orderId=${encodeURIComponent(orderId)}`,
          { cache: 'no-store' },
        );

        if (!res.ok) throw new Error('Falha ao carregar briefing.');

        const json = (await res.json()) as
          | { found: false }
          | { found: true; briefing: { data: any } };

        if ('found' in json && json.found) {
          const draft = (json.briefing.data ??
            {}) as Partial<BriefingFormValues>;
          form.reset({
            ...form.getValues(),
            ...draft,
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro inesperado.');
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, canUse]);

  // Autosave debounce
  const values = form.watch();
  React.useEffect(() => {
    if (loading || !canUse) return;

    const t = window.setTimeout(async () => {
      try {
        setSaving(true);
        await fetch('/api/briefing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, data: values }),
        });
      } catch {
        // autosave não deve travar UX
      } finally {
        setSaving(false);
      }
    }, 900);

    return () => window.clearTimeout(t);
  }, [values, orderId, loading, canUse]);

  // ✅ garante altura “compacta” no render e depois expande conforme necessário
  React.useEffect(() => {
    window.requestAnimationFrame(() => {
      const els =
        document.querySelectorAll<HTMLTextAreaElement>(
          'textarea[data-autosize="true"]',
        ) ?? [];
      els.forEach((el) => autosizeTextarea(el));
    });
  }, [step, loading, values.references, values.services, values.extraNotes]);

  const stepTitle = STEPS[step]?.title ?? 'Onboarding';
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  const getStepFields = (index: number) => {
    if (index === 0) {
      return [
        'contactName',
        'businessName',
        'niche',
        'contactPreference',
        'whatsapp',
        'email',
        'phone',
      ] as const;
    }

    if (index === 1) {
      return [
        'cityState',
        'address',
        'instagram',
        'currentWebsite',
        'colors',
        'references',
        'logoUrl',
      ] as const;
    }

    if (index === 2) {
      return ['services', 'extraNotes'] as const;
    }

    return ['domain'] as const;
  };

  const next = async () => {
    const fields = getStepFields(step);
    const ok = await form.trigger(fields as any, { shouldFocus: true });
    if (!ok) return;

    // ✅ Marca intenção de navegação
    submitIntentRef.current = 'next';

    setStep((s) => Math.min(s + 1, STEPS.length - 1));

    // ✅ Solta o guard no próximo frame (evita submit “vazado” ao renderizar o passo seguinte)
    window.requestAnimationFrame(() => {
      if (submitIntentRef.current === 'next') submitIntentRef.current = null;
    });
  };

  const prev = () => {
    submitIntentRef.current = null;
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = form.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch('/api/briefing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, data }),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(j?.error ?? 'Falha ao enviar briefing.');
      }

      window.location.href = `/onboarding/completed?orderId=${encodeURIComponent(
        orderId,
      )}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      setSubmitting(false);
    }
  });

  // ✅ Loading centralizado (sem Card)
  if (loading) {
    return (
      <main className='min-h-screen bg-muted/30'>
        <div className='mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6'>
          <div className='flex items-center gap-3'>
            <Loader2 className='h-5 w-5 animate-spin' />
            <p className='text-sm text-muted-foreground'>
              Carregando briefing…
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !canUse) {
    return (
      <main className='min-h-screen bg-muted/30'>
        <div className='mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6'>
          <Card className='w-full p-6 space-y-3'>
            <p className='text-base font-semibold'>
              Não foi possível continuar
            </p>
            <p className='text-sm text-muted-foreground'>{error}</p>
            <div className='flex flex-wrap gap-2'>
              <Button onClick={() => window.location.reload()}>
                Atualizar
              </Button>
              <Button variant='outline' asChild>
                <Link href='/'>Voltar</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className='relative min-h-screen overflow-hidden bg-linear-to-br from-blue-100 via-white to-white'>
      <div className='pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl' />

      <div className='mx-auto w-full max-w-3xl px-6 py-12'>
        <div className='mb-6 space-y-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <Badge className='bg-primary/10 text-primary'>Onboarding</Badge>

            <div className='text-xs text-muted-foreground'>
              {saving ? 'Salvando…' : 'Salvo automaticamente'}
            </div>
          </div>

          <div className='flex items-start justify-between gap-4'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>
                Passo {step + 1} de {STEPS.length}
              </p>
              <h1 className='text-2xl font-semibold tracking-tight'>
                {stepTitle}
              </h1>
              <p className='text-sm text-muted-foreground'>
                Preencha com calma. Você poderá revisar e atualizar depois.
              </p>
            </div>
          </div>

          <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
            <div
              className='h-full bg-primary transition-all'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className='p-6'>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                // ✅ Evita submit disparado por acidente durante navegação
                if (submitIntentRef.current === 'next') {
                  e.preventDefault();
                  e.stopPropagation();
                  submitIntentRef.current = null;
                  return;
                }

                // ✅ Se não for o último passo, Enter/submit vira "Continuar"
                if (step < STEPS.length - 1) {
                  e.preventDefault();
                  e.stopPropagation();
                  void next();
                  return;
                }

                // ✅ Último passo: submete normalmente
                submitIntentRef.current = null;
                submit(e);
              }}
              className='space-y-6'
            >
              {error ? (
                <div className='rounded-lg border bg-background p-4'>
                  <p className='text-sm font-semibold'>Atenção</p>
                  <p className='mt-1 text-sm text-muted-foreground'>{error}</p>
                </div>
              ) : null}

              {/* STEP 0 */}
              {step === 0 ? (
                <div className='space-y-6'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='contactName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seu nome</FormLabel>
                          <FormControl>
                            <Input placeholder='Ex: João Silva' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='businessName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do negócio</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Ex: Clínica Dr. Silva'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='niche'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nicho / especialidade</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Ex: Cardiologia, Odonto, Personal...'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Se você atender mais de um, pode listar separado por
                          vírgula.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='contactPreference'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormLabel>Preferência de contato</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className='grid gap-3 sm:grid-cols-3'
                            >
                              <label className='flex items-center gap-2 rounded-lg border bg-background px-3 py-2'>
                                <RadioGroupItem value='WHATSAPP' />
                                <span className='text-sm'>WhatsApp</span>
                              </label>

                              <label className='flex items-center gap-2 rounded-lg border bg-background px-3 py-2'>
                                <RadioGroupItem value='EMAIL' />
                                <span className='text-sm'>E-mail</span>
                              </label>

                              <label className='flex items-center gap-2 rounded-lg border bg-background px-3 py-2'>
                                <RadioGroupItem value='PHONE' />
                                <span className='text-sm'>Telefone</span>
                              </label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid gap-4 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='whatsapp'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input placeholder='(xx) xxxxx-xxxx' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='contato@exemplo.com'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem className='md:col-span-2'>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder='(xx) xxxx-xxxx' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* STEP 1 */}
              {step === 1 ? (
                <div className='space-y-6'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='cityState'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade / Estado (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Ex: São Paulo - SP'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='instagram'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder='@seuperfil' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Rua, número, bairro...'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name='colors'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cores (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Ex: azul + branco, ou #0ea5e9 #111827'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Se você não souber, deixe em branco e nós sugerimos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='references'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referências (links)</FormLabel>
                        <FormControl>
                          <Textarea
                            data-autosize='true'
                            rows={3}
                            placeholder='Cole aqui 1–3 links de sites/instas que você gosta'
                            className='min-h-21 resize-none overflow-hidden'
                            onInput={(e) =>
                              autosizeTextarea(
                                e.currentTarget as HTMLTextAreaElement,
                              )
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}

              {/* STEP 2 */}
              {step === 2 ? (
                <div className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='currentWebsite'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site atual (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder='https://...' {...field} />
                        </FormControl>
                        <FormDescription>
                          Se você não souber, deixe em branco e nós sugerimos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name='logoUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo (link por enquanto)</FormLabel>
                        <FormControl>
                          <Input placeholder='https://...' {...field} />
                        </FormControl>
                        <FormDescription>
                          Se você ainda não tem, pode deixar em branco.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='services'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serviços e preços</FormLabel>
                        <FormControl>
                          <Textarea
                            data-autosize='true'
                            rows={4}
                            placeholder='Liste seus serviços, valores e observações'
                            className='min-h-24 resize-none overflow-hidden'
                            onInput={(e) =>
                              autosizeTextarea(
                                e.currentTarget as HTMLTextAreaElement,
                              )
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}

              {/* STEP 3 */}
              {step === 3 ? (
                <div className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='extraNotes'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações extras</FormLabel>
                        <FormControl>
                          <Textarea
                            data-autosize='true'
                            rows={3}
                            placeholder='Ex: horário de atendimento, endereço, links, detalhes...'
                            className='min-h-21 resize-none overflow-hidden'
                            onInput={(e) =>
                              autosizeTextarea(
                                e.currentTarget as HTMLTextAreaElement,
                              )
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='domain'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domínio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Ex: meusite.com (se já tiver) / se não tiver, pode deixar em branco'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Se você ainda não tem domínio, deixe vazio e nós
                          orientamos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className='rounded-lg border bg-background p-4 space-y-1'>
                    <p className='text-sm font-semibold'>Revisão rápida</p>
                    <p className='text-sm text-muted-foreground'>
                      Ao clicar em “Enviar briefing”, nossa equipe inicia a
                      execução. Você poderá revisar/atualizar depois, se
                      necessário.
                    </p>
                  </div>
                </div>
              ) : null}

              <Separator />

              <div className='grid gap-2 sm:grid-cols-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={prev}
                  disabled={step === 0 || submitting}
                  className='w-full'
                >
                  Voltar
                </Button>

                {step < STEPS.length - 1 ? (
                  <Button
                    type='button'
                    onPointerDown={() => {
                      submitIntentRef.current = 'next';
                    }}
                    onClick={() => void next()}
                    disabled={submitting}
                    className='w-full'
                  >
                    Continuar
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    onPointerDown={() => {
                      submitIntentRef.current = 'submit';
                    }}
                    disabled={submitting}
                    className='w-full'
                  >
                    {submitting ? (
                      <span className='inline-flex items-center justify-center gap-2'>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Enviando…
                      </span>
                    ) : (
                      'Enviar briefing'
                    )}
                  </Button>
                )}
              </div>

              <p className='text-xs text-muted-foreground'>
                Dica: quanto mais detalhes você colocar (referências/serviços),
                mais precisa fica a primeira entrega.
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  );
};
