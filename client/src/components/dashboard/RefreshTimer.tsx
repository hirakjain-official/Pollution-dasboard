import { useState, useEffect } from "react";
import { RefreshCw, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function RefreshTimer() {
    const [countdown, setCountdown] = useState(30);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const queryClient = useQueryClient();

    const refreshAllData = async () => {
        setIsRefreshing(true);
        console.log("🔄 Refreshing all data from API...");

        try {
            // Force refetch ALL queries
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ["/api/wards"], type: "active" }),
                queryClient.refetchQueries({ queryKey: ["/api/hotspots"], type: "active" }),
                queryClient.refetchQueries({ queryKey: ["/api/complaints"], type: "active" }),
                queryClient.refetchQueries({ queryKey: ["/api/actions/recommendations"], type: "active" }),
                queryClient.refetchQueries({ queryKey: ["/api/actions/history"], type: "active" }),
            ]);

            // Update timestamp
            const now = new Date();
            setLastUpdated(now.toLocaleTimeString());
            console.log("✅ All data refreshed at", now.toLocaleTimeString());
        } catch (error) {
            console.error("❌ Refresh failed:", error);
        }

        setIsRefreshing(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    refreshAllData();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        // Initial fetch on mount
        refreshAllData();

        return () => clearInterval(interval);
    }, []);

    const handleManualRefresh = () => {
        refreshAllData();
        setCountdown(30);
    };

    return (
        <div className="flex items-center gap-3">
            {/* Last Updated Time */}
            {lastUpdated && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Updated: {lastUpdated}</span>
                </div>
            )}

            {/* Countdown Timer */}
            <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all ${isRefreshing
                        ? 'bg-emerald-100 text-emerald-700 scale-105'
                        : countdown <= 5
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }`}
                onClick={handleManualRefresh}
                title="Click to refresh now"
            >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-xs font-medium min-w-[24px]">
                    {isRefreshing ? '...' : `${countdown}s`}
                </span>
                <div className="w-12 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear ${isRefreshing ? 'bg-emerald-500' : countdown <= 5 ? 'bg-amber-500' : 'bg-primary'
                            }`}
                        style={{ width: `${(countdown / 30) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
