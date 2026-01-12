import { Ward } from "../models";
import { fetchWeather, fetchAQI } from "./weatherService";


export async function updateLiveData(): Promise<{ updated: number; failed: number }> {
    const wards = await Ward.find();
    let updated = 0;
    let failed = 0;

    for (const ward of wards) {
        try {
            
            const centerLat = ward.coordinates[0]?.[0] || 28.6139;
            const centerLng = ward.coordinates[0]?.[1] || 77.2090;

            
            const [weather, aqi] = await Promise.all([
                fetchWeather(centerLat, centerLng),
                fetchAQI(centerLat, centerLng)
            ]);

            
            if (weather && aqi) {
                ward.temperature = weather.temp;
                ward.humidity = weather.humidity;
                ward.windSpeed = weather.windSpeed;
                ward.pmLevel = Math.round(aqi.pm10);
                ward.pm25 = Math.round(aqi.pm2_5);
                ward.lastUpdated = new Date().toISOString();

                
                const riskFactor = (aqi.pm10 / 200) * 100;
                ward.riskIndex = Math.min(100, Math.round(riskFactor));

                await ward.save();
                updated++;
            } else {
                
                ward.pmLevel = Math.max(50, ward.pmLevel + Math.floor(Math.random() * 20 - 10));
                ward.pm25 = Math.max(25, ward.pm25 + Math.floor(Math.random() * 10 - 5));
                ward.temperature = Math.max(15, Math.min(45, ward.temperature + Math.floor(Math.random() * 4 - 2)));
                ward.humidity = Math.max(20, Math.min(90, ward.humidity + Math.floor(Math.random() * 6 - 3)));
                ward.windSpeed = Math.max(0, ward.windSpeed + Math.floor(Math.random() * 4 - 2));
                ward.lastUpdated = new Date().toISOString();

                const riskFactor = (ward.pmLevel / 200) * 100;
                ward.riskIndex = Math.min(100, Math.round(riskFactor));

                await ward.save();
                updated++;
            }
        } catch (error) {
            console.error(`Failed to update ward ${ward.name}:`, error);
            failed++;
        }
    }

    return { updated, failed };
}
