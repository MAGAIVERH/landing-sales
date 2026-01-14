import { prisma } from '@/lib/prisma';

import type {
  AdminSearchParamsRecord,
  LeadsPageData,
  LeadRow,
} from './leads.types';
import { normalizeLeadStatus, pick } from './leads.utils';

export const getLeadsPageData = async (
  sp: AdminSearchParamsRecord,
): Promise<LeadsPageData> => {
  const q = pick(sp, 'q').trim();
  const status = normalizeLeadStatus(pick(sp, 'status'));

  const leadsRaw = (await prisma.lead.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
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
    take: 200,
  })) as LeadRow[];

  const leadIds = leadsRaw.map((l) => l.id);

  const workItems = leadIds.length
    ? await prisma.adminWorkItem.findMany({
        where: { kind: 'LEAD', refId: { in: leadIds } },
        select: { refId: true, status: true, doneAt: true },
      })
    : [];

  const doneMap = new Map<string, boolean>();
  for (const wi of workItems) {
    doneMap.set(wi.refId, wi.status === 'DONE' || Boolean(wi.doneAt));
  }

  const openLeads = leadsRaw
    .filter((l) => !(doneMap.get(l.id) ?? false))
    .slice(0, 50);

  const doneLeads = leadsRaw
    .filter((l) => doneMap.get(l.id) ?? false)
    .slice(0, 50);

  return {
    q,
    status,
    openLeads,
    doneLeads,
  };
};
