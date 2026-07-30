import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initAnalytics } from "@/lib/analytics";
import "./index.css";

// Start analytics before React mounts. Doing this from a component effect made
// it depend on the router mounting first, which meant the very first page load
// could be missed entirely.
initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
