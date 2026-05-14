export interface GeneralSummary {
  Email_sent: number;
  Email_delivered: number;
  Email_delivery_rate: number;
  Email_opened: number;
  Email_open_rate: number;
  Email_clicked: number;
  Email_click_percentage: number;
  Email_unsubscribed: number;
  Email_Bounced: number;
  revenue: number;
}

export type ChannelMix = Record<string, string>;

export interface FunnelStep {
  count: number;
  percentage: string;
}

export interface DeliverFunnel {
  sent: FunnelStep;
  delivered: FunnelStep;
  opened: FunnelStep;
  clicked: FunnelStep;
  bounced: FunnelStep;
  revenue: number;
}

export interface GeneralTrendRow {
  'Email sent date': string;
  'Email sent': number;
  'Email delivered': number;
  'Email opened': number;
  'Email clicked': number;
  revenue: number;
}

export interface RevenueTrendRow {
  date: string;
  revenue: number;
}

export interface CampaignRow {
  campaign_id: string;
  campaign_name: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  bounced: number;
  revenue: number;
}

export interface GeneralCampaignResponse {
  total_campaigns: number;
  data: CampaignRow[];
}

export type CampaignDetailRow = Record<string, string | number>;

export interface TopCampaignRow {
  campaign_id: string;
  campaign_name: string;
  revenue: number;
}

export interface CountryAnalyticRow {
  country_code: string;
  revenue: number;
  total: number;
}

export interface DeviceAnalyticRow {
  device: string;
  revenue: number;
  total: number;
}

export interface SubmissionChannelRow {
  channel: string;
  delivered: number;
  submitted: number;
  submission_rate: number;
}

export interface SubmissionCountryRow {
  country_code: string;
  delivered: number;
  submitted: number;
  submission_rate: number;
}

export interface SubmissionRateResponse {
  by_channel: SubmissionChannelRow[];
  by_country: SubmissionCountryRow[];
}
