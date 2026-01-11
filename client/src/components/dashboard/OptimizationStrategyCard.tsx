import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Truck, Droplets, Wind, ArrowRight, Share2, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const MOCK_ALLOCATION = {
    hotspots: [
        { ward: "Ward 12 - Karol Bagh", priority: "Critical", resources: "4 Sprinklers, 2 Smog Guns" },
        { ward: "Ward 05 - Rohini", priority: "High", resources: "3 Sprinklers, 1 Smog Gun" },
        { ward: "Ward 08 - Civil Lines", priority: "Moderate", resources: "2 Sprinklers" },
    ],
    efficiency: "+35% Coverage"
};

export function OptimizationStrategyCard() {
    const [resources, setResources] = useState({
        sprinklers: 20,
        smogGuns: 8,
        sweepers: 15
    });
    const [allocation, setAllocation] = useState<typeof MOCK_ALLOCATION | null>(null);
    const [loading, setLoading] = useState(false);

    const handleOptimize = () => {
        setLoading(true);
        setTimeout(() => {
            setAllocation(MOCK_ALLOCATION);
            setLoading(false);
        }, 1500);
    };

    return (
        <Card className="border shadow-sm border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-600" />
                    MCD Resource Optimizer
                </CardTitle>
                <CardDescription className="text-xs">Input available inventory to generate optimal deployment plan.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-6">

                {/* Input Inventory */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Truck className="w-3 h-3" /> Sprinklers
                        </label>
                        <Input
                            type="number"
                            className="h-8 bg-white"
                            value={resources.sprinklers}
                            onChange={(e) => setResources({ ...resources, sprinklers: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Wind className="w-3 h-3" /> Smog Guns
                        </label>
                        <Input
                            type="number"
                            className="h-8 bg-white"
                            value={resources.smogGuns}
                            onChange={(e) => setResources({ ...resources, smogGuns: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Button
                            className="w-full h-full bg-purple-600 hover:bg-purple-700 text-white mt-auto"
                            onClick={handleOptimize}
                            disabled={loading}
                        >
                            {loading ? "..." : "Optimize"}
                        </Button>
                    </div>
                </div>

                {/* AI Output */}
                {allocation && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase text-purple-900 flex items-center gap-2">
                                <Share2 className="w-3.5 h-3.5" /> Optimal Distribution
                            </h4>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px]">
                                {allocation.efficiency} vs Manual
                            </Badge>
                        </div>

                        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                            <div className="divide-y">
                                {allocation.hotspots.map((item, i) => (
                                    <div key={i} className="p-3 flex items-start justify-between hover:bg-slate-50 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                <span className="text-sm font-medium text-slate-700">{item.ward}</span>
                                            </div>
                                            <div className="flex gap-2 text-xs text-muted-foreground pl-5">
                                                {item.resources}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`
                                            ${item.priority === "Critical" ? "bg-red-50 text-red-600 border-red-100" :
                                                item.priority === "High" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-blue-50 text-blue-600 border-blue-100"}
                                        `}>
                                            {item.priority}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 bg-slate-50 text-center border-t">
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-purple-600">
                                    View Full Deployment Schedule <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
