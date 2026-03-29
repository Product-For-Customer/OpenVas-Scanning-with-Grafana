import type {
  AssetRiskRow,
  ComparisonCard,
  DeviceExposureRow,
  EndpointBarItem,
  HighlightItem,
  RecommendationItem,
  ReportInfo,
  SeverityItem,
  SummaryMetric,
  VulnerabilityRow,
} from "./type";

export const reportInfo: ReportInfo = {
  title: "Network Vulnerability Assessment Report",
  subtitle:
    "Executive summary of scan coverage, vulnerability severity, asset risk exposure, device exposure, and comparison against the previous assessment.",
  dateRange: "2026-03-01 00:00:00 - 2026-03-31 23:59:59",
  generatedAt: "2026-03-31 23:45:00",
  classification: "Internal Use Only",
};

export const summaryMetrics: SummaryMetric[] = [
  { id: 1, label: "Total Tasks", value: 24, hint: "Based on task status summary" },
  { id: 2, label: "Scanned Hosts", value: 186, hint: "Distinct host coverage" },
  { id: 3, label: "Total Findings", value: "1,819", hint: "Latest snapshot only" },
  { id: 4, label: "Critical Findings", value: 292, hint: "Severity >= 9" },
  { id: 5, label: "Average Risk Score", value: "6.84", hint: "AVG severity > 0" },
  { id: 6, label: "Aged Assets", value: 37, hint: "Assets with aging > 20 days" },
];

export const executiveHighlights: HighlightItem[] = [
  {
    id: 1,
    title: "Critical findings decreased from the previous assessment",
    description:
      "The latest scan shows fewer critical issues than the previous version, indicating partial remediation progress in high-priority assets.",
    tone: "good",
  },
  {
    id: 2,
    title: "Several hosts still remain high risk for more than 30 days",
    description:
      "Aging data suggests that some important assets still contain unresolved findings and should be prioritized for remediation.",
    tone: "warning",
  },
  {
    id: 3,
    title: "Device exposure remains concentrated in a small number of systems",
    description:
      "The highest-risk hosts and firmware versions account for a significant portion of total exposure, making targeted remediation practical.",
    tone: "neutral",
  },
];

export const endpointSeverity: SeverityItem[] = [
  { name: "Critical", value: 292, color: "#dc2626" },
  { name: "High", value: 1419, color: "#f59e0b" },
  { name: "Medium", value: 267, color: "#eab308" },
  { name: "Low", value: 52, color: "#3b82f6" },
  { name: "Info", value: 190, color: "#64748b" },
];

export const comparisonCards: ComparisonCard[] = [
  { id: 1, title: "Total Findings", current: 1819, previous: 1940, diff: -121 },
  { id: 2, title: "Critical Findings", current: 292, previous: 331, diff: -39 },
  { id: 3, title: "High Findings", current: 1419, previous: 1492, diff: -73 },
  { id: 4, title: "Average Risk Score", current: 6.84, previous: 7.21, diff: -0.37 },
];

export const windowsEndpoints: EndpointBarItem[] = [
  { id: 1, name: "WIN-DC-01", high: 58, critical: 6 },
  { id: 2, name: "WIN-APP-02", high: 52, critical: 2 },
  { id: 3, name: "WIN-FILE-01", high: 41, critical: 11 },
  { id: 4, name: "WIN-USER-14", high: 39, critical: 9 },
  { id: 5, name: "WIN-USER-09", high: 34, critical: 7 },
];

export const linuxEndpoints: EndpointBarItem[] = [
  { id: 1, name: "LIN-WEB-01", high: 72, critical: 46 },
  { id: 2, name: "LIN-DB-01", high: 74, critical: 11 },
  { id: 3, name: "LIN-APP-01", high: 29, critical: 7 },
  { id: 4, name: "LIN-APP-03", high: 25, critical: 6 },
  { id: 5, name: "LIN-BASTION", high: 18, critical: 9 },
];

export const macEndpoints: EndpointBarItem[] = [
  { id: 1, name: "MAC-Design-01", high: 21, critical: 0 },
  { id: 2, name: "MAC-Design-02", high: 1, critical: 3 },
  { id: 3, name: "MAC-HR-01", high: 2, critical: 2 },
  { id: 4, name: "MAC-CEO-01", high: 1, critical: 2 },
  { id: 5, name: "MAC-FIN-01", high: 1, critical: 2 },
];

export const assetRiskRows: AssetRiskRow[] = [
  {
    id: 1,
    taskId: "12",
    taskName: "Core Network Scan",
    hostIp: "10.10.10.1",
    detectedDate: "2026-03-30",
    agingDay: 29,
    vulnerabilityTotal: 46,
    riskScore: 9.1,
  },
  {
    id: 2,
    taskId: "18",
    taskName: "Firewall Security Scan",
    hostIp: "10.10.20.1",
    detectedDate: "2026-03-31",
    agingDay: 21,
    vulnerabilityTotal: 38,
    riskScore: 8.8,
  },
  {
    id: 3,
    taskId: "8",
    taskName: "Distribution Layer Scan",
    hostIp: "10.10.30.3",
    detectedDate: "2026-03-29",
    agingDay: 18,
    vulnerabilityTotal: 35,
    riskScore: 8.2,
  },
  {
    id: 4,
    taskId: "4",
    taskName: "Wireless Controller Scan",
    hostIp: "10.10.40.10",
    detectedDate: "2026-03-27",
    agingDay: 14,
    vulnerabilityTotal: 28,
    riskScore: 7.9,
  },
  {
    id: 5,
    taskId: "15",
    taskName: "Server Security Scan",
    hostIp: "10.10.50.25",
    detectedDate: "2026-03-25",
    agingDay: 30,
    vulnerabilityTotal: 25,
    riskScore: 7.6,
  },
];

export const topVulnerabilities: VulnerabilityRow[] = [
  {
    id: 1,
    vulnerabilityName: "SNMP Default Community Names",
    vulnerabilityFamily: "SNMP",
    level: "Critical",
    severity: 9.8,
    total: 29,
    affectedHosts: 14,
  },
  {
    id: 2,
    vulnerabilityName: "TLS Weak Cipher Suites Supported",
    vulnerabilityFamily: "General",
    level: "High",
    severity: 8.4,
    total: 61,
    affectedHosts: 27,
  },
  {
    id: 3,
    vulnerabilityName: "SSH Weak MAC Algorithms Enabled",
    vulnerabilityFamily: "SSH",
    level: "High",
    severity: 7.9,
    total: 41,
    affectedHosts: 21,
  },
  {
    id: 4,
    vulnerabilityName: "Web Server Uses Deprecated Protocol",
    vulnerabilityFamily: "Web Servers",
    level: "High",
    severity: 7.6,
    total: 18,
    affectedHosts: 11,
  },
  {
    id: 5,
    vulnerabilityName: "ICMP Timestamp Reply Information Disclosure",
    vulnerabilityFamily: "Firewall",
    level: "Medium",
    severity: 5.3,
    total: 55,
    affectedHosts: 39,
  },
];

export const deviceExposureRows: DeviceExposureRow[] = [
  {
    id: 1,
    taskName: "Firewall Security Scan",
    ipAddress: "10.10.20.1",
    firmwareVersion: "FortiGate 7.0.x",
    riskScore: 8.8,
    vulnerabilityTotal: 38,
  },
  {
    id: 2,
    taskName: "Core Network Scan",
    ipAddress: "10.10.10.1",
    firmwareVersion: "Cisco IOS XE 17.x",
    riskScore: 9.1,
    vulnerabilityTotal: 46,
  },
  {
    id: 3,
    taskName: "Wireless Controller Scan",
    ipAddress: "10.10.40.10",
    firmwareVersion: "ArubaOS 8.x",
    riskScore: 7.9,
    vulnerabilityTotal: 28,
  },
  {
    id: 4,
    taskName: "Distribution Layer Scan",
    ipAddress: "10.10.30.3",
    firmwareVersion: "H3C Comware 7",
    riskScore: 8.2,
    vulnerabilityTotal: 35,
  },
];

export const recommendations: RecommendationItem[] = [
  {
    id: 1,
    title: "Prioritize hosts with both high risk score and long aging",
    description:
      "Assets that remain unresolved for a long period while still carrying high average severity should be remediated first.",
    priority: "High",
  },
  {
    id: 2,
    title: "Review repeated SNMP and weak crypto exposures",
    description:
      "Recurring vulnerabilities in SNMP, TLS, and SSH suggest a need for stronger hardening standards across network devices.",
    priority: "High",
  },
  {
    id: 3,
    title: "Track latest-versus-previous scan improvement monthly",
    description:
      "Use scan-to-scan comparison as an operational KPI to measure reduction in findings and risk over time.",
    priority: "Medium",
  },
];