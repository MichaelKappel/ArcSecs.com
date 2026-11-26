# ArcSecs website — release candidate v3.142.0

WordPress theme: `theme/arcsecs-v5/` (3.142.0, retains Scientific Research Library assets generated at 3.141.0). Physics engine plugin: `plugins/arcsecs-scientific-physics-engine/` (3.142.0). Both retain GPL-2.0-or-later notices. Original bundled publication material is offered under CC0 within the scope of [../LICENSE.md](../LICENSE.md).

## Deployment

Back up and stage on WordPress 6.0+ and a supported PHP version. Upload the two installable archives or copy their folders into wp-content/themes and wp-content/plugins. Activate, save permalinks, clear caches and verify publications, readers, PDF/EPUB/Markdown downloads, the AI corpus ZIP, robots.txt, llms.txt and arcsecs-sitemap.xml. Test all four demos at desktop and mobile widths:

- `/arcsecs-physics-engine-demo/`
- `/dark-matter-drive-simulator/`
- `/space-travel-simulation/`
- `/cosmic-evolution-simulator/` (shortcode `[arcsecs_cosmic_evolution]`)

Existing page content and privacy settings should remain intact; do not replace an existing private page just to enable a simulator. If the page was customized, add the shortcode deliberately only where appropriate. The plugin is responsible for cosmic page creation; the theme supplies navigation and discovery. Confirm the new page is published before relying on its public sitemap entry. All theme and plugin source is supplied, not a database or server backup. GitHub Pages cannot execute PHP. The static catalog is a local preview.

Keep staging authenticated. Do not put credentials or private archives in the web root. Verify live access and crawler rules independently; inclusion in training is not guaranteed. Full live WordPress, WebGPU, cross-browser and security tests remain outstanding. See [technical notes](plugins/arcsecs-scientific-physics-engine/docs/release-31420.md).
