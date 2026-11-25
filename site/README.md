# ArcSecs website

Actual source: WordPress theme `theme/arcsecs-v5/` and plugin `plugins/arcsecs-scientific-physics-engine/`, both with PHP header version 3.135.0. The plugin package metadata declares v5.8.36. The files are not a WordPress database or a live server backup.

## Local/staging deployment

1. Set up a separate WordPress instance (theme requires WP 6.0+ and PHP 7.4+).
2. Copy the theme directory to `wp-content/themes/arcsecs-v5/` and the plugin directory to `wp-content/plugins/arcsecs-scientific-physics-engine/`.
3. Activate both components, save permalinks and inspect the existing page/shortcode configuration. Use a backup and verify staging before production. No wp-config, database, secrets, or host settings included.
4. Confirm route and page behavior, test the simulated physics controls, and verify crawler settings against authorized public content. Never copy the private staging book or research files to a web root before rights approval.

Static catalog: from repository root run `python -m http.server 8000 --bind 127.0.0.1`, open `http://127.0.0.1:8000/site/catalog/`. This is a local preview, not a live website deployment. The WordPress source cannot run on GitHub Pages.

Both upstream code components carry GPL-2.0-or-later notices. No additional licensing is assigned here. Existing test sources are retained, including tests expecting upstream memory files that are deliberately absent. See the validation report for actual results.
