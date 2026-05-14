import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { DashboardRangeProvider } from './context/DashboardRangeProvider';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CampaignAnalyticsPage } from './pages/CampaignAnalyticsPage';
import { CampaignDetailPage } from './pages/CampaignDetailPage';
import { RevenueAnalyticsPage } from './pages/RevenueAnalyticsPage';
import { FunnelAnalyticsPage } from './pages/FunnelAnalyticsPage';
import { ChannelAnalyticsPage } from './pages/ChannelAnalyticsPage';
import { DeviceAnalyticsPage } from './pages/DeviceAnalyticsPage';
import { CountryAnalyticsPage } from './pages/CountryAnalyticsPage';
import { SubmissionAnalyticsPage } from './pages/SubmissionAnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DashboardRangeProvider>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/campaigns" element={<CampaignAnalyticsPage />} />
              <Route
                path="/campaigns/:campaignId"
                element={<CampaignDetailPage />}
              />
              <Route path="/revenue" element={<RevenueAnalyticsPage />} />
              <Route path="/funnel" element={<FunnelAnalyticsPage />} />
              <Route path="/channels" element={<ChannelAnalyticsPage />} />
              <Route path="/devices" element={<DeviceAnalyticsPage />} />
              <Route path="/countries" element={<CountryAnalyticsPage />} />
              <Route
                path="/submissions"
                element={<SubmissionAnalyticsPage />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </DashboardRangeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
