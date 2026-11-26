"use client";
import { Camera } from "kubai-icons-react/line";
import type { LineVariant } from "@/lib/line";

/**
 * The camera that stands for a line variant on the variant switches. It ships with the page,
 * so a switch never waits for, or makes the page fetch, the whole line set.
 */
export function LineVariantSample({ variant }: { variant: LineVariant }) {
  return <Camera size={18} color="currentColor" variant={variant} strokeWidth={2} />;
}
