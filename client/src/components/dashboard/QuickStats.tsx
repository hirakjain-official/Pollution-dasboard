import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Wind, Droplets, ThermometerSun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { delhiWards } from "@/data/mockData";

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: string;
    color?: string;
}

function MetricCard({ title, value, icon: Icon, trend, color = "text-slate-600" }: MetricCardProps) {
    return (
        <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
            </CardContent>
        </Card>
    );
}

export function QuickStats({ selectedWard }: { selectedWard: string }) {
    const { data: apiWards = [] } = useQuery<any[]>({
        queryKey: ["/api/wards"],
        refetchInterval: 30000 // Auto-refresh every 30 seconds
    });
    const wards = apiWards.length > 0 ? apiWards : delhiWards;

    // Filter wards based on selection
    const activeWards = selectedWard === "all"
        ? wards
        : wards.filter((w: any) => w.id === selectedWard);

    // Calculate averages (safely handle empty array)
    const avgPM25 = activeWards.length > 0
        ? Math.round(activeWards.reduce((acc: number, w: any) => acc + w.pm25, 0) / activeWards.length)
        : 0;

    const avgTemp = activeWards.length > 0
        ? Math.round(activeWards.reduce((acc: number, w: any) => acc + w.temperature, 0) / activeWards.length)
        : 0;

    const avgHumidity = activeWards.length > 0
        ? Math.round(activeWards.reduce((acc: number, w: any) => acc + w.humidity, 0) / activeWards.length)
        : 0;

    const avgWind = activeWards.length > 0
        ? Math.round(activeWards.reduce((acc: number, w: any) => acc + w.windSpeed, 0) / activeWards.length)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Avg PM2.5" value={`${avgPM25} µg/m³`} icon={Activity} color="text-red-500" trend={activeWards.length > 0 ? "+5% from yesterday" : "No data"} />
            <MetricCard title="Temperature" value={`${avgTemp}°C`} icon={ThermometerSun} color="text-orange-500" />
            <MetricCard title="Humidity" value={`${avgHumidity}%`} icon={Droplets} color="text-blue-500" />
            <MetricCard title="Wind Speed" value={`${avgWind} km/h`} icon={Wind} color="text-slate-500" />
        </div>
    );
}
