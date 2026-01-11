import { WardData, CitizenComplaint, ActionHistory, ActionRecommendation, AQITrendPoint } from "@/types";

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

export const citizenComplaints: CitizenComplaint[] = [
    { id: "c1", date: "2024-03-10", ward: "Shahdara", type: "Dust Control", description: "Heavy dust near construction site not being sprinkled.", pmCorrelation: 88, resolved: false },
    { id: "c2", date: "2024-03-09", ward: "North East", type: "Garbage Burning", description: "Smoke detected from open waste burning.", pmCorrelation: 92, resolved: false },
    { id: "c3", date: "2024-03-08", ward: "South", type: "Industrial", description: "Factory chimney emitting black smoke.", pmCorrelation: 65, resolved: true },
    { id: "c4", date: "2024-03-08", ward: "Central", type: "Dust Control", description: "Road dust accumulation on main road.", pmCorrelation: 72, resolved: true },
    { id: "c5", date: "2024-03-07", ward: "East", type: "Traffic", description: "Severe congestion causing idling emissions.", pmCorrelation: 55, resolved: false },
];

export const actionHistory: ActionHistory[] = [
    { id: "a1", date: "2024-03-10", time: "09:30 AM", ward: "North", action: "Mechanical Sweeping", department: "Sanitation", contractor: "ABC Contractors", pmBefore: 210, pmAfter: 180, effectiveness: 14, status: "completed" },
    { id: "a2", date: "2024-03-10", time: "10:15 AM", ward: "Shahdara", action: "Anti-Smog Gun", department: "Environment", contractor: "ABC Contractors", pmBefore: 350, pmAfter: 340, effectiveness: 2, status: "failed" },
    { id: "a3", date: "2024-03-09", time: "02:00 PM", ward: "South West", action: "Water Sprinkling", department: "PWD", contractor: "ABC Contractors", pmBefore: 120, pmAfter: 95, effectiveness: 21, status: "completed" },
    { id: "a4", date: "2024-03-09", time: "04:45 PM", ward: "Central", action: "Construction Ban Enforcement", department: "DPCC", contractor: "XYZ Services", pmBefore: 200, pmAfter: 190, effectiveness: 5, status: "partial" },
    { id: "a5", date: "2024-03-08", time: "11:00 AM", ward: "North East", action: "Waste Burning Fines", department: "MCD", contractor: "XYZ Services", pmBefore: 280, pmAfter: 220, effectiveness: 21, status: "completed" },
];

export const actionRecommendations: ActionRecommendation[] = [
    { id: "r1", ward: "Shahdara", action: "Deploy Anti-Smog Gun", priority: "high", department: "Environment", estimatedImpact: "-15% PM10", deadline: "2 Hrs", status: "pending" },
    { id: "r2", ward: "North East", action: "Intensify Wet Sweeping", priority: "high", department: "MCD", estimatedImpact: "-12% PM10", deadline: "4 Hrs", status: "in_progress" },
    { id: "r3", ward: "Central", action: "Traffic Diversion", priority: "medium", department: "Traffic Police", estimatedImpact: "-8% PM2.5", deadline: "6 Hrs", status: "pending" },
    { id: "r4", ward: "Okhla Phase 3", action: "Industrial Inspection", priority: "medium", department: "DPCC", estimatedImpact: "Long Term", deadline: "24 Hrs", status: "pending" },
];

export const generateTrendData = (wardId: string, basePM: number = 150): AQITrendPoint[] => {
    const hours = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
    return hours.map((time, i) => {
        const variation = Math.sin(i * 0.5) * 30 + (Math.random() - 0.5) * 20;
        const pm10 = Math.max(50, Math.round(basePM + variation));
        const pm25 = Math.round(pm10 * 0.5);
        const aqi = Math.round((pm10 + pm25) / 2);
        return { time, pm10, pm25, aqi };
    });
};

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
