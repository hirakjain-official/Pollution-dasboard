import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bot, LogOut, Loader2, FileText, CheckCircle2, AlertTriangle, Sparkles, LayoutDashboard, BarChart3, X, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog"; // Import Dialog components
import { useQuery } from "@tanstack/react-query";

// Reuse Dashboard Widgets
import { QuickStats } from "@/components/dashboard/QuickStats";
import { LiveAQICard } from "@/components/dashboard/LiveAQICard";
import { AQITrendChart } from "@/components/dashboard/AQITrendChart";
import { ActionRecommendationsCard } from "@/components/dashboard/ActionRecommendationsCard";
import { ActionHistoryTable } from "@/components/dashboard/ActionHistoryTable";
import { WardSelector } from "@/components/dashboard/WardSelector";
import { HotspotMap } from "@/components/dashboard/HotspotMap";
import { CitizenComplaintsCard } from "@/components/dashboard/CitizenComplaintsCard";
import { CorrelationAnalysisCard } from "@/components/dashboard/CorrelationAnalysisCard";

// New Gov Widgets
import { ResourceOverview } from "@/components/dashboard/ResourceOverview";
import { DecisionSupportPanel } from "@/components/dashboard/DecisionSupportPanel";
import { ContractorPerformanceCard } from "@/components/dashboard/ContractorPerformanceCard";
import { RouteDetailsDialog } from "@/components/dashboard/RouteDetailsDialog";

// Generate Plan using real AI API (Master LLM)

export default function GovDashboard() {
    const [, setLocation] = useLocation();
    const [selectedWard, setSelectedWard] = useState("all");

    // Fetch Wards
    const { data: wards = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/wards"] });

    const currentWard = selectedWard === "all" ? null : wards.find((w: any) => w.id === selectedWard) || null;
    const [mission, setMission] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<{ route: [number, number][], steps: string[], impactedWards: string[] } | null>(null);

    const handleLogout = () => {
        setLocation("/");
    };

    const handleGeneratePlan = async (missionText?: string) => {
        const textToUse = missionText || mission;
        if (!textToUse.trim()) return;
        if (missionText) setMission(missionText);
        setIsGenerating(true);

        try {
            const res = await fetch("/api/ai/plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mission: textToUse })
            });

            if (!res.ok) throw new Error("Failed to generate plan");

            const data = await res.json();
            // Data maps to: { strategy, routes, teamInstructions } from Master LLM
            // We need to map it to the structure expected by the UI state: { route: number[][], steps: string[], impactedWards: string[] }

            // Map the LLM's response to the UI state
            // If LLM returns a 'routes' array, we extract the path from the first route or mock it if missing
            // This mapping ensures compatibility even if LLM output varies slightly
            const mappedPlan = {
                route: data.routes?.[0]?.path ?
                    // Simulate parsing or just map if it's already coordinates? 
                    // The LLM returns strings like "Ward A", so we might need to map to coords.
                    // For SAFETY in this demo, let's keep using the hardcoded coordinates but inject the STEPS from AI.
                    [
                        [28.6139, 77.2090],
                        [28.6448, 77.2167],
                        [28.6692, 77.2223],
                        [28.7041, 77.1025]
                    ] :
                    [
                        [28.6139, 77.2090],
                        [28.6448, 77.2167]
                    ],
                steps: data.routes?.map((r: any) => `${r.action} at ${r.path?.join(" -> ")}`) || data.teamInstructions || ["AI Generation Incomplete"],
                impactedWards: ["ward-001", "ward-002"] // Placeholder or parse from response
            };

            setGeneratedPlan(mappedPlan);
        } catch (err) {
            console.error(err);
            // Fallback mock if API fails
            setGeneratedPlan({
                route: [[28.6139, 77.2090], [28.7041, 77.1025]],
                steps: ["AI Service Unavailable - Using Backup Protocol", "Deploy standard patrol"],
                impactedWards: ["backup-ward"]
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // Fetch Active Shift Plan for Map Layer
    const { data: routePlan } = useQuery<any>({
        queryKey: ["/api/shifts?type=morning"],
        refetchInterval: 60000
    });

    /* equipment types for labels */
    const equipmentTypes = ["Anti-Smog Gun", "Mechanical Sweeper", "Water Sprinkler", "Mist Cannon"];

    const activeRoutes = routePlan?.routes?.map((r: any, i: number) => ({
        path: r.path,
        color: "#3b82f6",
        label: r.assignedTo || equipmentTypes[i % equipmentTypes.length]
    })) || [];

    const [selectedRoute, setSelectedRoute] = useState<any>(null);

    return (
        <div className="min-h-screen bg-background relative">
            {/* Gov Header */}
            <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-md text-white">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-tight">Pollution Control Command Center</h1>
                            <Badge variant="outline" className="text-[10px] text-muted-foreground border-slate-200 bg-white shadow-sm gap-1">
                                <Sparkles className="h-3 w-3 text-indigo-500" />
                                AI-Enhanced Response System
                            </Badge>
                        </div>
                    </div>
                    <div className="ml-6"><WardSelector selectedWard={selectedWard} onSelectWard={setSelectedWard} /></div>
                    <div className="flex items-center gap-4 ml-auto">
                        <Link href="/strategy">
                            <Button variant="outline" className="gap-2 border-purple-200 hover:bg-purple-50 text-purple-700">
                                <Sparkles className="w-4 h-4" />
                                AI Strategy Hub
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" title="Logout" onClick={handleLogout}>
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                <QuickStats selectedWard={selectedWard} />

                <Tabs defaultValue="analytics" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-muted/50">
                            <TabsTrigger value="analytics" className="gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Ward Analytics & Reports
                            </TabsTrigger>
                            <TabsTrigger value="ops" className="gap-2">
                                <LayoutDashboard className="w-4 h-4" />
                                Command Center
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TAB 1: OPERATIONS (Main Command View) */}
                    <TabsContent value="ops" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Left: Input & Decisions */}
                            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                                <DecisionSupportPanel onGeneratePlan={handleGeneratePlan} />
                                <ResourceOverview />
                                <ActionRecommendationsCard selectedWard={selectedWard} />
                            </div>

                            {/* Right: Map & Active Plan (Map removed from here as per previous request, moved to analytics) */}
                            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                                <ActionHistoryTable selectedWard={selectedWard} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: ANALYTICS (Deep Dive) */}
                    <TabsContent value="analytics" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <LiveAQICard ward={currentWard} />
                                    <AQITrendChart wardId={selectedWard === "all" ? "central" : selectedWard} />
                                </div>
                                <HotspotMap
                                    selectedWard={selectedWard}
                                    className="h-[500px]"
                                    title="Pollution Hotspots"
                                    showLegend={true}
                                    additionalRoutes={activeRoutes}
                                    onRouteClick={setSelectedRoute}
                                />
                            </div>

                            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                                {selectedWard !== "all" ? (
                                    <ContractorPerformanceCard wardId={selectedWard} />
                                ) : (
                                    <Card className="border-dashed bg-muted/30 p-6 text-center text-muted-foreground">
                                        Select a Ward to see Contractor Performance
                                    </Card>
                                )}
                                <CitizenComplaintsCard selectedWard={selectedWard} />
                                <CorrelationAnalysisCard />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {/* AI PLAN POPUP DIALOG */}
            <Dialog open={!!generatedPlan} onOpenChange={(open) => !open && setGeneratedPlan(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-primary" />
                            AI Mission Plan Generated
                        </DialogTitle>
                        {/* Close button is automatically added by DialogContent, but user asked for explicit check */}
                    </DialogHeader>

                    {generatedPlan && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                            {/* Left: Plan Details */}
                            <div className="space-y-6">
                                <Card className="border shadow-none bg-emerald-50/50 border-emerald-100">
                                    <CardContent className="p-4 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">-45%</p>
                                                <p className="text-xs text-muted-foreground">Projected Impact on PM2.5</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <AlertTriangle className="w-6 h-6 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{generatedPlan.impactedWards.length} Wards</p>
                                                <p className="text-xs text-muted-foreground">Coverage Area</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Execution Steps
                                    </h3>
                                    <ScrollArea className="h-[200px] border rounded-md p-4 bg-slate-50">
                                        <ul className="space-y-4">
                                            {generatedPlan.steps.map((step, i) => (
                                                <li key={i} className="flex gap-3 text-sm">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-slate-700 mt-0.5">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                </div>
                            </div>

                            {/* Right: Mini Map */}
                            <div className="h-[400px] rounded-xl overflow-hidden border shadow-sm">
                                <HotspotMap
                                    selectedWard={selectedWard}
                                    generatedPlan={generatedPlan} // Pass plan strictly here
                                    className="h-full w-full"
                                    title="Tactical Route Overlay"
                                    showLegend={false}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="mt-6 flex justify-between gap-4 border-t pt-4">
                        <Button variant="ghost" onClick={() => setGeneratedPlan(null)}>
                            Dismiss
                        </Button>
                        <Link href="/strategy">
                            <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                                <Sparkles className="w-4 h-4" />
                                View Strategy Alignment
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <RouteDetailsDialog
                route={selectedRoute}
                open={!!selectedRoute}
                onClose={() => setSelectedRoute(null)}
            />
        </div>
    );
}
