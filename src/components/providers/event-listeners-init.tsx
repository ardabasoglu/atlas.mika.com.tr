"use client";

import { useEffect } from "react";
import { initProjectListeners } from "@/modules/project/listeners";

/**
 * Initializes domain event listeners once on the client.
 * Rendered in the root layout so listeners are registered after mount
 * instead of on module import.
 */
export function EventListenersInit() {
  useEffect(() => {
    initProjectListeners();
  }, []);
  return null;
}
