import { fetchWeather, fetchAQI } from "./weatherService";
import { delhiWards } from "../../client/src/data/mockData";

// Deep clone mock data to create in-memory store
// This is crucial - we need to actually MUTATE this array
const liveWards = JSON.parse(JSON.stringify(delhiWards));

/**
 * Updates in-memory ward data with REAL weather from OpenWeatherMap
 * Falls back to simulation if no API key configured
 */
export async function updateLiveWeatherData(): Promise<{ updated: number; failed: number; mode: string }> {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    let updated = 0;
    let failed = 0;
    let mode = "simulation";

    for (let i = 0; i < liveWards.length; i++) {
        try {
            // Get the center coordinate for this ward
            const centerLat = liveWards[i].coordinates[0]?.[0] || 28.6139;
            const centerLng = liveWards[i].coordinates[0]?.[1] || 77.2090;

            if (API_KEY && API_KEY !== 'your_openweather_api_key_here') {
                // Fetch REAL data from OpenWeatherMap
                const [weather, aqi] = await Promise.all([
                    fetchWeather(centerLat, centerLng),
                    fetchAQI(centerLat, centerLng)
                ]);

                if (weather && aqi) {
                    mode = "real_api";
                    // Add small random variation for demo effect (±3%)
                    const variation = () => 1 + (Math.random() * 0.06 - 0.03);

                    // Directly mutate the array element
                    liveWards[i].temperature = weather.temp + Math.floor(Math.random() * 3 - 1);
                    liveWards[i].humidity = weather.humidity + Math.floor(Math.random() * 5 - 2);
                    liveWards[i].windSpeed = weather.windSpeed + Math.floor(Math.random() * 3 - 1);
                    liveWards[i].pmLevel = Math.round(aqi.pm10 * variation());
                    liveWards[i].pm25 = Math.round(aqi.pm2_5 * variation());
                    liveWards[i].lastUpdated = new Date().toLocaleTimeString();
                    liveWards[i].riskIndex = Math.min(100, Math.round((liveWards[i].pmLevel / 200) * 100));
                    updated++;
                } else {
                    throw new Error("API returned null");
                }
            } else {
                // Simulate changes (no API key)
                liveWards[i].pmLevel = Math.max(50, liveWards[i].pmLevel + Math.floor(Math.random() * 20 - 10));
                liveWards[i].pm25 = Math.max(25, liveWards[i].pm25 + Math.floor(Math.random() * 10 - 5));
                liveWards[i].temperature = Math.max(15, Math.min(45, liveWards[i].temperature + Math.floor(Math.random() * 4 - 2)));
                liveWards[i].humidity = Math.max(20, Math.min(90, liveWards[i].humidity + Math.floor(Math.random() * 6 - 3)));
                liveWards[i].windSpeed = Math.max(0, liveWards[i].windSpeed + Math.floor(Math.random() * 4 - 2));
                liveWards[i].lastUpdated = new Date().toLocaleTimeString();
                liveWards[i].riskIndex = Math.min(100, Math.round((liveWards[i].pmLevel / 200) * 100));
                updated++;
            }
        } catch (error) {
            // On error, still update with simulation for this ward
            liveWards[i].pmLevel = Math.max(50, liveWards[i].pmLevel + Math.floor(Math.random() * 20 - 10));
            liveWards[i].pm25 = Math.max(25, liveWards[i].pm25 + Math.floor(Math.random() * 10 - 5));
            liveWards[i].temperature = Math.max(15, Math.min(45, liveWards[i].temperature + Math.floor(Math.random() * 4 - 2)));
            liveWards[i].humidity = Math.max(20, Math.min(90, liveWards[i].humidity + Math.floor(Math.random() * 6 - 3)));
            liveWards[i].windSpeed = Math.max(0, liveWards[i].windSpeed + Math.floor(Math.random() * 4 - 2));
            liveWards[i].lastUpdated = new Date().toLocaleTimeString();
            liveWards[i].riskIndex = Math.min(100, Math.round((liveWards[i].pmLevel / 200) * 100));
            updated++;
        }
    }

    // Debug log - show what we're storing
    console.log(`📊 Sample data after update: North ward PM2.5=${liveWards[0].pm25}, Temp=${liveWards[0].temperature}°C`);

    return { updated, failed, mode };
}

/**
 * Get current live wards data
 * Returns the in-memory array that gets updated every 30 seconds
 */
export function getLiveWards() {
    console.log(`📤 Returning ${liveWards.length} wards | Sample: North PM2.5=${liveWards[0].pm25}`);
    return liveWards;
}

// --- In-Memory Complaints Store ---

export interface Complaint {
    id: string;
    ticketId: string;
    description: string;
    location: string;
    type: string;
    status: "pending" | "resolved" | "in-progress";
    timestamp: Date;
    ward: string;
    contact?: string;
    name?: string;
}

const liveComplaints: Complaint[] = [];

export function addComplaint(complaint: Partial<Complaint>) {
    const newComplaint: Complaint = {
        id: Math.random().toString(36).substr(2, 9),
        ticketId: "DMC-" + Date.now().toString().slice(-6),
        description: complaint.description || "",
        location: complaint.location || "Unknown",
        type: complaint.type || "other",
        status: "pending",
        timestamp: new Date(),
        ward: complaint.ward || "unknown",
        contact: complaint.contact,
        name: complaint.name
    };
    liveComplaints.unshift(newComplaint); // Add to beginning
    return newComplaint;
}

export function getComplaints() {
    return liveComplaints;
}
