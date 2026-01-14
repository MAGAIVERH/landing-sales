import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { LeadMessagePreview } from '../components/lead-message-preview';
import { LeadRowActions } from '../components/lead-row-actions';
import { LeadStatusSelect } from '../components/lead-status-select';
import type { LeadRow, LeadsPageData } from './leads.types';
import { formatDateTime } from './leads.utils';

export const LeadsPage = ({
  q,
  status,
  openLeads,
  doneLeads,
}: LeadsPageData) => {
  const renderTable = (rows: LeadRow[], isDoneSection: boolean) => {
    return (
      <div className='w-full overflow-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-muted/40 text-left'>
            <tr>
              <th className='px-4 py-3 font-medium'>Contato</th>
              <th className='px-4 py-3 font-medium'>Mensagem</th>
              <th className='px-4 py-3 font-medium'>Status</th>
              <th className='px-4 py-3 font-medium'>Data</th>
              <th className='px-4 py-3 font-medium text-right'>Ações</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className='px-4 py-8 text-center text-sm text-muted-foreground'
                >
                  Nenhum lead encontrado.
                </td>
              </tr>
            ) : (
              rows.map((lead) => {
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
                      <LeadMessagePreview message={msgPreview} />
                    </td>

                    <td className='px-4 py-3'>
                      <LeadStatusSelect
                        leadId={lead.id}
                        defaultStatus={lead.status as any}
                        className='w-42.5'
                      />
                    </td>

                    <td className='px-4 py-3 text-muted-foreground'>
                      {formatDateTime(lead.createdAt)}
                    </td>

                    <td className='px-4 py-3'>
                      <div className='flex justify-end'>
                        <LeadRowActions
                          isDone={isDoneSection}
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
    );
  };

  return (
    <main className='mx-auto w-full max-w-7xl'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-xl font-semibold'>Leads</h1>
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
              <option value='NEW'>Novo</option>
              <option value='CONTACTED'>Contatado</option>
              <option value='QUALIFIED'>Qualificado</option>
              <option value='WON'>Vendido</option>
              <option value='LOST'>Perdido</option>
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
          <div className='flex items-center justify-between gap-3 px-4'>
            <div className='space-y-1'>
              <p className='text-sm font-semibold'>Leads</p>
              <p className='text-xs text-muted-foreground'>
                Ativos: {openLeads.length} • Concluídos: {doneLeads.length}
              </p>
            </div>

            {q || status ? (
              <Button asChild variant='outline' className='h-9'>
                <a href='/admin/leads'>Limpar filtros</a>
              </Button>
            ) : null}
          </div>

          <Separator />

          {renderTable(openLeads, false)}

          <Separator />

          <div className='p-4'>
            <p className='text-sm font-semibold'>Concluídos</p>
            <p className='text-xs text-muted-foreground'>
              Leads marcados como feitos (você pode reabrir).
            </p>
          </div>

          {renderTable(doneLeads, true)}
        </Card>
      </div>
    </main>
  );
};
