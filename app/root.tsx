import { LiveReload } from '@remix-run/react';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So greate, it's funny!</title>
      </head>
      <body>
        Hello Remix
        <LiveReload />
      </body>
    </html>
  );
}
