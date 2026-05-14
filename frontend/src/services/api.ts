import axios from 'axios';
import type {
  ChannelMix,
  CampaignDetailRow,
  CountryAnalyticRow,
  DeliverFunnel,
  DeviceAnalyticRow,
  GeneralCampaignResponse,
  GeneralSummary,
  GeneralTrendRow,
  RevenueTrendRow,
  SubmissionRateResponse,
  TopCampaignRow,
} from '../types/api';

export const API_BASE = 'http://127.0.0.1:5001';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 60_000,
});

export const api = {
  getGeneralSummary: () =>
    client.get<GeneralSummary>(
      '/api/copilot/journey/measurement/generalsummary',
    ),

  getChannelMix: () =>
    client.get<ChannelMix>('/api/copilot/journey/measurement/channelmix'),

  getDeliverFunnel: () =>
    client.get<DeliverFunnel>(
      '/api/copilot/journey/measurement/deliverfunnel',
    ),

  getGeneralTrend: () =>
    client.get<GeneralTrendRow[]>(
      '/api/copilot/journey/measurement/generaltrend',
    ),

  getRevenueTrend: () =>
    client.get<RevenueTrendRow[]>(
      '/api/copilot/journey/measurement/revenuetrend',
    ),

  getGeneralCampaign: () =>
    client.get<GeneralCampaignResponse>(
      '/api/copilot/journey/measurement/generalcampaign',
    ),

  getCampaignDetail: (campaignId: string) =>
    client.get<CampaignDetailRow[]>(
      `/api/copilot/journey/measurement/generalcampaign/${encodeURIComponent(campaignId)}`,
    ),

  getTopCampaigns: () =>
    client.get<TopCampaignRow[]>(
      '/api/copilot/journey/measurement/topcampaigns',
    ),

  getCountryAnalytics: () =>
    client.get<CountryAnalyticRow[]>(
      '/api/copilot/journey/measurement/countryanalytics',
    ),

  getDeviceAnalytics: () =>
    client.get<DeviceAnalyticRow[]>(
      '/api/copilot/journey/measurement/deviceanalytics',
    ),

  getSubmissionRate: () =>
    client.get<SubmissionRateResponse>('/api/submission_rate'),
};

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}
