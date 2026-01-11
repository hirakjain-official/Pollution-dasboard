import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function CitizenComplaintsCard({ selectedWard }: { selectedWard: string }) {
    const { data: wards = [] } = useQuery<any[]>({ queryKey: ["/api/wards"] });
    const { data: complaints = [] } = useQuery<any[]>({
        queryKey: ["/api/complaints"],
        refetchInterval: 5000 // Refresh often to see new complaints
    });

    const filtered = selectedWard === "all"
        ? complaints
        : complaints.filter((c: any) => {
            // Match ward ID or Name
            const wardMatch = wards.find((w: any) => w.id === selectedWard);
            return c.ward === selectedWard || (wardMatch && c.ward === wardMatch.name);
        });

    // Handle both new 'status' and old 'resolved' fields
    const isPending = (c: any) => c.status === "pending" || (!c.status && !c.resolved);
    const unresolvedCount = filtered.filter(isPending).length;

    const formatDate = (date: string | Date) => {
        if (!date) return "Just now";
        return new Date(date).toLocaleString();
    };

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    Citizen Complaints
                    <Badge variant="destructive" className="ml-auto">{unresolvedCount} Pending</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <ScrollArea className="h-[400px]">
                    <div className="space-y-2 pr-3">
                        {filtered.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No complaints found for this area.
                            </div>
                        )}
                        {filtered.map((complaint: any) => {
                            const pending = isPending(complaint);
                            return (
                                <div key={complaint.id || Math.random()} className={`p-3 rounded-lg border ${!pending ? "bg-muted/30" : "bg-red-50 border-red-200"}`}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant={!pending ? "secondary" : "destructive"} className="text-[10px] h-5 capitalize">
                                                    {complaint.type}
                                                </Badge>
                                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                                                    {complaint.ticketId || "LEGACY"}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium mt-1.5">{complaint.location}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-2 italic">"{complaint.description}"</p>
                                            {complaint.name && (
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    Reported by: <span className="font-medium">{complaint.name}</span> {complaint.phone && `(${complaint.phone})`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground border-t pt-2">
                                        <span>{formatDate(complaint.timestamp || complaint.date)}</span>
                                        {pending ? (
                                            <span className="flex items-center gap-1 text-red-600 font-medium">
                                                <AlertTriangle className="w-3 h-3" /> Action Required
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                                <CheckCircle className="w-3 h-3" /> Resolved
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
