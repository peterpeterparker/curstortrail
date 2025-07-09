"use client";

import { HomeStats } from "@/components/home-stats";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, MapPin, Mountain } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Trail Running Adventures
            </h1>
            <p className="text-muted-foreground mb-8 text-xl">
              Explore my personal trail running journeys with detailed routes,
              photos, and experiences from the mountains.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
      <section className="bg-muted/50 px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">
            What You'll Find
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Mountain className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Detailed Routes</CardTitle>
                <CardDescription>
                  Complete trail information with distance, elevation, and
                  difficulty ratings
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="text-primary mb-2 h-8 w-8" />
                <CardTitle>GPX Tracks</CardTitle>
                <CardDescription>
                  Interactive maps with actual GPS data from my runs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="text-primary mb-2 h-8 w-8" />
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
