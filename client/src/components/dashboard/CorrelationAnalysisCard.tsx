import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function CorrelationAnalysisCard() {
    return (
        <Card className="border shadow-sm h-full">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Complaint-AQI Correlation Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-red-700">High Correlation Zones</p>
                                <p className="text-xs text-red-600 mt-1">Shahdara, North East have 85%+ complaint-PM correlation</p>
                            </div>
                            <div className="text-3xl font-bold text-red-600">3</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Most Common Issue</p>
                            <p className="font-semibold mt-1">Road Dust</p>
                            <p className="text-xs text-muted-foreground">42% of complaints</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Avg Response Time</p>
                            <p className="font-semibold mt-1">2.4 hours</p>
                            <p className="text-xs text-muted-foreground">Target: 2 hours</p>
                        </div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs font-medium text-amber-700 mb-2">Insight</p>
                        <p className="text-sm text-amber-800">Complaints spike 2-3 hours after PM10 exceeds 200 µg/m³. Proactive sprinkling can reduce complaints by 40%.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
