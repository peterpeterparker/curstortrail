"use client";

import { Navigation } from "@/components/navigation";
import { HomeStats } from "@/components/home-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mountain, MapPin, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Trail Running Adventures
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore my personal trail running journeys with detailed routes, photos, and experiences from the mountains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trails">
                <Button size="lg" className="flex items-center space-x-2">
                  <Mountain className="h-5 w-5" />
                  <span>View All Trails</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Find</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Mountain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Detailed Routes</CardTitle>
                <CardDescription>
                  Complete trail information with distance, elevation, and difficulty ratings
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle>GPX Tracks</CardTitle>
                <CardDescription>
                  Interactive maps with actual GPS data from my runs
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Personal Stories</CardTitle>
                <CardDescription>
                  Photos and experiences from each trail adventure
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <HomeStats />
    </div>
  );
}
