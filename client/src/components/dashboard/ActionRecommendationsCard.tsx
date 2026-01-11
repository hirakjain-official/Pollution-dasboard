import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Lightbulb, Clock, Play, CheckCircle, Users, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function ActionRecommendationsCard({ selectedWard }: { selectedWard: string }) {
    const { data: wards = [] } = useQuery<any[]>({ queryKey: ["/api/wards"] });
    const { data: recommendations = [] } = useQuery<any[]>({ queryKey: ["/api/actions/recommendations"] });

    const filtered = selectedWard === "all"
        ? recommendations
        : recommendations.filter((a: any) => wards.find((w: any) => w.id === selectedWard)?.name === a.ward);

    const statusIcons: any = { pending: <Clock className="w-4 h-4 text-amber-500" />, in_progress: <Play className="w-4 h-4 text-blue-500" />, completed: <CheckCircle className="w-4 h-4 text-emerald-500" /> };
    const priorityColors: any = { high: "bg-red-100 text-red-700 border-red-200", medium: "bg-amber-100 text-amber-700 border-amber-200", low: "bg-gray-100 text-gray-700 border-gray-200" };

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Action Recommendations
                    <Badge className="ml-auto">{filtered.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <ScrollArea className="h-[280px]">
                    <div className="space-y-2 pr-3">
                        {filtered.map((rec, i) => (
                            <motion.div key={rec.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                className={`p-3 rounded-lg border ${priorityColors[rec.priority]}`} data-testid={`recommendation-${rec.id}`}>
                                <div className="flex items-start gap-2">
                                    {statusIcons[rec.status]}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{rec.action}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <Badge variant="outline" className="text-[10px] h-5">{rec.ward}</Badge>
                                            <Badge variant="outline" className="text-[10px] h-5"><Users className="w-3 h-3 mr-1" />{rec.department}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Target className="w-3 h-3" />{rec.estimatedImpact}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rec.deadline}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
