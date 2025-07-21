import { Hono } from "hono";
import terms from "../react-app/terms/index.html?raw";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/terms", (c) => {
  return c.html(terms);
});

export default app;
