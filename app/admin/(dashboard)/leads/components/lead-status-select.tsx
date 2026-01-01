'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST';

type Props = {
  leadId: string;
  defaultStatus: LeadStatus;
  className?: string;
};

const statusLabel: Record<LeadStatus, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contatado',
  QUALIFIED: 'Qualificado',
  WON: 'Vendido',
  LOST: 'Perdido',
};

export const LeadStatusSelect = ({
  leadId,
  defaultStatus,
  className,
}: Props) => {
  const router = useRouter();
  const [value, setValue] = React.useState<LeadStatus>(defaultStatus);
  const [loading, setLoading] = React.useState(false);

  const onChange = async (next: string) => {
    const nextStatus = next as LeadStatus;
    const prev = value;

    setValue(nextStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json().catch(() => null);

      // Se o middleware bloquear (401 JSON sem ok) ou qualquer erro, reverte.
      if (!res.ok || !data?.ok) {
        setValue(prev);
        return;
      }

      router.refresh();
    } catch {
      setValue(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
      className={cn(
        'h-9 rounded-md border bg-background px-3 text-sm',
        loading ? 'opacity-70' : '',
        className,
      )}
    >
      {Object.keys(statusLabel).map((k) => {
        const key = k as LeadStatus;
        return (
          <option key={key} value={key}>
            {statusLabel[key]}
          </option>
        );
      })}
    </select>
  );
};
