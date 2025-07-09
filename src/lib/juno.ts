import type { Trail } from "@/types/trail";
import { initJuno } from "@junobuild/core";

// Initialize Juno
export const initJunoClient = async () => {
  const satelliteId = process.env.NEXT_PUBLIC_SATELLITE_ID;
  if (!satelliteId) {
    console.warn("NEXT_PUBLIC_SATELLITE_ID not found in environment variables");
    return;
  }

  await initJuno({
    satelliteId,
  });
};

// Trail collection operations
export const createTrail = async (
  trail: Omit<Trail, "id" | "createdAt" | "updatedAt">,
) => {
  const { setDoc } = await import("@junobuild/core");

  const now = new Date().toISOString();
  const trailId = crypto.randomUUID();
  const trailWithMetadata = {
    ...trail,
    id: trailId,
    createdAt: now,
    updatedAt: now,
  };

  return await setDoc({
    collection: "trails",
    doc: {
      key: trailId,
      data: trailWithMetadata,
    },
  });
};

export const getTrails = async () => {
  const { listDocs } = await import("@junobuild/core");

  const trails = await listDocs({
    collection: "trails",
    filter: {},
  });

  return trails.items.map((doc) => doc.data) as Trail[];
};

export const getTrail = async (id: string) => {
  const { getDoc } = await import("@junobuild/core");

  const trail = await getDoc({
    collection: "trails",
    key: id,
  });

  return trail?.data as Trail;
};

export const updateTrail = async (id: string, updates: Partial<Trail>) => {
  const { setDoc } = await import("@junobuild/core");

  const updatedTrail = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return await setDoc({
    collection: "trails",
    doc: {
      key: id,
      data: updatedTrail,
    },
  });
};

export const deleteTrail = async (id: string) => {
  const { getDoc, deleteDoc } = await import("@junobuild/core");
  const doc = await getDoc({ collection: "trails", key: id });
  if (!doc) throw new Error("Document not found");
  return await deleteDoc({
    collection: "trails",
    doc,
  });
};

// File storage operations
export const uploadFile = async (file: File, path: string) => {
  const { uploadFile: upload } = await import("@junobuild/core");

  return await upload({
    data: file,
    filename: file.name,
    collection: "files",
  });
};
