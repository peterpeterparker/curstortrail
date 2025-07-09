import type { GPXPoint, GPXTrack } from "@/types/trail";

export const parseGPX = async (gpxContent: string): Promise<GPXTrack> => {
  // Dynamic import with proper error handling
  try {
    const gpxparser = await import("gpxparser");
    console.log("GPXParser module:", gpxparser);
    const GPXParser = gpxparser.default || gpxparser.GPXParser;
    console.log("GPXParser constructor:", GPXParser);
    const gpx = new GPXParser();
    gpx.parse(gpxContent);

    if (gpx.tracks.length === 0) {
      throw new Error("No tracks found in GPX file");
    }

    const track = gpx.tracks[0];
    console.log("Track data:", track);

    const points: GPXPoint[] = [];

    track.points.forEach((point) => {
      points.push({
        lat: point.lat,
        lng: point.lon,
        elevation: point.ele,
        timestamp: point.time,
      });
    });

    // Calculate distance from points
    const distance = calculateDistance(points);

    // Calculate elevation from points
    const elevation = calculateElevation(points);

    // Calculate duration (if available in track data)
    const duration = track.time?.total ? track.time.total / 1000 : 0;

    return {
      name: track.name || "Trail Track",
      points,
      distance,
      elevation,
      duration,
    };
  } catch (error) {
    console.error("Error parsing GPX:", error);
    throw error;
  }
};

export const calculateDistance = (points: GPXPoint[]): number => {
  if (points.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    const R = 6371; // Earth's radius in kilometers
    const dLat = ((curr.lat - prev.lat) * Math.PI) / 180;
    const dLon = ((curr.lng - prev.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((prev.lat * Math.PI) / 180) *
        Math.cos((curr.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    totalDistance += distance;
  }

  return totalDistance;
};

export const calculateElevation = (points: GPXPoint[]): number => {
  if (points.length === 0) return 0;

  const elevations = points
    .map((p) => p.elevation)
    .filter((e) => e !== undefined) as number[];

  if (elevations.length === 0) return 0;

  const max = Math.max(...elevations);
  const min = Math.min(...elevations);

  return max - min;
};
