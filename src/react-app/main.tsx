import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initClientAnalytics } from "./analytics";

// The worker-rendered pages load gtag from their own <head>; the SPA routes
// have no server-rendered head of their own, so they wire it up here.
initClientAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
