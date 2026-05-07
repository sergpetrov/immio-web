import { Hono } from "hono";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Privacy from "../react-app/Privacy";
import Terms from "../react-app/Terms";

const app = new Hono();

const layout = (title: string, body: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | Immio</title>
  </head>
  <body>
    ${body}
  </body>
</html>`;

const legalPage = (title: string, Component: ComponentType) => {
  return (request: Request) => {
    const headers = new Headers({
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600",
    });

    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    const html = layout(title, renderToStaticMarkup(createElement(Component)));

    return new Response(html, { status: 200, headers });
  };
};

const privacyHandler = legalPage("Privacy Policy", Privacy);
const termsHandler = legalPage("Terms of Use", Terms);

app.on(["GET", "HEAD"], "/privacy", (c) => privacyHandler(c.req.raw));
app.on(["GET", "HEAD"], "/privacy/", (c) => privacyHandler(c.req.raw));
app.on(["GET", "HEAD"], "/terms", (c) => termsHandler(c.req.raw));
app.on(["GET", "HEAD"], "/terms/", (c) => termsHandler(c.req.raw));

export default app;
