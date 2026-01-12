import { Ward, Hotspot, ActionRecommendation, ActionHistory, CitizenComplaint, Resource, ShiftPlan, Contractor } from "./models";

export const seedDatabase = async () => {
    
    const wardCount = await Ward.countDocuments();
    if (wardCount > 0) return { message: "Database already seeded" };

    
    const wards = [
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

    await Ward.insertMany(wards);

    
    const hotspots = [
        { name: "Anand Vihar Bus Terminal", lat: 28.6469, lng: 77.3164, pmLevel: 342, type: "traffic", severity: "critical" },
        { name: "Mundka Industrial Area", lat: 28.6839, lng: 77.0315, pmLevel: 298, type: "industrial", severity: "critical" },
        { name: "Jahangirpuri Construction", lat: 28.7258, lng: 77.1729, pmLevel: 267, type: "construction", severity: "high" },
        { name: "Okhla Industrial Estate", lat: 28.5355, lng: 77.2719, pmLevel: 234, type: "industrial", severity: "high" },
        { name: "Wazirpur Industrial", lat: 28.6997, lng: 77.1654, pmLevel: 212, type: "industrial", severity: "high" },
        { name: "Azadpur Mandi", lat: 28.7136, lng: 77.1789, pmLevel: 189, type: "dust", severity: "medium" },
        { name: "Sarai Kale Khan", lat: 28.5893, lng: 77.2566, pmLevel: 176, type: "traffic", severity: "medium" },
        { name: "Narela Industrial Zone", lat: 28.8529, lng: 77.0929, pmLevel: 223, type: "industrial", severity: "high" },
    ];
    await Hotspot.insertMany(hotspots);

    return { message: "Database seeded successfully" };
};
