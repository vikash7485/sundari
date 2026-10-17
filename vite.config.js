import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const PAGES = ['/', '/collection', '/gallery', '/about', '/contact']

// Fills %VITE_SITE_URL% in index.html and writes robots.txt + sitemap.xml at build time.
function siteUrl(env) {
  const url = (env.VITE_SITE_URL || '').replace(/\/$/, '')
  return {
    name: 'sundari-site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => {
        // Without a domain, canonical / og:url can't be absolute – leave them out.
        if (!url) html = html.replace(/\s*<link rel="canonical"[^>]*>/, '').replace(/\s*<meta property="og:url"[^>]*>/, '')
        return html.replaceAll('%VITE_SITE_URL%', url)
      },
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', 'Disallow: /admin', url && `Sitemap: ${url}/sitemap.xml`].filter(Boolean).join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots + '\n' })
      if (!url) {
        this.warn('VITE_SITE_URL is not set – Open Graph image and sitemap need your live domain (see README).')
        return
      }
      const today = new Date().toISOString().slice(0, 10)
      const sitemap =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        PAGES.map((p) => `  <url><loc>${url}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
        '\n</urlset>\n'
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // A live build without Supabase keys silently runs in demo mode: the owner's products would be
  // saved only on their own phone and visitors would see samples. `npm run build:demo` skips this check.
  if (command === 'build' && mode === 'production' && !(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY)) {
    throw new Error(
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set, so this build would run in demo mode. ' +
        'Add them to .env (or your hosting settings) – see README. To build the demo on purpose, run "npm run build:demo".',
    )
  }
  return {
    plugins: [siteUrl(env), react(), tailwindcss()],
  }
})
