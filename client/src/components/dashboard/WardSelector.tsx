import { Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getWardStatus } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { delhiWards } from "@/data/mockData";

type StatusLevel = "good" | "moderate" | "poor" | "critical";

function StatusDot({ status, size = "md", pulse = false }: { status: StatusLevel; size?: "sm" | "md" | "lg"; pulse?: boolean }) {
    const sizeClasses = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-4 h-4" };
    const colorClasses: Record<StatusLevel, string> = { good: "bg-emerald-500", moderate: "bg-amber-500", poor: "bg-orange-500", critical: "bg-red-500" };
    return <span className={`inline-block rounded-full ${colorClasses[status]} ${sizeClasses[size]} ${pulse ? "animate-pulse" : ""}`} />;
}

export function WardSelector({ selectedWard, onSelectWard }: { selectedWard: string; onSelectWard: (id: string) => void }) {
    const { data: apiWards = [] } = useQuery<any[]>({ queryKey: ["/api/wards"] });
    const wards = apiWards.length > 0 ? apiWards : delhiWards;

    return (
        <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <Select value={selectedWard} onValueChange={onSelectWard}>
                <SelectTrigger className="w-[200px]" data-testid="ward-selector">
                    <SelectValue placeholder="Select Ward" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Wards (Delhi)</SelectItem>
                    {wards.map(ward => (
                        <SelectItem key={ward.id} value={ward.id}>
                            <div className="flex items-center gap-2">
                                <StatusDot status={getWardStatus(ward.pmLevel)} size="sm" />
                                {ward.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
