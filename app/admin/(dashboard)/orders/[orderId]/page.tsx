import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  Pencil,
  User,
  Globe,
  Phone,
  Mail,
  Instagram,
  Image as ImageIcon,
  Palette,
  StickyNote,
} from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const formatBRL = (cents: number) => {
  const value = cents / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const isoDate = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : '-');

const isPlainObject = (v: unknown): v is Record<string, unknown> => {
  if (!v) return false;
  if (Array.isArray(v)) return false;
  return typeof v === 'object';
};

const getBriefingPayload = (briefing: unknown) => {
  const b = briefing as any;
  if (!b) return null;

  return (
    b.data ??
    b.payload ??
    b.answers ??
    b.form ??
    b.content ??
    b.snapshot ??
    b.fields ??
    b
  );
};

const normalizeUrl = (value?: string) => {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://${v}`;
};

const clean = (v: unknown) => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') {
    const x = v.trim();
    return x.length ? x : null;
  }
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'boolean') return v;
  if (Array.isArray(v)) return v.length ? v : null;
  if (isPlainObject(v)) return Object.keys(v).length ? v : null;
  return v;
};

const pick = (obj: Record<string, unknown>, keys: string[]) => {
  for (const k of keys) {
    const v = clean(obj[k]);
    if (v !== null) return v;
  }
  return null;
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => {
  return (
    <div className='flex items-start justify-between gap-4 rounded-xl border bg-card px-3 py-3'>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <div className='min-w-0 text-right'>
        <div className='text-sm font-medium text-foreground'>{value}</div>
      </div>
    </div>
  );
};

const SectionCard = ({
  title,
  subtitle,
  icon: Icon,
  children,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) => {
  return (
    <Card className='rounded-2xl border bg-card shadow-sm'>
      <div className='flex items-start justify-between gap-3 p-4 sm:p-5'>
        <div className='flex items-start gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40'>
            <Icon className='h-5 w-5 text-foreground/80' />
          </div>

          <div className='min-w-0'>
            <p className='text-sm font-semibold'>{title}</p>
            {subtitle ? (
              <p className='mt-1 text-xs text-muted-foreground'>{subtitle}</p>
            ) : null}
          </div>
        </div>

        {rightSlot ? <div className='shrink-0'>{rightSlot}</div> : null}
      </div>

      <Separator />

      <div className='p-4 sm:p-5'>{children}</div>
    </Card>
  );
};

const Empty = ({ text }: { text: string }) => (
  <div className='rounded-xl border bg-muted/20 px-3 py-2'>
    <p className='text-sm text-muted-foreground'>{text}</p>
  </div>
);

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      lead: true,
      briefing: true,
      price: { include: { product: true } },
    },
  });

  if (!order) notFound();

  const customerEmail = order.customerEmail ?? order.lead?.email ?? 'sem email';
  const customerPhone = order.lead?.phone ?? '';
  const productName = order.price?.product?.name ?? 'Produto';
  const total = formatBRL(order.amountTotal);

  const briefing = order.briefing as any;
  const briefingStatus = briefing?.status ?? (briefing ? 'OK' : '—');

  const payload = getBriefingPayload(briefing);
  const data = isPlainObject(payload)
    ? (payload as Record<string, unknown>)
    : null;

  // ===== MAPEAMENTO PARA “ADMIN READ MODE” (labels humanas) =====
  const contactName = data
    ? (pick(data, ['contactName', 'name', 'ownerName', 'fullName']) as
        | string
        | null)
    : null;
  const businessName = data
    ? (pick(data, ['businessName', 'companyName', 'brandName']) as
        | string
        | null)
    : null;
  const niche = data
    ? (pick(data, ['niche', 'segment', 'specialty']) as string | null)
    : null;

  const email = data
    ? (pick(data, ['email', 'contactEmail']) as string | null)
    : null;
  const whatsapp = data
    ? (pick(data, ['whatsapp', 'phone', 'contactPhone']) as string | null)
    : null;
  const phone = data
    ? (pick(data, ['phone', 'telephone', 'contactPhone']) as string | null)
    : null;

  const contactPreference = data
    ? (pick(data, ['contactPreference', 'preferredContact']) as string | null)
    : null;

  const instagram = data
    ? (pick(data, ['instagram', 'insta']) as string | null)
    : null;
  const currentWebsite = data
    ? (pick(data, ['currentWebsite', 'domain', 'website', 'site']) as
        | string
        | null)
    : null;

  const logoUrl = data
    ? (pick(data, ['logoUrl', 'logo', 'logoURL']) as string | null)
    : null;
  const colors = data ? pick(data, ['colors', 'brandColors']) : null;

  const address = data
    ? (pick(data, ['address', 'cityState', 'location']) as string | null)
    : null;

  const references = data
    ? pick(data, ['references', 'referenceSites', 'inspirations'])
    : null;
  const services = data ? pick(data, ['services', 'products', 'menu']) : null;

  const extraNotes = data
    ? (pick(data, ['extraNotes', 'notes', 'observations']) as string | null)
    : null;

  const instagramUrl =
    instagram && instagram.startsWith('@')
      ? `https://instagram.com/${instagram.slice(1)}`
      : instagram
      ? normalizeUrl(
          instagram.includes('instagram.com')
            ? instagram
            : `instagram.com/${instagram.replace('@', '')}`,
        )
      : null;

  const websiteUrl = currentWebsite ? normalizeUrl(currentWebsite) : null;
  const logoHref = logoUrl ? normalizeUrl(logoUrl) : null;

  return (
    <div className='grid gap-6'>
      {/* Top bar */}
      <Card className='rounded-2xl border border-primary/15 bg-primary/5 p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='secondary'>Pedido</Badge>
              <Badge variant='outline' className='truncate'>
                {order.id}
              </Badge>

              {briefing ? (
                <Badge
                  variant='secondary'
                  className='bg-primary/10 text-primary'
                >
                  Briefing: {String(briefingStatus)}
                </Badge>
              ) : (
                <Badge variant='secondary'>Sem briefing</Badge>
              )}

              {niche ? <Badge variant='outline'>{niche}</Badge> : null}
            </div>

            <h1 className='mt-3 text-xl font-semibold tracking-tight'>
              {customerEmail} • {productName}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Tela administrativa de leitura. Aqui você consulta o briefing sem
              risco de editar.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Link href='/admin'>
              <Button variant='outline' className='h-9 gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Dashboard
              </Button>
            </Link>

            <Link href='/admin/orders'>
              <Button variant='outline' className='h-9 gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Pedidos
              </Button>
            </Link>

            <Link href={`/onboarding?orderId=${order.id}`}>
              <Button className='h-9 gap-2' variant='secondary'>
                <Pencil className='h-4 w-4' />
                Editar briefing
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Resumo do pedido */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <SectionCard
          title='Resumo'
          subtitle='Pedido e cliente.'
          icon={CreditCard}
        >
          <div className='grid gap-2'>
            <Row label='Cliente' value={customerEmail} />
            <Row label='Telefone (lead)' value={customerPhone || '-'} />
            <Row label='Produto' value={productName} />
            <Row label='Total' value={total} />
            <Row label='Status do pedido' value={order.status} />
            <Row label='Pago em' value={isoDate(order.paidAt)} />
          </div>
        </SectionCard>

        <SectionCard
          title='Ação'
          subtitle='Próximo passo para produção.'
          icon={CheckCircle2}
        >
          <div className='grid gap-2'>
            <div className='rounded-xl border bg-muted/20 px-3 py-3'>
              <p className='text-sm font-medium'>Fluxo recomendado</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Leia o briefing aqui. Só use “Editar briefing” se precisar
                corrigir algo.
              </p>
            </div>

            <Link href='/admin'>
              <Button className='h-10 w-full gap-2'>
                Voltar ao dashboard <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </SectionCard>

        <SectionCard
          title='Briefing'
          subtitle='Status do onboarding.'
          icon={ClipboardList}
        >
          <div className='grid gap-2'>
            <Row label='Status' value={String(briefingStatus)} />
            <Row label='Criado em' value={isoDate(briefing?.createdAt)} />
            <Row label='Atualizado em' value={isoDate(briefing?.updatedAt)} />
          </div>
        </SectionCard>
      </div>

      {/* Briefing - modo leitura, organizado */}
      <div className='grid gap-4 lg:grid-cols-2'>
        <SectionCard
          title='Identidade'
          subtitle='Quem é o cliente e qual negócio é.'
          icon={User}
        >
          {!briefing ? (
            <Empty text='Sem briefing disponível.' />
          ) : (
            <div className='grid gap-2'>
              {contactName ? (
                <Row label='Nome do contato' value={contactName} />
              ) : null}
              {businessName ? (
                <Row label='Nome do negócio' value={businessName} />
              ) : null}
              {niche ? (
                <Row
                  label='Nicho / especialidade'
                  value={<Badge variant='secondary'>{niche}</Badge>}
                />
              ) : null}
              {address ? <Row label='Localidade' value={address} /> : null}

              {!contactName && !businessName && !niche && !address ? (
                <Empty text='Nenhuma informação de identidade preenchida.' />
              ) : null}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title='Contato'
          subtitle='Como falar com o cliente.'
          icon={Phone}
          rightSlot={
            contactPreference ? (
              <Badge variant='secondary'>
                {String(contactPreference).toUpperCase()}
              </Badge>
            ) : null
          }
        >
          {!briefing ? (
            <Empty text='Sem briefing disponível.' />
          ) : (
            <div className='grid gap-2'>
              {email ? (
                <Row
                  label='E-mail'
                  value={
                    <a className='hover:underline' href={`mailto:${email}`}>
                      {email}
                    </a>
                  }
                />
              ) : null}

              {whatsapp ? (
                <Row label='WhatsApp' value={String(whatsapp)} />
              ) : null}
              {phone ? <Row label='Telefone' value={String(phone)} /> : null}

              {!email && !whatsapp && !phone ? (
                <Empty text='Nenhum contato preenchido.' />
              ) : null}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title='Presença online'
          subtitle='Links úteis para referência.'
          icon={Globe}
        >
          {!briefing ? (
            <Empty text='Sem briefing disponível.' />
          ) : (
            <div className='grid gap-2'>
              {websiteUrl ? (
                <Row
                  label='Site atual / domínio'
                  value={
                    <a
                      className='hover:underline'
                      href={websiteUrl}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {currentWebsite}
                    </a>
                  }
                />
              ) : null}

              {instagramUrl ? (
                <Row
                  label='Instagram'
                  value={
                    <a
                      className='inline-flex items-center gap-2 hover:underline'
                      href={instagramUrl}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Instagram className='h-4 w-4' />
                      {instagram}
                    </a>
                  }
                />
              ) : null}

              {references ? (
                <Row
                  label='Referências'
                  value={
                    Array.isArray(references) ? (
                      <span className='text-sm'>{references.join(', ')}</span>
                    ) : (
                      <span className='text-sm'>{String(references)}</span>
                    )
                  }
                />
              ) : null}

              {!websiteUrl && !instagramUrl && !references ? (
                <Empty text='Nenhuma presença online informada.' />
              ) : null}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title='Marca'
          subtitle='Elementos de identidade visual.'
          icon={Palette}
        >
          {!briefing ? (
            <Empty text='Sem briefing disponível.' />
          ) : (
            <div className='grid gap-2'>
              {logoHref ? (
                <Row
                  label='Logo'
                  value={
                    <a
                      className='inline-flex items-center gap-2 hover:underline'
                      href={logoHref}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <ImageIcon className='h-4 w-4' />
                      Abrir logo
                    </a>
                  }
                />
              ) : null}

              {colors ? (
                <Row
                  label='Cores'
                  value={
                    Array.isArray(colors) ? (
                      <span className='text-sm'>{colors.join(', ')}</span>
                    ) : (
                      <span className='text-sm'>{String(colors)}</span>
                    )
                  }
                />
              ) : null}

              {!logoHref && !colors ? (
                <Empty text='Marca ainda não informada.' />
              ) : null}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title='Observações e escopo'
        subtitle='O que influencia a entrega.'
        icon={StickyNote}
      >
        {!briefing ? (
          <Empty text='Sem briefing disponível.' />
        ) : (
          <div className='grid gap-2'>
            {services ? (
              <Row
                label='Serviços / produtos'
                value={
                  Array.isArray(services) ? (
                    <span className='text-sm'>{services.join(', ')}</span>
                  ) : (
                    <span className='text-sm'>{String(services)}</span>
                  )
                }
              />
            ) : null}

            {extraNotes ? (
              <Row label='Notas do cliente' value={extraNotes} />
            ) : null}

            {!services && !extraNotes ? (
              <Empty text='Sem observações adicionais.' />
            ) : null}
          </div>
        )}
      </SectionCard>

      {/* Rodapé */}
      <Card className='rounded-2xl border bg-card p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <FileText className='h-4 w-4' />
            <span className='truncate'>
              {customerEmail} • {productName} • {total}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <Link href='/admin/orders'>
              <Button variant='outline' className='h-9'>
                Voltar para pedidos
              </Button>
            </Link>
            <Link href='/admin'>
              <Button className='h-9'>Dashboard</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
