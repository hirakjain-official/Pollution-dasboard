import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export interface AQITrendPoint {
  time: string;
  pm10: number;
  pm25: number;
  aqi: number;
}

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
