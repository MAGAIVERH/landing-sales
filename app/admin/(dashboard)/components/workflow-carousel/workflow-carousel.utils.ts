import type { UpsellItem } from './workflow-carousel.types';

export const MAX_COLLAPSED = 4;

export const STEP_DEFAULT = 4;
export const MAX_VISIBLE_DEFAULT = 20;

export const PAGE_SIZE_UPSELL = 20;

export const upsellBadge = (tag: UpsellItem['tag']) => {
  if (tag === 'PENDING') {
    return {
      label: 'Pendente',
      className: 'border-amber-200 bg-amber-50 text-amber-900',
    };
  }

  return {
    label: 'Não contratou',
    className: 'border-muted bg-muted/40 text-muted-foreground',
  };
};

export const canPaginateDefault = (len: number, visibleCount: number) =>
  visibleCount >= MAX_VISIBLE_DEFAULT && len > MAX_VISIBLE_DEFAULT;

export const totalPagesDefault = (len: number) =>
  Math.max(1, Math.ceil(len / MAX_VISIBLE_DEFAULT));

export const sliceForDefaultTab = <T>(
  items: T[],
  visibleCount: number,
  pageDefault: number,
) => {
  const start = canPaginateDefault(items.length, visibleCount)
    ? pageDefault * MAX_VISIBLE_DEFAULT
    : 0;

  return items.slice(start, start + visibleCount);
};

export const canShowMoreDefault = (len: number, visibleCount: number) =>
  len > visibleCount && visibleCount < MAX_VISIBLE_DEFAULT;

export const canShowLessDefault = (visibleCount: number) =>
  visibleCount > MAX_COLLAPSED;

export const totalPagesUpsell = (len: number) =>
  Math.max(1, Math.ceil(len / PAGE_SIZE_UPSELL));

export const sliceForUpsell = <T>(
  items: T[],
  expandedUpsell: boolean,
  pageUpsell: number,
) => {
  if (!expandedUpsell) return items.slice(0, MAX_COLLAPSED);

  const start = pageUpsell * PAGE_SIZE_UPSELL;
  return items.slice(start, start + PAGE_SIZE_UPSELL);
};
