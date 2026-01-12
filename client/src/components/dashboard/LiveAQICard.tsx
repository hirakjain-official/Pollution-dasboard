import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Gauge, Droplets, Thermometer, Wind } from "lucide-react";
import { WardData } from "@/types";
import { getWardStatus, getRiskLevel } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { delhiWards } from "@/data/mockData";

export function LiveAQICard({ ward }: { ward: WardData | null }) {
    const { data: apiWards = [], isLoading, error } = useQuery<any[]>({
        queryKey: ["/api/wards"],
        refetchInterval: 30000 
    });

    
    console.log("🔍 LiveAQICard - API response:", {
        apiWardsLength: apiWards?.length,
        firstWardPM25: apiWards?.[0]?.pm25,
        isLoading,
        error: error?.message
    });

    const wards = apiWards.length > 0 ? apiWards : delhiWards;

    
    const data = ward || (wards.length > 0 ? {
        
        pmLevel: Math.round(wards.reduce((a, w) => a + w.pmLevel, 0) / wards.length),
        pm25: Math.round(wards.reduce((a, w) => a + w.pm25, 0) / wards.length),
        riskIndex: Math.round(wards.reduce((a, w) => a + w.riskIndex, 0) / wards.length),
        humidity: Math.round(wards.reduce((a, w) => a + w.humidity, 0) / wards.length),
        temperature: Math.round(wards.reduce((a, w) => a + w.temperature, 0) / wards.length),
        windSpeed: Math.round(wards.reduce((a, w) => a + w.windSpeed, 0) / wards.length),
    } : { 
        pmLevel: 0, pm25: 0, riskIndex: 0, humidity: 0, temperature: 0, windSpeed: 0
    });

    const status = getWardStatus(data.pmLevel);
    const riskLevel = getRiskLevel(data.riskIndex);
    const riskColors = { low: "text-emerald-600 bg-emerald-50", medium: "text-amber-600 bg-amber-50", high: "text-orange-600 bg-orange-50", critical: "text-red-600 bg-red-50" };

    return (
        <Card className="border shadow-sm overflow-hidden">
            <div className={`h-1 ${status === "critical" ? "bg-red-500" : status === "poor" ? "bg-orange-500" : status === "moderate" ? "bg-amber-500" : "bg-emerald-500"}`} />
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                    Live AQI Status
                    {ward && <Badge variant="outline" className="ml-auto">{ward.name}</Badge>}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">PM10</p>
                        <p className={`text-4xl font-display font-bold ${status === "critical" || status === "poor" ? "text-red-600" : status === "moderate" ? "text-amber-600" : "text-emerald-600"}`}>{data.pmLevel}</p>
                        <p className="text-xs text-muted-foreground">µg/m³</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">PM2.5</p>
                        <p className={`text-4xl font-display font-bold ${data.pm25 > 60 ? "text-red-600" : data.pm25 > 30 ? "text-amber-600" : "text-emerald-600"}`}>{data.pm25}</p>
                        <p className="text-xs text-muted-foreground">µg/m³</p>
                    </div>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${riskColors[riskLevel]}`}>
                    <div className="flex items-center gap-2">
                        <Gauge className="w-5 h-5" />
                        <span className="font-semibold">Risk Index</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{data.riskIndex}</span>
                        <span className="text-xs uppercase font-medium">{riskLevel}</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <div><p className="text-xs font-semibold">{data.humidity}%</p><p className="text-[10px] text-muted-foreground">Humidity</p></div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <div><p className="text-xs font-semibold">{data.temperature}°C</p><p className="text-[10px] text-muted-foreground">Temp</p></div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                        <Wind className="w-4 h-4 text-sky-500" />
                        <div><p className="text-xs font-semibold">{data.windSpeed} km/h</p><p className="text-[10px] text-muted-foreground">Wind</p></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
