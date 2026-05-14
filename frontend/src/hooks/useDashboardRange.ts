import { useContext } from 'react';
import { DashboardRangeContext } from '../context/dashboard-range-context';

export function useDashboardRange() {
  const ctx = useContext(DashboardRangeContext);
  if (!ctx) {
    throw new Error('useDashboardRange must be used within provider');
  }
  return ctx;
}

export type { DashboardRange } from '../context/dashboard-range-context';
