import { useState } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, Polyline, Marker, useMap } from "react-leaflet";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, ZoomIn, ZoomOut, Locate, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWardStatus } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { delhiWards } from "@/data/mockData";
import "leaflet/dist/leaflet.css";

type StatusLevel = "good" | "moderate" | "poor" | "critical";

const statusColors: Record<StatusLevel, string> = { good: "#22c55e", moderate: "#f59e0b", poor: "#f97316", critical: "#ef4444" };
const hotspotColors: Record<string, string> = { low: "#22c55e", medium: "#f59e0b", high: "#f97316", critical: "#ef4444" };

interface HotspotMapProps {
    selectedWard: string;
    generatedPlan?: {
        route: [number, number][];
        steps: string[];
        impactedWards: string[];
    } | null;
    additionalRoutes?: { path: [number, number][], color?: string, label?: string, assignedTo?: string }[];
    className?: string;
    title?: string;
    showLegend?: boolean;
    onRouteClick?: (route: any) => void;
}


function MapControls({ onZoomIn, onZoomOut, onCenter }: { onZoomIn: () => void; onZoomOut: () => void; onCenter: () => void }) {
    return (
        <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-1">
            <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md" onClick={onZoomIn}>
                <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md" onClick={onZoomOut}>
                <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md" onClick={onCenter}>
                <Locate className="h-4 w-4" />
            </Button>
        </div>
    );
}


function MapController({ zoomAction, centerAction }: { zoomAction: 'in' | 'out' | null; centerAction: boolean }) {
    const map = useMap();

    if (zoomAction === 'in') map.zoomIn();
    if (zoomAction === 'out') map.zoomOut();
    if (centerAction) map.setView([28.62, 77.22], 11);

    return null;
}

export function HotspotMap({ selectedWard, generatedPlan, additionalRoutes, className, title, showLegend = true, onRouteClick }: HotspotMapProps) {
    const [hoveredWard, setHoveredWard] = useState<string | null>(null);
    const [zoomAction, setZoomAction] = useState<'in' | 'out' | null>(null);
    const [centerAction, setCenterAction] = useState(false);

    const { data: apiWards = [] } = useQuery<any[]>({ queryKey: ["/api/wards"] });
    const { data: apiHotspots = [] } = useQuery<any[]>({ queryKey: ["/api/hotspots"] });

    const wards = (apiWards && apiWards.length > 0) ? apiWards : delhiWards;
    const hotspots = apiHotspots || [];

    const filteredHotspots = selectedWard === "all" ? hotspots : hotspots.filter((h: any) => h?.ward === selectedWard);

    const validWards = wards.filter((ward: any) =>
        ward && ward.coordinates && Array.isArray(ward.coordinates) && ward.coordinates.length > 0
    );

    const validHotspots = filteredHotspots.filter((spot: any) =>
        spot && typeof spot.lat === 'number' && typeof spot.lng === 'number' && !isNaN(spot.lat) && !isNaN(spot.lng)
    );

    const handleZoom = (action: 'in' | 'out') => {
        setZoomAction(action);
        setTimeout(() => setZoomAction(null), 100);
    };

    const handleCenter = () => {
        setCenterAction(true);
        setTimeout(() => setCenterAction(false), 100);
    };

    return (
        <Card className={`border shadow-sm overflow-hidden relative ${className || ""}`}>
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    {generatedPlan ? <Navigation className="w-4 h-4 text-emerald-600" /> : <MapPin className="w-4 h-4 text-muted-foreground" />}
                    {title || "Pollution Hotspots"}
                    {generatedPlan ? (
                        <Badge className="ml-auto animate-in fade-in bg-emerald-600">Route Active</Badge>
                    ) : (
                        <Badge variant="destructive" className="ml-auto">{validHotspots.length} Active</Badge>
                    )}
                </CardTitle>
            </CardHeader>

            <div className={`relative ${className?.includes("min-h-") ? "h-full min-h-[inherit]" : "h-[350px]"}`}>
                {}
                <MapControls
                    onZoomIn={() => handleZoom('in')}
                    onZoomOut={() => handleZoom('out')}
                    onCenter={handleCenter}
                />

                <MapContainer
                    center={[28.62, 77.22]}
                    zoom={11}
                    className="h-full w-full"
                    zoomControl={false}
                    style={{ zIndex: 1 }}
                >
                    <MapController zoomAction={zoomAction} centerAction={centerAction} />
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                    {}
                    {validWards.map((ward: any) => {
                        const isHovered = hoveredWard === ward.id;
                        const isSelected = selectedWard === ward.id;
                        const status = getWardStatus(ward.pmLevel);

                        return (
                            <Polygon
                                key={ward.id}
                                positions={ward.coordinates as any}
                                pathOptions={{
                                    color: isHovered || isSelected ? '#1e3a8a' : statusColors[status],
                                    fillColor: isHovered || isSelected ? statusColors[status] : ward.color,
                                    fillOpacity: isHovered ? 0.7 : isSelected ? 0.6 : 0.35,
                                    weight: isHovered || isSelected ? 3 : 1
                                }}
                                eventHandlers={{
                                    mouseover: () => setHoveredWard(ward.id),
                                    mouseout: () => setHoveredWard(null)
                                }}
                            >
                                <Popup>
                                    <div className="font-sans p-1 min-w-[160px]">
                                        <p className="font-bold text-base mb-2 border-b pb-1">{ward.name}</p>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">PM2.5:</span>
                                                <span className="font-semibold text-red-600">{ward.pm25} µg/m³</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">PM10:</span>
                                                <span className="font-semibold">{ward.pmLevel} µg/m³</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Temperature:</span>
                                                <span>{ward.temperature}°C</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Humidity:</span>
                                                <span>{ward.humidity}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Risk Index:</span>
                                                <span className={`font-bold ${ward.riskIndex > 70 ? 'text-red-600' : ward.riskIndex > 50 ? 'text-orange-500' : 'text-green-600'}`}>
                                                    {ward.riskIndex}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2 text-center">Updated: {ward.lastUpdated}</p>
                                    </div>
                                </Popup>
                            </Polygon>
                        );
                    })}

                    {}
                    {validHotspots.map((spot: any) => (
                        <CircleMarker
                            key={spot.id}
                            center={[spot.lat, spot.lng]}
                            radius={12 + (spot.pmLevel / 25)}
                            pathOptions={{
                                color: hotspotColors[spot.severity] || hotspotColors.medium,
                                fillColor: hotspotColors[spot.severity] || hotspotColors.medium,
                                fillOpacity: 0.6,
                                weight: 2
                            }}
                        >
                            <Popup>
                                <div className="font-sans p-1">
                                    <p className="font-bold text-base">{spot.name}</p>
                                    <p className="text-sm">PM10: <span className="font-semibold text-red-600">{spot.pmLevel} µg/m³</span></p>
                                    <p className="text-xs text-gray-500 capitalize mt-1">Type: {spot.type}</p>
                                    <p className="text-xs font-medium capitalize" style={{ color: hotspotColors[spot.severity] }}>
                                        Severity: {spot.severity}
                                    </p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}

                    {}
                    {generatedPlan?.route && Array.isArray(generatedPlan.route) && generatedPlan.route.length > 0 && (
                        (() => {
                            
                            const safeRoute = generatedPlan.route.filter((p: any) => Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number');

                            if (safeRoute.length === 0) return null;

                            return (
                                <>
                                    <Polyline
                                        positions={safeRoute as any}
                                        pathOptions={{ color: '#0f172a', weight: 5, opacity: 0.9, dashArray: '10, 10' }} 
                                        eventHandlers={{
                                            click: () => onRouteClick && onRouteClick({ label: "Main Route", ...generatedPlan })
                                        }}
                                    />
                                    {safeRoute[0] && (
                                        <Marker position={safeRoute[0] as any}>
                                            <Popup>Main Start</Popup>
                                        </Marker>
                                    )}
                                    {safeRoute[safeRoute.length - 1] && (
                                        <Marker position={safeRoute[safeRoute.length - 1] as any}>
                                            <Popup>Main End</Popup>
                                        </Marker>
                                    )}
                                </>
                            );
                        })()
                    )}

                    {}
                    {additionalRoutes && Array.isArray(additionalRoutes) && additionalRoutes.map((route: any, idx: number) => {
                        if (!route?.path || !Array.isArray(route.path) || route.path.length === 0) return null;

                        
                        const safePath = route.path.filter((p: any) => Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number');
                        if (safePath.length === 0) return null;

                        const isSprinkler = true; 
                        const baseColor = route.color || '#3b82f6';

                        return (
                            <div key={idx}>
                                { }
                                <Polyline
                                    positions={safePath as any}
                                    pathOptions={{ color: 'transparent', weight: 20, opacity: 0 }}
                                    eventHandlers={{
                                        click: (e) => {
                                            if (onRouteClick) onRouteClick(route);
                                            
                                        },
                                        mouseover: () => setHoveredWard(`route-${idx}`), 
                                        mouseout: () => setHoveredWard(null)
                                    }}
                                />

                                { }
                                <Polyline
                                    positions={safePath as any}
                                    pathOptions={{
                                        color: baseColor,
                                        weight: hoveredWard === `route-${idx}` ? 8 : 5,
                                        opacity: 0.8,
                                        lineCap: 'round',
                                        lineJoin: 'round'
                                    }}
                                >
                                    {route.label && <Popup className="font-semibold">{route.label}</Popup>}
                                </Polyline>

                                { }
                                <Polyline
                                    positions={safePath as any}
                                    pathOptions={{
                                        color: '#bae6fd',
                                        weight: 2,
                                        opacity: 0.9
                                    }}
                                    eventHandlers={{ click: () => onRouteClick && onRouteClick(route) }}
                                />
                            </div>
                        );
                    })}
                </MapContainer>
            </div>

            {}
            {showLegend && (
                <div className="px-4 pb-3 pt-2 border-t bg-muted/30">
                    <div className="flex flex-wrap gap-4 text-[10px]">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                            <span className="text-muted-foreground">Good (0-100)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
                            <span className="text-muted-foreground">Moderate (100-150)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
                            <span className="text-muted-foreground">Poor (150-250)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                            <span className="text-muted-foreground">Critical (&gt;250)</span>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
