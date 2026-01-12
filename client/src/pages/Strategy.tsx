import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Sparkles, LogOut, Target, TrendingUp, DollarSign, Calendar, Bot, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { OptimizationStrategyCard } from "@/components/dashboard/OptimizationStrategyCard";
import { PolicySimulator } from "@/components/dashboard/PolicySimulator";
import { LongTermGoals } from "@/components/dashboard/LongTermGoals";
import { InterventionEfficacy } from "@/components/dashboard/InterventionEfficacy";
import { ShiftPlanner } from "@/components/dashboard/ShiftPlanner";

export default function Strategy() {
    const [, setLocation] = useLocation();
    const [aiOpen, setAiOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState<any>(null);

    const handleLogout = () => {
        setLocation("/");
    };

    const handleAskAI = async () => {
        setAiOpen(true);
        if (insight) return; // Don't refetch if already present

        setLoading(true);
        try {
            const res = await fetch("/api/ai/strategy", {
                method: "POST"
            });
            const data = await res.json();
            setInsight(data);
        } catch (e) {
            console.error(e);
            setInsight({
                analysis: "AI Service Temporarily Unavailable. Please rely on manual charts.",
                shortTermGoals: ["Maintain current AQI", "Monitor hotspots"],
                longTermGoals: ["Evaluation pending"],
                riskAssessment: "Unable to assess risk at this moment."
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Strategy Header */}
            <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/gov-dashboard">
                            <Button variant="ghost" size="icon" className="mr-1">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-tight">Operational Strategy</h1>
                            <Badge variant="outline" className="text-[10px] font-normal border-purple-200 text-purple-700">MCD Resource Optimization</Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        <Button
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 gap-2"
                            onClick={handleAskAI}
                        >
                            <Bot className="w-4 h-4" />
                            Ask AI Advisor
                        </Button>
                        <Button variant="ghost" size="icon" title="Logout" onClick={handleLogout}>
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    {/* Intro Section */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Resource Deployment Planning</h2>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                AI-driven allocation of sprinklers, anti-smog guns, and mechanical sweepers to maximize impact.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-600 hover:bg-emerald-700">
                                <Target className="w-3 h-3 mr-1" /> On Track: 2 Goals
                            </Badge>
                            <Badge variant="secondary">
                                <Calendar className="w-3 h-3 mr-1" /> Next Review: Q3 2026
                            </Badge>
                        </div>
                    </div>

                    {/* Main Grid Layout */}
                    {/* Main Content Areas */}
                    <Tabs defaultValue="deployment" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                                <TabsTrigger value="deployment">Deployment Operations</TabsTrigger>
                                <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* TAB 1: DEPLOYMENT OPERATIONS */}
                        <TabsContent value="deployment" className="space-y-6">
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                                {/* Left: Planner & Map (8 cols) */}
                                <div className="xl:col-span-8 flex flex-col gap-6">
                                    <ShiftPlanner />
                                </div>

                                {/* Right: Inventory Allocator (4 cols) */}
                                <div className="xl:col-span-4 flex flex-col gap-6">
                                    <OptimizationStrategyCard />
                                    <LongTermGoals />
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 2: IMPACT ANALYSIS */}
                        <TabsContent value="analysis" className="space-y-6">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <PolicySimulator />
                                <div className="flex flex-col gap-6">
                                    <InterventionEfficacy />
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                        <h4 className="font-bold text-blue-900 mb-2">Simulation Logic</h4>
                                        <p className="text-xs text-blue-800">
                                            The simulator uses historical AQI response data to predict the outcome of operational intensity changes. Values are estimates.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* AI Advisor Dialog */}
            <Dialog open={aiOpen} onOpenChange={setAiOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-purple-700">
                            <Bot className="w-6 h-6" />
                            Strategic AI Advisor
                        </DialogTitle>
                        <DialogDescription>
                            Real-time analysis of city-wide pollution metrics and policy impact.
                        </DialogDescription>
                    </DialogHeader>

                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                            <p>Analyzing policy data...</p>
                        </div>
                    ) : insight ? (
                        <div className="space-y-6 py-2">
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-sm leading-relaxed text-slate-800">
                                <h4 className="font-semibold text-purple-900 mb-2">Current Analysis</h4>
                                {insight.analysis}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Short Term</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        {insight.shortTermGoals?.map((g: string, i: number) => <li key={i}>{g}</li>)}
                                    </ul>
                                </div>
                                <div className="border rounded-lg p-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Long Term</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        {insight.longTermGoals?.map((g: string, i: number) => <li key={i}>{g}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-900 text-sm">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                                <div>
                                    <span className="font-bold">Risk Assessment:</span> {insight.riskAssessment}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <DialogFooter>
                        <Button onClick={() => setAiOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
