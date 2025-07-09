"use client";

import { Navigation } from "@/components/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { parseGPX } from "@/lib/gpx-parser";
import { createTrail, uploadFile } from "@/lib/juno";
import type { GPXTrack, TrailFormData } from "@/types/trail";
import { Upload, X } from "lucide-react";
import { useState } from "react";

function AdminContent() {
  const [formData, setFormData] = useState<TrailFormData>({
    title: "",
    description: "",
    distance: 0,
    elevation: 0,
    duration: "",
    difficulty: "moderate",
    location: "",
    date: new Date().toISOString().split("T")[0],
    gpxFile: undefined,
    photos: [],
  });

  // String versions for input display
  const [inputValues, setInputValues] = useState({
    distance: "",
    elevation: "",
  });

  const [loading, setLoading] = useState(false);
  const [gpxData, setGpxData] = useState<GPXTrack | null>(null);

  const handleInputChange = (field: keyof TrailFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (
    field: "distance" | "elevation",
    value: string,
  ) => {
    // Update the display value
    setInputValues((prev) => ({ ...prev, [field]: value }));

    // Update the form data with parsed number or 0 if empty
    const numValue = value === "" ? 0 : Number(value);
    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [field]: numValue }));
    }
  };

  const handleGPXUpload = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = await parseGPX(text);
      setGpxData(parsed);
      setFormData((prev) => ({
        ...prev,
        distance: parsed.distance,
        elevation: parsed.elevation,
        duration: formatDuration(parsed.duration),
      }));
      // Update input display values
      setInputValues((prev) => ({
        ...prev,
        distance: parsed.distance.toString(),
        elevation: parsed.elevation.toString(),
      }));
    } catch (error) {
      console.error("Error parsing GPX:", error);
      alert("Error parsing GPX file. Please check the file format.");
    }
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handlePhotoUpload = (files: FileList) => {
    const newPhotos = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload photos first
      const photoUrls: string[] = [];
      for (const photo of formData.photos) {
        const uploadResult = await uploadFile(
          photo,
          `trails/photos/${Date.now()}_${photo.name}`,
        );
        photoUrls.push(uploadResult.fullPath);
      }

      // Upload GPX file if provided
      let gpxFileUrl: string | undefined;
      if (formData.gpxFile) {
        const gpxUploadResult = await uploadFile(
          formData.gpxFile,
          `trails/gpx/${Date.now()}_${formData.gpxFile.name}`,
        );
        gpxFileUrl = gpxUploadResult.fullPath;
      }

      // Create trail document
      const trailData = {
        title: formData.title,
        description: formData.description,
        distance: formData.distance,
        elevation: formData.elevation,
        duration: formData.duration,
        difficulty: formData.difficulty,
        location: formData.location,
        date: formData.date,
        gpxFile: gpxFileUrl, // store file path instead of content
        photos: photoUrls,
      };

      await createTrail(trailData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        distance: 0,
        elevation: 0,
        duration: "",
        difficulty: "moderate",
        location: "",
        date: new Date().toISOString().split("T")[0],
        gpxFile: undefined,
        photos: [],
      });
      setGpxData(null);

      alert("Trail added successfully!");
    } catch (error) {
      console.error("Error creating trail:", error);
      alert("Error creating trail. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Add New Trail</h1>
          <p className="text-muted-foreground">
            Share your latest trail running adventure
          </p>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Trail Information</CardTitle>
              <CardDescription>
                Fill in the details about your trail run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="title">Trail Name *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g., Mount Tamalpais Loop"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="e.g., Marin County, CA"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your trail experience..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="distance">Distance (km) *</Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      value={inputValues.distance}
                      onChange={(e) =>
                        handleNumberInputChange("distance", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="elevation">Elevation (m) *</Label>
                    <Input
                      id="elevation"
                      type="number"
                      value={inputValues.elevation}
                      onChange={(e) =>
                        handleNumberInputChange("elevation", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      placeholder="e.g., 2h 30m"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        handleInputChange("difficulty", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gpx">GPX File (Optional)</Label>
                  <Input
                    id="gpx"
                    type="file"
                    accept=".gpx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleInputChange("gpxFile", file);
                        handleGPXUpload(file);
                      }
                    }}
                  />
                  {gpxData && (
                    <div className="bg-muted mt-2 rounded-md p-3">
                      <p className="text-sm">
                        GPX loaded: {gpxData.name} ({gpxData.points.length}{" "}
                        points)
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Photos</Label>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("photos")?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Add Photos
                      </Button>
                      <input
                        id="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files && handlePhotoUpload(e.target.files)
                        }
                      />
                    </div>

                    {formData.photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <div className="bg-muted flex h-24 w-full items-center justify-center rounded-md text-xs">
                              📷 {photo.name}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Adding Trail..." : "Add Trail"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
