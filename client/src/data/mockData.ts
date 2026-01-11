export interface WardData {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
  pmLevel: number;
  pm25: number;
  humidity: number;
  temperature: number;
  windSpeed: number;
  routesCount: number;
  routesNeedingAction: number;
  lastUpdated: string;
  contractor: string;
  effectiveness: number;
  riskIndex: number;
  complaints: number;
}

export interface AQITrendPoint {
  time: string;
  pm10: number;
  pm25: number;
  aqi: number;
}

export interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  pmLevel: number;
  type: "construction" | "traffic" | "industrial" | "dust";
  severity: "low" | "medium" | "high" | "critical";
}

export interface ActionRecommendation {
  id: string;
  ward: string;
  action: string;
  priority: "high" | "medium" | "low";
  department: string;
  estimatedImpact: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
}

export interface ActionHistory {
  id: string;
  date: string;
  time: string;
  ward: string;
  action: string;
  department: string;
  contractor: string;
  pmBefore: number;
  pmAfter: number;
  effectiveness: number;
  status: "completed" | "partial" | "failed";
}

export interface CitizenComplaint {
  id: string;
  date: string;
  ward: string;
  type: string;
  description: string;
  pmCorrelation: number;
  resolved: boolean;
}

export const delhiWards: WardData[] = [
  {
    id: "north", name: "North", color: "#fce7f3",
    coordinates: [[28.75, 77.15], [28.78, 77.18], [28.80, 77.22], [28.78, 77.28], [28.74, 77.30], [28.70, 77.28], [28.68, 77.22], [28.70, 77.16], [28.75, 77.15]],
    pmLevel: 178, pm25: 89, humidity: 48, temperature: 29, windSpeed: 8, routesCount: 12, routesNeedingAction: 4,
    lastUpdated: "5 min ago", contractor: "ABC Contractors", effectiveness: 42, riskIndex: 72, complaints: 23
  },
  {
    id: "north-west", name: "North West", color: "#e0e7ff",
    coordinates: [[28.72, 77.02], [28.76, 77.08], [28.75, 77.15], [28.70, 77.16], [28.66, 77.12], [28.64, 77.06], [28.68, 77.02], [28.72, 77.02]],
    pmLevel: 156, pm25: 78, humidity: 52, temperature: 28, windSpeed: 10, routesCount: 8, routesNeedingAction: 2,
    lastUpdated: "3 min ago", contractor: "Green Clean Ltd", effectiveness: 58, riskIndex: 58, complaints: 12
  },
  {
    id: "north-east", name: "North East", color: "#dbeafe",
    coordinates: [[28.74, 77.30], [28.72, 77.34], [28.68, 77.36], [28.64, 77.34], [28.66, 77.28], [28.70, 77.28], [28.74, 77.30]],
    pmLevel: 245, pm25: 122, humidity: 44, temperature: 30, windSpeed: 6, routesCount: 6, routesNeedingAction: 4,
    lastUpdated: "2 min ago", contractor: "XYZ Services", effectiveness: 28, riskIndex: 88, complaints: 45
  },
  {
    id: "west", name: "West", color: "#fef3c7",
    coordinates: [[28.66, 77.02], [28.68, 77.02], [28.64, 77.06], [28.66, 77.12], [28.64, 77.16], [28.60, 77.14], [28.56, 77.10], [28.58, 77.04], [28.66, 77.02]],
    pmLevel: 134, pm25: 67, humidity: 56, temperature: 27, windSpeed: 12, routesCount: 10, routesNeedingAction: 1,
    lastUpdated: "4 min ago", contractor: "ABC Contractors", effectiveness: 62, riskIndex: 48, complaints: 8
  },
  {
    id: "central", name: "Central", color: "#fed7aa",
    coordinates: [[28.68, 77.22], [28.70, 77.28], [28.66, 77.28], [28.64, 77.24], [28.64, 77.20], [28.68, 77.22]],
    pmLevel: 198, pm25: 99, humidity: 50, temperature: 31, windSpeed: 7, routesCount: 14, routesNeedingAction: 5,
    lastUpdated: "1 min ago", contractor: "XYZ Services", effectiveness: 45, riskIndex: 76, complaints: 34
  },
  {
    id: "new-delhi", name: "New Delhi", color: "#fef9c3",
    coordinates: [[28.64, 77.16], [28.64, 77.20], [28.64, 77.24], [28.60, 77.26], [28.56, 77.24], [28.56, 77.18], [28.60, 77.14], [28.64, 77.16]],
    pmLevel: 112, pm25: 56, humidity: 58, temperature: 28, windSpeed: 14, routesCount: 16, routesNeedingAction: 2,
    lastUpdated: "2 min ago", contractor: "Green Clean Ltd", effectiveness: 71, riskIndex: 38, complaints: 6
  },
  {
    id: "south-west", name: "South West", color: "#d9f99d",
    coordinates: [[28.56, 77.04], [28.58, 77.04], [28.56, 77.10], [28.56, 77.18], [28.52, 77.16], [28.48, 77.12], [28.46, 77.06], [28.50, 77.02], [28.56, 77.04]],
    pmLevel: 98, pm25: 49, humidity: 62, temperature: 26, windSpeed: 15, routesCount: 9, routesNeedingAction: 0,
    lastUpdated: "6 min ago", contractor: "ABC Contractors", effectiveness: 78, riskIndex: 28, complaints: 3
  },
  {
    id: "south", name: "South", color: "#e9d5ff",
    coordinates: [[28.56, 77.18], [28.56, 77.24], [28.54, 77.28], [28.50, 77.30], [28.46, 77.26], [28.48, 77.20], [28.52, 77.16], [28.56, 77.18]],
    pmLevel: 142, pm25: 71, humidity: 54, temperature: 27, windSpeed: 11, routesCount: 11, routesNeedingAction: 2,
    lastUpdated: "3 min ago", contractor: "Green Clean Ltd", effectiveness: 55, riskIndex: 52, complaints: 15
  },
  {
    id: "south-east", name: "South East", color: "#a5f3fc",
    coordinates: [[28.60, 77.26], [28.64, 77.28], [28.62, 77.34], [28.58, 77.36], [28.54, 77.32], [28.54, 77.28], [28.60, 77.26]],
    pmLevel: 167, pm25: 83, humidity: 51, temperature: 29, windSpeed: 9, routesCount: 7, routesNeedingAction: 2,
    lastUpdated: "4 min ago", contractor: "XYZ Services", effectiveness: 48, riskIndex: 62, complaints: 18
  },
  {
    id: "east", name: "East", color: "#99f6e4",
    coordinates: [[28.66, 77.28], [28.68, 77.36], [28.64, 77.38], [28.62, 77.34], [28.64, 77.28], [28.66, 77.28]],
    pmLevel: 212, pm25: 106, humidity: 46, temperature: 30, windSpeed: 7, routesCount: 8, routesNeedingAction: 3,
    lastUpdated: "2 min ago", contractor: "XYZ Services", effectiveness: 35, riskIndex: 78, complaints: 28
  },
  {
    id: "shahdara", name: "Shahdara", color: "#fecaca",
    coordinates: [[28.68, 77.36], [28.72, 77.34], [28.74, 77.38], [28.72, 77.42], [28.68, 77.40], [28.66, 77.38], [28.68, 77.36]],
    pmLevel: 289, pm25: 144, humidity: 42, temperature: 32, windSpeed: 5, routesCount: 5, routesNeedingAction: 4,
    lastUpdated: "1 min ago", contractor: "ABC Contractors", effectiveness: 22, riskIndex: 95, complaints: 52
  }
];

export const generateTrendData = (wardId: string): AQITrendPoint[] => {
  const ward = delhiWards.find(w => w.id === wardId);
  const basePM = ward?.pmLevel || 150;
  const hours = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  return hours.map((time, i) => {
    const variation = Math.sin(i * 0.5) * 30 + (Math.random() - 0.5) * 20;
    const pm10 = Math.max(50, Math.round(basePM + variation));
    const pm25 = Math.round(pm10 * 0.5);
    const aqi = Math.round((pm10 + pm25) / 2);
    return { time, pm10, pm25, aqi };
  });
};

export const hotspots: Hotspot[] = [
  { id: "h1", name: "Anand Vihar Bus Terminal", lat: 28.6469, lng: 77.3164, pmLevel: 342, type: "traffic", severity: "critical" },
  { id: "h2", name: "Mundka Industrial Area", lat: 28.6839, lng: 77.0315, pmLevel: 298, type: "industrial", severity: "critical" },
  { id: "h3", name: "Jahangirpuri Construction", lat: 28.7258, lng: 77.1729, pmLevel: 267, type: "construction", severity: "high" },
  { id: "h4", name: "Okhla Industrial Estate", lat: 28.5355, lng: 77.2719, pmLevel: 234, type: "industrial", severity: "high" },
  { id: "h5", name: "Wazirpur Industrial", lat: 28.6997, lng: 77.1654, pmLevel: 212, type: "industrial", severity: "high" },
  { id: "h6", name: "Azadpur Mandi", lat: 28.7136, lng: 77.1789, pmLevel: 189, type: "dust", severity: "medium" },
  { id: "h7", name: "Sarai Kale Khan", lat: 28.5893, lng: 77.2566, pmLevel: 176, type: "traffic", severity: "medium" },
  { id: "h8", name: "Narela Industrial Zone", lat: 28.8529, lng: 77.0929, pmLevel: 223, type: "industrial", severity: "high" },
];

export const actionRecommendations: ActionRecommendation[] = [
  { id: "ar1", ward: "Shahdara", action: "Deploy 3 additional water tankers on main roads", priority: "high", department: "Sanitation Dept", estimatedImpact: "-35% PM10", deadline: "Today 10:00 AM", status: "pending" },
  { id: "ar2", ward: "North East", action: "Activate fog cannons near Anand Vihar", priority: "high", department: "Environment Dept", estimatedImpact: "-28% PM10", deadline: "Today 11:00 AM", status: "in_progress" },
  { id: "ar3", ward: "East", action: "Increase sprinkling frequency to every 2 hours", priority: "high", department: "PWD", estimatedImpact: "-22% PM10", deadline: "Today 12:00 PM", status: "pending" },
  { id: "ar4", ward: "Central", action: "Deploy mechanical sweepers on Ring Road section", priority: "medium", department: "MCD Roads", estimatedImpact: "-18% PM10", deadline: "Today 2:00 PM", status: "pending" },
  { id: "ar5", ward: "North", action: "Issue advisory to construction sites for dust control", priority: "medium", department: "DPCC", estimatedImpact: "-15% PM10", deadline: "Today 3:00 PM", status: "completed" },
  { id: "ar6", ward: "South East", action: "Coordinate with traffic police for congestion reduction", priority: "medium", department: "Traffic Police", estimatedImpact: "-12% PM10", deadline: "Today 4:00 PM", status: "pending" },
  { id: "ar7", ward: "West", action: "Routine evening sprinkling cycle", priority: "low", department: "Sanitation Dept", estimatedImpact: "-10% PM10", deadline: "Today 6:00 PM", status: "pending" },
  { id: "ar8", ward: "South", action: "Monitor and maintain green belt areas", priority: "low", department: "Horticulture", estimatedImpact: "-8% PM10", deadline: "This Week", status: "in_progress" },
];

export const actionHistory: ActionHistory[] = [
  { id: "ah1", date: "2026-01-11", time: "08:30 AM", ward: "Shahdara", action: "Water sprinkling - Main Road", department: "Sanitation", contractor: "ABC Contractors", pmBefore: 312, pmAfter: 245, effectiveness: 21, status: "partial" },
  { id: "ah2", date: "2026-01-11", time: "07:00 AM", ward: "Central", action: "Mechanical sweeping - Ring Road", department: "PWD", contractor: "XYZ Services", pmBefore: 234, pmAfter: 178, effectiveness: 24, status: "completed" },
  { id: "ah3", date: "2026-01-11", time: "06:30 AM", ward: "New Delhi", action: "Water sprinkling + Anti-smog guns", department: "Environment", contractor: "Green Clean Ltd", pmBefore: 156, pmAfter: 98, effectiveness: 37, status: "completed" },
  { id: "ah4", date: "2026-01-10", time: "06:00 PM", ward: "South West", action: "Evening sprinkling cycle", department: "Sanitation", contractor: "ABC Contractors", pmBefore: 134, pmAfter: 89, effectiveness: 34, status: "completed" },
  { id: "ah5", date: "2026-01-10", time: "04:00 PM", ward: "East", action: "Fog cannon deployment", department: "Environment", contractor: "XYZ Services", pmBefore: 267, pmAfter: 198, effectiveness: 26, status: "completed" },
  { id: "ah6", date: "2026-01-10", time: "02:00 PM", ward: "North", action: "Construction site inspection", department: "DPCC", contractor: "N/A", pmBefore: 198, pmAfter: 178, effectiveness: 10, status: "partial" },
  { id: "ah7", date: "2026-01-10", time: "10:00 AM", ward: "North East", action: "Water tanker deployment", department: "Sanitation", contractor: "XYZ Services", pmBefore: 278, pmAfter: 312, effectiveness: -12, status: "failed" },
  { id: "ah8", date: "2026-01-10", time: "08:00 AM", ward: "South", action: "Morning sprinkling routine", department: "Sanitation", contractor: "Green Clean Ltd", pmBefore: 167, pmAfter: 134, effectiveness: 20, status: "completed" },
];

export const citizenComplaints: CitizenComplaint[] = [
  { id: "cc1", date: "2026-01-11", ward: "Shahdara", type: "Excessive Dust", description: "Heavy dust near main road, visibility affected", pmCorrelation: 92, resolved: false },
  { id: "cc2", date: "2026-01-11", ward: "North East", type: "Construction Dust", description: "Uncontrolled dust from building site near school", pmCorrelation: 88, resolved: false },
  { id: "cc3", date: "2026-01-11", ward: "East", type: "Road Dust", description: "No water sprinkling done since morning", pmCorrelation: 85, resolved: false },
  { id: "cc4", date: "2026-01-11", ward: "Central", type: "Vehicle Emissions", description: "Heavy traffic congestion causing smog", pmCorrelation: 78, resolved: true },
  { id: "cc5", date: "2026-01-10", ward: "North", type: "Industrial Smoke", description: "Factory emissions visible from residential area", pmCorrelation: 82, resolved: true },
  { id: "cc6", date: "2026-01-10", ward: "South East", type: "Burning Waste", description: "Open burning of garbage in vacant plot", pmCorrelation: 75, resolved: true },
  { id: "cc7", date: "2026-01-10", ward: "Shahdara", type: "Road Dust", description: "Unpaved road causing dust storms", pmCorrelation: 90, resolved: false },
  { id: "cc8", date: "2026-01-10", ward: "West", type: "Construction Dust", description: "Metro construction without dust barriers", pmCorrelation: 72, resolved: true },
];

export const getWardStatus = (pmLevel: number): "good" | "moderate" | "poor" | "critical" => {
  if (pmLevel > 250) return "critical";
  if (pmLevel > 150) return "poor";
  if (pmLevel > 100) return "moderate";
  return "good";
};

export const getRiskLevel = (riskIndex: number): "low" | "medium" | "high" | "critical" => {
  if (riskIndex > 80) return "critical";
  if (riskIndex > 60) return "high";
  if (riskIndex > 40) return "medium";
  return "low";
};
