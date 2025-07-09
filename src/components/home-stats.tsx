"use client";

import { initJunoClient } from "@/lib/juno";
import { Clock, MapPin, Mountain, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

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
      <section className="bg-muted/30 px-4 py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse text-center">
                <div className="bg-muted mx-auto mb-2 h-8 w-8 rounded" />
                <div className="bg-muted mx-auto mb-1 h-4 w-3/4 rounded" />
                <div className="bg-muted mx-auto h-3 w-1/2 rounded" />
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
    <section className="bg-muted/30 px-4 py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          <div>
            <Mountain className="text-primary mx-auto mb-2 h-8 w-8" />
            <div className="text-2xl font-bold">
              {stats.total_trails.toFixed(0)}
            </div>
            <div className="text-muted-foreground text-sm">Trails</div>
          </div>

          <div>
            <TrendingUp className="text-primary mx-auto mb-2 h-8 w-8" />
            <div className="text-2xl font-bold">
              {stats.total_distance.toFixed(1)}
            </div>
            <div className="text-muted-foreground text-sm">km Total</div>
          </div>

          <div>
            <MapPin className="text-primary mx-auto mb-2 h-8 w-8" />
            <div className="text-2xl font-bold">
              {stats.total_elevation.toFixed(0)}
            </div>
            <div className="text-muted-foreground text-sm">m Elevation</div>
          </div>

          <div>
            <Clock className="text-primary mx-auto mb-2 h-8 w-8" />
            <div className="text-2xl font-bold">
              {stats.average_distance.toFixed(1)}
            </div>
            <div className="text-muted-foreground text-sm">km Average</div>
          </div>
        </div>
      </div>
    </section>
  );
}
