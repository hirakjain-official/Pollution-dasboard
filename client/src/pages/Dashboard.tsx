import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Polygon, Popup, CircleMarker } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import {
  Droplets, Wind, Thermometer, AlertTriangle, CheckCircle2, Clock, TrendingDown, TrendingUp, X, ChevronRight, ChevronDown,
  Building2, Truck, MapPin, Activity, Target, Gauge, ArrowUpRight, ArrowDownRight, Zap, ExternalLink, Filter,
  MessageSquare, History, Lightbulb, Radio, Users, FileText, CircleDot, Play, CheckCircle, XCircle, Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  delhiWards, getWardStatus, getRiskLevel, generateTrendData, hotspots, actionRecommendations, actionHistory, citizenComplaints,
  WardData, Hotspot, ActionRecommendation, ActionHistory, CitizenComplaint
} from "@/data/mockData";
import "leaflet/dist/leaflet.css";

type StatusLevel = "good" | "moderate" | "poor" | "critical";

const statusColors: Record<StatusLevel, string> = { good: "#22c55e", moderate: "#f59e0b", poor: "#f97316", critical: "#ef4444" };
const hotspotColors: Record<string, string> = { low: "#22c55e", medium: "#f59e0b", high: "#f97316", critical: "#ef4444" };

function StatusDot({ status, size = "md", pulse = false }: { status: StatusLevel; size?: "sm" | "md" | "lg"; pulse?: boolean }) {
  const sizeClasses = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-4 h-4" };
  const colorClasses: Record<StatusLevel, string> = { good: "bg-emerald-500", moderate: "bg-amber-500", poor: "bg-orange-500", critical: "bg-red-500" };
  return <span className={`inline-block rounded-full ${colorClasses[status]} ${sizeClasses[size]} ${pulse ? "animate-pulse" : ""}`} />;
}

function WardSelector({ selectedWard, onSelectWard }: { selectedWard: string; onSelectWard: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <Building2 className="w-5 h-5 text-muted-foreground" />
      <Select value={selectedWard} onValueChange={onSelectWard}>
        <SelectTrigger className="w-[200px]" data-testid="ward-selector">
          <SelectValue placeholder="Select Ward" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Wards (Delhi)</SelectItem>
          {delhiWards.map(ward => (
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

function LiveAQICard({ ward }: { ward: WardData | null }) {
  const data = ward || {
    pmLevel: Math.round(delhiWards.reduce((a, w) => a + w.pmLevel, 0) / delhiWards.length),
    pm25: Math.round(delhiWards.reduce((a, w) => a + w.pm25, 0) / delhiWards.length),
    riskIndex: Math.round(delhiWards.reduce((a, w) => a + w.riskIndex, 0) / delhiWards.length),
    humidity: Math.round(delhiWards.reduce((a, w) => a + w.humidity, 0) / delhiWards.length),
    temperature: Math.round(delhiWards.reduce((a, w) => a + w.temperature, 0) / delhiWards.length),
    windSpeed: Math.round(delhiWards.reduce((a, w) => a + w.windSpeed, 0) / delhiWards.length),
  };
  const status = getWardStatus(data.pmLevel);
  const riskLevel = getRiskLevel(data.riskIndex);
  const riskColors = { low: "text-emerald-600 bg-emerald-50", medium: "text-amber-600 bg-amber-50", high: "text-orange-600 bg-orange-50", critical: "text-red-600 bg-red-50" };

  return (
    <Card className="border shadow-sm overflow-hidden">
      <div className={`h-1 ${status === "critical" ? "bg-red-500" : status === "poor" ? "bg-orange-500" : status === "moderate" ? "bg-amber-500" : "bg-emerald-500"}`} />
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          Live AQI Status
          {ward && <Badge variant="outline" className="ml-auto">{ward.name}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">PM10</p>
            <p className={`text-4xl font-display font-bold ${status === "critical" || status === "poor" ? "text-red-600" : status === "moderate" ? "text-amber-600" : "text-emerald-600"}`}>{data.pmLevel}</p>
            <p className="text-xs text-muted-foreground">µg/m³</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">PM2.5</p>
            <p className={`text-4xl font-display font-bold ${data.pm25 > 60 ? "text-red-600" : data.pm25 > 30 ? "text-amber-600" : "text-emerald-600"}`}>{data.pm25}</p>
            <p className="text-xs text-muted-foreground">µg/m³</p>
          </div>
        </div>
        <div className={`flex items-center justify-between p-3 rounded-lg ${riskColors[riskLevel]}`}>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            <span className="font-semibold">Risk Index</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{data.riskIndex}</span>
            <span className="text-xs uppercase font-medium">{riskLevel}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div><p className="text-xs font-semibold">{data.humidity}%</p><p className="text-[10px] text-muted-foreground">Humidity</p></div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <div><p className="text-xs font-semibold">{data.temperature}°C</p><p className="text-[10px] text-muted-foreground">Temp</p></div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <Wind className="w-4 h-4 text-sky-500" />
            <div><p className="text-xs font-semibold">{data.windSpeed} km/h</p><p className="text-[10px] text-muted-foreground">Wind</p></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AQITrendChart({ wardId }: { wardId: string }) {
  const data = useMemo(() => generateTrendData(wardId), [wardId]);
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          AQI Trend (24 Hours)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pm10Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
            <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="pm10" stroke="#ef4444" strokeWidth={2} fill="url(#pm10Gradient)" name="PM10" />
            <Area type="monotone" dataKey="pm25" stroke="#3b82f6" strokeWidth={2} fill="url(#pm25Gradient)" name="PM2.5" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function HotspotMap({ selectedWard }: { selectedWard: string }) {
  const filteredHotspots = selectedWard === "all" ? hotspots : hotspots;
  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          Pollution Hotspots
          <Badge variant="destructive" className="ml-auto">{filteredHotspots.length} Active</Badge>
        </CardTitle>
      </CardHeader>
      <div className="h-[300px]">
        <MapContainer center={[28.62, 77.22]} zoom={11} className="h-full w-full" zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          {delhiWards.map(ward => (
            <Polygon key={ward.id} positions={ward.coordinates} pathOptions={{ color: statusColors[getWardStatus(ward.pmLevel)], fillColor: ward.color, fillOpacity: 0.4, weight: 1 }} />
          ))}
          {filteredHotspots.map(spot => (
            <CircleMarker key={spot.id} center={[spot.lat, spot.lng]} radius={10 + (spot.pmLevel / 30)}
              pathOptions={{ color: hotspotColors[spot.severity], fillColor: hotspotColors[spot.severity], fillOpacity: 0.7 }}>
              <Popup><div className="font-sans"><p className="font-bold">{spot.name}</p><p className="text-sm">PM10: {spot.pmLevel} µg/m³</p><p className="text-xs text-gray-500 capitalize">{spot.type}</p></div></Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <CardContent className="px-4 py-3 border-t">
        <div className="flex flex-wrap gap-3 text-xs">
          {(["critical", "high", "medium", "low"] as const).map(level => (
            <div key={level} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: hotspotColors[level] }} />
              <span className="capitalize">{level}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionRecommendationsCard({ selectedWard }: { selectedWard: string }) {
  const filtered = selectedWard === "all" ? actionRecommendations : actionRecommendations.filter(a => delhiWards.find(w => w.id === selectedWard)?.name === a.ward);
  const statusIcons = { pending: <Clock className="w-4 h-4 text-amber-500" />, in_progress: <Play className="w-4 h-4 text-blue-500" />, completed: <CheckCircle className="w-4 h-4 text-emerald-500" /> };
  const priorityColors = { high: "bg-red-100 text-red-700 border-red-200", medium: "bg-amber-100 text-amber-700 border-amber-200", low: "bg-gray-100 text-gray-700 border-gray-200" };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Action Recommendations
          <Badge className="ml-auto">{filtered.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ScrollArea className="h-[280px]">
          <div className="space-y-2 pr-3">
            {filtered.map((rec, i) => (
              <motion.div key={rec.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`p-3 rounded-lg border ${priorityColors[rec.priority]}`} data-testid={`recommendation-${rec.id}`}>
                <div className="flex items-start gap-2">
                  {statusIcons[rec.status]}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{rec.action}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-[10px] h-5">{rec.ward}</Badge>
                      <Badge variant="outline" className="text-[10px] h-5"><Users className="w-3 h-3 mr-1" />{rec.department}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" />{rec.estimatedImpact}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rec.deadline}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ActionHistoryTable({ selectedWard }: { selectedWard: string }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    let data = selectedWard === "all" ? actionHistory : actionHistory.filter(a => delhiWards.find(w => w.id === selectedWard)?.name === a.ward);
    if (search) data = data.filter(a => a.action.toLowerCase().includes(search.toLowerCase()) || a.ward.toLowerCase().includes(search.toLowerCase()));
    return data;
  }, [selectedWard, search]);
  const statusBadges = {
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

function CitizenComplaintsCard({ selectedWard }: { selectedWard: string }) {
  const filtered = selectedWard === "all" ? citizenComplaints : citizenComplaints.filter(c => delhiWards.find(w => w.id === selectedWard)?.name === c.ward);
  const unresolvedCount = filtered.filter(c => !c.resolved).length;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          Citizen Complaints
          <Badge variant="destructive" className="ml-auto">{unresolvedCount} Unresolved</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ScrollArea className="h-[220px]">
          <div className="space-y-2 pr-3">
            {filtered.map(complaint => (
              <div key={complaint.id} className={`p-3 rounded-lg border ${complaint.resolved ? "bg-muted/30" : "bg-red-50 border-red-200"}`} data-testid={`complaint-${complaint.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={complaint.resolved ? "secondary" : "destructive"} className="text-[10px] h-5">{complaint.type}</Badge>
                      <span className="text-[10px] text-muted-foreground">{complaint.ward}</span>
                    </div>
                    <p className="text-xs mt-1.5 text-muted-foreground line-clamp-2">{complaint.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${complaint.pmCorrelation > 80 ? "bg-red-500" : complaint.pmCorrelation > 60 ? "bg-amber-500" : "bg-emerald-500"}`} />
                      <span className="text-xs font-semibold">{complaint.pmCorrelation}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">PM Correlation</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>{complaint.date}</span>
                  {complaint.resolved ? (
                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-3 h-3" />Resolved</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600"><XCircle className="w-3 h-3" />Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function QuickStats({ selectedWard }: { selectedWard: string }) {
  const wards = selectedWard === "all" ? delhiWards : delhiWards.filter(w => w.id === selectedWard);
  const totalRoutes = wards.reduce((a, w) => a + w.routesCount, 0);
  const needsAction = wards.reduce((a, w) => a + w.routesNeedingAction, 0);
  const avgEffectiveness = Math.round(wards.reduce((a, w) => a + w.effectiveness, 0) / wards.length);
  const totalComplaints = wards.reduce((a, w) => a + w.complaints, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="border shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100"><Activity className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-2xl font-display font-bold">{totalRoutes}</p><p className="text-xs text-muted-foreground">Total Routes</p></div>
        </div>
      </Card>
      <Card className="border shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-2xl font-display font-bold text-red-600">{needsAction}</p><p className="text-xs text-muted-foreground">Need Action</p></div>
        </div>
      </Card>
      <Card className="border shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100"><Target className="w-5 h-5 text-emerald-600" /></div>
          <div><p className="text-2xl font-display font-bold text-emerald-600">{avgEffectiveness}%</p><p className="text-xs text-muted-foreground">Avg Effectiveness</p></div>
        </div>
      </Card>
      <Card className="border shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100"><MessageSquare className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-2xl font-display font-bold text-amber-600">{totalComplaints}</p><p className="text-xs text-muted-foreground">Complaints</p></div>
        </div>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const [selectedWard, setSelectedWard] = useState("all");
  const currentWard = selectedWard === "all" ? null : delhiWards.find(w => w.id === selectedWard) || null;

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center shadow-md">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold leading-tight">AQI Sprinkler Dashboard</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Delhi Municipal Corporation</p>
            </div>
          </div>
          <div className="ml-6"><WardSelector selectedWard={selectedWard} onSelectWard={setSelectedWard} /></div>
          <div className="ml-auto flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Live</Badge>
            <span className="text-xs text-muted-foreground">Updated just now</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <QuickStats selectedWard={selectedWard} />
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <LiveAQICard ward={currentWard} />
            <AQITrendChart wardId={selectedWard === "all" ? "central" : selectedWard} />
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <HotspotMap selectedWard={selectedWard} />
            <ActionRecommendationsCard selectedWard={selectedWard} />
          </div>
        </div>

        <ActionHistoryTable selectedWard={selectedWard} />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <CitizenComplaintsCard selectedWard={selectedWard} />
          </div>
          <div className="col-span-12 lg:col-span-6">
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
          </div>
        </div>
      </main>
    </div>
  );
}
