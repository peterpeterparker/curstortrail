"use client";

import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mountain, MapPin, Clock, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getTrails, getTrail } from "@/lib/juno";
import { parseGPX } from "@/lib/gpx-parser";
import { TrailMap } from "@/components/trail-map";
import { ArrowLeft } from "lucide-react";
import type { Trail, GPXPoint } from "@/types/trail";

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  hard: "bg-orange-100 text-orange-800",
  expert: "bg-red-100 text-red-800",
};

export default function TrailsPage() {
  const searchParams = useSearchParams();
  const trailId = searchParams.get('id');
  const [trails, setTrails] = useState<Trail[] | undefined>(undefined);
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [gpxPoints, setGpxPoints] = useState<GPXPoint[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (trailId) {
          // Fetch single trail
          const trailData = await getTrail(trailId);
          if (!trailData) {
            setLoading(false);
            return;
          }
          setTrail(trailData);

          // Generate photo URLs
          if (trailData.photos.length > 0) {
            const { downloadUrl } = await import("@junobuild/core");
            const urls = trailData.photos.map(photo => 
              downloadUrl({
                assetKey: {
                  fullPath: photo,
                  token: undefined,
                },
              })
            );
            setPhotoUrls(urls);
          }

          // Download and parse GPX file if available
          if (trailData.gpxFile) {
            try {
              const { downloadUrl } = await import("@junobuild/core");
              const gpxUrl = downloadUrl({
                assetKey: {
                  fullPath: trailData.gpxFile,
                  token: undefined,
                },
              });
              
              const response = await fetch(gpxUrl);
              const gpxContent = await response.text();
              const parsed = await parseGPX(gpxContent);
              setGpxPoints(parsed.points);
            } catch (error) {
              console.error("Error parsing GPX file:", error);
            }
          }
        } else {
          // Fetch all trails
          console.log("Fetching trails...");
          const trailsData = await getTrails();
          console.log("Trails data:", trailsData);
          setTrails(trailsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set empty arrays to show "no trails" state
        setTrails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trailId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  // Show trail detail if ID is provided
  if (trailId) {
    if (!trail) {
      return (
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Trail Not Found</h1>
              <p className="text-muted-foreground mb-4">
                The trail you're looking for doesn't exist.
              </p>
              <Link href="/trails">
                <Button>Back to Trails</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/trails" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trails
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{trail.title}</h1>
                    <p className="text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {trail.location}
                    </p>
                  </div>
                  <Badge className={difficultyColors[trail.difficulty]}>
                    {trail.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-semibold">{trail.distance.toFixed(1)}km</div>
                    <div className="text-sm text-muted-foreground">Distance</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Mountain className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-semibold">{trail.elevation.toFixed(0)}m</div>
                    <div className="text-sm text-muted-foreground">Elevation</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-semibold">{trail.duration}</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(trail.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                {trail.description && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {trail.description}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Map */}
              <TrailMap points={gpxPoints} title="Trail Route" />

              {/* Photos */}
              {photoUrls.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Photos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photoUrls.map((photoUrl, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={photoUrl}
                            alt={`Trail photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trail Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Difficulty</div>
                    <div className="flex items-center mt-1">
                      <Badge className={difficultyColors[trail.difficulty]}>
                        {trail.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Distance</div>
                    <div className="text-lg font-semibold">{trail.distance.toFixed(1)} kilometers</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Elevation Gain</div>
                    <div className="text-lg font-semibold">{trail.elevation.toFixed(0)} meters</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Duration</div>
                    <div className="text-lg font-semibold">{trail.duration}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Date</div>
                    <div className="text-lg font-semibold">
                      {new Date(trail.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Download GPX
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share Trail
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show trails listing
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Trails</h1>
          <p className="text-muted-foreground">
            Explore all my trail running adventures
          </p>
        </div>

        {!trails || trails.length === 0 ? (
          <div className="text-center py-12">
            <Mountain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No trails yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding your trail running adventures to see them here.
            </p>
            <Link href="/admin">
              <Button>Add Your First Trail</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trails?.map((trail) => (
              <Card key={trail.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-2">{trail.title}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {trail.location}
                      </CardDescription>
                    </div>
                    <Badge className={difficultyColors[trail.difficulty]}>
                      {trail.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {trail.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{trail.distance.toFixed(1)}km</span>
                      </div>
                      <div className="flex items-center">
                        <Mountain className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{trail.elevation.toFixed(0)}m</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{trail.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(trail.date).toLocaleDateString()}
                    </div>

                    {trail.photos.length > 0 && (
                      <div className="flex space-x-2">
                        {trail.photos.slice(0, 3).map((photo, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground"
                          >
                            📷
                          </div>
                        ))}
                        {trail.photos.length > 3 && (
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                            +{trail.photos.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    <Link href={`/trails?id=${trail.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 