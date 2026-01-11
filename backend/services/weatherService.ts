import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Using HTTP instead of HTTPS as per user's working example
const WEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather";
const AQI_BASE_URL = "http://api.openweathermap.org/data/2.5/air_pollution";

export interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
}

export interface AQIData {
    aqi: number; // 1-5 scale from OpenWeather
    pm2_5: number;
    pm10: number;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
    if (!API_KEY || API_KEY === 'your_openweather_api_key_here') {
        console.warn("⚠️  OPENWEATHER_API_KEY is not configured properly");
        return null;
    }

    try {
        console.log(`🌤️  Fetching weather for lat=${lat}, lon=${lon}...`);
        const response = await axios.get(WEATHER_BASE_URL, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units: "metric"
            },
        });

        console.log(`✅ Weather fetched successfully`);
        return {
            temp: Math.round(response.data.main.temp),
            humidity: response.data.main.humidity,
            windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
            conditions: response.data.weather[0].main,
        };
    } catch (error: any) {
        console.error("❌ Error fetching weather:");
        console.error("  Status:", error.response?.status);
        console.error("  Message:", error.response?.data?.message || error.message);
        console.error("  API Key (first 10 chars):", API_KEY?.substring(0, 10) + "...");
        return null;
    }
}

export async function fetchAQI(lat: number, lon: number): Promise<AQIData | null> {
    if (!API_KEY || API_KEY === 'your_openweather_api_key_here') {
        console.warn("⚠️  OPENWEATHER_API_KEY is not configured properly");
        return null;
    }

    try {
        console.log(`🌍 Fetching AQI for lat=${lat}, lon=${lon}...`);
        const response = await axios.get(AQI_BASE_URL, {
            params: {
                lat,
                lon,
                appid: API_KEY
            },
        });

        const data = response.data.list[0];
        console.log(`✅ AQI fetched: Level ${data.main.aqi}, PM2.5=${data.components.pm2_5}, PM10=${data.components.pm10}`);

        return {
            aqi: data.main.aqi,
            pm2_5: data.components.pm2_5,
            pm10: data.components.pm10,
        };
    } catch (error: any) {
        console.error("❌ Error fetching AQI:");
        console.error("  Status:", error.response?.status);
        console.error("  Message:", error.response?.data?.message || error.message);
        console.error("  API Key (first 10 chars):", API_KEY?.substring(0, 10) + "...");
        return null;
    }
}
