import { Hono } from "hono";
import { SECURITY_HEADERS } from "../shared/securityHeaders";
import content, { notFoundHandler, type ContentBindings } from "./content";

const app = new Hono<{ Bindings: ContentBindings }>();

app.use("*", async (c, next) => {
  await next();
  // `c.header` clones a finalized Response first. Mutating `c.res.headers`
  // after a handler `return new Response(...)` can be a no-op.
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    c.header(name, value);
  }
});

app.route("/", content);

// Must live on the root app: Hono ignores a `notFound` handler registered on a
// mounted sub-app.
app.notFound(notFoundHandler);

export default app;
