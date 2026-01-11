import { useState } from "react";
import { Link } from "wouter";
import { Droplets, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { delhiWards } from "@/data/mockData";

// Dashboard Widgets
import { QuickStats } from "@/components/dashboard/QuickStats";
import { LiveAQICard } from "@/components/dashboard/LiveAQICard";
import { AQITrendChart } from "@/components/dashboard/AQITrendChart";
import { HotspotMap } from "@/components/dashboard/HotspotMap";
import { WardSelector } from "@/components/dashboard/WardSelector";
import { CorrelationAnalysisCard } from "@/components/dashboard/CorrelationAnalysisCard";
import { RefreshTimer } from "@/components/dashboard/RefreshTimer";
import { GovActionStatus } from "@/components/dashboard/GovActionStatus";
import { ComplaintButton } from "@/components/dashboard/ComplaintButton";

export default function Dashboard() {
  const [selectedWard, setSelectedWard] = useState("all");
  const { data: apiWards = [] } = useQuery<any[]>({
    queryKey: ["/api/wards"],
    refetchInterval: 30000 // Auto-refresh every 30 seconds
  });
  const wards = apiWards.length > 0 ? apiWards : delhiWards;

  const currentWard = selectedWard === "all" ? null : wards.find((w: any) => w.id === selectedWard) || null;

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
            <HotspotMap selectedWard={selectedWard} />
          </div>
        </div>

        {/* Government Action Status - Full Width */}
        <GovActionStatus />

        {/* Correlation Analysis */}
        <CorrelationAnalysisCard />

        {/* Floating Complaint Button */}
        <ComplaintButton />
      </main>
    </div>
  );
}
