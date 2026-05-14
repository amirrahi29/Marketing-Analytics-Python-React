import { createContext } from 'react';
import type { DatePreset } from '../utils/dateRange';

export interface DashboardRange {
  preset: DatePreset;
  from: Date;
  to: Date;
}

export const DashboardRangeContext = createContext<{
  range: DashboardRange;
  setPreset: (p: DatePreset) => void;
} | null>(null);
