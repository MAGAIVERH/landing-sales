import { prisma } from '@/lib/prisma';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { LeadRowActions } from './components/lead-row-actions';

export const dynamic = 'force-dynamic';

type AdminSearchParams = Promise<Record<string, string | string[] | undefined>>;

const pick = (sp: Record<string, any>, key: string) => {
  const v = sp?.[key];
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
};

const formatDateTime = (value: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(value);
};

const getSourceLabel = (landingPath?: string | null) => {
  if (!landingPath) return 'desconhecido';
  if (landingPath === '/budget') return 'Orçamento';
  if (landingPath === '/') return 'Hero';
  return landingPath.replace('/', '') || landingPath;
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: AdminSearchParams;
}) {
  const sp = await searchParams;

  const q = pick(sp, 'q').trim();
  const status = pick(sp, 'status').trim(); // NEW | CONTACTED | QUALIFIED | WON | LOST | ''

  const leads = await prisma.lead.findMany({
    where: {
      ...(status
        ? {
            status: status as any,
          }
        : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
              { phone: { contains: q, mode: 'insensitive' } },
              { message: { contains: q, mode: 'insensitive' } },
              { landingPath: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <main className='mx-auto w-full max-w-7xl px-4 py-8 md:px-8'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>Leads</h1>
        <p className='text-sm text-muted-foreground'>
          Triagem rápida para atendimento e follow-up.
        </p>
      </div>

      <Separator className='my-6' />

      <Card className='p-4'>
        <form
          className='grid gap-3 md:grid-cols-[1fr_220px_180px]'
          method='GET'
        >
          <div className='grid gap-2'>
            <span className='text-sm font-medium'>Buscar</span>
            <Input
              name='q'
              defaultValue={q}
              placeholder='Email, WhatsApp, nome, mensagem...'
              className='h-10'
            />
          </div>

          <div className='grid gap-2'>
            <span className='text-sm font-medium'>Status</span>
            <select
              name='status'
              defaultValue={status}
              className='h-10 rounded-md border bg-background px-3 text-sm'
            >
              <option value=''>Todos</option>
              <option value='NEW'>NEW</option>
              <option value='CONTACTED'>CONTACTED</option>
              <option value='QUALIFIED'>QUALIFIED</option>
              <option value='WON'>WON</option>
              <option value='LOST'>LOST</option>
            </select>
          </div>

          <div className='flex items-end'>
            <Button type='submit' className='h-10 w-full'>
              Aplicar
            </Button>
          </div>
        </form>
      </Card>

      <div className='mt-6'>
        <Card className='overflow-hidden'>
          <div className='flex items-center justify-between gap-3 p-4'>
            <div className='space-y-1'>
              <p className='text-sm font-semibold'>Últimos leads</p>
              <p className='text-xs text-muted-foreground'>
                Mostrando {leads.length} (máx. 50)
              </p>
            </div>

            {q || status ? (
              <Button asChild variant='outline' className='h-9'>
                <a href='/admin/leads'>Limpar filtros</a>
              </Button>
            ) : null}
          </div>

          <Separator />

          <div className='w-full overflow-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/40 text-left'>
                <tr>
                  <th className='px-4 py-3 font-medium'>Contato</th>
                  <th className='px-4 py-3 font-medium'>Mensagem</th>
                  <th className='px-4 py-3 font-medium'>Origem</th>
                  <th className='px-4 py-3 font-medium'>Status</th>
                  <th className='px-4 py-3 font-medium'>Data</th>
                  <th className='px-4 py-3 font-medium text-right'>Ações</th>
                </tr>
              </thead>

              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-4 py-8 text-center text-sm text-muted-foreground'
                    >
                      Nenhum lead encontrado.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const contact =
                      lead.name?.trim() ||
                      lead.email?.trim() ||
                      lead.phone?.trim() ||
                      'Sem identificação';

                    const msgPreview = (lead.message ?? '').trim();

                    return (
                      <tr key={lead.id} className='border-t align-top'>
                        <td className='px-4 py-3'>
                          <div className='space-y-1'>
                            <p className='font-medium'>{contact}</p>

                            <div className='space-y-0.5 text-xs text-muted-foreground'>
                              {lead.email ? <p>{lead.email}</p> : null}
                              {lead.phone ? <p>{lead.phone}</p> : null}
                            </div>
                          </div>
                        </td>

                        <td className='px-4 py-3'>
                          {msgPreview ? (
                            <p className='text-muted-foreground line-clamp-3 max-w-130'>
                              {msgPreview}
                            </p>
                          ) : (
                            <p className='text-muted-foreground'>
                              Sem mensagem
                            </p>
                          )}
                        </td>

                        <td className='px-4 py-3'>
                          <Badge variant='secondary'>
                            {getSourceLabel(lead.landingPath)}
                          </Badge>
                        </td>

                        <td className='px-4 py-3'>
                          <Badge>{lead.status}</Badge>
                        </td>

                        <td className='px-4 py-3 text-muted-foreground'>
                          {formatDateTime(lead.createdAt)}
                        </td>

                        <td className='px-4 py-3'>
                          <div className='flex justify-end'>
                            <LeadRowActions
                              lead={{
                                id: lead.id,
                                name: lead.name ?? '',
                                email: lead.email ?? '',
                                phone: lead.phone ?? '',
                                message: lead.message ?? '',
                                landingPath: lead.landingPath ?? '',
                                source: lead.source ?? '',
                                createdAt: lead.createdAt.toISOString(),
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
