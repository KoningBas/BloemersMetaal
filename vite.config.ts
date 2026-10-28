import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

const root = fileURLToPath(new URL('.', import.meta.url));

// Every page. A page that is missing here 404s in the build.
const pages = {
  home: 'index.html',
  diensten: 'diensten/index.html',
  prijzen: 'prijzen/index.html',
  'over-ons': 'over-ons/index.html',
  'veelgestelde-vragen': 'veelgestelde-vragen/index.html',
  contact: 'contact/index.html',
  privacy: 'privacy/index.html',
  '404': '404.html',
};

const PARTIAL = /<!--\s*partial:([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g;
const ATTR = /([\w-]+)="([^"]*)"/g;

// Injects src/partials/<name>.html at build and dev time.
// <!-- partial:header current="diensten" --> fills {{current}} and marks the nav link.
function partials(): Plugin {
  const render = (html: string, depth = 0): string =>
    html.replace(PARTIAL, (_, name: string, rawAttrs: string) => {
      const file = resolve(root, 'src/partials', `${name}.html`);
      if (!existsSync(file)) throw new Error(`Unknown partial: ${name}`);
      const attrs: Record<string, string> = {};
      for (const [, k, v] of rawAttrs.matchAll(ATTR)) attrs[k] = v;
      let out = readFileSync(file, 'utf8');
      out = out.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in attrs ? attrs[k] : m));
      if (attrs.current) {
        out = out.replaceAll(`data-nav="${attrs.current}"`, 'aria-current="page"');
      }
      out = out.replace(/\sdata-nav="[^"]*"/g, '');
      return depth < 3 ? render(out, depth + 1) : out;
    });

  return {
    name: 'html-partials',
    transformIndexHtml: { order: 'pre', handler: (html) => render(html) },
    handleHotUpdate({ file, server }) {
      if (file.includes('src/partials')) server.ws.send({ type: 'full-reload' });
    },
  };
}

// Dev only: /diensten -> /diensten/, and unknown pages get 404.html.
function devRouting(): Plugin {
  const dirs = Object.values(pages)
    .filter((p) => p.endsWith('/index.html'))
    .map((p) => '/' + p.replace('/index.html', ''));
  return {
    name: 'dev-routing',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '/').split('?')[0];
        if (dirs.includes(url)) {
          res.writeHead(301, { Location: url + '/' });
          res.end();
          return;
        }
        next();
      });
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = (req.url || '/').split('?')[0];
          if (req.headers.accept?.includes('text/html') && !url.includes('.')) {
            try {
              const html = await server.transformIndexHtml(url, readFileSync(resolve(root, '404.html'), 'utf8'));
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/html');
              res.end(html);
              return;
            } catch (err) {
              return next(err);
            }
          }
          next();
        });
      };
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [partials(), devRouting()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: Object.fromEntries(Object.entries(pages).map(([k, v]) => [k, resolve(root, v)])),
    },
  },
});
