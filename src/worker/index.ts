import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import terms from "../react-app/terms/index.html?raw";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/terms", (c) => {
  return c.html(terms);
});

// Serve static files from the assets directory
app.use("/*", serveStatic({ root: "./" }));

// Fallback for SPA
app.get("/*", serveStatic({ path: "./index.html" }));


export default app;
