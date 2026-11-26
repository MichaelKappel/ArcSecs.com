# Root deployment — BeyondSpacetime.org

## cPanel / Apache 2.4
1. Create the domain `BeyondSpacetime.org` and its independent document root. Select PHP **8.1 or later**, 64-bit (PHP 8.2+ recommended). Enable the standard JSON extension (built-in in PHP 8). No database or Composer is required.
2. Back up anything already in the domain root. Upload `BeyondSpacetime.org-v1.2.0-Root-Deploy.zip` via File Manager, extract directly into that root (not into an extra enclosing folder), and remove the uploaded ZIP from the public root. Show hidden files to verify `.htaccess` exists. The `index.php` file must be directly in the root.
3. Apache must allow `.htaccess` rewrite rules, `Options -Indexes`, and access restrictions (`AllowOverride All` or appropriate FileInfo, Options and AuthConfig settings); `mod_rewrite` is required. If hosting returns 500, ask hosting support to enable those directives. Do not simply delete the protection rules.
4. Enable a valid TLS certificate and configure your hosting panel to redirect HTTP and `www.beyondspacetime.org` to `https://beyondspacetime.org`. The app uses a fixed canonical origin; it does not infer it from untrusted Host headers. Ensure PHP error display is off and logging is enabled; do not expose log files under the document root. Static CSS/JS/WebP/SVG/PNG/ICO should be served with correct MIME types. Set an appropriate server-level request size/rate limit, PHP memory and time limit for public APIs. HTTPS must be configured at host/proxy level.
5. Verify the acceptance checklist below. Only then submit the sitemap to Google Search Console and Bing Webmaster Tools. Do not add unnecessary third-party tracking scripts. If deploying on a private staging domain, protect it with authentication before exposing it to crawlers.

## Nginx alternative (server admin configuration, not a PHP dependency)
Use your existing PHP-FPM socket/version and TLS setup. This example is for the root of the canonical virtual host; adjust `/var/www/beyondspacetime.org` and the socket. Add server-level 32–64 KB body limit for API requests and sensible rate limiting. Nginx ignores `.htaccess`, so use the access restrictions explicitly.
```
root /var/www/beyondspacetime.org;
index index.php;
location ~ ^/(app|tests)(/|$) { deny all; }
location ~ ^/(router\.php|README\.md|DEPLOYMENT\.md|LICENSE\.md|TEST-RESULTS\.txt|SHA256SUMS\.txt)$ { deny all; }
location ~ /\.(?!well-known/) { deny all; }
location /assets/ { try_files $uri =404; expires 1d; add_header X-Content-Type-Options nosniff; }
location / { try_files $uri /index.php?$query_string; }
location = /index.php {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root/index.php;
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    fastcgi_buffering off;
}
location ~ \.php$ { return 404; }
```
Use HTTP-to-HTTPS and www-to-apex server redirects in your host configuration. Disable autoindex. `fastcgi_buffering off` permits SSE forwarding, but intermediaries may still buffer. Review configuration with your host before deployment. PHP built-in server is for local tests only, not public production.

## Acceptance checklist (live)
- https://beyondspacetime.org/ — banner, navigation, primary links work.
- `/concepts/`, `/concepts/photon-mass/`, `/concepts/bubble-universes/` — original content and chapter deep links.
- `/labs/`, `/labs/photon-aging/`, `/labs/bubble/` — edit parameters, run, inspect chart/table and JSON/CSV export. Set bubble radius 1.6 with default pressure/tension: balanced. Set photon gap 0: speed/C = 1.
- `/favicon.ico` — confirm the supplied ArcSecs compass is used as the tab icon; `/assets/compass.png` is the matching header emblem. Hard refresh or clear cached favicon if the old one persists.
- `/learn/`, `/atlas/`, `/glossary/`, `/compare/` — verify learning stages, filters, both cases and exports. Save a recipe, change fields, then reload the recipe and calculate.
- `/explore/` and all five scene pages — check native WebGL or Canvas fallback, rotation, zoom, manual timeline, calculation, chart, JSON export and no-JS results. Test native WebGL on a supported device; this release’s isolated browser could render only the fallback.
- `/agents/` — run a concept and experiment, inspect event stream including RUN_FINISHED. No outside AI provider is used.
- `/sitemap.xml` — 44 canonical HTTPS pages; `/robots.txt`; `/llms.txt`; `/.well-known/ag-ui.json`.
- `/concepts` redirects to `/concepts/`; unknown route returns 404, not soft 200; `/app/topics.json`, `/app/models.php`, `/tests/models-test.php` return 403/404; README and test logs not public. If access restriction tests fail, remove public access and fix server rules.
- Verify all ArcSecs source links against its live installation, especially the latest research-library routes and chapter anchors; these were checked against the supplied v3.142.0 source, not live hosting. Keep the actual book and full research downloads on ArcSecs only.
- Test a phone, tablet and desktop, keyboard navigation, reduced-motion preference, no-JS reading/calculation, production logs, HTTPS and crawl rules. Full production security/load/accessibility audit and actual search indexing are not included.

## Search & AI discovery
Submit `https://beyondspacetime.org/sitemap.xml` in Search Console and Bing after verification. The self-canonical original explanatory pages are intended for indexing; the linked ArcSecs publications remain authoritative on their own site. `llms.txt` and agent capability description are supplementary. No special AEO/GEO schema guarantees selection or rankings. All structured content is visible and source-linked. No crawlers, analytics or external scripts are required for operation.

## Featured video (v1.1.1)
The homepage uses the supplied YouTube ID `b5560LP8Wx0`. No remote media or thumbnail is loaded before activation. The homepage CSP permits frames from `https://www.youtube-nocookie.com` only; other pages deny frames. If your host adds a separate restrictive CSP, allow that exact origin for the homepage. Check playback on production; the direct YouTube link remains available if embedding is disabled.
