import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp, ArrowUpRight } from "lucide-react";

export function InterventionEfficacy() {
    const interventions = [
        { name: "Mech. Sweeping", impact: 92, trend: "+5%", label: "Highly Effective" },
        { name: "Anti-Smog Guns", impact: 65, trend: "-2%", label: "Moderate" },
        { name: "Water Sprinkling", impact: 88, trend: "+12%", label: "Effective" },
        { name: "Traffic Diversion", impact: 45, trend: "Stable", label: "Low Impact" },
    ];

    return (
        <Card className="border shadow-md bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Intervention Efficacy
                </CardTitle>
                <CardDescription>Impact analysis of current actions on AQI reduction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="space-y-4">
                    {interventions.map((item, i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-700">{item.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold ${item.trend.includes("+") ? "text-emerald-600" : "text-amber-600"
                                        }`}>
                                        {item.trend}
                                    </span>
                                    <Badge variant="secondary" className="text-[10px] h-5 bg-slate-100 text-slate-600">
                                        {item.label}
                                    </Badge>
                                </div>
                            </div>
                            <Progress value={item.impact} className="h-2" indicatorClassName={
                                item.impact > 80 ? "bg-emerald-500" : item.impact > 60 ? "bg-blue-500" : "bg-amber-500"
                            } />
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                    <ArrowUpRight className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-amber-900">Optimization Insight</p>
                        <p className="text-[10px] text-amber-800 leading-snug">
                            "Mechanical Sweeping" is currently outperforming "Smog Guns" by 27%. Recommend shifting 2 Operations Teams to Sweeping duty for better ROI.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
