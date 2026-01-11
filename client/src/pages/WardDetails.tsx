import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  ArrowLeft, Droplets, Wind, Thermometer, AlertTriangle, CheckCircle2, Clock, TrendingDown,
  Truck, MapPin, Activity, Target, Route, Building2, Zap, MessageSquare, Users, Gauge, Radio
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getWardStatus, getRiskLevel, generateTrendData } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { delhiWards, actionHistory as mockHistory, citizenComplaints as mockComplaints } from "@/data/mockData";

interface RouteInfo {
  id: string;
  name: string;
  pmLevel: number;
  status: "good" | "moderate" | "poor" | "critical";
  needsSprinkling: boolean;
  lastSprinkled: string | null;
}

const generateRoutesForWard = (ward: any): RouteInfo[] => {
  const routes: RouteInfo[] = [];
  const routeNames = ["Main Street", "Highway Connector", "Industrial Road", "Market Lane", "Residential Block A", "Commercial Zone", "School Road", "Hospital Road", "Ring Road Section", "Metro Station Road", "Bus Depot Road", "Park Avenue", "Temple Street", "Bridge Approach", "Flyover Section", "Construction Zone"];
  for (let i = 0; i < ward.routesCount; i++) {
    const pmVariation = Math.floor(Math.random() * 60) - 30;
    const pm = Math.max(50, Math.round(ward.pmLevel + pmVariation));
    const status = getWardStatus(pm);
    const needsSprinkling = i < ward.routesNeedingAction;
    routes.push({ id: `${ward.id}-r${i + 1}`, name: `${routeNames[i % routeNames.length]} - ${ward.name}`, pmLevel: pm, status, needsSprinkling, lastSprinkled: needsSprinkling ? null : `${Math.floor(Math.random() * 4) + 1} hours ago` });
  }
  return routes.sort((a, b) => b.pmLevel - a.pmLevel);
};

function StatusBadge({ status }: { status: "good" | "moderate" | "poor" | "critical" }) {
  const config = { good: { bg: "bg-emerald-100 text-emerald-700", label: "Good" }, moderate: { bg: "bg-amber-100 text-amber-700", label: "Moderate" }, poor: { bg: "bg-orange-100 text-orange-700", label: "Poor" }, critical: { bg: "bg-red-100 text-red-700", label: "Critical" } };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config[status].bg}`}>{config[status].label}</span>;
}

export default function WardDetails() {
  const params = useParams();
  const wardId = params.wardId as string;

  const { data: apiWards = [] } = useQuery<any[]>({ queryKey: ["/api/wards"] });
  const { data: apiHistory = [] } = useQuery<any[]>({ queryKey: ["/api/actions/history"] });
  const { data: apiComplaints = [] } = useQuery<any[]>({ queryKey: ["/api/complaints"] });

  const wards = apiWards.length > 0 ? apiWards : delhiWards;
  const history = apiHistory.length > 0 ? apiHistory : mockHistory;
  const complaints = apiComplaints.length > 0 ? apiComplaints : mockComplaints;

  const ward = wards.find((w: any) => w.id === wardId);

  const trendData = useMemo(() => ward ? generateTrendData(ward.id) : [], [ward]);
  const routes = useMemo(() => ward ? generateRoutesForWard(ward) : [], [ward]);
  const wardHistory = useMemo(() => ward ? history.filter((a: any) => a.ward === ward.name) : [], [ward, history]);
  const wardComplaints = useMemo(() => ward ? complaints.filter((c: any) => c.ward === ward.name) : [], [ward, complaints]);

  if (!ward) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-2">Loading...</h1>
          <p className="text-muted-foreground mb-4">Fetching ward details...</p>
          <Link href="/"><Button><ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const status = getWardStatus(ward.pmLevel);
  const riskLevel = getRiskLevel(ward.riskIndex);
  const riskColors = { low: "text-emerald-600 bg-emerald-50", medium: "text-amber-600 bg-amber-50", high: "text-orange-600 bg-orange-50", critical: "text-red-600 bg-red-50" };

  return (
    <div className="min-h-screen bg-background" data-testid="ward-details">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/"><Button variant="ghost" size="icon" className="mr-2" data-testid="button-back"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border" style={{ backgroundColor: ward.color }}><Building2 className="w-5 h-5 text-gray-700" /></div>
            <div><h1 className="text-lg font-display font-bold leading-tight">{ward.name} Ward</h1><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Delhi Municipal Corporation</p></div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <StatusBadge status={status} />
            <Badge variant="outline" className="gap-1.5 text-xs"><Clock className="w-3 h-3" />{ward.lastUpdated}</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="border shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100"><Activity className="w-5 h-5 text-red-600" /></div>
              <div><p className={`text-2xl font-display font-bold ${status === "critical" || status === "poor" ? "text-red-600" : status === "moderate" ? "text-amber-600" : "text-emerald-600"}`}>{ward.pmLevel}</p><p className="text-xs text-muted-foreground">PM10 µg/m³</p></div>
            </div>
          </Card>
          <Card className="border shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100"><Radio className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-2xl font-display font-bold">{ward.pm25}</p><p className="text-xs text-muted-foreground">PM2.5 µg/m³</p></div>
            </div>
          </Card>
          <Card className="border shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${riskColors[riskLevel]}`}><Gauge className="w-5 h-5" /></div>
              <div><p className="text-2xl font-display font-bold">{ward.riskIndex}</p><p className="text-xs text-muted-foreground">Risk Index</p></div>
            </div>
          </Card>
          <Card className="border shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
              <div><p className="text-2xl font-display font-bold text-amber-600">{ward.routesNeedingAction}</p><p className="text-xs text-muted-foreground">Need Action</p></div>
            </div>
          </Card>
          <Card className="border shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100"><Target className="w-5 h-5 text-emerald-600" /></div>
              <div><p className="text-2xl font-display font-bold text-emerald-600">{ward.effectiveness}%</p><p className="text-xs text-muted-foreground">Effectiveness</p></div>
            </div>
          </Card>
          <Card className="border shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100"><MessageSquare className="w-5 h-5 text-purple-600" /></div>
              <div><p className="text-2xl font-display font-bold text-purple-600">{ward.complaints}</p><p className="text-xs text-muted-foreground">Complaints</p></div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-muted-foreground" />24-Hour AQI Trend</CardTitle></CardHeader>
              <CardContent className="px-2 pb-4">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pm10Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                      <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                    <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="pm10" stroke="#ef4444" strokeWidth={2} fill="url(#pm10Grad)" name="PM10" />
                    <Area type="monotone" dataKey="pm25" stroke="#3b82f6" strokeWidth={2} fill="url(#pm25Grad)" name="PM2.5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Card className="border shadow-sm h-full">
              <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Truck className="w-4 h-4 text-muted-foreground" />Contractor Info</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4 space-y-4">
                <p className="font-semibold text-lg">{ward.contractor}</p>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1"><span className="text-muted-foreground">Effectiveness</span><span className={`font-semibold ${ward.effectiveness > 50 ? "text-emerald-600" : ward.effectiveness > 30 ? "text-amber-600" : "text-red-600"}`}>{ward.effectiveness}%</span></div>
                  <Progress value={ward.effectiveness} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2 bg-muted/50 rounded-lg text-center"><p className="text-lg font-bold">{ward.routesCount}</p><p className="text-[10px] text-muted-foreground">Total Routes</p></div>
                  <div className="p-2 bg-muted/50 rounded-lg text-center"><p className="text-lg font-bold text-red-600">{ward.routesNeedingAction}</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <Droplets className="w-4 h-4 text-blue-500" /><span className="text-sm">{ward.humidity}% Humidity</span>
                  <Wind className="w-4 h-4 text-sky-500 ml-auto" /><span className="text-sm">{ward.windSpeed} km/h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" />All Routes<Badge className="ml-auto">{routes.length}</Badge></CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-3">
                {routes.map((route, idx) => (
                  <motion.div key={route.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${route.needsSprinkling ? "bg-red-50 border-red-200" : "bg-card"}`} data-testid={`route-${route.id}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${route.status === "critical" ? "bg-red-100 text-red-600" : route.status === "poor" ? "bg-orange-100 text-orange-600" : route.status === "moderate" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>{idx + 1}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{route.name}</p><p className="text-xs text-muted-foreground">{route.lastSprinkled ? `Sprinkled ${route.lastSprinkled}` : "Not sprinkled"}</p></div>
                    <div className="text-right"><p className={`text-lg font-bold ${route.status === "critical" || route.status === "poor" ? "text-red-600" : route.status === "moderate" ? "text-amber-600" : "text-emerald-600"}`}>{route.pmLevel}</p><p className="text-[10px] text-muted-foreground">µg/m³</p></div>
                    {route.needsSprinkling && <Badge variant="destructive" className="text-[10px]"><Zap className="w-3 h-3 mr-1" />Action</Badge>}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" />Recent Actions<Badge className="ml-auto">{wardHistory.length}</Badge></CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 pr-3">
                    {wardHistory.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">No recent actions</p> : wardHistory.map(action => (
                      <div key={action.id} className={`p-3 rounded-lg border ${action.status === "completed" ? "bg-emerald-50 border-emerald-200" : action.status === "partial" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{action.action}</p>
                          <Badge className={action.status === "completed" ? "bg-emerald-100 text-emerald-700" : action.status === "partial" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>{action.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{action.date} {action.time}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{action.department}</span>
                          <span className={`font-semibold ${action.effectiveness > 0 ? "text-emerald-600" : "text-red-600"}`}>{action.effectiveness > 0 ? "-" : "+"}{Math.abs(action.effectiveness)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-muted-foreground" />Citizen Complaints<Badge variant="destructive" className="ml-auto">{wardComplaints.filter(c => !c.resolved).length} Open</Badge></CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 pr-3">
                    {wardComplaints.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">No complaints</p> : wardComplaints.map(complaint => (
                      <div key={complaint.id} className={`p-3 rounded-lg border ${complaint.resolved ? "bg-muted/30" : "bg-red-50 border-red-200"}`}>
                        <div className="flex items-start justify-between">
                          <div><Badge variant={complaint.resolved ? "secondary" : "destructive"} className="text-[10px] h-5">{complaint.type}</Badge><p className="text-xs mt-1.5 text-muted-foreground">{complaint.description}</p></div>
                          <div className="text-right"><div className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${complaint.pmCorrelation > 80 ? "bg-red-500" : "bg-amber-500"}`} /><span className="text-xs font-semibold">{complaint.pmCorrelation}%</span></div><p className="text-[10px] text-muted-foreground">Correlation</p></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">{complaint.date}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
