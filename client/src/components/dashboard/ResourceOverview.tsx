import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Truck, Droplets, Users, ShieldAlert } from "lucide-react";

export function ResourceOverview() {
    const resources = [
        { name: "Water Sprinklers", total: 50, active: 42, icon: Droplets, color: "text-blue-500" },
        { name: "Anti-Smog Guns", total: 20, active: 18, icon: ShieldAlert, color: "text-purple-500" },
        { name: "Field Teams", total: 100, active: 85, icon: Users, color: "text-emerald-500" },
        { name: "Support Vehicles", total: 30, active: 12, icon: Truck, color: "text-amber-500" },
    ];

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    Active Resources
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
                {resources.map((res) => (
                    <div key={res.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <res.icon className={`w-3 h-3 ${res.color}`} />
                                {res.name}
                            </span>
                            <span className="font-semibold">
                                {res.active}/{res.total}
                            </span>
                        </div>
                        <Progress value={(res.active / res.total) * 100} className="h-1.5" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
