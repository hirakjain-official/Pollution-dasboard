import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";

export function DecisionSupportPanel({ onGeneratePlan }: { onGeneratePlan: (mission: string) => void }) {
    const insights = [
        {
            id: 1,
            type: "critical",
            message: "Ward D (Shahdara) PM2.5 spiked +30% in last hour.",
            action: "Deploy Anti-Smog Gun",
            impact: "Expected -15% PM reduction",
        },
        {
            id: 2,
            type: "warning",
            message: "Traffic congestion increasing in Central Ward.",
            action: "Reroute Sprinklers",
            impact: "Avoid delay of 20 mins",
        },
    ];

    return (
        <Card className="border shadow-sm border-l-4 border-l-primary/50">
            <CardHeader className="pb-2 pt-4 px-4 bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    AI Decision Support
                </CardTitle>
                <CardDescription className="text-xs">Real-time analysis & recommendations</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-3 space-y-3">
                {insights.map((insight) => (
                    <div key={insight.id} className="p-3 bg-white border rounded-lg shadow-sm">
                        <div className="flex items-start gap-2">
                            {insight.type === "critical" ? (
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className="text-xs font-medium text-slate-800">{insight.message}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> {insight.impact}
                                    </span>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="h-6 text-[10px] px-2"
                                        onClick={() => onGeneratePlan(insight.action)}
                                    >
                                        Execute <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
