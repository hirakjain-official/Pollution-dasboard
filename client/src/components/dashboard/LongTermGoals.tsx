import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";

export function LongTermGoals() {
    const goals = [
        {
            title: "Achieve 100% Ward Sprinkling",
            deadline: "Todays Target",
            progress: 65,
            status: "In Progress",
            color: "bg-blue-500"
        },
        {
            title: "Reduce Complaint Backlog to Zero",
            deadline: "4 Hours Left",
            progress: 80,
            status: "On Track",
            color: "bg-emerald-500"
        },
        {
            title: "Deploy all Anti-Smog Guns",
            deadline: "Immediate",
            progress: 40,
            status: "Delayed",
            color: "bg-amber-500"
        }
    ];

    return (
        <Card className="border shadow-md bg-white h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    Operational Targets
                </CardTitle>
                <CardDescription>Daily MCD Performance Goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                {goals.map((goal, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                                <h4 className="font-semibold text-sm">{goal.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" /> {goal.deadline}
                                </div>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${goal.status === "On Track"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : goal.status === "In Progress"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-amber-100 text-amber-700"
                                }`}>
                                {goal.status}
                            </span>
                        </div>
                        <div className="relative pt-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-slate-700">{goal.progress}% Completed</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" indicatorClassName={goal.color} />
                        </div>
                    </div>
                ))}

                <div className="pt-4 mt-2 border-t">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                        <div>
                            <p className="text-xs font-bold text-purple-900">AI Optimization</p>
                            <p className="text-[10px] text-purple-700 leading-tight">
                                Re-route 3 empty tankers from Ward 5 to Ward 8 to meet the "100% Sprinkling" target by 5 PM.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
