export type ReportInfo = {
  title: string;
  subtitle: string;
  dateRange: string;
  generatedAt: string;
  classification: string;
};

export type SummaryMetric = {
  id: number;
  label: string;
  value: string | number;
  hint?: string;
};

export type HighlightItem = {
  id: number;
  title: string;
  description: string;
  tone: "good" | "warning" | "neutral";
};

export type SeverityItem = {
  name: string;
  value: number;
  color: string;
};

export type ComparisonCard = {
  id: number;
  title: string;
  current: number;
  previous: number | null;
  diff: number | null;
};

export type AssetRiskRow = {
  id: number;
  taskId: string;
  taskName: string;
  hostIp: string;
  detectedDate: string;
  agingDay: number;
  vulnerabilityTotal: number;
  riskScore: number;
};

export type EndpointBarItem = {
  id: number;
  name: string;
  high: number;
  critical: number;
};

export type VulnerabilityRow = {
  id: number;
  vulnerabilityName: string;
  vulnerabilityFamily: string;
  level: "Critical" | "High" | "Medium" | "Low" | "Info";
  severity: number;
  total: number;
  affectedHosts: number;
};

export type DeviceExposureRow = {
  id: number;
  taskName: string;
  ipAddress: string;
  firmwareVersion: string;
  riskScore: number;
  vulnerabilityTotal: number;
};

export type RecommendationItem = {
  id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
};