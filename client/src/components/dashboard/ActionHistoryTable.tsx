import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { History, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function ActionHistoryTable({ selectedWard }: { selectedWard: string }) {
    const [search, setSearch] = useState("");
    const { data: wards = [] } = useQuery<any[]>({ queryKey: ["/api/wards"] });
    const { data: history = [] } = useQuery<any[]>({ queryKey: ["/api/actions/history"] });

    const filtered = useMemo(() => {
        let data = selectedWard === "all"
            ? history
            : history.filter((a: any) => wards.find((w: any) => w.id === selectedWard)?.name === a.ward);

        if (search) data = data.filter((a: any) => a.action.toLowerCase().includes(search.toLowerCase()) || a.ward.toLowerCase().includes(search.toLowerCase()));
        return data;
    }, [selectedWard, search, history, wards]);

    const statusBadges: any = {
        completed: <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Completed</Badge>,
        partial: <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Partial</Badge>,
        failed: <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>
    };

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <History className="w-4 h-4 text-muted-foreground" />
                        Action History
                    </CardTitle>
                    <div className="relative w-48">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} data-testid="history-search" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                <ScrollArea className="h-[300px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">Date/Time</TableHead>
                                <TableHead className="text-xs">Ward</TableHead>
                                <TableHead className="text-xs">Action</TableHead>
                                <TableHead className="text-xs">Department</TableHead>
                                <TableHead className="text-xs text-right">Before</TableHead>
                                <TableHead className="text-xs text-right">After</TableHead>
                                <TableHead className="text-xs text-right">Impact</TableHead>
                                <TableHead className="text-xs">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(action => (
                                <TableRow key={action.id} data-testid={`history-row-${action.id}`}>
                                    <TableCell className="text-xs"><p className="font-medium">{action.date}</p><p className="text-muted-foreground">{action.time}</p></TableCell>
                                    <TableCell className="text-xs font-medium">{action.ward}</TableCell>
                                    <TableCell className="text-xs max-w-[200px] truncate">{action.action}</TableCell>
                                    <TableCell className="text-xs">{action.department}</TableCell>
                                    <TableCell className="text-xs text-right font-medium text-red-600">{action.pmBefore}</TableCell>
                                    <TableCell className="text-xs text-right font-medium text-emerald-600">{action.pmAfter}</TableCell>
                                    <TableCell className="text-xs text-right">
                                        <span className={`font-semibold ${action.effectiveness > 0 ? "text-emerald-600" : "text-red-600"}`}>
                                            {action.effectiveness > 0 ? "-" : "+"}{Math.abs(action.effectiveness)}%
                                        </span>
                                    </TableCell>
                                    <TableCell>{statusBadges[action.status]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
