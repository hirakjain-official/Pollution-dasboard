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
