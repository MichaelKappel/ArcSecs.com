<?php
/**
 * Virtual ArcSecs Cosmic Anomalies Tracker page.
 *
 * @package ArcSecs
 */

$demo_url      = arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' );
$drive_url     = arcsecs_dark_matter_drive_simulator_url();
$hub_url       = arcsecs_ai_access_url( 'arcsecs-research-hub/' );
$framework_url = arcsecs_ai_access_url( 'standard-cosmology-vs-arcsecs/' );
$tracker_url   = arcsecs_ai_access_url( 'cosmic-anomalies-tracker/' );
$multi_messenger_url = arcsecs_ai_access_url( 'multi-messenger-light-delay/' );

$anomalies = array(
    array(
        'name'        => 'Hubble Tension',
        'slug'        => 'hubble-tension',
        'category'    => 'redshift-expansion',
        'status'      => 'Mainstream Active Debate',
        'shortStatus' => 'Open Problem',
        'evidenceTier' => 'Active Interpretation',
        'dependency'  => 'Expansion history, distance ladder calibration, early-universe CMB inference, dark energy assumptions.',
        'lens'        => 'Tired light, variable light speed, redshift duality, and cumulative photon-energy decay as explicit simulation branches.',
        'observation' => 'Early-universe CMB-derived Hubble constant estimates differ from local distance-ladder measurements.',
        'mainstream'  => 'Mainstream cosmology generally treats the tension as a calibration, systematic, or new-physics problem inside an expanding-universe framework. Candidate explanations include early dark energy, modified expansion history, refined Cepheid calibration, and other extensions.',
        'pressure'    => 'The numbers are precise enough that the disagreement is no longer easy to dismiss as casual measurement noise, but the field still debates whether it is a hidden systematic or a real crack in the model.',
        'arcsecs'     => 'The speculative ArcSecs interpretation asks whether observed redshift must be treated as pure metric expansion. It models tired-light attenuation, Proca dispersion, and pulse stretching as testable alternatives, not as settled replacements.',
        'hook'        => 'Redshift decay, tired-light attenuation, variable-speed-of-light toggles, and supernova pulse-stretching telemetry in the Physics Engine Demo.',
        'evidence'    => 'Strong observational pressure point; mainstream active debate; ArcSecs simulation target.',
        'references'  => array(
            array( 'label' => 'CERN Courier: The Hubble tension', 'url' => 'https://cerncourier.com/a/the-hubble-tension/' ),
            array( 'label' => 'arXiv: Sound Horizon-free H0 measurements', 'url' => 'https://arxiv.org/pdf/2601.00650' ),
            array( 'label' => 'Quanta: Webb and cosmology controversy', 'url' => 'https://www.quantamagazine.org/the-webb-telescope-further-deepens-the-biggest-controversy-in-cosmology-20240813/' ),
        ),
    ),
    array(
        'name'        => 'JWST Mature Early Galaxies',
        'slug'        => 'jwst-mature-early-galaxies',
        'category'    => 'early-universe',
        'status'      => 'Mainstream Active Debate',
        'shortStatus' => 'Active Debate',
        'evidenceTier' => 'Active Interpretation',
        'dependency'  => 'Big Bang timeline, hierarchical structure formation, early star-formation efficiency, stellar population modeling.',
        'lens'        => 'Static-distance redshift interpretation, optical attenuation, deep-time galaxies, and mass-boom scenario tests.',
        'observation' => 'JWST has reported very distant, surprisingly luminous, structurally developed, or chemically enriched galaxies that appear early in the standard timeline.',
        'mainstream'  => 'Mainstream responses include earlier-than-expected star formation, revised galaxy formation models, selection effects, dust and stellar-population uncertainties, and improved spectroscopic follow-up.',
        'pressure'    => 'The pressure point is not one galaxy alone; it is the pattern of mature-looking high-redshift systems that pushes formation models to become faster, more efficient, and more nuanced.',
        'arcsecs'     => 'ArcSecs explores the possibility that some high-redshift maturity problems are artifacts of forcing static-distance observations into an expanding-metric age ladder.',
        'hook'        => 'Static-distance redshift mode, mass-boom branch, optical attenuation controls, and galaxy-age interpretation panels.',
        'evidence'    => 'Fast-moving observational field; mainstream modeling is adapting; ArcSecs treats the anomalies as deep-time simulation tests.',
        'references'  => array(
            array( 'label' => 'NASA Webb: most distant known galaxy', 'url' => 'https://science.nasa.gov/blogs/webb/2024/05/30/nasas-james-webb-space-telescope-finds-most-distant-known-galaxy/' ),
            array( 'label' => 'Steward Observatory: earliest known galaxy', 'url' => 'https://astro.arizona.edu/news/webb-discovers-earliest-known-galaxy-now' ),
            array( 'label' => 'JADES-GS-z14-0 overview', 'url' => 'https://en.wikipedia.org/wiki/JADES-GS-z14-0' ),
        ),
    ),
    array(
        'name'        => 'SPARC / Galaxy Rotation Curves',
        'slug'        => 'sparc-galaxy-rotation-curves',
        'category'    => 'galaxy-dynamics',
        'status'      => 'ArcSecs Simulation Target',
        'shortStatus' => 'Simulation Target',
        'evidenceTier' => 'Established Observation',
        'dependency'  => 'Cold dark matter halos, baryonic feedback, modified gravity comparisons, and acceleration-scale regularities.',
        'lens'        => 'Massive Proca photon condensate behaving like an optically inactive gravitational halo.',
        'observation' => 'Galaxy rotation curves and radial acceleration relations show tight empirical behavior across diverse galaxy types.',
        'mainstream'  => 'Mainstream Lambda-CDM uses cold dark matter halos plus baryonic feedback, while modified-gravity alternatives try to capture the empirical acceleration relation more directly.',
        'pressure'    => 'The regularity of the relation is a pressure point because dark matter halos should be complex, history-dependent structures, yet the data often follows simple patterns.',
        'arcsecs'     => 'ArcSecs proposes a speculative tired-light condensate: ancient degraded photons become optically inactive but still mass-bearing, pooling around galaxies as a dark-sector field.',
        'hook'        => 'Rotation-curve visualizer, Proca photon mass slider, condensate density field, and baryonic-vs-condensate acceleration comparison.',
        'evidence'    => 'Well-observed galaxy-scale issue; mainstream and alternative interpretations remain debated; condensate model is speculative.',
        'references'  => array(
            array( 'label' => 'SPARC database', 'url' => 'https://astroweb.case.edu/SPARC/' ),
            array( 'label' => 'arXiv: SPARC galaxies prefer Dark Matter over MOND', 'url' => 'https://arxiv.org/html/2401.10202v1' ),
            array( 'label' => 'MDPI: Galaxy rotation curve model', 'url' => 'https://www.mdpi.com/2075-4434/14/1/12' ),
        ),
    ),
    array(
        'name'        => 'El Gordo Cluster Collision',
        'slug'        => 'el-gordo-cluster-collision',
        'category'    => 'cluster-formation',
        'status'      => 'Needs More Data',
        'shortStatus' => 'Extreme Event',
        'evidenceTier' => 'Active Interpretation',
        'dependency'  => 'Hierarchical structure formation, cluster mass estimates, merger velocities, and dark matter halo growth.',
        'lens'        => 'Deep-time structure formation without a strict young-universe bottleneck.',
        'observation' => 'The El Gordo galaxy cluster is a massive, high-redshift merging system often discussed as difficult to reproduce in simple structure-formation timelines.',
        'mainstream'  => 'Mainstream explanations treat it as a rare extreme event and refine mass estimates, selection effects, and hydrodynamical simulations.',
        'pressure'    => 'The pressure comes from combining mass, redshift, merger speed, and morphology. A single rare object can be survivable; a pattern of extreme structures would be harder.',
        'arcsecs'     => 'ArcSecs asks whether a static or deep-time universe makes such massive structures less surprising by giving clusters far longer to form, drift, and collide.',
        'hook'        => 'Cluster collision velocity sandbox, deep-time structure formation mode, and merger-energy accounting ledger.',
        'evidence'    => 'Interesting high-mass cluster case; not a standalone falsification; useful as a simulation stress test.',
        'references'  => array(
            array( 'label' => 'Physics World: giant galaxy clusters', 'url' => 'https://physicsworld.com/a/are-giant-galaxy-clusters-defying-standard-cosmology/' ),
            array( 'label' => 'Triton Station: The Fat One', 'url' => 'https://tritonstation.com/2021/02/05/the-fat-one-a-test-of-structure-formation-with-the-most-massive-cluster-of-galaxies/' ),
            array( 'label' => 'El Gordo overview', 'url' => 'https://en.wikipedia.org/wiki/El_Gordo_(galaxy_cluster)' ),
        ),
    ),
    array(
        'name'        => 'Lithium-7 Problem',
        'slug'        => 'lithium-7-problem',
        'category'    => 'element-abundance',
        'status'      => 'Mainstream Active Debate',
        'shortStatus' => 'Abundance Stress',
        'evidenceTier' => 'Established Observation',
        'dependency'  => 'Big Bang nucleosynthesis, stellar depletion, nuclear reaction rates, and possible new particle physics.',
        'lens'        => 'Long-term chemical equilibrium instead of a single primordial abundance freeze-out.',
        'observation' => 'Standard Big Bang nucleosynthesis predicts more Lithium-7 than is observed in metal-poor halo stars.',
        'mainstream'  => 'Mainstream explanations include stellar depletion, nuclear reaction uncertainties, and speculative particle-physics modifications during or after nucleosynthesis.',
        'pressure'    => 'Deuterium and helium can fit well while Lithium-7 does not, making the mismatch stubborn rather than a broad failure of all light-element modeling.',
        'arcsecs'     => 'ArcSecs explores whether light-element ratios could be long-term equilibrium signatures in a static or cyclic process rather than one-time primordial leftovers.',
        'hook'        => 'Element abundance equilibrium panel, chemistry ledger, or future nucleosynthesis stress-test module.',
        'evidence'    => 'Known mainstream problem; not proof against Big Bang cosmology; useful as an accounting benchmark.',
        'references'  => array(
            array( 'label' => 'arXiv: BBN and early dark energy', 'url' => 'https://arxiv.org/html/2512.11163v2' ),
            array( 'label' => 'Triton Station: Deuterium-Lithium tension', 'url' => 'https://tritonstation.com/2025/05/16/the-deuterium-lithium-tension-in-big-bang-nucleosynthesis/' ),
        ),
    ),
    array(
        'name'        => 'Photon Mass / Proca Electrodynamics',
        'slug'        => 'photon-mass-proca-electrodynamics',
        'category'    => 'electrodynamics',
        'status'      => 'Speculative Extension',
        'shortStatus' => 'Guardrail Test',
        'evidenceTier' => 'Boundary Constraint',
        'dependency'  => 'Massless photons, gauge invariance, Maxwell electrodynamics, and extremely tight experimental upper bounds.',
        'lens'        => 'Tiny non-zero photon mass enabling Proca dispersion, longitudinal modes, and tired-light condensate behavior.',
        'observation' => 'Mainstream physics treats photons as massless, while experiments place strict upper bounds rather than measuring a non-zero mass.',
        'mainstream'  => 'A zero photon rest mass preserves the standard electromagnetic framework and agrees with extraordinarily successful experiments.',
        'pressure'    => 'The pressure is not that photon mass has been observed; it is that a simulation can expose exactly how tiny a non-zero mass would have to be and what contradictions it creates.',
        'arcsecs'     => 'ArcSecs uses Proca electrodynamics as a speculative branch where photon mass creates frequency-dependent vacuum dispersion and dark-sector accumulation over distance.',
        'hook'        => 'Photon mass upper-bound slider, dispersion visualization, longitudinal polarization concept panel, and conservation warnings.',
        'evidence'    => 'Highly speculative. Must stay inside experimental upper bounds and show failure states openly.',
        'references'  => array(
            array( 'label' => 'Particle Data Group photon mass discussion', 'url' => 'https://pdg.lbl.gov/' ),
            array( 'label' => 'ArcSecs comparison page', 'url' => $framework_url ),
        ),
    ),
    array(
        'name'        => 'Tired Light / Redshift Duality',
        'slug'        => 'tired-light-redshift-duality',
        'category'    => 'redshift-expansion',
        'status'      => 'ArcSecs Simulation Target',
        'shortStatus' => 'Historic Challenge',
        'evidenceTier' => 'Speculative Extension',
        'dependency'  => 'Metric expansion, supernova time dilation, Tolman surface brightness, image sharpness, and energy conservation.',
        'lens'        => 'Photon energy loss over cosmological distance plus explicit checks for time-stretch, dimming, and blurring failures.',
        'observation' => 'Cosmological redshift is normally interpreted as expansion of space, while tired-light ideas try to explain redshift through energy loss over distance.',
        'mainstream'  => 'Mainstream cosmology rejects classic tired-light models because they historically struggle with supernova time dilation, Tolman dimming, image sharpness, and the CMB.',
        'pressure'    => 'The useful pressure point is comparative: any alternative must reproduce more than a redshift-distance curve.',
        'arcsecs'     => 'ArcSecs turns tired light into a visible test case. It should show where the model passes, where it fails, and which extra assumptions are being smuggled in.',
        'hook'        => 'Metric redshift versus tired-light redshift toggle, Tolman-style brightness check, image-blur warning, and supernova stretch comparison.',
        'evidence'    => 'Historically difficult alternative; appropriate only as a transparent computational thought experiment.',
        'references'  => array(
            array( 'label' => 'MNRAS: redshift duality framework', 'url' => 'https://academic.oup.com/mnras/advance-article/doi/10.1093/mnras/stag726/8659021' ),
            array( 'label' => 'Hubble law overview', 'url' => 'https://en.wikipedia.org/wiki/Hubble%27s_law' ),
        ),
    ),
    array(
        'name'        => 'Dark Matter Drive Implications',
        'slug'        => 'dark-matter-drive-implications',
        'category'    => 'propulsion',
        'status'      => 'Speculative Extension',
        'shortStatus' => 'Propulsion Thought Experiment',
        'evidenceTier' => 'Speculative Extension',
        'dependency'  => 'Dark matter ontology, relativistic protection, propulsion energetics, EIT analogies, and thermal accounting.',
        'lens'        => 'Harvest, compress, and redirect a massive slow-light substrate instead of moving spacetime geometry.',
        'observation' => 'If dark matter were a massive photon condensate, propulsion concepts could be reframed around interacting with that medium.',
        'mainstream'  => 'Mainstream propulsion concepts at this scale remain speculative; dark matter is not an available engineering fuel in accepted physics.',
        'pressure'    => 'The pressure is engineering honesty: drag, heat, shielding, capture efficiency, exhaust momentum, and conservation cannot be hand-waved.',
        'arcsecs'     => 'ArcSecs explores a dark matter ramjet using EIT-style scoop fields, dark-state polariton analogies, stationary-light capture, HIBE shielding, and reactor re-ingestion.',
        'hook'        => 'Dark Matter Drive simulation scenario inside the Physics Engine Demo, with scoop, shield, reactor, thermal, and exhaust ledgers.',
        'evidence'    => 'Speculative extension only. Treat as a simulation concept, not demonstrated engineering.',
        'references'  => array(
            array( 'label' => 'Open the Dark Matter Drive Simulator', 'url' => $drive_url ),
            array( 'label' => 'Run the ArcSecs Physics Engine Demo', 'url' => $demo_url ),
            array( 'label' => 'ArcSecs framework comparison', 'url' => $framework_url ),
        ),
    ),
);

$categories = array(
    'all'                => 'All Categories',
    'redshift-expansion' => 'Redshift / Expansion',
    'early-universe'     => 'Early Universe',
    'galaxy-dynamics'    => 'Galaxy Dynamics',
    'cluster-formation'  => 'Cluster Formation',
    'element-abundance'  => 'Element Abundance',
    'electrodynamics'    => 'Electrodynamics',
    'propulsion'         => 'Propulsion',
);



$pressure_ledgers = array(
    array(
        'name'              => 'Hubble Tension',
        'slug'              => 'hubble-tension',
        'category'          => 'Redshift / Expansion',
        'observationScore'  => 92,
        'mainstreamScore'   => 76,
        'arcsecsScore'      => 70,
        'demoPriorityScore' => 96,
        'mainstreamCost'    => 'Distance-ladder systematics, early-dark-energy branches, or modified expansion history must be constrained without breaking CMB and BAO successes.',
        'arcsecsCost'       => 'A tired-light or redshift-duality branch must reproduce supernova stretch, surface-brightness dimming, image sharpness, and CMB constraints.',
        'killTest'          => 'If redshift-decay settings cannot reproduce time dilation and Tolman-style dimming together, the branch should visibly fail.',
    ),
    array(
        'name'              => 'JWST Mature Early Galaxies',
        'slug'              => 'jwst-mature-early-galaxies',
        'category'          => 'Early Universe',
        'observationScore'  => 86,
        'mainstreamScore'   => 72,
        'arcsecsScore'      => 64,
        'demoPriorityScore' => 82,
        'mainstreamCost'    => 'Earlier star formation, dust corrections, top-heavy stellar populations, feedback changes, and spectroscopic follow-up must converge.',
        'arcsecsCost'       => 'A static-distance interpretation must explain why the same sky also appears to contain a coherent CMB, nucleosynthesis signatures, and large-scale structure.',
        'killTest'          => 'If improved spectroscopy and population modeling remove the maturity stress, this item should downgrade from pressure point to calibration lesson.',
    ),
    array(
        'name'              => 'SPARC / Galaxy Rotation Curves',
        'slug'              => 'sparc-galaxy-rotation-curves',
        'category'          => 'Galaxy Dynamics',
        'observationScore'  => 95,
        'mainstreamScore'   => 80,
        'arcsecsScore'      => 68,
        'demoPriorityScore' => 91,
        'mainstreamCost'    => 'Cold dark matter halos and baryonic feedback must explain tight acceleration regularities without excessive tuning.',
        'arcsecsCost'       => 'A Proca condensate must produce halo-like gravity while staying optically inactive and respecting photon-mass bounds.',
        'killTest'          => 'If condensate density cannot recover a credible rotation curve without violating photon-mass guardrails, mark the branch invalid.',
    ),
    array(
        'name'              => 'El Gordo Cluster Collision',
        'slug'              => 'el-gordo-cluster-collision',
        'category'          => 'Cluster Formation',
        'observationScore'  => 78,
        'mainstreamScore'   => 70,
        'arcsecsScore'      => 58,
        'demoPriorityScore' => 73,
        'mainstreamCost'    => 'Extreme-event probabilities, mass estimates, merger velocities, and simulation selection effects must remain statistically plausible.',
        'arcsecsCost'       => 'Deep-time structure formation must still account for observed cluster distributions, lensing, gas morphology, and merger rates.',
        'killTest'          => 'If mainstream simulations reproduce the cluster population without strained tails, the ArcSecs pressure score should drop.',
    ),
    array(
        'name'              => 'Lithium-7 Problem',
        'slug'              => 'lithium-7-problem',
        'category'          => 'Element Abundance',
        'observationScore'  => 88,
        'mainstreamScore'   => 67,
        'arcsecsScore'      => 52,
        'demoPriorityScore' => 61,
        'mainstreamCost'    => 'Stellar depletion, nuclear rates, and possible particle extensions must fix lithium without breaking deuterium and helium agreement.',
        'arcsecsCost'       => 'A non-Big-Bang abundance model must replace an entire successful nucleosynthesis framework, not only one isotope mismatch.',
        'killTest'          => 'If the tracker cannot model deuterium, helium, and lithium together, it should not use lithium as a standalone victory claim.',
    ),
    array(
        'name'              => 'Photon Mass / Proca Electrodynamics',
        'slug'              => 'photon-mass-proca-electrodynamics',
        'category'          => 'Electrodynamics',
        'observationScore'  => 60,
        'mainstreamScore'   => 94,
        'arcsecsScore'      => 55,
        'demoPriorityScore' => 88,
        'mainstreamCost'    => 'Massless photons remain the clean, successful baseline; any non-zero mass branch must be treated as bounded speculation.',
        'arcsecsCost'       => 'Proca behavior must stay below empirical limits while still generating meaningful dispersion over cosmic distances.',
        'killTest'          => 'If the required photon mass exceeds published upper bounds, the UI should flag the scenario as ruled out for that parameter set.',
    ),
    array(
        'name'              => 'Tired Light / Redshift Duality',
        'slug'              => 'tired-light-redshift-duality',
        'category'          => 'Redshift / Expansion',
        'observationScore'  => 84,
        'mainstreamScore'   => 89,
        'arcsecsScore'      => 62,
        'demoPriorityScore' => 98,
        'mainstreamCost'    => 'The expanding-universe interpretation must continue integrating CMB, BAO, supernovae, and structure formation consistently.',
        'arcsecsCost'       => 'Tired light must overcome its historic failures: image blur, time dilation, surface brightness, and energy accounting.',
        'killTest'          => 'If energy loss creates blur or dimming mismatches outside observational tolerance, the branch should fail loudly.',
    ),
    array(
        'name'              => 'Dark Matter Drive Implications',
        'slug'              => 'dark-matter-drive-implications',
        'category'          => 'Propulsion',
        'observationScore'  => 35,
        'mainstreamScore'   => 88,
        'arcsecsScore'      => 46,
        'demoPriorityScore' => 77,
        'mainstreamCost'    => 'Accepted physics does not provide an engineerable dark-matter fuel stream or demonstrated macroscopic EIT scoop.',
        'arcsecsCost'       => 'The drive concept must close drag, heat, shielding, intake, exhaust, and conservation ledgers before it is more than a story engine.',
        'killTest'          => 'If capture energy exceeds usable output or heat cannot be rejected, the simulator should mark the propulsion profile as non-viable.',
    ),
);


$simulation_run_profiles = array(
    array(
        'slug'       => 'hubble-tension',
        'name'       => 'Hubble Tension',
        'objective'  => 'Compare pure metric redshift against tired-light attenuation and variable light-speed pulse stretching while keeping brightness and time-dilation checks visible.',
        'controls'   => array( 'Metric redshift mode', 'Tired-light decay strength', 'Variable speed of light branch', 'Supernova pulse duration', 'Tolman-style brightness ledger' ),
        'pass'       => 'A useful branch reproduces redshift and pulse stretch without hiding brightness, blur, CMB, or energy-accounting failures.',
        'fail'       => 'Fail the branch if the model needs arbitrary dimming, creates image blur, breaks units, or cannot explain time dilation and surface brightness together.',
    ),
    array(
        'slug'       => 'jwst-mature-early-galaxies',
        'name'       => 'JWST Mature Early Galaxies',
        'objective'  => 'Test whether static-distance attenuation and deep-time interpretation reduce the need for impossibly fast early galaxy maturity.',
        'controls'   => array( 'Static-distance redshift mode', 'Optical attenuation curve', 'Mass-boom branch', 'Galaxy age interpretation', 'Chemical maturity note' ),
        'pass'       => 'A useful run keeps luminosity, angular size, age, and metallicity assumptions on screen so the interpretation can be challenged.',
        'fail'       => 'Fail the branch if the settings only relabel redshift without explaining why galaxies look bright, structured, and chemically mature.',
    ),
    array(
        'slug'       => 'sparc-galaxy-rotation-curves',
        'name'       => 'SPARC / Galaxy Rotation Curves',
        'objective'  => 'Compare baryonic acceleration, cold dark matter halo assumptions, and a speculative tired-light condensate density field.',
        'controls'   => array( 'Baryonic mass map', 'Condensate density field', 'Proca photon mass slider', 'Rotation curve overlay', 'Residual error meter' ),
        'pass'       => 'A useful run shows the observed curve, predicted curve, residuals, and where the condensate assumption adds or removes explanatory burden.',
        'fail'       => 'Fail the branch if the condensate can be tuned freely with no falsifiable density profile or conservation check.',
    ),
    array(
        'slug'       => 'el-gordo-cluster-collision',
        'name'       => 'El Gordo Cluster Collision',
        'objective'  => 'Stress-test cluster mass, merger velocity, morphology, and available formation time under standard and deep-time assumptions.',
        'controls'   => array( 'Cluster mass estimate', 'Collision velocity', 'Formation-time window', 'Merger-energy ledger', 'Morphology fit note' ),
        'pass'       => 'A useful run shows whether deep-time assumptions reduce tension without ignoring measured mass, redshift, or merger geometry.',
        'fail'       => 'Fail the branch if it explains the collision only by granting unlimited time while losing the observed morphology or energy budget.',
    ),
    array(
        'slug'       => 'lithium-7-problem',
        'name'       => 'Lithium-7 Problem',
        'objective'  => 'Track light-element abundance mismatch as an explicit chemistry ledger instead of using it as a vague rhetorical attack.',
        'controls'   => array( 'Predicted Lithium-7 abundance', 'Observed Spite Plateau value', 'Stellar depletion branch', 'Equilibrium chemistry branch', 'Uncertainty band' ),
        'pass'       => 'A useful run separates deuterium, helium, and lithium behavior so one mismatch does not get exaggerated into a total model collapse.',
        'fail'       => 'Fail the branch if it cannot preserve the successful light-element fits while addressing the lithium mismatch.',
    ),
    array(
        'slug'       => 'photon-mass-proca-electrodynamics',
        'name'       => 'Photon Mass / Proca Electrodynamics',
        'objective'  => 'Expose exactly what changes when photon mass is moved from zero to a tiny non-zero Proca-style simulation value.',
        'controls'   => array( 'Photon mass upper-bound slider', 'Group velocity dispersion', 'Longitudinal mode warning', 'Gauge-invariance guardrail', 'Energy-momentum ledger' ),
        'pass'       => 'A useful run makes dispersion, mass limits, and standard-physics guardrails impossible to miss.',
        'fail'       => 'Fail the branch if photon mass is used as a magic knob that breaks known electrodynamics without warning the user.',
    ),
    array(
        'slug'       => 'tired-light-redshift-duality',
        'name'       => 'Tired Light / Redshift Duality',
        'objective'  => 'Test whether energy-loss redshift can be made visible alongside the historic objections that tired-light models must survive.',
        'controls'   => array( 'Energy-loss coefficient', 'Distance path length', 'Frequency-dependent velocity', 'Image blur check', 'Surface brightness check' ),
        'pass'       => 'A useful run preserves the strongest mainstream objections as live failure checks, not footnotes.',
        'fail'       => 'Fail the branch if redshift can be matched only by sacrificing sharp images, observed brightness scaling, or supernova timing.',
    ),
    array(
        'slug'       => 'dark-matter-drive-implications',
        'name'       => 'Dark Matter Drive Implications',
        'objective'  => 'Translate the condensate idea into an engineering-style capture, drag, heat, shielding, and exhaust ledger.',
        'controls'   => array( 'Condensate intake density', 'EIT scoop field scale', 'Drag and heat load', 'HIBE shield recovery', 'Exhaust momentum balance' ),
        'pass'       => 'A useful run shows whether harvested substrate provides more usable thrust than it costs in capture, shielding, and heat rejection.',
        'fail'       => 'Fail the branch if the capture system is a net energy sink or if thermal load exceeds the shield and radiator model.',
    ),
);

$statuses = array(
    'all'                         => 'All Statuses',
    'Mainstream Active Debate'    => 'Mainstream Active Debate',
    'ArcSecs Simulation Target'   => 'ArcSecs Simulation Target',
    'Speculative Extension'       => 'Speculative Extension',
    'Needs More Data'             => 'Needs More Data',
);

$evidence_tiers = array(
    'all'                     => 'All Evidence Grades',
    'Established Observation' => 'Established Observation',
    'Active Interpretation'   => 'Active Interpretation',
    'Boundary Constraint'     => 'Boundary Constraint',
    'Speculative Extension'   => 'Speculative Extension',
);
?>
<article class="anomalies-page" data-anomalies-page>
    <div class="anomalies-reading-progress" data-anomalies-reading-progress aria-hidden="true"></div>

    <header class="anomalies-hero" id="top">
        <div class="wrap anomalies-hero__grid">
            <div class="anomalies-hero__copy">
                <div class="eyebrow">Test-driven cosmology</div>
                <h1>The ArcSecs Cosmic Anomalies Tracker</h1>
                <p class="anomalies-hero__subtitle">A test-driven map of the observations putting pressure on Lambda-CDM, spacetime expansion, dark matter, and massless electrodynamics.</p>
                <p>This is a tracker, not just an article. It organizes real astronomical pressure points and compares the mainstream Lambda-CDM interpretation, the observational problem, the speculative ArcSecs interpretation, and the simulation hook that should make the idea testable instead of rhetorical.</p>
                <p class="anomalies-disclaimer"><strong>Science framing:</strong> ArcSecs is an experimental and speculative physics framework. This tracker compares mainstream cosmological explanations with alternative ArcSecs interpretations for research, simulation, and critical-thinking purposes.</p>
                <div class="hero-actions anomalies-hero__actions">
                    <a class="arcsecs-button" href="#interactive-tracker">Explore the Tracker</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $hub_url ); ?>">Start Here</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $demo_url ); ?>">Run the Physics Engine Demo</a>
                    <a class="arcsecs-button ghost" href="<?php echo esc_url( $framework_url ); ?>">Read the ArcSecs Framework</a>
                </div>
            </div>
            <aside class="anomalies-hero__instrument" aria-label="Tracker summary instrument">
                <span class="anomalies-pulse" aria-hidden="true"></span>
                <div class="anomalies-ring anomalies-ring--one" aria-hidden="true"></div>
                <div class="anomalies-ring anomalies-ring--two" aria-hidden="true"></div>
                <dl>
                    <div><dt>Tracked anomalies</dt><dd><?php echo esc_html( (string) count( $anomalies ) ); ?></dd></div>
                    <div><dt>Run profiles</dt><dd><?php echo esc_html( (string) count( $simulation_run_profiles ) ); ?> guided recipes</dd></div>
                    <div><dt>Evidence grades</dt><dd><?php echo esc_html( (string) ( count( $evidence_tiers ) - 1 ) ); ?> claim lanes</dd></div>
                    <div><dt>Review mode</dt><dd>Observation-first toggle</dd></div>
                    <div><dt>Boundary</dt><dd>Bold hypotheses, explicit failure states</dd></div>
                </dl>
            </aside>
        </div>
        <div class="wrap">
            <figure class="anomalies-hero-banner">
                <?php arcsecs_render_theme_picture( 'assets/images/cosmic-anomalies-tracker-overview.png', 'Detailed ArcSecs Cosmic Anomalies Tracker overview graphic showing Hubble tension, tired light redshift, JWST high-redshift galaxies, the El Gordo cluster, Lithium-7 abundance stress, SPARC rotation curves, Proca massive-photon ideas, and speculative dark-matter-drive concepts.', array( 'width' => '1916', 'height' => '821', 'loading' => 'eager', 'fetchpriority' => 'high' ) ); ?>
                <figcaption>A visual overview of the page's main pressure points and speculative simulation branches.</figcaption>
            </figure>
        </div>
    </header>

    <nav class="anomalies-mini-nav" aria-label="Cosmic anomalies tracker sections">
        <div class="wrap anomalies-mini-nav__inner">
            <a href="#anomalies-reader-path">Start</a>
            <a href="#tracker-dashboard">Dashboard</a>
            <a href="#claim-hygiene">Claim hygiene</a>
            <a href="#observation-first-mode">Review mode</a>
            <a href="#interactive-tracker">Tracker</a>
            <a href="#pressure-ledger">Pressure ledger</a>
            <a href="#simulation-run-builder">Run builder</a>
            <a href="#why-tracker">Why track?</a>
            <a href="#hubble-article">Hubble tension</a>
            <a href="#jwst-article">JWST</a>
            <a href="#rotation-article">Rotation curves</a>
            <a href="#simulation-bridge">Simulation</a>
            <a href="#evidence-sources-anomalies">Sources</a>
            <a href="#references">References</a>
        </div>
    </nav>


    <section id="anomalies-reader-path" class="anomalies-section wrap anomalies-reader-path" aria-labelledby="anomalies-reader-path-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Reader path</div>
            <h2 id="anomalies-reader-path-title">Turn the anomaly list into a workflow.</h2>
            <p>The tracker is easier to use when visitors separate what was observed, how mainstream cosmology explains it, what ArcSecs is testing, and what would make a claim fail.</p>
        </div>
        <div class="anomalies-readability-grid" aria-label="Suggested reading path for the cosmic anomalies tracker">
            <article class="anomalies-readability-card">
                <span>01</span>
                <h3>Start with the observation</h3>
                <p>Read the empirical pressure point first: redshift, early galaxies, rotation curves, clusters, element abundance, or electrodynamic limits.</p>
                <a href="#tracker-dashboard">Open dashboard →</a>
            </article>
            <article class="anomalies-readability-card">
                <span>02</span>
                <h3>Check the mainstream lane</h3>
                <p>Use the mainstream explanation as the control case before giving any speculative branch credit.</p>
                <a href="#interactive-tracker">Filter the tracker →</a>
            </article>
            <article class="anomalies-readability-card">
                <span>03</span>
                <h3>Read the ArcSecs lane</h3>
                <p>Only then compare tired light, Proca photons, condensate dark matter, relational inertia, or propulsion implications.</p>
                <a href="#pressure-ledger">Open the pressure ledger →</a>
            </article>
            <article class="anomalies-readability-card">
                <span>04</span>
                <h3>End with a kill test</h3>
                <p>Every strong claim needs a failure condition. The run builder turns each anomaly into a test recipe.</p>
                <a href="#simulation-run-builder">Build a run card →</a>
            </article>
        </div>
        <div class="anomalies-deeper-links" aria-label="Anomaly tracker deep links">
            <a href="#claim-hygiene">Claim hygiene</a>
            <a href="#observation-first-mode">Observation-first mode</a>
            <a href="#hubble-article">Hubble tension</a>
            <a href="#rotation-article">Rotation curves</a>
            <a href="#simulation-bridge">Simulation bridge</a>
        </div>
    </section>

    <section id="tracker-dashboard" class="anomalies-section wrap" aria-labelledby="tracker-dashboard-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Quick summary</div>
            <h2 id="tracker-dashboard-title">Dashboard of pressure points.</h2>
            <p>Each card names the mainstream dependency, the ArcSecs lens, and the place where a simulation should make the claim visible enough to argue with.</p>
        </div>
        <div class="anomalies-dashboard-grid">
            <?php foreach ( $anomalies as $anomaly ) : ?>
                <a class="anomalies-dashboard-card" href="#<?php echo esc_attr( $anomaly['slug'] ); ?>">
                    <span class="anomalies-status anomalies-status--<?php echo esc_attr( sanitize_title( $anomaly['status'] ) ); ?>"><?php echo esc_html( $anomaly['shortStatus'] ); ?></span>
                    <h3><?php echo esc_html( $anomaly['name'] ); ?></h3>
                    <p><strong>Mainstream dependency:</strong> <?php echo esc_html( $anomaly['dependency'] ); ?></p>
                    <p data-anomalies-speculative-lane><strong>ArcSecs lens:</strong> <?php echo esc_html( $anomaly['lens'] ); ?></p>
                    <p><strong>Evidence grade:</strong> <?php echo esc_html( $anomaly['evidenceTier'] ); ?></p>
                    <span class="anomalies-card-link">Open section →</span>
                </a>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="claim-hygiene" class="anomalies-section wrap" aria-labelledby="claim-hygiene-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Claim hygiene layer</div>
            <h2 id="claim-hygiene-title">Separate the observation from the interpretation. <button type="button" class="anomalies-inline-copy" data-copy-link="#claim-hygiene">Copy section link</button></h2>
            <p>This page is stronger when it refuses to blur data, mainstream inference, ArcSecs hypothesis, and engineering speculation. The evidence-grade filter below keeps those lanes visible.</p>
        </div>
        <div class="anomalies-claim-ladder" aria-label="Cosmic anomaly evidence grading ladder">
            <article class="anomalies-claim-step">
                <span>01</span>
                <h3>Established Observation</h3>
                <p>Measurements or repeatable empirical patterns worth taking seriously even when interpretations differ.</p>
            </article>
            <article class="anomalies-claim-step">
                <span>02</span>
                <h3>Active Interpretation</h3>
                <p>Areas where the observation is real, but the model-level meaning is still being argued, calibrated, or refined.</p>
            </article>
            <article class="anomalies-claim-step">
                <span>03</span>
                <h3>Boundary Constraint</h3>
                <p>Guardrail physics, such as photon-mass limits, that should constrain the simulation before a scenario is treated as plausible.</p>
            </article>
            <article class="anomalies-claim-step">
                <span>04</span>
                <h3>Speculative Extension</h3>
                <p>ArcSecs-only branches that belong in the demo as explicit thought experiments with pass conditions and failure states.</p>
            </article>
        </div>
    </section>

    <section id="observation-first-mode" class="anomalies-section wrap" aria-labelledby="observation-first-mode-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Observation-first review mode</div>
            <h2 id="observation-first-mode-title">Read the sky first, then the theory. <button type="button" class="anomalies-inline-copy" data-copy-link="#observation-first-mode">Copy section link</button></h2>
            <p>The new review mode lets visitors dim ArcSecs-only interpretation lanes without deleting them. That makes the page useful for skeptics, supporters, and visitors who want to inspect the observation before reading the speculative branch.</p>
        </div>
        <div class="anomalies-review-grid" aria-label="Observation-first workflow">
            <article>
                <span>01</span>
                <h3>Observation</h3>
                <p>Start with what was measured: redshift disagreements, mature-looking distant galaxies, rotation curves, cluster masses, abundance mismatches, or electrodynamic bounds.</p>
            </article>
            <article>
                <span>02</span>
                <h3>Mainstream interpretation</h3>
                <p>Review the conventional Lambda-CDM or Standard Model explanation before deciding whether the observation is actually a pressure point.</p>
            </article>
            <article data-anomalies-speculative-lane>
                <span>03</span>
                <h3>ArcSecs branch</h3>
                <p>Then restore the speculative lane and inspect whether tired light, Proca photons, relational inertia, or condensate behavior gives a real testable contrast.</p>
            </article>
            <article>
                <span>04</span>
                <h3>Kill test</h3>
                <p>End with the failure condition. A claim that cannot name its own failure state is not ready for the demo.</p>
            </article>
        </div>
    </section>

    <section id="interactive-tracker" class="anomalies-section wrap" aria-labelledby="interactive-tracker-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Interactive tracker</div>
            <h2 id="interactive-tracker-title">Filter the anomaly map.</h2>
            <p>The controls are progressive enhancement. Without JavaScript, every tracker card remains readable and linkable.</p>
        </div>
        <form class="anomalies-filter-panel" data-anomalies-filter-form aria-label="Filter cosmic anomalies">
            <label>
                <span>Search</span>
                <input type="search" data-anomalies-search placeholder="Search Hubble, Proca, lithium, SPARC..." autocomplete="off">
            </label>
            <label>
                <span>Category</span>
                <select data-anomalies-category>
                    <?php foreach ( $categories as $category_value => $category_label ) : ?>
                        <option value="<?php echo esc_attr( $category_value ); ?>"><?php echo esc_html( $category_label ); ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>
                <span>Status</span>
                <select data-anomalies-status>
                    <?php foreach ( $statuses as $status_value => $status_label ) : ?>
                        <option value="<?php echo esc_attr( $status_value ); ?>"><?php echo esc_html( $status_label ); ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>
                <span>Evidence grade</span>
                <select data-anomalies-evidence>
                    <?php foreach ( $evidence_tiers as $tier_value => $tier_label ) : ?>
                        <option value="<?php echo esc_attr( $tier_value ); ?>"><?php echo esc_html( $tier_label ); ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <div class="anomalies-filter-mode">
                <span>Review mode</span>
                <button type="button" data-anomalies-observation-mode aria-pressed="false">Observation-first off</button>
                <small>Dims ArcSecs-only lanes while keeping them available.</small>
            </div>
            <div class="anomalies-filter-actions">
                <button type="button" data-anomalies-expand>Expand details</button>
                <button type="button" data-anomalies-collapse>Collapse details</button>
                <button type="button" data-anomalies-reset>Reset filters</button>
            </div>
            <p class="anomalies-result-count" data-anomalies-result-count aria-live="polite"><?php echo esc_html( count( $anomalies ) ); ?> anomalies visible.</p>
        </form>

        <div class="anomalies-tracker-grid" data-anomalies-card-grid>
            <?php foreach ( $anomalies as $anomaly ) : ?>
                <?php $keywords = strtolower( $anomaly['name'] . ' ' . $anomaly['observation'] . ' ' . $anomaly['mainstream'] . ' ' . $anomaly['arcsecs'] . ' ' . $anomaly['hook'] . ' ' . $anomaly['category'] . ' ' . $anomaly['status'] . ' ' . $anomaly['evidenceTier'] ); ?>
                <article id="<?php echo esc_attr( $anomaly['slug'] ); ?>" class="anomalies-tracker-card" data-anomalies-card data-category="<?php echo esc_attr( $anomaly['category'] ); ?>" data-status="<?php echo esc_attr( $anomaly['status'] ); ?>" data-evidence-tier="<?php echo esc_attr( $anomaly['evidenceTier'] ); ?>" data-keywords="<?php echo esc_attr( $keywords ); ?>">
                    <header class="anomalies-tracker-card__header">
                        <div>
                            <span class="anomalies-status anomalies-status--<?php echo esc_attr( sanitize_title( $anomaly['status'] ) ); ?>"><?php echo esc_html( $anomaly['status'] ); ?></span>
                            <span class="anomalies-evidence-label anomalies-evidence-label--<?php echo esc_attr( sanitize_title( $anomaly['evidenceTier'] ) ); ?>"><?php echo esc_html( $anomaly['evidenceTier'] ); ?></span>
                            <h3><?php echo esc_html( $anomaly['name'] ); ?></h3>
                        </div>
                        <button type="button" class="anomalies-copy-button" data-copy-link="#<?php echo esc_attr( $anomaly['slug'] ); ?>" aria-label="Copy link to <?php echo esc_attr( $anomaly['name'] ); ?>">Copy link</button>
                    </header>
                    <p class="anomalies-observation"><strong>Observation:</strong> <?php echo esc_html( $anomaly['observation'] ); ?></p>
                    <div class="anomalies-view-grid">
                        <section aria-label="Mainstream view">
                            <h4>Mainstream View</h4>
                            <p><?php echo esc_html( $anomaly['mainstream'] ); ?></p>
                        </section>
                        <section aria-label="Observational pressure point">
                            <h4>Pressure Point</h4>
                            <p><?php echo esc_html( $anomaly['pressure'] ); ?></p>
                        </section>
                        <section aria-label="ArcSecs speculative view" data-anomalies-speculative-lane>
                            <h4>ArcSecs View</h4>
                            <p><?php echo esc_html( $anomaly['arcsecs'] ); ?></p>
                        </section>
                    </div>
                    <details class="anomalies-detail">
                        <summary>Evidence / Interpretation / Simulation hook</summary>
                        <div class="anomalies-triad">
                            <p><strong>Evidence grade:</strong> <?php echo esc_html( $anomaly['evidenceTier'] ); ?></p>
                            <p><strong>Evidence status:</strong> <?php echo esc_html( $anomaly['evidence'] ); ?></p>
                            <p><strong>Simulation hook:</strong> <?php echo esc_html( $anomaly['hook'] ); ?></p>
                        </div>
                    </details>
                    <div class="anomalies-reference-links" aria-label="References for <?php echo esc_attr( $anomaly['name'] ); ?>">
                        <?php foreach ( $anomaly['references'] as $reference ) : ?>
                            <?php $is_external = strpos( $reference['url'], home_url() ) !== 0 && strpos( $reference['url'], 'https://arcsecs.com' ) !== 0 && strpos( $reference['url'], '/' ) !== 0; ?>
                            <a href="<?php echo esc_url( $reference['url'] ); ?>"<?php echo $is_external ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>><?php echo esc_html( $reference['label'] ); ?></a>
                        <?php endforeach; ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
        <p class="anomalies-empty-state" data-anomalies-empty hidden>No tracker cards match those filters.</p>
    </section>


    <section id="pressure-ledger" class="anomalies-section wrap" aria-labelledby="pressure-ledger-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Evidence discipline</div>
            <h2 id="pressure-ledger-title">Pressure ledger: what each anomaly costs. <button type="button" class="anomalies-inline-copy" data-copy-link="#pressure-ledger">Copy section link</button></h2>
            <p>This ledger is the anti-hype layer. Higher scores do not mean ArcSecs is proven; they show where the observation is mature, where mainstream explanations are carrying load, where ArcSecs has enough structure to simulate, and which items deserve demo priority.</p>
        </div>
        <div class="anomalies-ledger-grid">
            <?php foreach ( $pressure_ledgers as $ledger ) : ?>
                <article class="anomalies-ledger-card" aria-labelledby="ledger-<?php echo esc_attr( $ledger['slug'] ); ?>-title">
                    <header>
                        <span class="anomalies-ledger-category"><?php echo esc_html( $ledger['category'] ); ?></span>
                        <h3 id="ledger-<?php echo esc_attr( $ledger['slug'] ); ?>-title"><a href="#<?php echo esc_attr( $ledger['slug'] ); ?>"><?php echo esc_html( $ledger['name'] ); ?></a></h3>
                    </header>
                    <div class="anomalies-meter-list" aria-label="Scores for <?php echo esc_attr( $ledger['name'] ); ?>">
                        <div class="anomalies-meter"><span>Observation maturity</span><strong><?php echo esc_html( (string) $ledger['observationScore'] ); ?></strong><i style="--score: <?php echo esc_attr( (string) $ledger['observationScore'] ); ?>%;"></i></div>
                        <div class="anomalies-meter"><span>Mainstream fit pressure</span><strong><?php echo esc_html( (string) $ledger['mainstreamScore'] ); ?></strong><i style="--score: <?php echo esc_attr( (string) $ledger['mainstreamScore'] ); ?>%;"></i></div>
                        <div class="anomalies-meter"><span>ArcSecs simulation readiness</span><strong><?php echo esc_html( (string) $ledger['arcsecsScore'] ); ?></strong><i style="--score: <?php echo esc_attr( (string) $ledger['arcsecsScore'] ); ?>%;"></i></div>
                        <div class="anomalies-meter"><span>Demo priority</span><strong><?php echo esc_html( (string) $ledger['demoPriorityScore'] ); ?></strong><i style="--score: <?php echo esc_attr( (string) $ledger['demoPriorityScore'] ); ?>%;"></i></div>
                    </div>
                    <div class="anomalies-cost-grid">
                        <p><strong>Mainstream cost:</strong> <?php echo esc_html( $ledger['mainstreamCost'] ); ?></p>
                        <p><strong>ArcSecs cost:</strong> <?php echo esc_html( $ledger['arcsecsCost'] ); ?></p>
                        <p><strong>Failure condition:</strong> <?php echo esc_html( $ledger['killTest'] ); ?></p>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="simulation-run-builder" class="anomalies-section wrap anomalies-article-section" aria-labelledby="simulation-run-builder-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Guided experiment builder</div>
            <h2 id="simulation-run-builder-title">Build a simulation run card. <button type="button" class="anomalies-inline-copy" data-copy-link="#simulation-run-builder">Copy section link</button></h2>
            <p>Pick an anomaly and the page turns it into a compact demo recipe: objective, controls to touch, pass condition, and failure condition. This makes the tracker a launchpad for test-driven simulation instead of a static article.</p>
        </div>
        <div class="anomalies-run-builder" data-simulation-run-builder>
            <div class="anomalies-run-builder__controls">
                <label>
                    <span>Choose anomaly</span>
                    <select data-simulation-profile-select>
                        <?php foreach ( $simulation_run_profiles as $profile ) : ?>
                            <option value="<?php echo esc_attr( $profile['slug'] ); ?>"><?php echo esc_html( $profile['name'] ); ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>
                <button type="button" data-simulation-copy>Copy run plan</button>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( $demo_url ); ?>">Open demo</a>
            </div>
            <div class="anomalies-run-builder__output" data-simulation-profile-output aria-live="polite">
                <noscript>Selecting profiles requires JavaScript, but the tracker cards above include every simulation hook and failure condition.</noscript>
            </div>
            <script type="application/json" data-simulation-profiles><?php echo wp_json_encode( $simulation_run_profiles, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); ?></script>
        </div>
    </section>

    <section class="anomalies-section wrap anomalies-scan-brief" aria-label="Long-form reading guide">
        <div class="anomalies-scan-summary">
            <strong>Long-form guide:</strong> each section below should be read as observation → mainstream interpretation → ArcSecs simulation question → failure condition. The goal is not to win by tone; the goal is to make the test visible.
        </div>
    </section>

    <section id="why-tracker" class="anomalies-section wrap anomalies-article-section" aria-labelledby="why-tracker-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Long-form context</div>
            <h2 id="why-tracker-title">Why build a Cosmic Anomalies Tracker? <button type="button" class="anomalies-inline-copy" data-copy-link="#why-tracker">Copy section link</button></h2>
            <p>Because a model should be strongest where the observations are hardest.</p>
        </div>
        <div class="anomalies-article-grid">
            <article>
                <h3>The problem with treating models as untouchable</h3>
                <p>Lambda-CDM is the mainstream baseline because it explains a large amount of evidence with a compact framework. That deserves respect. But a baseline is not a shrine. When observations create tension, a healthy scientific culture should make those tensions visible, not bury them under jargon or team loyalty.</p>
                <p>ArcSecs uses a software-engineering metaphor: treat cosmology like a codebase. A theory has dependencies, assumptions, regression tests, edge cases, and failure modes. The point of the tracker is to keep those stress tests organized.</p>
            </article>
            <article>
                <h3>Evidence, interpretation, simulation</h3>
                <p>Every tracker item separates the observation from the interpretation. That matters because the same observation can be explained through different assumptions. The ArcSecs side is speculative, so the most honest way to present it is as a simulation target with explicit checks.</p>
                <p>A good alternative model should not merely sound clever. It should expose what it predicts, what it costs, and what would falsify or weaken it.</p>
            </article>
        </div>
    </section>

    <section id="hubble-article" class="anomalies-section wrap anomalies-article-section" aria-labelledby="hubble-article-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Redshift / expansion</div>
            <h2 id="hubble-article-title">Hubble tension: expansion rate or redshift interpretation problem? <button type="button" class="anomalies-inline-copy" data-copy-link="#hubble-article">Copy section link</button></h2>
        </div>
        <div class="anomalies-comparison-panel">
            <div><h3>Mainstream interpretation</h3><p>The mainstream view keeps metric expansion and asks whether the local distance ladder, early-universe inference, dark energy behavior, or high-redshift physics needs adjustment.</p></div>
            <div data-anomalies-speculative-lane><h3>ArcSecs speculative interpretation</h3><p>ArcSecs asks whether part of redshift could be cumulative photon-energy decay, dispersion, or variable light-speed behavior on a static relational stage. That is a demanding claim because it must also address supernova time dilation, brightness dimming, image sharpness, the CMB, and baryon acoustic features.</p></div>
        </div>
    </section>

    <section id="jwst-article" class="anomalies-section wrap anomalies-article-section" aria-labelledby="jwst-article-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Early universe</div>
            <h2 id="jwst-article-title">JWST and the problem of mature early galaxies. <button type="button" class="anomalies-inline-copy" data-copy-link="#jwst-article">Copy section link</button></h2>
            <p>JWST did not make Lambda-CDM vanish. It did make early structure formation more interesting, more constrained, and harder to oversimplify.</p>
        </div>
        <p class="anomalies-wide-copy">The mainstream answer is to improve the astrophysics: star formation may turn on earlier, galaxies may be brighter than expected, feedback may behave differently, and some candidates may shift after better spectroscopy. The ArcSecs answer is more radical: maybe high-redshift systems are not young in the way the expansion timeline says they are. The tracker keeps both ideas side by side and points to the simulation settings that would have to do the work.</p>
    </section>

    <section id="rotation-article" class="anomalies-section wrap anomalies-article-section" aria-labelledby="rotation-article-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Galaxy dynamics</div>
            <h2 id="rotation-article-title">Rotation curves, SPARC, and the dark matter question. <button type="button" class="anomalies-inline-copy" data-copy-link="#rotation-article">Copy section link</button></h2>
        </div>
        <div class="anomalies-article-grid anomalies-article-grid--three">
            <article><h3>Cold dark matter halos</h3><p>The mainstream solution gives galaxies invisible mass halos and uses baryonic feedback to explain detailed structure.</p></article>
            <article><h3>Modified gravity</h3><p>Alternatives such as MOND-style approaches focus on the tight empirical acceleration relation.</p></article>
            <article data-anomalies-speculative-lane><h3>ArcSecs condensate</h3><p>ArcSecs explores whether exhausted Proca photons could become an optically dark, gravitationally relevant condensate.</p></article>
        </div>
    </section>

    <section id="deep-time-article" class="anomalies-section wrap anomalies-article-section" aria-labelledby="deep-time-article-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Deep-time structure</div>
            <h2 id="deep-time-article-title">El Gordo and deep-time structure formation. <button type="button" class="anomalies-inline-copy" data-copy-link="#deep-time-article">Copy section link</button></h2>
        </div>
        <p class="anomalies-wide-copy">The El Gordo cluster is useful because it turns structure formation into a stress test: mass, merger velocity, redshift, and morphology have to be explained together. Mainstream cosmology can treat it as a rare event and refine simulations. ArcSecs uses it as a deep-time sandbox: what happens to cluster statistics if the universe is not forced through a short expansion-age bottleneck?</p>
    </section>

    <section id="lithium-article" class="anomalies-section wrap anomalies-article-section" aria-labelledby="lithium-article-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Element abundance</div>
            <h2 id="lithium-article-title">Lithium-7 and Big Bang nucleosynthesis stress. <button type="button" class="anomalies-inline-copy" data-copy-link="#lithium-article">Copy section link</button></h2>
        </div>
        <p class="anomalies-wide-copy">The Lithium-7 problem is not a theatrical knockout punch against the Big Bang. It is a stubborn mismatch inside an otherwise successful light-element framework. That makes it valuable: it is exactly the kind of anomaly a test-driven page should track with care, not exaggerate.</p>
    </section>

    <section id="proca-article" class="anomalies-section wrap anomalies-article-section" aria-labelledby="proca-article-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">Electrodynamics</div>
            <h2 id="proca-article-title">Proca electrodynamics and the massive photon hypothesis. <button type="button" class="anomalies-inline-copy" data-copy-link="#proca-article">Copy section link</button></h2>
        </div>
        <div class="anomalies-comparison-panel">
            <div><h3>Mainstream guardrail</h3><p>Photon rest mass is treated as zero in standard electromagnetic theory. Any non-zero value must fit inside extremely tight experimental upper bounds and avoid breaking successful physics.</p></div>
            <div data-anomalies-speculative-lane><h3>Simulation branch</h3><p>ArcSecs can still model a tiny Proca-style photon mass as a branch. The branch should show dispersion, energy accounting, longitudinal-mode implications, and warnings when assumptions exceed the guardrails.</p></div>
        </div>
    </section>

    <section id="simulation-bridge" class="anomalies-section wrap anomalies-article-section" aria-labelledby="simulation-bridge-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">From anomaly tracking to simulation</div>
            <h2 id="simulation-bridge-title">Why this matters for the ArcSecs Physics Engine. <button type="button" class="anomalies-inline-copy" data-copy-link="#simulation-bridge">Copy section link</button></h2>
            <p>The tracker should feed the demo. The demo should feed the tracker.</p>
        </div>
        <div class="anomalies-scan-summary anomalies-scan-summary--compact">
            <strong>Quick read:</strong> the strongest page-to-demo path is not more argument. It is a repeatable scenario with one changed variable, visible telemetry, and a named failure state.
        </div>
        <p class="anomalies-wide-copy">For timing and redshift branches, open the <a href="<?php echo esc_url( $multi_messenger_url ); ?>">Multi-Messenger Light Delay</a> page to inspect GW170817, GW150914, and GW190521 as gravitational-wave baseline / electromagnetic-lag stress tests. For the propulsion branch, open the <a href="<?php echo esc_url( $drive_url ); ?>">Dark Matter Drive Simulator</a> to inspect field capture, energy accounting, massive photon lensing, shielding, thermal limits, and replay controls without duplicating plugin code in the theme.</p>
        <div class="anomalies-simulation-grid">
            <article><span>01</span><h3>Assumption toggles</h3><p>Photon mass, tired-light decay, variable light-speed mode, condensate density, and dark matter halo assumptions should be switched on deliberately.</p></article>
            <article><span>02</span><h3>Conservation ledgers</h3><p>Energy, momentum, brightness, timing, heat, drag, and units need visible accounting.</p></article>
            <article><span>03</span><h3>Failure states</h3><p>When a model cannot match supernova stretch, Tolman dimming, CMB structure, or lensing, the UI should say so clearly.</p></article>
        </div>
        <div class="anomalies-demo-cta">
            <p><strong>Conclusion:</strong> test the model, do not worship the model. That rule applies to mainstream cosmology, alternative cosmology, and ArcSecs itself.</p>
            <a class="arcsecs-button" href="<?php echo esc_url( $demo_url ); ?>">Run the Physics Engine Demo</a>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( $framework_url ); ?>">Compare with the ArcSecs Framework</a>
        </div>
    </section>



    <?php arcsecs_render_evidence_sources_component( 'anomalies' ); ?>

    <section id="references" class="anomalies-section wrap" aria-labelledby="references-title">
        <div class="anomalies-section__heading">
            <div class="eyebrow">References</div>
            <h2 id="references-title">Source links and reading trail. <button type="button" class="anomalies-inline-copy" data-copy-link="#references">Copy section link</button></h2>
            <p>References include mainstream sources and speculative or alternative sources. External links open in a new tab.</p>
        </div>
        <ol class="anomalies-references-list">
            <li><a href="https://cerncourier.com/a/the-hubble-tension/" target="_blank" rel="noopener noreferrer">CERN Courier — The Hubble tension</a></li>
            <li><a href="https://arxiv.org/pdf/2601.00650" target="_blank" rel="noopener noreferrer">arXiv — Dissecting the Hubble tension</a></li>
            <li><a href="https://science.nasa.gov/blogs/webb/2024/05/30/nasas-james-webb-space-telescope-finds-most-distant-known-galaxy/" target="_blank" rel="noopener noreferrer">NASA Webb — most distant known galaxy</a></li>
            <li><a href="https://astroweb.case.edu/SPARC/" target="_blank" rel="noopener noreferrer">SPARC database</a></li>
            <li><a href="https://physicsworld.com/a/are-giant-galaxy-clusters-defying-standard-cosmology/" target="_blank" rel="noopener noreferrer">Physics World — giant galaxy clusters</a></li>
            <li><a href="https://tritonstation.com/2025/05/16/the-deuterium-lithium-tension-in-big-bang-nucleosynthesis/" target="_blank" rel="noopener noreferrer">Triton Station — Deuterium-Lithium tension</a></li>
            <li><a href="<?php echo esc_url( $tracker_url ); ?>#interactive-tracker">ArcSecs internal tracker anchors</a></li>
            <li><a href="<?php echo esc_url( $framework_url ); ?>">Standard Cosmology vs. ArcSecs framework comparison</a></li>
            <li><a href="<?php echo esc_url( $multi_messenger_url ); ?>">ArcSecs Multi-Messenger Light Delay timing page</a></li>
        </ol>
    </section>
</article>
