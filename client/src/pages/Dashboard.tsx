import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Popup, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  X,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Building2,
  Truck,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import "leaflet/dist/leaflet.css";

type StatusLevel = "good" | "moderate" | "poor" | "critical";
type TimeSlot = "morning" | "evening" | "night";

interface Route {
  id: string;
  name: string;
  ward: string;
  coordinates: [number, number][];
  status: StatusLevel;
  pmBefore: number;
  pmAfter: number | null;
  humidity: number;
  lastSprinkled: string | null;
  needsSprinkling: boolean;
  impactScore: number;
  contractor: string;
}

interface ContractorAlert {
  id: string;
  contractor: string;
  type: "ineffective" | "skipped" | "worsening";
  route: string;
  message: string;
  timestamp: string;
}

interface ActionPlan {
  slot: TimeSlot;
  routes: {
    id: string;
    name: string;
    priority: "high" | "medium" | "low";
    reason: string;
  }[];
}

const mockRoutes: Route[] = [
  {
    id: "r1",
    name: "MG Road - Sector 12",
    ward: "Ward 5",
    coordinates: [
      [28.6139, 77.209],
      [28.6189, 77.219],
      [28.6229, 77.229],
    ],
    status: "critical",
    pmBefore: 285,
    pmAfter: null,
    humidity: 45,
    lastSprinkled: null,
    needsSprinkling: true,
    impactScore: 92,
    contractor: "ABC Contractors",
  },
  {
    id: "r2",
    name: "Industrial Belt Road",
    ward: "Ward 7",
    coordinates: [
      [28.6089, 77.199],
      [28.6039, 77.209],
      [28.5989, 77.219],
    ],
    status: "poor",
    pmBefore: 198,
    pmAfter: 142,
    humidity: 52,
    lastSprinkled: "2 hours ago",
    needsSprinkling: true,
    impactScore: 78,
    contractor: "XYZ Services",
  },
  {
    id: "r3",
    name: "Construction Zone C",
    ward: "Ward 5",
    coordinates: [
      [28.6239, 77.199],
      [28.6289, 77.209],
    ],
    status: "moderate",
    pmBefore: 156,
    pmAfter: 98,
    humidity: 58,
    lastSprinkled: "4 hours ago",
    needsSprinkling: false,
    impactScore: 45,
    contractor: "ABC Contractors",
  },
  {
    id: "r4",
    name: "Residential Sector 8",
    ward: "Ward 3",
    coordinates: [
      [28.6039, 77.229],
      [28.6089, 77.239],
      [28.6139, 77.249],
    ],
    status: "good",
    pmBefore: 89,
    pmAfter: 52,
    humidity: 65,
    lastSprinkled: "1 hour ago",
    needsSprinkling: false,
    impactScore: 28,
    contractor: "Green Clean Ltd",
  },
  {
    id: "r5",
    name: "Highway Connector NH-48",
    ward: "Ward 9",
    coordinates: [
      [28.5939, 77.189],
      [28.5889, 77.179],
      [28.5839, 77.169],
    ],
    status: "critical",
    pmBefore: 312,
    pmAfter: null,
    humidity: 42,
    lastSprinkled: null,
    needsSprinkling: true,
    impactScore: 95,
    contractor: "XYZ Services",
  },
];

const mockAlerts: ContractorAlert[] = [
  {
    id: "a1",
    contractor: "XYZ Services",
    type: "ineffective",
    route: "Industrial Belt Road",
    message: "3 consecutive sprinklings with <15% PM reduction",
    timestamp: "15 min ago",
  },
  {
    id: "a2",
    contractor: "ABC Contractors",
    type: "skipped",
    route: "MG Road - Sector 12",
    message: "High-impact route not sprinkled in 8 hours",
    timestamp: "1 hour ago",
  },
];

const mockActionPlans: ActionPlan[] = [
  {
    slot: "morning",
    routes: [
      { id: "r1", name: "MG Road - Sector 12", priority: "high", reason: "PM10 at 285 µg/m³, peak traffic ahead" },
      { id: "r5", name: "Highway Connector NH-48", priority: "high", reason: "PM10 at 312 µg/m³, wind direction favorable" },
      { id: "r2", name: "Industrial Belt Road", priority: "medium", reason: "Previous sprinkle partially effective" },
    ],
  },
  {
    slot: "evening",
    routes: [
      { id: "r2", name: "Industrial Belt Road", priority: "high", reason: "Expected PM spike post-work hours" },
      { id: "r3", name: "Construction Zone C", priority: "medium", reason: "Moderate levels, preventive action" },
    ],
  },
  {
    slot: "night",
    routes: [
      { id: "r1", name: "MG Road - Sector 12", priority: "medium", reason: "Overnight dust settlement" },
    ],
  },
];

const statusColors: Record<StatusLevel, string> = {
  good: "bg-status-good",
  moderate: "bg-status-moderate",
  poor: "bg-status-poor",
  critical: "bg-status-critical",
};

const statusLabels: Record<StatusLevel, string> = {
  good: "Good",
  moderate: "Moderate",
  poor: "Poor",
  critical: "Critical",
};

const routeColors: Record<StatusLevel, string> = {
  good: "#22c55e",
  moderate: "#f59e0b",
  poor: "#f97316",
  critical: "#ef4444",
};

function StatusIndicator({ status, size = "md" }: { status: StatusLevel; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };
  
  return (
    <span
      className={`inline-block rounded-full ${statusColors[status]} ${sizeClasses[size]} ${status === "critical" ? "status-pulse" : ""}`}
    />
  );
}

function AQICard({ routes }: { routes: Route[] }) {
  const avgPM = Math.round(routes.reduce((acc, r) => acc + r.pmBefore, 0) / routes.length);
  const status: StatusLevel = avgPM > 250 ? "critical" : avgPM > 150 ? "poor" : avgPM > 100 ? "moderate" : "good";
  
  return (
    <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current AQI Status</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusIndicator status={status} size="lg" />
              <span className="text-2xl font-display font-bold">{avgPM}</span>
              <span className="text-sm text-muted-foreground">µg/m³ avg</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Droplets className="w-4 h-4" />
                  <span className="text-sm font-medium">52%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Avg Humidity</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Wind className="w-4 h-4" />
                  <span className="text-sm font-medium">12 km/h</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Wind Speed</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-sm font-medium">28°C</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Temperature</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WardSummary({ routes }: { routes: Route[] }) {
  const wards = Array.from(new Set(routes.map((r) => r.ward)));
  
  const getWardStatus = (ward: string): StatusLevel => {
    const wardRoutes = routes.filter((r) => r.ward === ward);
    const avgPM = wardRoutes.reduce((acc, r) => acc + r.pmBefore, 0) / wardRoutes.length;
    if (avgPM > 250) return "critical";
    if (avgPM > 150) return "poor";
    if (avgPM > 100) return "moderate";
    return "good";
  };
  
  return (
    <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Ward Status
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {wards.map((ward) => {
            const status = getWardStatus(ward);
            return (
              <Badge
                key={ward}
                variant="outline"
                className="gap-1.5 py-1 px-2.5 font-medium"
                data-testid={`badge-ward-${ward.toLowerCase().replace(" ", "-")}`}
              >
                <StatusIndicator status={status} size="sm" />
                {ward}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ContractorAlerts({ alerts }: { alerts: ContractorAlert[] }) {
  if (alerts.length === 0) return null;
  
  const alertIcons = {
    ineffective: <TrendingDown className="w-4 h-4" />,
    skipped: <AlertTriangle className="w-4 h-4" />,
    worsening: <TrendingUp className="w-4 h-4" />,
  };
  
  return (
    <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm border-l-4 border-l-destructive">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Contractor Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-2 rounded-lg bg-destructive/5 text-sm"
              data-testid={`alert-${alert.id}`}
            >
              <span className="text-destructive mt-0.5">{alertIcons[alert.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{alert.contractor}</p>
                <p className="text-muted-foreground text-xs">{alert.message}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{alert.route} • {alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionPlansPanel({ plans }: { plans: ActionPlan[] }) {
  const slotIcons: Record<TimeSlot, React.ReactNode> = {
    morning: <Sun className="w-4 h-4" />,
    evening: <Sunset className="w-4 h-4" />,
    night: <Moon className="w-4 h-4" />,
  };
  
  const slotTimes: Record<TimeSlot, string> = {
    morning: "6:00 - 10:00",
    evening: "16:00 - 19:00",
    night: "22:00 - 02:00",
  };
  
  return (
    <Card className="border-0 shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Today's Action Plans
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-9">
            {(["morning", "evening", "night"] as TimeSlot[]).map((slot) => (
              <TabsTrigger
                key={slot}
                value={slot}
                className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-testid={`tab-${slot}`}
              >
                {slotIcons[slot]}
                <span className="capitalize">{slot}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {plans.map((plan) => (
            <TabsContent key={plan.slot} value={plan.slot} className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">{slotTimes[plan.slot]}</p>
              <div className="space-y-2">
                {plan.routes.map((route) => (
                  <div
                    key={route.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      route.priority === "high"
                        ? "bg-destructive/10 border border-destructive/20"
                        : route.priority === "medium"
                        ? "bg-status-moderate/10 border border-status-moderate/20"
                        : "bg-muted"
                    }`}
                    data-testid={`plan-route-${route.id}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        route.priority === "high"
                          ? "bg-destructive"
                          : route.priority === "medium"
                          ? "bg-status-moderate"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{route.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{route.reason}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                ))}
                {plan.routes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No priority routes for this slot</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function RouteDetailPanel({ route, onClose }: { route: Route; onClose: () => void }) {
  const impactChange = route.pmAfter !== null ? Math.round(((route.pmBefore - route.pmAfter) / route.pmBefore) * 100) : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-4 right-4 w-80 z-[1000]"
    >
      <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-md">
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-base font-display font-semibold">{route.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{route.ward}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2" onClick={onClose} data-testid="button-close-detail">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <div className="flex items-center gap-2">
            <StatusIndicator status={route.status} size="md" />
            <span className="text-sm font-medium">{statusLabels[route.status]}</span>
            {route.needsSprinkling && (
              <Badge variant="destructive" className="ml-auto text-xs">
                Needs Sprinkling
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">PM Before</p>
              <p className="text-xl font-display font-bold">{route.pmBefore}</p>
              <p className="text-xs text-muted-foreground">µg/m³</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">PM After</p>
              {route.pmAfter !== null ? (
                <>
                  <p className="text-xl font-display font-bold">{route.pmAfter}</p>
                  <p className="text-xs text-muted-foreground">µg/m³</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Not sprinkled</p>
              )}
            </div>
          </div>
          
          {impactChange !== null && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${impactChange > 30 ? "bg-status-good/10" : impactChange > 15 ? "bg-status-moderate/10" : "bg-destructive/10"}`}>
              {impactChange > 30 ? (
                <CheckCircle2 className="w-5 h-5 text-status-good" />
              ) : impactChange > 15 ? (
                <TrendingDown className="w-5 h-5 text-status-moderate" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {impactChange > 30 ? "Effective" : impactChange > 15 ? "Moderate Effect" : "Low Effect"}
                </p>
                <p className="text-xs text-muted-foreground">{impactChange}% PM reduction</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Humidity
              </span>
              <span className="font-medium">{route.humidity}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Sprinkled
              </span>
              <span className="font-medium">{route.lastSprinkled || "Never"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Contractor
              </span>
              <span className="font-medium">{route.contractor}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Impact Score
              </span>
              <span className="font-medium">{route.impactScore}/100</span>
            </div>
          </div>
          
          {route.needsSprinkling && (
            <Button className="w-full" data-testid="button-mark-sprinkled">
              <Droplets className="w-4 h-4 mr-2" />
              Mark as Sprinkled
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] map-overlay rounded-lg p-3 shadow-md">
      <p className="text-xs font-medium text-muted-foreground mb-2">Route Status</p>
      <div className="flex flex-wrap gap-3">
        {(Object.keys(statusColors) as StatusLevel[]).map((status) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`w-3 h-1 rounded-full`} style={{ backgroundColor: routeColors[status] }} />
            <span className="text-xs capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteLines({ routes, onRouteClick }: { routes: Route[]; onRouteClick: (route: Route) => void }) {
  return (
    <>
      {routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.coordinates}
          pathOptions={{
            color: routeColors[route.status],
            weight: route.needsSprinkling ? 6 : 4,
            opacity: 0.9,
            dashArray: route.needsSprinkling ? undefined : "10, 5",
          }}
          eventHandlers={{
            click: () => onRouteClick(route),
          }}
        >
          <Popup>
            <div className="font-sans">
              <p className="font-semibold">{route.name}</p>
              <p className="text-sm text-gray-600">PM: {route.pmBefore} µg/m³</p>
            </div>
          </Popup>
        </Polyline>
      ))}
    </>
  );
}

export default function Dashboard() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const routesNeedingSprinkling = mockRoutes.filter((r) => r.needsSprinkling).length;

  return (
    <div className="h-screen w-full flex flex-col bg-background" data-testid="dashboard">
      <header className="h-14 border-b bg-card/80 backdrop-blur-sm flex items-center px-4 gap-4 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Droplets className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold leading-tight">AQI Sprinkler Dashboard</h1>
            <p className="text-xs text-muted-foreground">Municipal Dust Mitigation System</p>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <Badge variant="secondary" className="gap-1.5" data-testid="badge-routes-needing-sprinkling">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            {routesNeedingSprinkling} routes need sprinkling
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-good animate-pulse" />
            Live
          </Badge>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r bg-card/50 flex flex-col overflow-hidden flex-shrink-0">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <AQICard routes={mockRoutes} />
              <WardSummary routes={mockRoutes} />
              <ContractorAlerts alerts={mockAlerts} />
              <ActionPlansPanel plans={mockActionPlans} />
            </div>
          </ScrollArea>
        </aside>
        
        <main className="flex-1 relative">
          <MapContainer
            center={[28.6089, 77.209]}
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <RouteLines routes={mockRoutes} onRouteClick={setSelectedRoute} />
          </MapContainer>
          
          <MapLegend />
          
          <AnimatePresence>
            {selectedRoute && (
              <RouteDetailPanel route={selectedRoute} onClose={() => setSelectedRoute(null)} />
            )}
          </AnimatePresence>
          
          <div className="absolute top-4 left-4 z-[1000] map-overlay rounded-lg px-3 py-2 shadow-md">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">2 minutes ago</p>
          </div>
        </main>
      </div>
    </div>
  );
}
