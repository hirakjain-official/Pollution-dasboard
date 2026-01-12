import { fetchWeather, fetchAQI } from "./weatherService";
import { delhiWards } from "../../client/src/data/mockData";

// Deep clone mock data to create in-memory store
// This is crucial - we need to actually MUTATE this array
const liveWards = JSON.parse(JSON.stringify(delhiWards || []));

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

                    // Add significant sensor noise (jitter) to make chart look alive
                    // User requested +/- 6 variation
                    const pmNoise = Math.floor(Math.random() * 13) - 6; // -6 to +6
                    const tempNoise = Math.floor(Math.random() * 3) - 1; // -1 to +1
                    const humidNoise = Math.floor(Math.random() * 5) - 2; // -2 to +2
                    const windNoise = Math.floor(Math.random() * 3) - 1; // -1 to +1

                    // Update all fields with base API data + noise
                    liveWards[i].temperature = Math.round(weather.temp + tempNoise);
                    liveWards[i].humidity = Math.min(100, Math.max(0, weather.humidity + humidNoise));
                    liveWards[i].windSpeed = Math.max(0, weather.windSpeed + windNoise);
                    liveWards[i].pmLevel = Math.max(0, aqi.pm10 + pmNoise);
                    liveWards[i].pm25 = Math.max(0, aqi.pm2_5 + Math.round(pmNoise / 2));

                    liveWards[i].lastUpdated = new Date().toLocaleTimeString();
                    liveWards[i].riskIndex = Math.min(100, Math.round((liveWards[i].pmLevel / 200) * 100));
                    updated++;
                } else {
                    throw new Error("API returned null");
                }
            } else {
                // Simulate changes (no API key)
                // Add more noticeable fluctuation for simulation mode
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

    // Track history for trend chart
    updateHistory();

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

// --- History Tracking for Trend Chart ---

const history: { time: string; pm10: number; pm25: number; aqi: number }[] = [];

function updateHistory() {
    // Calculate city-wide average
    const avgPM10 = Math.round(liveWards.reduce((a: number, w: any) => a + (w.pmLevel || 0), 0) / liveWards.length);
    const avgPM25 = Math.round(liveWards.reduce((a: number, w: any) => a + (w.pm25 || 0), 0) / liveWards.length);

    const point = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pm10: avgPM10,
        pm25: avgPM25,
        aqi: Math.round((avgPM10 + avgPM25) / 2) // Approximate AQI
    };

    // FIX: Generate backfill BEFORE adding the first live point if history is empty
    if (history.length === 0) {
        const basePM10 = avgPM10 > 0 ? avgPM10 : 150;
        const now = new Date();
        const HISTORY_POINTS = 100; // 8 hours back

        for (let i = HISTORY_POINTS; i > 0; i--) {
            const timeOffset = i * (480 / HISTORY_POINTS) * 60 * 1000;
            const t = new Date(now.getTime() - timeOffset);

            const variation = Math.sin(i * 0.2) * 40 + (Math.random() - 0.5) * 20;
            const hPM10 = Math.max(50, Math.round(basePM10 + variation));
            const hPM25 = Math.round(hPM10 * 0.55);

            history.push({
                time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                pm10: hPM10,
                pm25: hPM25,
                aqi: Math.round((hPM10 + hPM25) / 2)
            });
        }
    }

    history.push(point);
    if (history.length > 500) history.shift(); // Keep last ~4 hours (at 30s/update)
}

export function getHistory() {
    // If history is empty, ALWAYS generate demo data (4 hours history)
    if (history.length === 0) {
        // Unconditionally use 150 as base if liveWards is empty/undefined, to prevent skip
        const basePM10 = (liveWards && liveWards.length > 0) ? (liveWards[0]?.pmLevel || 150) : 150;

        const now = new Date();
        const HISTORY_POINTS = 100; // Generate 100 initial points spreading back 8 hours

        for (let i = HISTORY_POINTS; i >= 0; i--) {
            // Time spreads back 8 hours (480 mins)
            const timeOffset = i * (480 / HISTORY_POINTS) * 60 * 1000;
            const t = new Date(now.getTime() - timeOffset);

            // Add some variation to look realistic (sine wave + random noise)
            const variation = Math.sin(i * 0.2) * 40 + (Math.random() - 0.5) * 20;
            const pm10 = Math.max(50, Math.round(basePM10 + variation));
            const pm25 = Math.round(pm10 * 0.55);

            history.push({
                time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                pm10: pm10,
                pm25: pm25,
                aqi: Math.round((pm10 + pm25) / 2)
            });
        }
    }
    return history;
}
// --- Mutable Shift Plans (In-Memory) ---
const liveShifts: Record<string, any> = {};

// Helper to get realistic Delhi routes
function getRoutePoints(wardName: string): [number, number][] | null {
    // Define realistic major routes with variations
    const routes: Record<string, [number, number][]> = {
        // Central Delhi
        "Central": [ // CP Inner
            [28.6328, 77.2197], [28.6315, 77.2208], [28.6298, 77.2210],
            [28.6285, 77.2200], [28.6280, 77.2185], [28.6290, 77.2165],
            [28.6310, 77.2160], [28.6328, 77.2197]
        ],
        "Central-Outer": [ // CP Outer
            [28.6340, 77.2210], [28.6320, 77.2230], [28.6290, 77.2230],
            [28.6270, 77.2210], [28.6270, 77.2170], [28.6290, 77.2150],
            [28.6320, 77.2150], [28.6340, 77.2190]
        ],
        "Central-ITO": [
            [28.6280, 77.2430], [28.6290, 77.2350], [28.6310, 77.2300]
        ],

        // North Delhi
        "North": [ // Pitampura
            [28.7041, 77.1025], [28.7100, 77.1200], [28.7150, 77.1400],
            [28.7200, 77.1600], [28.7000, 77.1800]
        ],
        "North-ModelTown": [
            [28.7150, 77.1900], [28.7100, 77.1950], [28.7000, 77.2000]
        ],
        "North-Campus": [
            [28.6900, 77.2100], [28.6950, 77.2050], [28.7000, 77.2100]
        ],

        // South Delhi
        "South": [ // Ring Road South
            [28.5244, 77.1855], [28.5300, 77.2000], [28.5400, 77.2100],
            [28.5500, 77.2200], [28.5600, 77.2300]
        ],
        "South-GK": [ // GK Area
            [28.5450, 77.2350], [28.5400, 77.2400], [28.5350, 77.2450]
        ],
        "South-NehruPlace": [
            [28.5480, 77.2500], [28.5500, 77.2550], [28.5520, 77.2500]
        ],

        // East Delhi
        "East": [ // Laxmi Nagar
            [28.6200, 77.2800], [28.6250, 77.2900], [28.6300, 77.3000],
            [28.6350, 77.3100]
        ],
        "East-MayurVihar": [
            [28.6000, 77.2900], [28.5900, 77.3000], [28.5950, 77.3100]
        ],

        // West Delhi
        "West": [ // Rajouri
            [28.6500, 77.1000], [28.6400, 77.1100], [28.6300, 77.1200]
        ],
        "West-Dwarka": [
            [28.5800, 77.0500], [28.5900, 77.0600], [28.6000, 77.0700]
        ]
    };

    if (routes[wardName]) return routes[wardName];

    // Fallback Zigzag for unknown wards
    const ward = liveWards.find((w: any) => w.name === wardName || w.id === wardName.toLowerCase().replace(" ", "-"));
    if (!ward) return null;

    const center = ward.coordinates[0][0];
    const lat = center[0];
    const lng = center[1];

    return [
        [lat + 0.015, lng - 0.015],
        [lat + 0.005, lng - 0.005],
        [lat, lng],
        [lat - 0.005, lng + 0.005],
        [lat - 0.015, lng + 0.015]
    ];
}

export function getShiftPlan(type: string) {
    if (!liveShifts[type]) {
        // PRE-POPULATE REALISTIC PLANS ON STARTUP
        let routes = [];
        let focus = "";
        let impactedWards = [];

        if (type === "morning") {
            focus = "Traffic Corridors & Schools";
            impactedWards = ["Central", "South", "West", "North"];
            routes = [
                { id: "m-1", priority: "High", path: getRoutePoints("Central"), assignedTo: "Sprinkler Unit A1 (CP)" },
                { id: "m-2", priority: "Standard", path: getRoutePoints("South"), assignedTo: "Sprinkler Unit A2 (Ring Road)" },
                { id: "m-3", priority: "Standard", path: getRoutePoints("West"), assignedTo: "Sprinkler Unit B1" },
                { id: "m-4", priority: "Standard", path: getRoutePoints("North-ModelTown"), assignedTo: "Sprinkler Unit N1 (Schools)" },
                { id: "m-5", priority: "Standard", path: getRoutePoints("Central-Outer"), assignedTo: "Mechanized Sweeper M1" }
            ];
        } else if (type === "evening") {
            focus = "Markets & Transit Hubs";
            impactedWards = ["Central", "North", "East", "South"];
            routes = [
                { id: "e-1", priority: "High", path: getRoutePoints("North"), assignedTo: "Mist Cannon N1 (Market)" },
                { id: "e-2", priority: "Standard", path: getRoutePoints("Central-ITO"), assignedTo: "Sprinkler Unit C1 (Office Hub)" },
                { id: "e-3", priority: "Standard", path: getRoutePoints("East"), assignedTo: "Sprinkler Unit E1" },
                { id: "e-4", priority: "Standard", path: getRoutePoints("South-GK"), assignedTo: "Mobile Smog Gun S2" },
                { id: "e-5", priority: "Standard", path: getRoutePoints("East-MayurVihar"), assignedTo: "Sprinkler Unit E2" }
            ];
        } else { // Night
            focus = "Construction Sites & Industrial Areas";
            impactedWards = ["North", "West", "South", "Central"];
            routes = [
                { id: "n-1", priority: "High", path: getRoutePoints("North"), assignedTo: "Heavy Duty Sprinkler H1" },
                { id: "n-2", priority: "High", path: getRoutePoints("West-Dwarka"), assignedTo: "Dust Suppressor W1" },
                { id: "n-3", priority: "Standard", path: getRoutePoints("South-NehruPlace"), assignedTo: "Patrol Unit S1" },
                { id: "n-4", priority: "Standard", path: getRoutePoints("North-Campus"), assignedTo: "Mist Cannon N2" },
                { id: "n-5", priority: "Standard", path: getRoutePoints("Central"), assignedTo: "Night Sweeper C2" }
            ];
        }

        liveShifts[type] = {
            type,
            date: new Date().toISOString(),
            routes,
            focus,
            steps: [
                "Deploy units to assigned sectors",
                "Activate anti-smog guns at major intersections",
                "Verify PM2.5 levels post-sprinkling (Target: <150)"
            ],
            impactedWards
        };
    }
    return liveShifts[type];
}

export async function generateAutoShiftPlan(type: string) {
    // 1. Get critical wards
    const criticalWards = liveWards.filter((w: any) => w.pmLevel > 180).map((w: any) => w.name);
    const targetWards = criticalWards.length > 0 ? criticalWards : ["Central", "North", "South", "East"];

    // 2. Generate routes based on these wards
    // 3. Update store with diverse equipment labels
    const equipmentTypes = ["Anti-Smog Gun", "Mechanical Sweeper", "Water Sprinkler", "Mist Cannon"];

    // Generate MORE routes for auto-plan (5 routes)
    const newRoutes = [];
    for (let i = 0; i < 5; i++) {
        const ward = targetWards[i % targetWards.length];
        const eqType = equipmentTypes[i % equipmentTypes.length];
        // Random ID suffix to make it feel real
        const unitId = Math.floor(Math.random() * 10) + 1;

        newRoutes.push({
            id: `${type}-auto-${i}-${Date.now()}`,
            priority: i === 0 ? "High" : "Standard",
            path: getRoutePoints(ward),
            assignedTo: `${eqType} ${unitId} (${ward})`
        });
    }

    // 3. Update store
    liveShifts[type] = {
        type,
        date: new Date().toISOString(),
        routes: newRoutes,
        focus: criticalWards.length > 0 ? `Emergency Hotspot Response` : `Routine Maintenance`,
        steps: [
            `AI Detected high pollution in: ${targetWards.join(", ")}`,
            `Mobilize ${newRoutes.length} sprinkler units immediately`,
            "Execute wet sweeping and dust suppression"
        ],
        impactedWards: targetWards
    };

    return liveShifts[type];
}
