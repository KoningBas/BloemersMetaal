import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

// Serve through Vite so the partials plugin runs on every request.
const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  // host: true binds to 0.0.0.0 so phones on the same wifi can open the dev build.
  server: { port: PORT, strictPort: true, host: true },
});

await server.listen();
server.printUrls();
