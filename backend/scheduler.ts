import { updateLiveWeatherData } from "./services/inMemoryWeatherService";


export function startWeatherRefreshScheduler() {
    console.log("🌡️  Starting weather refresh scheduler (30s interval)");
    console.log("📡 OpenWeatherMap API:", process.env.OPENWEATHER_API_KEY ? "CONFIGURED ✅" : "NOT SET (using simulation)");

    
    updateLiveWeatherData()
        .then(result => {
            const mode = result.mode === "real_api" ? "REAL DATA from OpenWeatherMap" : "SIMULATED data";
            console.log(`✅ Initial weather update: ${result.updated} wards | Mode: ${mode}`);
        })
        .catch(err => console.error("❌ Initial weather update failed:", err));

    
    setInterval(async () => {
        try {
            const result = await updateLiveWeatherData();
            const mode = result.mode === "real_api" ? "🌐 REAL" : "🎲 SIM";
            console.log(`🔄 [${new Date().toLocaleTimeString()}] Updated ${result.updated} wards | ${mode}`);
        } catch (error) {
            console.error("❌ Scheduled weather update failed:", error);
        }
    }, 30000); 
}
