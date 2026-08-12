import { Hono } from "hono";
import content from "./content";

const app = new Hono();

app.route("/", content);

export default app;
