import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin } from "lucide-react";

interface RouteDetailsDialogProps {
    route: any | null;
    open: boolean;
    onClose: () => void;
}

export function RouteDetailsDialog({ route, open, onClose }: RouteDetailsDialogProps) {
    if (!route) return null;

    
    
    
    const label = route.label || "Unit";
    const sectorMatch = label.match(/\((.*?)\)/);
    const sector = sectorMatch ? sectorMatch[1] : "Central Zone";

    const startLocation = `${sector} Depot`;
    const endLocation = `${sector} Sector ${Math.floor(Math.random() * 12) + 1}`;
    const vehicleNumber = `DL-${Math.floor(Math.random() * 10)}C-${Math.floor(Math.random() * 9000) + 1000}`;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-blue-600" />
                        Unit Deployment Details
                    </DialogTitle>
                    <DialogDescription>
                        Operational status and route information.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg border">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800">{label}</h4>
                                <div className="text-xs text-muted-foreground font-mono mt-1">ID: {vehicleNumber}</div>
                            </div>
                            <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                        </div>

                        <div className="space-y-3 relative">
                            {}
                            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-200" />

                            <div className="flex gap-3 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Start Location</div>
                                    <div className="text-sm font-medium">{startLocation}</div>
                                    <div className="text-[10px] text-slate-500">06:00 AM • Depot Dispatch</div>
                                </div>
                            </div>

                            <div className="flex gap-3 relative z-10 mt-4">
                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                                    <MapPin className="w-3 h-3 text-amber-600" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current/End Location</div>
                                    <div className="text-sm font-medium">{endLocation}</div>
                                    <div className="text-[10px] text-slate-500">ETA: On Schedule</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 border rounded bg-white">
                            <div className="text-xs text-muted-foreground">Water Capacity</div>
                            <div className="font-semibold text-blue-600">4,500 Ltrs</div>
                        </div>
                        <div className="p-3 border rounded bg-white">
                            <div className="text-xs text-muted-foreground">Spray Coverage</div>
                            <div className="font-semibold text-emerald-600">12.5 km</div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
