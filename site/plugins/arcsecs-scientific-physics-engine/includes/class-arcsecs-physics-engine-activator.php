<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ArcSecs_Physics_Engine_Activator
{
    /**
     * Creates the demo page and inserts it into the most appropriate WordPress menu.
     *
     * @return void
     */
    public static function activate(): void
    {
        $page_id = self::create_or_update_demo_page();
        self::create_cosmic_page();
        $dark_drive_page_id = self::create_or_update_dark_matter_drive_page();
        $contact_page_id = self::create_or_update_contact_page();
        self::add_demo_page_to_menu($page_id);
        self::add_dark_matter_drive_page_to_menu($dark_drive_page_id);
        self::add_contact_page_to_menu($contact_page_id);
        self::update_contact_footer_metadata($contact_page_id);
        self::update_contact_live_verification_notes($contact_page_id);
        update_option('arcsecs_physics_engine_version', ARCSECS_PHYSICS_ENGINE_VERSION);
        flush_rewrite_rules();
    }

    /**
     * Recreates activation content from the admin page.
     *
     * @return Int32 WordPress post ID for the demo page.
     */
    public static function repair_installation(): int
    {
        $page_id = self::create_or_update_demo_page();
        self::create_cosmic_page();
        $dark_drive_page_id = self::create_or_update_dark_matter_drive_page();
        $contact_page_id = self::create_or_update_contact_page();
        self::add_demo_page_to_menu($page_id);
        self::add_dark_matter_drive_page_to_menu($dark_drive_page_id);
        self::add_contact_page_to_menu($contact_page_id);
        self::update_contact_footer_metadata($contact_page_id);
        self::update_contact_live_verification_notes($contact_page_id);
        return $page_id;
    }

    /**
     * Creates or updates the ArcSecs Physics Engine demo page.
     *
     * @return Int32 WordPress post ID for the demo page.
     */
    private static function create_cosmic_page(): int
    {
        $existing = get_page_by_path('cosmic-evolution-simulator');
        if ($existing instanceof WP_Post) { return (int) $existing->ID; }
        return (int) wp_insert_post(array('post_title' => 'Cosmic Evolution & Greater Cosmos', 'post_name' => 'cosmic-evolution-simulator', 'post_type' => 'page', 'post_status' => 'publish', 'post_content' => "<!-- wp:shortcode -->\n[arcsecs_cosmic_evolution]\n<!-- /wp:shortcode -->", 'comment_status' => 'closed'));
    }

    private static function create_or_update_demo_page(): int
    {
        $stored_page_id = (int) get_option('arcsecs_physics_engine_demo_page_id', 0);
        $existing_page = $stored_page_id > 0 ? get_post($stored_page_id) : null;

        if (!($existing_page instanceof WP_Post) || $existing_page->post_type !== 'page') {
            $existing_page = get_page_by_path('arcsecs-physics-engine-demo');
        }

        $content = "<!-- wp:heading {\"level\":1} -->\n<h1>ArcSecs Scientific Physics Engine Demo</h1>\n<!-- /wp:heading -->\n\n<!-- wp:paragraph -->\n<p>Choose a scenario and select Run to begin a speculative cosmology simulation. Open the expandable control console only when you want to tune parameters, export data, or rerun the model.</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:shortcode -->\n[arcsecs_physics_engine title=\"ArcSecs Scientific Physics Engine\" subtitle=\"A live scientific instrument for TDD Physics, VSL, tired light, Proca dispersion, covariant constants, and Dark Matter Drive flow models.\" scenario=\"darkMatterDrive\" auto_run=\"false\" auto_grand_experiment=\"false\" steps=\"6000\"]\n<!-- /wp:shortcode -->";

        $post_data = array(
            'post_title' => 'ArcSecs Physics Engine Demo',
            'post_name' => 'arcsecs-physics-engine-demo',
            'post_content' => $content,
            'post_status' => 'publish',
            'post_type' => 'page',
            'comment_status' => 'closed',
            'ping_status' => 'closed',
        );

        if ($existing_page instanceof WP_Post) {
            $page_id = (int) $existing_page->ID;
        } else {
            $page_id = (int) wp_insert_post($post_data);
        }

        if ($page_id > 0) {
            update_option('arcsecs_physics_engine_demo_page_id', $page_id);
        }

        return $page_id;
    }

    /**
     * Creates or updates the Interactive Dark Matter Drive Simulator page.
     *
     * @return Int32 WordPress post ID for the simulator page.
     */
    private static function create_or_update_dark_matter_drive_page(): int
    {
        $stored_page_id = (int) get_option('arcsecs_dark_matter_drive_page_id', 0);
        $existing_page = $stored_page_id > 0 ? get_post($stored_page_id) : null;

        if (!($existing_page instanceof WP_Post) || $existing_page->post_type !== 'page') {
            $existing_page = get_page_by_path('dark-matter-drive-simulator');
        }

        $content = <<<'HTML'
<!-- wp:heading {"level":1} -->
<h1>Dark Matter Drive Simulator</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Explore the ArcSecs Dark Matter Drive Simulator with galaxy rotation curves, dark matter halo controls, dark matter wind, MQN / Dark Matter Drive concept walkthroughs, lensing-style arcsecond telemetry, and clearly labeled speculative engineering boundaries.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This simulator is a speculative research visualization. It does not claim dark matter propulsion is established technology and does not present browser telemetry as operational spacecraft capability.</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[arcsecs_dark_matter_drive_simulator]
<!-- /wp:shortcode -->
HTML;

        $post_data = array(
            'post_title' => 'Dark Matter Drive Simulator',
            'post_name' => 'dark-matter-drive-simulator',
            'post_content' => $content,
            'post_status' => 'publish',
            'post_type' => 'page',
            'comment_status' => 'closed',
            'ping_status' => 'closed',
        );

        if ($existing_page instanceof WP_Post) {
            $page_id = (int) $existing_page->ID;
        } else {
            $page_id = (int) wp_insert_post($post_data);
        }

        if ($page_id > 0) {
            update_option('arcsecs_dark_matter_drive_page_id', $page_id);
        }

        return $page_id;
    }


    /**
     * Creates or updates the public Michael Kappel contact page.
     *
     * @return Int32 WordPress post ID for the contact page.
     */
    private static function create_or_update_contact_page(): int
    {
        $stored_page_id = (int) get_option('arcsecs_contact_page_id', 0);
        $existing_page = $stored_page_id > 0 ? get_post($stored_page_id) : null;

        if (!($existing_page instanceof WP_Post) || $existing_page->post_type !== 'page') {
            $existing_page = get_page_by_path('contact');
        }

        if (!($existing_page instanceof WP_Post) || $existing_page->post_type !== 'page') {
            $existing_page = get_page_by_path('michael-kappel-contact');
        }

        $content = <<<'HTML'
<!-- wp:group {"className":"arcsecs-contact-hero arcsecs-contact-trust-hero"} -->
<div class="wp-block-group arcsecs-contact-hero arcsecs-contact-trust-hero"><!-- wp:heading {"level":1} -->
<h1>Contact Michael Kappel</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"arcsecs-contact-lede"} -->
<p class="arcsecs-contact-lede">Michael Kappel is a senior software engineer and software architect in the Chicago area. He builds practical, production-ready web software with C#, ASP.NET Core, SQL Server, TypeScript, APIs, automated testing, semantic search, and AI-assisted engineering workflows.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This page gives ArcSecs visitors a direct way to reach the person maintaining the software, public documentation, review artifacts, and cautious research-visualization workflow. The background summary intentionally uses business-domain categories instead of exact employer or client names.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"className":"arcsecs-contact-columns arcsecs-contact-card-grid"} -->
<div class="wp-block-columns arcsecs-contact-columns arcsecs-contact-card-grid"><!-- wp:column -->
<div class="wp-block-column arcsecs-contact-card"><!-- wp:heading {"level":2} -->
<h2>Contact</h2>
<!-- /wp:heading -->

<!-- wp:list {"className":"arcsecs-contact-list"} -->
<ul class="arcsecs-contact-list"><li><strong>Email:</strong> <a class="arcsecs-contact-link" href="mailto:mike@ns12.com">mike@ns12.com</a></li><li><strong>Phone:</strong> <a class="arcsecs-contact-link" href="tel:+16303627576">(630) 362-7576</a></li><li><strong>Location:</strong> Cicero, Illinois / Chicago area</li><li><strong>Professional profile:</strong> <a class="arcsecs-contact-link" href="https://mikekappel.com/" rel="noopener">MikeKappel.com</a></li></ul>
<!-- /wp:list --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column arcsecs-contact-card"><!-- wp:heading {"level":2} -->
<h2>Why this contact page exists</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>ArcSecs is a speculative research visualization and public evidence workflow. Michael's role is to keep the software side grounded: readable public pages, source-bounded claims, exportable evidence, deterministic validation, review gates, and cautious handoff artifacts.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Reach out for ArcSecs questions, Dark Matter Drive presentation work, software architecture review, modernization planning, public research-site implementation, or AI-assisted engineering workflows that still need human review.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:heading {"level":2} -->
<h2>Engineering background</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Michael has more than two decades of engineering experience across data-heavy business systems, claims and review workflows, logistics and transportation systems, collaboration tools, managed services tooling, ERP and fulfillment operations, public-sector style reporting, financial systems, payments, and consulting-style architecture rescue work.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>His technical strengths include ASP.NET Core, MVC, Razor Pages, Web API, C#, SQL Server, EF Core, ADO.NET, stored procedures, performance tuning, TypeScript, JavaScript, REST integrations, automated testing, SOLID design, code review, refactoring strategy, and AI-assisted modernization with human review gates.</p>
<!-- /wp:paragraph -->

<!-- wp:columns {"className":"arcsecs-contact-columns arcsecs-contact-card-grid"} -->
<div class="wp-block-columns arcsecs-contact-columns arcsecs-contact-card-grid"><!-- wp:column -->
<div class="wp-block-column arcsecs-contact-card"><!-- wp:heading {"level":2} -->
<h2>How I can help</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>Turn older web applications, stored procedures, and undocumented business rules into maintainable modern systems.</li><li>Design SQL-heavy applications with reliable reporting, transactional workflows, indexing, and performance discipline.</li><li>Build API-backed workflows, machine-readable endpoints, public documentation, and local-only review exports.</li><li>Use AI as a reviewed engineering assistant instead of treating model output as truth.</li></ul>
<!-- /wp:list --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column arcsecs-contact-card"><!-- wp:heading {"level":2} -->
<h2>Best reasons to reach out</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><li>You need a senior review of architecture, data flow, reliability, or maintainability.</li><li>You want public research pages to be clearer, safer, and easier for people and AI agents to inspect.</li><li>You need careful modernization that protects business rules while improving code quality.</li><li>You want ArcSecs-related feedback, implementation help, or review of evidence/export workflows.</li></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->


<!-- wp:heading {"level":2} -->
<h2>Live verification notes</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"arcsecs-contact-verification-note"} -->
<p class="arcsecs-contact-verification-note">After deployment, a human reviewer should verify that email, phone, location, MikeKappel.com, Contact menu placement, footer-link guidance, mobile spacing, tap-friendly links, scoped ContactPage / Person / ContactPoint JSON-LD, employer/client omission, and ArcSecs claim boundaries are still visible. This is local review metadata only and does not fetch, publish, or validate live pages automatically.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>Theme footer handoff</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"arcsecs-contact-footer-handoff"} -->
<p class="arcsecs-contact-footer-handoff">If the active theme exposes footer navigation, add a manual footer link labeled Contact or Contact Michael Kappel pointing to /contact/. The plugin stores footer-link metadata for human review only and does not force unrelated theme footer behavior.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>Claim boundary</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"arcsecs-contact-boundary"} -->
<p class="arcsecs-contact-boundary">This contact page supports software, documentation, review, and speculative research-visualization work. It does not claim ArcSecs is proven physics, does not claim dark matter propulsion is established technology, and does not present speculative simulator output as operational capability.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"arcsecs-contact-footer-guidance"} -->
<p class="arcsecs-contact-footer-guidance">Footer link guidance: link to this page as Contact or Contact Michael Kappel when the active theme exposes footer navigation. This plugin stores footer-link metadata for human review but does not force unrelated theme footer behavior.</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://arcsecs.com/contact/#contact-page",
      "name": "Contact Michael Kappel",
      "url": "https://arcsecs.com/contact/",
      "description": "Contact page for Michael Kappel, a senior software engineer and software architect supporting ArcSecs public research-visualization software, documentation, review artifacts, and cautious evidence workflows.",
      "about": { "@id": "https://mikekappel.com/#person" },
      "mainEntity": { "@id": "https://mikekappel.com/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://mikekappel.com/#person",
      "name": "Michael Kappel",
      "jobTitle": "Senior Software Engineer / Software Architect",
      "email": "mike@ns12.com",
      "telephone": "+1-630-362-7576",
      "url": "https://mikekappel.com/",
      "sameAs": ["https://mikekappel.com/"],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cicero",
        "addressRegion": "IL",
        "addressCountry": "US"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "mike@ns12.com",
        "telephone": "+1-630-362-7576",
        "contactType": "professional software engineering contact"
      },
      "knowsAbout": ["C#", "ASP.NET Core", "SQL Server", "TypeScript", "software architecture", "legacy modernization", "AI-assisted engineering", "semantic search", "testing strategy", "public research visualization"]
    }
  ]
}
</script>
<!-- /wp:html -->
HTML;

        $post_data = array(
            'post_title' => 'Contact Michael Kappel',
            'post_name' => 'contact',
            'post_content' => $content,
            'post_status' => 'publish',
            'post_type' => 'page',
            'comment_status' => 'closed',
            'ping_status' => 'closed',
        );

        if ($existing_page instanceof WP_Post) {
            $page_id = (int) $existing_page->ID;
        } else {
            $page_id = (int) wp_insert_post($post_data);
        }

        if ($page_id > 0) {
            update_option('arcsecs_contact_page_id', $page_id);
        }

        return $page_id;
    }

    /**
     * Adds the demo page to the first available navigation menu or creates one.
     *
     * @param Int32 $page_id WordPress post ID for the demo page.
     * @return void
     */
    private static function add_demo_page_to_menu(int $page_id): void
    {
        if ($page_id <= 0) {
            return;
        }

        $menu_id = self::resolve_menu_id();
        if ($menu_id <= 0) {
            return;
        }

        $items = wp_get_nav_menu_items($menu_id);
        if (is_array($items)) {
            foreach ($items as $item) {
                if ((int) $item->object_id === $page_id && $item->object === 'page') {
                    update_option('arcsecs_physics_engine_menu_item_id', (int) $item->ID);
                    return;
                }

                if (isset($item->url) && untrailingslashit((string) $item->url) === untrailingslashit(get_permalink($page_id))) {
                    update_option('arcsecs_physics_engine_menu_item_id', (int) $item->ID);
                    return;
                }
            }
        }

        $menu_item_id = wp_update_nav_menu_item(
            $menu_id,
            0,
            array(
                'menu-item-title' => 'Physics Engine Demo',
                'menu-item-object-id' => $page_id,
                'menu-item-object' => 'page',
                'menu-item-type' => 'post_type',
                'menu-item-status' => 'publish',
            )
        );

        if (!is_wp_error($menu_item_id)) {
            update_option('arcsecs_physics_engine_menu_item_id', (int) $menu_item_id);
        }
    }

    /**
     * Adds the Dark Matter Drive simulator page to the plugin-managed navigation menu.
     *
     * @param Int32 $page_id WordPress post ID for the simulator page.
     * @return void
     */
    private static function add_dark_matter_drive_page_to_menu(int $page_id): void
    {
        if ($page_id <= 0) {
            return;
        }

        $menu_id = self::resolve_menu_id();
        if ($menu_id <= 0) {
            return;
        }

        $permalink = get_permalink($page_id);

        $items = wp_get_nav_menu_items($menu_id);
        if (is_array($items)) {
            foreach ($items as $item) {
                if ((int) $item->object_id === $page_id && $item->object === 'page') {
                    wp_update_nav_menu_item(
                        $menu_id,
                        (int) $item->ID,
                        array(
                            'menu-item-title' => 'DM Drive',
                            'menu-item-object-id' => $page_id,
                            'menu-item-object' => 'page',
                            'menu-item-type' => 'post_type',
                            'menu-item-status' => 'publish',
                        )
                    );
                    update_option('arcsecs_dark_matter_drive_menu_item_id', (int) $item->ID);
                    return;
                }

                if (is_string($permalink) && isset($item->url) && untrailingslashit((string) $item->url) === untrailingslashit($permalink)) {
                    wp_update_nav_menu_item(
                        $menu_id,
                        (int) $item->ID,
                        array(
                            'menu-item-title' => 'DM Drive',
                            'menu-item-url' => $permalink,
                            'menu-item-type' => 'custom',
                            'menu-item-status' => 'publish',
                        )
                    );
                    update_option('arcsecs_dark_matter_drive_menu_item_id', (int) $item->ID);
                    return;
                }
            }
        }

        $menu_item_id = wp_update_nav_menu_item(
            $menu_id,
            0,
            array(
                'menu-item-title' => 'DM Drive',
                'menu-item-object-id' => $page_id,
                'menu-item-object' => 'page',
                'menu-item-type' => 'post_type',
                'menu-item-status' => 'publish',
            )
        );

        if (!is_wp_error($menu_item_id)) {
            update_option('arcsecs_dark_matter_drive_menu_item_id', (int) $menu_item_id);
        }
    }



    /**
     * Stores plugin-owned footer metadata for themes or reviewers that expose footer links.
     *
     * @param Int32 $page_id WordPress post ID for the contact page.
     * @return void
     */
    private static function update_contact_footer_metadata(int $page_id): void
    {
        if ($page_id <= 0) {
            return;
        }

        $permalink = get_permalink($page_id);
        update_option(
            'arcsecs_contact_footer_link_metadata',
            array(
                'label' => 'Contact',
                'title' => 'Contact Michael Kappel',
                'url' => is_string($permalink) ? $permalink : '/contact/',
                'page_id' => $page_id,
                'guidance' => 'Footer contact link metadata only. Human theme review may place this link in a footer when the active theme exposes footer navigation; the plugin does not force unrelated theme footer behavior.',
                'package_version' => ARCSECS_PHYSICS_ENGINE_VERSION,
                'live_verification_notes_option' => 'arcsecs_contact_page_live_verification_notes',
            )
        );
    }


    /**
     * Stores local-only contact page live verification notes for post-deployment human review.
     *
     * @param Int32 $page_id WordPress post ID for the contact page.
     * @return void
     */
    private static function update_contact_live_verification_notes(int $page_id): void
    {
        if ($page_id <= 0) {
            return;
        }

        $permalink = get_permalink($page_id);
        update_option(
            'arcsecs_contact_page_live_verification_notes',
            array(
                'packageVersion' => ARCSECS_PHYSICS_ENGINE_VERSION,
                'exportType' => 'contactPageLiveVerificationNotes',
                'generatedUtc' => gmdate('Y-m-d\TH:i:s\Z'),
                'pageSourceRoute' => is_string($permalink) ? $permalink : '/contact/',
                'contactPageSlug' => 'contact',
                'verificationRows' => array(
                    array('check' => 'email visible', 'expected' => 'mike@ns12.com', 'status' => 'human-review-required'),
                    array('check' => 'phone visible', 'expected' => '+1-630-362-7576', 'status' => 'human-review-required'),
                    array('check' => 'location visible', 'expected' => 'Cicero, Illinois / Chicago area', 'status' => 'human-review-required'),
                    array('check' => 'MikeKappel.com visible', 'expected' => 'https://mikekappel.com/', 'status' => 'human-review-required'),
                    array('check' => 'Contact menu item visible', 'expected' => 'Contact', 'status' => 'human-review-required'),
                    array('check' => 'footer-link metadata available', 'expected' => 'arcsecs_contact_footer_link_metadata', 'status' => 'guidance-only'),
                    array('check' => 'mobile layout readable', 'expected' => 'tap-friendly email and phone links without horizontal overflow', 'status' => 'human-review-required'),
                    array('check' => 'ContactPage / Person / ContactPoint JSON-LD scoped', 'expected' => '/contact/ only', 'status' => 'human-review-required'),
                    array('check' => 'exact employer/client names omitted', 'expected' => 'true', 'status' => 'human-review-required'),
                    array('check' => 'ArcSecs boundary copy visible', 'expected' => 'speculative research visualization only', 'status' => 'human-review-required'),
                ),
                'footerHandoffGuidance' => 'If the active theme exposes footer navigation, a human reviewer may add a footer link labeled Contact or Contact Michael Kappel that points to /contact/. The plugin keeps footer metadata as guidance only and does not force unrelated theme behavior.',
                'schemaSafetyStatus' => 'ContactPage / Person / ContactPoint schema is intended to be scoped only to /contact/ and must not be injected into unrelated routes.',
                'employerClientOmissionStatus' => 'Exact employer and client names remain intentionally omitted from contact copy and schema.',
                'warnings' => array('Human reviewer must verify the live theme footer manually if footer navigation exists.'),
                'recommendedFixes' => array('After deployment, open /contact/ on desktop and phone, verify contact facts, schema scope, footer guidance, menu placement, and ArcSecs boundary copy.'),
                'speculativeBoundaryText' => 'ArcSecs is a speculative research visualization. Contact-page launch notes do not prove physics, do not establish dark matter propulsion, and do not indicate operational capability.',
                'exportContainsExecutableCode' => false,
            )
        );
    }

    /**
     * Adds the contact page to the plugin-managed navigation menu.
     *
     * @param Int32 $page_id WordPress post ID for the contact page.
     * @return void
     */
    private static function add_contact_page_to_menu(int $page_id): void
    {
        if ($page_id <= 0) {
            return;
        }

        $menu_id = self::resolve_menu_id();
        if ($menu_id <= 0) {
            return;
        }

        $permalink = get_permalink($page_id);
        $items = wp_get_nav_menu_items($menu_id);
        if (is_array($items)) {
            foreach ($items as $item) {
                if ((int) $item->object_id === $page_id && $item->object === 'page') {
                    wp_update_nav_menu_item(
                        $menu_id,
                        (int) $item->ID,
                        array(
                            'menu-item-title' => 'Contact',
                            'menu-item-object-id' => $page_id,
                            'menu-item-object' => 'page',
                            'menu-item-type' => 'post_type',
                            'menu-item-status' => 'publish',
                        )
                    );
                    update_option('arcsecs_contact_menu_item_id', (int) $item->ID);
                    return;
                }

                if (is_string($permalink) && isset($item->url) && untrailingslashit((string) $item->url) === untrailingslashit($permalink)) {
                    wp_update_nav_menu_item(
                        $menu_id,
                        (int) $item->ID,
                        array(
                            'menu-item-title' => 'Contact',
                            'menu-item-url' => $permalink,
                            'menu-item-type' => 'custom',
                            'menu-item-status' => 'publish',
                        )
                    );
                    update_option('arcsecs_contact_menu_item_id', (int) $item->ID);
                    return;
                }
            }
        }

        $menu_item_id = wp_update_nav_menu_item(
            $menu_id,
            0,
            array(
                'menu-item-title' => 'Contact',
                'menu-item-object-id' => $page_id,
                'menu-item-object' => 'page',
                'menu-item-type' => 'post_type',
                'menu-item-status' => 'publish',
            )
        );

        if (!is_wp_error($menu_item_id)) {
            update_option('arcsecs_contact_menu_item_id', (int) $menu_item_id);
        }
    }

    /**
     * Resolves a WordPress menu ID for auto-link insertion.
     *
     * @return Int32 Menu term ID.
     */
    private static function resolve_menu_id(): int
    {
        $locations = get_nav_menu_locations();
        $preferred_locations = array('primary', 'main', 'menu-1', 'header', 'top');

        foreach ($preferred_locations as $location_name) {
            if (isset($locations[$location_name]) && (int) $locations[$location_name] > 0) {
                return (int) $locations[$location_name];
            }
        }

        foreach ($locations as $menu_id) {
            if ((int) $menu_id > 0) {
                return (int) $menu_id;
            }
        }

        $menus = wp_get_nav_menus();
        if (!empty($menus)) {
            return (int) $menus[0]->term_id;
        }

        $menu_id = wp_create_nav_menu('ArcSecs Main Menu');
        if (is_wp_error($menu_id)) {
            return 0;
        }

        $registered_locations = get_registered_nav_menus();
        if (!empty($registered_locations)) {
            $first_location = (string) array_key_first($registered_locations);
            $locations[$first_location] = (int) $menu_id;
            set_theme_mod('nav_menu_locations', $locations);
        }

        return (int) $menu_id;
    }
}
