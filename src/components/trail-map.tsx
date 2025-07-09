"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GPXPoint } from "@/types/trail";
import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

interface TrailMapProps {
  points: GPXPoint[];
  title: string;
}

export function TrailMap({ points, title }: TrailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const initMap = async () => {
      const L = await import("leaflet");

      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Initialize map
      const map = L.map(mapRef.current!).setView(
        [points[0].lat, points[0].lng],
        13,
      );
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Create polyline from GPX points
      const latlngs = points.map((point) => [point.lat, point.lng]);
      const polyline = L.polyline(latlngs, { color: "red", weight: 3 }).addTo(
        map,
      );

      // Add start and end markers
      if (points.length > 0) {
        L.marker([points[0].lat, points[0].lng])
          .addTo(map)
          .bindPopup("Start")
          .openPopup();

        if (points.length > 1) {
          L.marker([
            points[points.length - 1].lat,
            points[points.length - 1].lng,
          ])
            .addTo(map)
            .bindPopup("End");
        }
      }

      // Fit map to polyline
      map.fitBounds(polyline.getBounds());
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [points]);

  if (points.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            No GPS data available for this trail
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="h-64 w-full rounded-md"
          style={{ zIndex: 1 }}
        />
      </CardContent>
    </Card>
  );
}
