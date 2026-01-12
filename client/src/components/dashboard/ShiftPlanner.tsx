import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HotspotMap } from "@/components/dashboard/HotspotMap";
import { Map, Clock, AlertTriangle, CheckCircle2, CalendarClock, MapPin, Navigation, FileDown, Sun, Moon, Sunset, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export function ShiftPlanner() {
    const [activeRoute, setActiveRoute] = useState<any>(null);

    const fetchShift = (type: string) => useQuery({
        queryKey: [`/api/shifts?type=${type}`]
    });

    const { data: morningData, isLoading: mLoading } = fetchShift("morning");
    const { data: eveningData, isLoading: eLoading } = fetchShift("evening");
    const { data: nightData, isLoading: nLoading } = fetchShift("night");

    const transformPlan = (data: any, title: string, defaultFocus: string) => {
        if (!data || !data.routes || data.routes.length === 0) {
            return {
                title,
                focus: defaultFocus,
                route: [],
                extraRoutes: [],
                steps: ["No active plan found."],
                impactedWards: []
            };
        }

        const mainRoute = data.routes.find((r: any) => r.priority === 'High') || data.routes[0];
        const extraRoutes = data.routes
            .filter((r: any) => r !== mainRoute)
            .map((r: any, idx: number) => ({
                path: r.path,
                color: ["#eab308", "#3b82f6", "#a855f7", "#ef4444", "#f97316"][idx % 5],
                label: r.assignedTo || `Unit ${idx + 1}`
            }));

        return {
            title,
            focus: data.focus || defaultFocus,
            route: mainRoute.path,
            extraRoutes,
            steps: data.steps || [],
            impactedWards: data.impactedWards || []
        };
    };

    const SHIFT_PLANS = {
        morning: transformPlan(morningData, "Morning Shift (06:00 - 14:00)", "School Zones & Markets"),
        evening: transformPlan(eveningData, "Evening Shift (14:00 - 22:00)", "Traffic Intersections"),
        night: transformPlan(nightData, "Night Shift (22:00 - 06:00)", "Construction Sites")
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Daily Pollution Control Operations Plan", 14, 22);

        doc.setFontSize(11);
        doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 30);

        const tableRows: any[] = [];

        Object.entries(SHIFT_PLANS).forEach(([shiftKey, plan]) => {
            // Main Route
            if (plan.route && plan.route.length > 0) {
                tableRows.push([
                    plan.title,
                    "MAIN ROUTE",
                    "High Priority",
                    plan.focus,
                    "Primary Team"
                ]);
            }

            // Extra Routes
            plan.extraRoutes.forEach((route: any, idx: number) => {
                tableRows.push([
                    plan.title,
                    route.label,
                    "Standard",
                    plan.focus,
                    `Unit ${idx + 1}`
                ]);
            });
        });

        // @ts-ignore
        autoTable(doc, {
            head: [['Shift', 'Route Name', 'Priority', 'Focus Area', 'Assigned Unit']],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
        });

        doc.save("daily-operations-plan.pdf");
    };

    // Aggregate all routes for the 24-Hour Master View
    const allRoutes = [
        ...(SHIFT_PLANS.morning.route && SHIFT_PLANS.morning.route.length ? [{ path: SHIFT_PLANS.morning.route, color: "#f97316", label: "Morning Main" }] : []),
        ...SHIFT_PLANS.morning.extraRoutes,
        ...(SHIFT_PLANS.evening.route && SHIFT_PLANS.evening.route.length ? [{ path: SHIFT_PLANS.evening.route, color: "#a855f7", label: "Evening Main" }] : []),
        ...SHIFT_PLANS.evening.extraRoutes,
        ...(SHIFT_PLANS.night.route && SHIFT_PLANS.night.route.length ? [{ path: SHIFT_PLANS.night.route, color: "#3b82f6", label: "Night Main" }] : []),
        ...SHIFT_PLANS.night.extraRoutes
    ];


    const queryClient = useQueryClient();

    const handleAutoPlan = async () => {
        try {
            await Promise.all([
                fetch("/api/shifts/auto-generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "morning" }) }),
                fetch("/api/shifts/auto-generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "evening" }) }),
                fetch("/api/shifts/auto-generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "night" }) })
            ]);
            // Invalidate queries to refresh map
            queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
            alert("AI Plan Generated Successfully! Map initialized.");
        } catch (e) {
            console.error(e);
            alert("Failed to generate plan. Ensure backend is running.");
        }
    };

    const handleRouteClick = (route: any) => {
        console.log("Route clicked:", route);
        setActiveRoute(route);
    };

    return (
        <Card className="border shadow-md bg-white">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarClock className="w-5 h-5 text-indigo-600" />
                            24-Hour Deployment Plan
                        </CardTitle>
                        <CardDescription>Automated route generation for next operational day.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm"
                            onClick={handleAutoPlan}
                        >
                            <Sparkles className="w-3 h-3" />
                            AI Auto-Plan
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            onClick={handleExportPDF}
                        >
                            <FileDown className="w-3 h-3" />
                            Download Plan
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-6">

                {/* Master 24-Hour Map */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Map className="w-4 h-4 text-slate-500" /> Full Day Coverage Overview
                        </h3>
                        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                            {allRoutes.length} Active Routes
                        </Badge>
                    </div>
                    <div className="h-[350px] w-full rounded-xl overflow-hidden border shadow-sm relative z-0">
                        <HotspotMap
                            selectedWard="all"
                            generatedPlan={null}
                            additionalRoutes={allRoutes}
                            className="h-full w-full"
                            title="24-Hour Master Deployment Plan"
                            showLegend={true}
                            onRouteClick={handleRouteClick}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Morning Shift */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Sun className="w-4 h-4 text-orange-500" /> Morning Shift
                            </h3>
                            <Badge variant="outline" className="text-xs">{SHIFT_PLANS.morning.focus}</Badge>
                        </div>
                        <HotspotMap
                            selectedWard="all"
                            className="h-[250px] rounded-lg border-2 border-orange-100"
                            generatedPlan={{
                                route: SHIFT_PLANS.morning.route,
                                steps: [],
                                impactedWards: SHIFT_PLANS.morning.impactedWards
                            }}
                            additionalRoutes={SHIFT_PLANS.morning.extraRoutes}
                            title="06:00 - 14:00 Coverage"
                            showLegend={false}
                            onRouteClick={handleRouteClick}
                        />
                        <div className="text-xs text-muted-foreground bg-slate-50 p-2 rounded border">
                            <strong>Active Units:</strong> {SHIFT_PLANS.morning.extraRoutes.length + 1} | <strong>Focus:</strong> {SHIFT_PLANS.morning.focus}
                        </div>
                    </div>

                    {/* Evening Shift */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Sunset className="w-4 h-4 text-purple-500" /> Evening Shift
                            </h3>
                            <Badge variant="outline" className="text-xs">{SHIFT_PLANS.evening.focus}</Badge>
                        </div>
                        <HotspotMap
                            selectedWard="all"
                            className="h-[250px] rounded-lg border-2 border-purple-100"
                            generatedPlan={{
                                route: SHIFT_PLANS.evening.route,
                                steps: [],
                                impactedWards: SHIFT_PLANS.evening.impactedWards
                            }}
                            additionalRoutes={SHIFT_PLANS.evening.extraRoutes}
                            title="14:00 - 22:00 Coverage"
                            showLegend={false}
                            onRouteClick={handleRouteClick}
                        />
                        <div className="text-xs text-muted-foreground bg-slate-50 p-2 rounded border">
                            <strong>Active Units:</strong> {SHIFT_PLANS.evening.extraRoutes.length + 1} | <strong>Focus:</strong> {SHIFT_PLANS.evening.focus}
                        </div>
                    </div>

                    {/* Night Shift */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Moon className="w-4 h-4 text-indigo-500" /> Night Shift
                            </h3>
                            <Badge variant="outline" className="text-xs">{SHIFT_PLANS.night.focus}</Badge>
                        </div>
                        <HotspotMap
                            selectedWard="all"
                            className="h-[250px] rounded-lg border-2 border-indigo-100"
                            generatedPlan={{
                                route: SHIFT_PLANS.night.route,
                                steps: [],
                                impactedWards: SHIFT_PLANS.night.impactedWards
                            }}
                            additionalRoutes={SHIFT_PLANS.night.extraRoutes}
                            title="22:00 - 06:00 Coverage"
                            showLegend={false}
                            onRouteClick={handleRouteClick}
                        />
                        <div className="text-xs text-muted-foreground bg-slate-50 p-2 rounded border">
                            <strong>Active Units:</strong> {SHIFT_PLANS.night.extraRoutes.length + 1} | <strong>Focus:</strong> {SHIFT_PLANS.night.focus}
                        </div>
                    </div>
                </div>

                {/* Route Details Dialog */}
                <Dialog open={!!activeRoute} onOpenChange={() => setActiveRoute(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-blue-600" />
                                Route Details
                            </DialogTitle>
                            <DialogDescription>
                                Active deployment status for selected unit.
                            </DialogDescription>
                        </DialogHeader>

                        {activeRoute && (
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded-md border">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-muted-foreground">Assigned Unit:</div>
                                        <div className="font-medium">{activeRoute.label || activeRoute.assignedTo || "Standard Unit"}</div>

                                        <div className="text-muted-foreground">Vehicle ID:</div>
                                        <div className="font-medium">DL-1GC-{Math.floor(Math.random() * 9000) + 1000}</div>

                                        <div className="text-muted-foreground">Driver:</div>
                                        <div className="font-medium">{(["Ramesh Kumar", "Suresh Singh", "Vijay Yadav", "Amit Verma"])[Math.floor(Math.random() * 4)]}</div>

                                        <div className="text-muted-foreground">Status:</div>
                                        <Badge className="w-fit bg-emerald-500">Active - On Route</Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Live Telemetry</h4>
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                        <div className="p-2 border rounded bg-white">
                                            <div className="text-muted-foreground">Speed</div>
                                            <div className="font-bold text-lg">34 <span className="text-[10px] font-normal">km/h</span></div>
                                        </div>
                                        <div className="p-2 border rounded bg-white">
                                            <div className="text-muted-foreground">Water Level</div>
                                            <div className="font-bold text-lg text-blue-600">76%</div>
                                        </div>
                                        <div className="p-2 border rounded bg-white">
                                            <div className="text-muted-foreground">Sprinkling</div>
                                            <div className="font-bold text-lg text-emerald-600">ON</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button variant="outline" size="sm" onClick={() => setActiveRoute(null)}>Close</Button>
                                    <Button size="sm" className="ml-2 bg-blue-600 hover:bg-blue-700">Contact Driver</Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
