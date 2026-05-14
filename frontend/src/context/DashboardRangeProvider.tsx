import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  rangeFromPreset,
  type DatePreset,
} from '../utils/dateRange';
import { DashboardRangeContext } from './dashboard-range-context';

export function DashboardRangeProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<DatePreset>('30d');

  const range = useMemo(() => {
    const { from, to } = rangeFromPreset(preset);
    return { preset, from, to };
  }, [preset]);

  const setPreset = useCallback((p: DatePreset) => {
    setPresetState(p);
  }, []);

  const value = useMemo(() => ({ range, setPreset }), [range, setPreset]);

  return (
    <DashboardRangeContext.Provider value={value}>
      {children}
    </DashboardRangeContext.Provider>
  );
}
