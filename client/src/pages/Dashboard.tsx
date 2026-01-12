import { useState } from "react";
import { Link } from "wouter";
import { Droplets, Lock, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { delhiWards } from "@/data/mockData";


import { QuickStats } from "@/components/dashboard/QuickStats";
import { LiveAQICard } from "@/components/dashboard/LiveAQICard";
import { AQITrendChart } from "@/components/dashboard/AQITrendChart";
import { HotspotMap } from "@/components/dashboard/HotspotMap";
import { WardSelector } from "@/components/dashboard/WardSelector";
import { CorrelationAnalysisCard } from "@/components/dashboard/CorrelationAnalysisCard";
import { RefreshTimer } from "@/components/dashboard/RefreshTimer";
import { GovActionStatus } from "@/components/dashboard/GovActionStatus";
import { ComplaintButton } from "@/components/dashboard/ComplaintButton";
import { RouteDetailsDialog } from "@/components/dashboard/RouteDetailsDialog";

export default function Dashboard() {
  const [selectedWard, setSelectedWard] = useState("all");
  const { data: apiWards = [] } = useQuery<any[]>({
    queryKey: ["/api/wards"],
    refetchInterval: 30000
  });
  const wards = apiWards.length > 0 ? apiWards : delhiWards;

  const currentWard = selectedWard === "all" ? null : wards.find((w: any) => w.id === selectedWard) || null;

  const { data: routePlan } = useQuery<any>({
    queryKey: ["/api/shifts?type=morning"],
    refetchInterval: 60000
  });


  const equipmentTypes = ["Anti-Smog Gun", "Mechanical Sweeper", "Water Sprinkler", "Mist Cannon"];

  const activeRoutes = routePlan?.routes?.map((r: any, i: number) => ({
    path: r.path,
    color: "#3b82f6",
    label: r.assignedTo || equipmentTypes[i % equipmentTypes.length]
  })) || [];

  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md shadow-sm">
        { }
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/20">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Field Operations Command
              </h1>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                Rapid Response Unit
              </p>
            </div>
          </div>
          <div className="ml-6"><WardSelector selectedWard={selectedWard} onSelectWard={setSelectedWard} /></div>
          <div className="ml-auto flex items-center gap-3">
            <RefreshTimer />
            <Badge variant="outline" className="gap-1.5 text-xs"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Live</Badge>
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors">
                <Lock className="w-3 h-3" />
                Gov Login
              </Button>
            </Link>
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
            <HotspotMap
              selectedWard={selectedWard}
              additionalRoutes={activeRoutes}
              title="Live Operations Map"
              onRouteClick={setSelectedRoute}
            />
          </div>
        </div>

        { }
        <GovActionStatus />

        { }
        <CorrelationAnalysisCard />

        { }
        <ComplaintButton />
      </main>
      <RouteDetailsDialog
        route={selectedRoute}
        open={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
      />
    </div>
  );
}
