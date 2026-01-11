import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bot, LogOut, Loader2, FileText, CheckCircle2, AlertTriangle, Sparkles, LayoutDashboard, BarChart3, X } from "lucide-react";
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

// Mock AI Service Response
const mockGeneratePlan = async (mission: string) => {
    return new Promise<{ route: [number, number][], steps: string[], impactedWards: string[] }>((resolve) => {
        setTimeout(() => {
            resolve({
                route: [
                    [28.6139, 77.2090], // Start (Central Delhi)
                    [28.6448, 77.2167], // Karol Bagh
                    [28.6692, 77.2223], // Civil Lines
                    [28.7041, 77.1025], // Rohini
                ],
                steps: [
                    "Deploy sprinkling trucks to Karol Bagh Main Market (High PM2.5).",
                    "Proceed North-West via Ring Road to Civil Lines.",
                    "Set up anti-smog guns at Rohini Sector 13 intersection.",
                    "Coordinate with traffic police for route clearance."
                ],
                impactedWards: ["ward-001", "ward-002", "ward-005"]
            });
        }, 2000);
    });
};

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
        const plan = await mockGeneratePlan(textToUse);
        setGeneratedPlan(plan);
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen bg-background relative">
            {/* Gov Header */}
            <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-tight">Gov. Mission Planner</h1>
                            <Badge variant="outline" className="text-[10px] font-normal">AI-Powered Decision Support</Badge>
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
        </div>
    );
}
