import { Hono } from "hono";
import content, { notFoundHandler, type ContentBindings } from "./content";

const app = new Hono<{ Bindings: ContentBindings }>();

app.route("/", content);

// Must live on the root app: Hono ignores a `notFound` handler registered on a
// mounted sub-app.
app.notFound(notFoundHandler);

export default app;
