import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Droplets,
    Truck,
    TreePine,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingDown,
    Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface ActionItem {
    id: string;
    name: string;
    status: "active" | "standby" | "maintenance";
    location: string;
    lastAction: string;
}

export function GovActionStatus() {
    // Simulated live data - would come from API in production
    const [actionStats, setActionStats] = useState({
        activeSprinklers: 47,
        totalSprinklers: 62,
        waterTankers: 23,
        totalTankers: 30,
        dustSweepers: 18,
        totalSweepers: 25,
        treePlanting: 156,
        complaintsResolved: 34,
        totalComplaints: 52,
        avgResponseTime: 2.5, // hours
        pollutionReduction: 12, // percentage
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setActionStats(prev => ({
                ...prev,
                activeSprinklers: Math.min(prev.totalSprinklers, Math.max(40, prev.activeSprinklers + Math.floor(Math.random() * 3 - 1))),
                waterTankers: Math.min(prev.totalTankers, Math.max(18, prev.waterTankers + Math.floor(Math.random() * 3 - 1))),
                dustSweepers: Math.min(prev.totalSweepers, Math.max(15, prev.dustSweepers + Math.floor(Math.random() * 3 - 1))),
                complaintsResolved: Math.min(prev.totalComplaints, prev.complaintsResolved + (Math.random() > 0.7 ? 1 : 0)),
            }));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const sprinklerPercent = (actionStats.activeSprinklers / actionStats.totalSprinklers) * 100;
    const tankerPercent = (actionStats.waterTankers / actionStats.totalTankers) * 100;
    const sweeperPercent = (actionStats.dustSweepers / actionStats.totalSweepers) * 100;
    const resolutionPercent = (actionStats.complaintsResolved / actionStats.totalComplaints) * 100;

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Government Action Status
                    <Badge variant="outline" className="ml-auto gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Active Equipment Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Sprinklers */}
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-800">Sprinklers</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">
                            {actionStats.activeSprinklers}<span className="text-sm font-normal text-blue-500">/{actionStats.totalSprinklers}</span>
                        </p>
                        <Progress value={sprinklerPercent} className="h-1.5 mt-2" />
                        <p className="text-[10px] text-blue-600 mt-1">{Math.round(sprinklerPercent)}% Active</p>
                    </div>

                    {/* Water Tankers */}
                    <div className="p-3 rounded-lg bg-sky-50 border border-sky-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-sky-600" />
                            <span className="text-xs font-medium text-sky-800">Water Tankers</span>
                        </div>
                        <p className="text-2xl font-bold text-sky-700">
                            {actionStats.waterTankers}<span className="text-sm font-normal text-sky-500">/{actionStats.totalTankers}</span>
                        </p>
                        <Progress value={tankerPercent} className="h-1.5 mt-2" />
                        <p className="text-[10px] text-sky-600 mt-1">{Math.round(tankerPercent)}% Deployed</p>
                    </div>

                    {/* Dust Sweepers */}
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 17h18M5 17V7a2 2 0 012-2h10a2 2 0 012 2v10M8 17v4M16 17v4" />
                            </svg>
                            <span className="text-xs font-medium text-amber-800">Road Sweepers</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-700">
                            {actionStats.dustSweepers}<span className="text-sm font-normal text-amber-500">/{actionStats.totalSweepers}</span>
                        </p>
                        <Progress value={sweeperPercent} className="h-1.5 mt-2" />
                        <p className="text-[10px] text-amber-600 mt-1">{Math.round(sweeperPercent)}% Operating</p>
                    </div>

                    {/* Trees Planted */}
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-2">
                            <TreePine className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-800">Trees This Month</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700">{actionStats.treePlanting}</p>
                        <p className="text-[10px] text-emerald-600 mt-1">+23 this week</p>
                    </div>
                </div>

                {/* Response Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t">
                    {/* Complaint Resolution */}
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Complaints Resolved</p>
                            <p className="text-sm font-bold">{actionStats.complaintsResolved}/{actionStats.totalComplaints}</p>
                            <p className="text-[10px] text-green-600">{Math.round(resolutionPercent)}% resolution rate</p>
                        </div>
                    </div>

                    {/* Avg Response Time */}
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="p-2 rounded-full bg-orange-100">
                            <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Avg Response Time</p>
                            <p className="text-sm font-bold">{actionStats.avgResponseTime} hrs</p>
                            <p className="text-[10px] text-orange-600">-30 min vs last week</p>
                        </div>
                    </div>

                    {/* Pollution Reduction */}
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="p-2 rounded-full bg-blue-100">
                            <TrendingDown className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">PM2.5 Reduction</p>
                            <p className="text-sm font-bold text-green-600">↓ {actionStats.pollutionReduction}%</p>
                            <p className="text-[10px] text-muted-foreground">vs yesterday</p>
                        </div>
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-amber-800">Active Alert: High AQI in North East Delhi</p>
                            <p className="text-[10px] text-amber-700 mt-0.5">
                                Extra sprinklers deployed • 3 water tankers en route • Estimated normalization: 2 hours
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Actions Feed */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Actions</p>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                        {[
                            { time: "2 min ago", action: "Sprinkler activated", location: "Shahdara Main Road" },
                            { time: "5 min ago", action: "Water tanker deployed", location: "North East Zone" },
                            { time: "12 min ago", action: "Complaint resolved", location: "Central Delhi" },
                            { time: "18 min ago", action: "Road sweeping completed", location: "New Delhi NDMC Area" },
                            { time: "25 min ago", action: "Dust barrier installed", location: "Construction Site, West" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs p-1.5 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                                <span className="text-[10px] text-muted-foreground w-16">{item.time}</span>
                                <span className="font-medium">{item.action}</span>
                                <span className="text-muted-foreground ml-auto text-[10px]">{item.location}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
