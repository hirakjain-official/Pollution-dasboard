import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HotspotMap } from "@/components/dashboard/HotspotMap";
import { Map, Clock, AlertTriangle, CheckCircle2, CalendarClock, MapPin, Navigation, FileDown, Sun, Moon, Sunset, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function ShiftPlanner() {
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
        // ... existing PDF logic stays same as it uses SHIFT_PLANS scope ...
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
                            onClick={() => alert("AI Planning requires OPENROUTER_API_KEY. Backend integration is ready.")}
                        >
                            <Sparkles className="w-4 h-4" /> AI Auto-Plan
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
                            <FileDown className="w-4 h-4" /> Download Plan
                        </Button>
                        <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                            {allRoutes.length} Total Active Routes
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-6">

                {/* Master 24-Hour Map */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Map className="w-4 h-4 text-slate-500" /> Full Day Coverage Overview
                    </h3>
                    <div className="h-[300px] w-full rounded-xl overflow-hidden border shadow-sm relative z-0">
                        <HotspotMap
                            selectedWard="all"
                            generatedPlan={null}
                            additionalRoutes={allRoutes}
                            className="h-full w-full"
                            title="24-Hour Master Plan"
                            showLegend={false}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(SHIFT_PLANS).map(([key, plan]) => (
                        <div key={key} className="space-y-3 border rounded-lg p-3 bg-slate-50/50">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {key === 'morning' && <Sun className="w-4 h-4 text-orange-500" />}
                                    {key === 'evening' && <Sunset className="w-4 h-4 text-purple-500" />}
                                    {key === 'night' && <Moon className="w-4 h-4 text-blue-900" />}
                                    <h3 className="font-semibold text-sm capitalize">{key} Shift</h3>
                                </div>
                                <Badge variant="outline" className="text-[10px] h-5 bg-white">
                                    {plan.route.length + (plan.extraRoutes?.length || 0)} Routes
                                </Badge>
                            </div>

                            <div className="h-[200px] rounded-lg overflow-hidden border shadow-sm relative group bg-white">
                                <HotspotMap
                                    selectedWard="all"
                                    generatedPlan={{ route: plan.route, steps: plan.steps, impactedWards: plan.impactedWards }}
                                    additionalRoutes={plan.extraRoutes}
                                    className="h-full w-full"
                                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                                    showLegend={false}
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <Badge variant="secondary" className="text-[10px] w-full justify-center bg-slate-100 text-slate-600">
                                        Focus: {plan.focus.split('&')[0]}...
                                    </Badge>
                                </div>
                                <ul className="space-y-1">
                                    {plan.steps.slice(0, 2).map((step: string, i: number) => (
                                        <li key={i} className="flex gap-1.5 text-[10px] text-slate-500 items-start leading-tight">
                                            <span className="mt-0.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card >
    );
}
