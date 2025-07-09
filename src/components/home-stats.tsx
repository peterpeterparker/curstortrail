"use client";

import { useEffect, useState } from "react";
import { Mountain, TrendingUp, Clock, MapPin } from "lucide-react";
import { initJunoClient } from "@/lib/juno";

interface TrailStats {
  total_trails: number;
  total_distance: number;
  total_elevation: number;
  average_distance: number;
  average_elevation: number;
  difficulty_breakdown: {
    easy: number;
    moderate: number;
    hard: number;
    expert: number;
  };
  last_updated: string;
}

export function HomeStats() {
  const [stats, setStats] = useState<TrailStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await initJunoClient();
        
        const { getDoc } = await import("@junobuild/core");
        const statsDoc = await getDoc({
          collection: "stats",
          key: "trail-stats",
        });

        if (statsDoc) {
          setStats(statsDoc.data as TrailStats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-8 w-8 bg-muted rounded mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-1" />
                <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return null; // Don't show anything if no stats available
  }

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <Mountain className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total_trails.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Trails</div>
          </div>
          
          <div>
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total_distance.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">km Total</div>
          </div>
          
          <div>
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total_elevation.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">m Elevation</div>
          </div>
          
          <div>
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.average_distance.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">km Average</div>
          </div>
        </div>
      </div>
    </section>
  );
} 