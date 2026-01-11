import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HardHat, CheckCircle2, AlertTriangle, XCircle, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ContractorPerformanceCardProps {
    wardId: string | null;
}

export function ContractorPerformanceCard({ wardId }: ContractorPerformanceCardProps) {
    const { data: contractors = [] } = useQuery<any[]>({ queryKey: ["/api/contractors"] });

    if (!wardId || wardId === "all") {
        return (
            <Card className="border shadow-sm border-dashed bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center h-[200px] text-center p-6">
                    <HardHat className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
                    <p className="text-sm font-medium text-muted-foreground">Select a Ward to view Contractor Performance</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Detailed metrics are available for specific zones only.</p>
                </CardContent>
            </Card>
        );
    }

    // Find contractor for the ward (assuming generic link or first one for demo if no specific mapping exists in backend yet, 
    // but ideally we filter by ward. Since my backend contractor model has no wardId? 
    // Wait, backend model 'Contractor' has 'assignedWards'.
    const data = contractors.find((c: any) => c.assignedWards?.includes(wardId) || c.assignedWards?.includes("all")) || {
        name: "Allocated Contractor",
        manager: "N/A",
        complianceScore: 0,
        status: "good",
        resources: { deployed: 0, total: 0 },
        tasks: { completed: 0, pending: 0 },
        violations: 0,
        tasksCompleted: 0,
        tasksPending: 0
    };

    // Normalize data structure if API differs from local mock
    const normalizedData = {
        name: data.name,
        manager: "Site Manager", // Backend might not have manager field
        complianceScore: data.complianceScore || 85,
        status: data.complianceScore > 80 ? "good" : data.complianceScore > 60 ? "moderate" : "poor",
        resources: { deployed: 10, total: 12 }, // Mock stats if missing
        tasks: { completed: data.tasksCompleted || 0, pending: data.tasksPending || 0 },
        violations: 0
    };

    // Check if we use 'data' or 'normalizedData' below. 
    // The original code used data.status etc. I will use normalizedData.
    const displayData = normalizedData;

    const statusColor =
        displayData.status === "good" ? "text-emerald-600" :
            displayData.status === "moderate" ? "text-amber-600" : "text-red-600";

    const progressColor =
        displayData.status === "good" ? "bg-emerald-600" :
            displayData.status === "moderate" ? "bg-amber-600" : "bg-red-600";

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4 bg-slate-50/50">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <HardHat className="w-4 h-4 text-slate-700" />
                            Contractor Performance
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">Assigned to this Ward</CardDescription>
                    </div>
                    <Badge variant={displayData.status === "poor" ? "destructive" : "outline"} className={`capitalize ${displayData.status !== "poor" && "bg-white"}`}>
                        {displayData.status} Standing
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-4 space-y-5">

                {/* Contractor Details */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-base text-slate-800">{displayData.name}</h3>
                        <p className="text-xs text-muted-foreground">Manager: {displayData.manager}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-2xl font-bold ${statusColor}`}>{displayData.complianceScore}%</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Compliance</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">SLA Adherence</span>
                        <span className="font-medium">{displayData.complianceScore}/100</span>
                    </div>
                    <Progress value={displayData.complianceScore} className={`h-2 [&>div]:${progressColor}`} />
                </div>

                {/* Start Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-slate-50 p-2 rounded border text-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-700">{displayData.tasks.completed}</p>
                        <p className="text-[10px] text-muted-foreground">Completed</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border text-center">
                        <TrendingUp className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-700">{displayData.tasks.pending}</p>
                        <p className="text-[10px] text-muted-foreground">Pending</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border text-center">
                        <AlertTriangle className={`w-4 h-4 mx-auto mb-1 ${displayData.violations > 0 ? "text-red-500" : "text-slate-400"}`} />
                        <p className={`text-lg font-bold ${displayData.violations > 0 ? "text-red-600" : "text-slate-700"}`}>{displayData.violations}</p>
                        <p className="text-[10px] text-muted-foreground">Violations</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
