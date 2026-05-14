import { useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { AnimatedOutlet } from '../components/AnimatedOutlet';

const titles: Record<string, string> = {
  '/': 'Rahi · Command',
  '/campaigns': 'Campaign performance',
  '/revenue': 'Revenue intelligence',
  '/funnel': 'Journey funnel',
  '/channels': 'Channel mix',
  '/devices': 'Device distribution',
  '/countries': 'Geo performance',
  '/submissions': 'Submission conversion',
};

export function DashboardLayout() {
  const [mobileNav, setMobileNav] = useState(false);
  const { pathname } = useLocation();

  const pageTitle = useMemo(() => {
    if (pathname.startsWith('/campaigns/')) return 'Campaign detail';
    return titles[pathname] ?? 'Analytics';
  }, [pathname]);

  return (
    <div className="app-canvas flex min-h-dvh bg-slate-50/94 dark:bg-[#030711]">
      <Sidebar open={mobileNav} onClose={() => setMobileNav(false)} />
      <div className="relative z-10 flex min-h-dvh min-w-0 flex-1 flex-col">
        <TopNavbar
          onOpenMenu={() => setMobileNav(true)}
          title={pageTitle}
        />
        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  );
}
