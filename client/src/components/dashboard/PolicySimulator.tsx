import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Gauge, Droplets, Wind, Truck, TrendingDown } from "lucide-react";

export function PolicySimulator() {
    
    const [sweepingFreq, setSweepingFreq] = useState([2]); 
    const [sprinklerCoverage, setSprinklerCoverage] = useState([40]); 
    const [smogGunHrs, setSmogGunHrs] = useState([4]); 

    
    const calculateImpact = () => {
        
        const sweepScore = (sweepingFreq[0] / 4) * 25;
        const sprinkleScore = (sprinklerCoverage[0] / 100) * 50;
        const gunScore = (smogGunHrs[0] / 12) * 25;

        const totalReduction = Math.min(sweepScore + sprinkleScore + gunScore, 100);
        return Math.round(totalReduction);
    };

    const reduction = calculateImpact();
    const futureAQI = Math.max(350 - (350 * (reduction / 100)), 50).toFixed(0);

    return (
        <Card className="border shadow-md bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-indigo-600" />
                    Daily Operations Simulator
                </CardTitle>
                <CardDescription>Simulate the impact of today's cleaning intensity on AQI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Current Avg AQI</p>
                        <p className="text-2xl font-bold text-slate-700">350</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <Badge variant="outline" className="bg-white border-green-200 text-green-700 mb-1">
                            -{reduction}% Reduction
                        </Badge>
                        <TrendingDown className="w-6 h-6 text-green-500 animate-bounce" />
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Projected AQI</p>
                        <p className="text-3xl font-bold text-indigo-600">{futureAQI}</p>
                    </div>
                </div>

                {}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Truck className="w-4 h-4 text-orange-500" /> Mech. Sweeping Frequency
                            </label>
                            <span className="text-sm font-bold text-orange-600">{sweepingFreq}x / Day</span>
                        </div>
                        <Slider
                            value={sweepingFreq}
                            onValueChange={setSweepingFreq}
                            max={4}
                            step={1}
                            className="[&>.relative>.absolute]:bg-orange-500"
                        />
                        <p className="text-[10px] text-muted-foreground">Number of times main roads are swept mechanically.</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-500" /> Sprinkler Coverage
                            </label>
                            <span className="text-sm font-bold text-blue-600">{sprinklerCoverage}% Area</span>
                        </div>
                        <Slider
                            value={sprinklerCoverage}
                            onValueChange={setSprinklerCoverage}
                            max={100}
                            step={5}
                            className="[&>.relative>.absolute]:bg-blue-500"
                        />
                        <p className="text-[10px] text-muted-foreground">Percentage of ward area covered by anti-dust sprinkling.</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Wind className="w-4 h-4 text-emerald-500" /> Smog Gun Duration
                            </label>
                            <span className="text-sm font-bold text-emerald-600">{smogGunHrs} Hours</span>
                        </div>
                        <Slider
                            value={smogGunHrs}
                            onValueChange={setSmogGunHrs}
                            max={12}
                            step={1}
                            className="[&>.relative>.absolute]:bg-emerald-500"
                        />
                        <p className="text-[10px] text-muted-foreground">Daily operating hours for static anti-smog guns.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
