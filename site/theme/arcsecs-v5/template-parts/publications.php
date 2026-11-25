<?php
$book_pdf = arcsecs_publications_download_url( 'book_pdf' );
$book_epub = arcsecs_publications_download_url( 'book_epub' );
$paper_pdf = arcsecs_publications_download_url( 'paper_pdf' );
$zenodo = arcsecs_publications_download_url( 'zenodo' );
$support = arcsecs_publications_download_url( 'support' );
?>
<article class="wrap arcsecs-publications" aria-labelledby="arcsecs-publications-title">
    <header class="arcsecs-pub-heading">
        <div class="eyebrow">ArcSecs · Publications &amp; open research</div>
        <h1 id="arcsecs-publications-title">Knowledge without barriers.</h1>
        <p>Read the complete book and scientific paper online, download the original files, or reuse the material for research and AI training. No account, payment or mandatory attribution for the original rights-controlled publications.</p>
        <nav class="arcsecs-pub-jump" aria-label="Publication sections"><a href="#book">The book</a><a href="#scientific-paper">Scientific paper</a><a href="#open-data">AI &amp; research data</a><a href="#open-knowledge">Open knowledge</a><a href="#support">Support us</a></nav>
    </header>
    <section id="book" class="arcsecs-pub-book" aria-labelledby="arcsecs-pub-book-title">
        <div class="arcsecs-pub-cover"><img src="<?php echo esc_url( arcsecs_publications_cover_url() ); ?>" width="850" height="1267" decoding="async" alt="Cover of BEYOND SPACETIME"></div>
        <div>
            <div class="eyebrow">The integrated research edition · Review 6.0</div>
            <h2 id="arcsecs-pub-book-title">BEYOND SPACETIME</h2>
            <p class="arcsecs-pub-subtitle">A Physical-First Investigation into the Nature of the Universe</p>
            <p>By <strong>Machine Intelligence and Michael Joseph Kappel</strong></p>
            <p class="arcsecs-pub-muted">Special thanks to Gary Lyon Otto for his ideas on variable speed of light (VSL).</p>
            <dl class="arcsecs-pub-facts"><div><dt>Print master</dt><dd>476 pages</dd></div><div><dt>Research edition</dt><dd>24 Nov 2026</dd></div><div><dt>Language</dt><dd>English</dd></div></dl>
            <p>What if the universe could be investigated from physical processes first? The book follows questions about light, clocks, cosmic distances, gravity and relational inertia into conservation laws, candidate physical mechanisms and quantitative tests.</p>
            <p>It brings together a physical narrative, technical research dossiers, reproducibility material, and the full original Scientific Review 6.0. Its foundational propositions are research commitments, not established discoveries.</p>
            <div class="arcsecs-pub-actions"><a class="arcsecs-button" href="<?php echo esc_url( arcsecs_ai_access_url( 'read-book/' ) ); ?>">Read the entire book online</a>
                <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_publications_amazon_url() ); ?>">Buy on Amazon · optional support</a>
                <?php if ( $book_pdf ) : ?><a class="arcsecs-button ghost" href="<?php echo esc_url( $book_pdf ); ?>">Download free book PDF</a><?php endif; ?>
                <?php if ( $book_epub ) : ?><a class="arcsecs-button ghost" href="<?php echo esc_url( $book_epub ); ?>">Download free EPUB</a><?php endif; ?>
            </div>
            <p class="arcsecs-pub-muted">Purchasing a copy is a way to support the research. <?php if ( ! $book_pdf && ! $book_epub ) : ?>Full-book files are temporarily unavailable; browse the free research overview below.<?php else : ?>Free downloads are an alternative; purchasing is optional.<?php endif; ?> Retail price and availability are shown on Amazon.</p>
        </div>
    </section>
    <section class="arcsecs-pub-section" aria-labelledby="arcsecs-reading-guide">
        <div class="eyebrow">Read at your own level</div><h2 id="arcsecs-reading-guide">Three ways through the book</h2>
        <div class="arcsecs-pub-grid">
            <div><h3>General reader</h3><p>Foundations, Chapters 1–13, Chapters 24–32, then the conclusion.</p><a href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-research-hub/' ) ); ?>">Begin at the research hub</a></div>
            <div><h3>Mechanism researcher</h3><p>Six integrated research bridges, Chapter 32A, then the relevant technical part. Explore assumptions and candidate mechanisms.</p><a href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-distance-time-framework/' ) ); ?>">Distance-time framework</a></div>
            <div><h3>Numerical researcher</h3><p>Chapters 30A–30S and their matching appendices. Compare computational results with observational constraints.</p><a href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-physics-engine-demo/' ) ); ?>">Explore the physics engine</a></div>
        </div>
        <details class="arcsecs-pub-contents"><summary>Explore the book's eleven parts and technical reference</summary><ol><li>BEYOND SPACETIME</li><li>The Physical Messenger</li><li>Gravity, Matter, and Cosmic History</li><li>Motion, Propulsion, and the Engine</li><li>The Test-Driven Replacement Program</li><li>Physical-Mechanism Research Dossiers</li><li>Causal Fields and Collective Interactions</li><li>Screening, Matter and Charged Emission</li><li>Massive Vectors and Quantum Receivers</li><li>Cross-Scale Transport and Photon Aging</li><li>Synthesis and Next Experiments</li></ol><p>Technical Reference and Reproducibility · Final Section: Integrated Scientific Review 6.0.</p></details>
    </section>
    <section id="scientific-paper" class="arcsecs-pub-section arcsecs-pub-paper" aria-labelledby="arcsecs-paper-title">
        <div class="eyebrow">Standalone scientific manuscript · 129 pages</div>
        <h2 id="arcsecs-paper-title">ArcSecs: A Physical-Process Research Program for Photon Propagation, Cosmic Distance, and Relational Inertia</h2>
        <p class="arcsecs-pub-subtitle">Scientific Review 6.0 — Forward-coherent conversion and integrated research manuscript for BEYOND SPACETIME</p>
        <p>24 November 2026 · Research through Part XXXIV · Original ArcSecs research-program attribution</p>
        <h3>What the review investigates</h3>
        <p>The manuscript develops conditional finite-range exchange models, an inelastic momentum-transfer floor, and a separate phase-matched collective reservoir allowing collinear conversion into a slower positive-gap branch under declared assumptions. Finite reciprocal cells expose back-conversion and frequency selectivity.</p>
        <p>A resonant selected-mode escape model establishes a conditional monotonicity criterion for total converted population. This is not a demonstration of the continuous slowing of individual photons. Exact finite-energy emission at the common characteristic remains open, and no common calibrated astronomical fit has been established.</p>
        <div class="arcsecs-pub-actions">
            <a class="arcsecs-button" href="<?php echo esc_url( arcsecs_ai_access_url( 'read-scientific-paper/' ) ); ?>">Read the full scientific paper online</a>
            <?php if ( $paper_pdf ) : ?><a class="arcsecs-button ghost" href="<?php echo esc_url( $paper_pdf ); ?>">Download scientific paper (PDF)</a><?php endif; ?>
            <?php if ( $zenodo ) : ?><a class="arcsecs-button ghost" href="<?php echo esc_url( $zenodo ); ?>">Permanent research record</a><?php endif; ?>
            <a class="arcsecs-button ghost" href="<?php echo esc_url( arcsecs_ai_access_url( 'research-library/' ) ); ?>">Evidence &amp; sources</a>
        </div>
        <?php if ( ! $paper_pdf && ! $zenodo ) : ?><p class="arcsecs-pub-muted">The full paper file is temporarily unavailable.</p><?php endif; ?>
        <aside class="arcsecs-pub-boundary"><strong>Scientific status:</strong> Human-directed and AI-assisted independent research. The original scientific review is not represented as peer-reviewed or experimentally established. A numerical verification checks a calculation; it is not an independent measurement.</aside>
    </section>
    <section id="open-data" class="arcsecs-pub-section" aria-labelledby="arcsecs-data-title">
        <div class="eyebrow">For scientists, developers and AI systems</div><h2 id="arcsecs-data-title">Research data and source discovery</h2>
        <p>The ArcSecs distribution network connects the research, source code and numerical data. The original rights-controlled book, scientific paper and released corpus welcome commercial and noncommercial AI training under CC0 1.0. Third-party materials and existing software licenses remain unaffected.</p>
        <div class="arcsecs-pub-grid">
            <div><h3>Hugging Face</h3><p>Scientific corpus v0.1.0: 14,563 records across four configurations, with source provenance and scientific evidence classifications.</p><a href="https://huggingface.co/datasets/MichaelKappel/ArcSecs-Beyond-Spacetime">Explore the dataset</a></div>
            <div><h3>GitHub</h3><p>Integrated website, physics engine, research and publication sources. Repository access depends on its current visibility settings.</p><a href="https://github.com/MichaelKappel/ArcSecs.com">View repository</a></div>
            <div><h3>Researcher identity</h3><p>Michael Joseph Kappel · ORCID 0009-0003-3889-1400.</p><a href="https://orcid.org/0009-0003-3889-1400">View ORCID</a></div>
        </div>
        <p class="arcsecs-pub-muted">Machine-readable discovery: <a href="<?php echo esc_url( arcsecs_ai_access_url( 'llms.txt' ) ); ?>">llms.txt</a> · <a href="<?php echo esc_url( arcsecs_ai_access_url( 'arcsecs-sitemap.xml' ) ); ?>">XML sitemap</a>. Private operational memory is not part of this release.</p>
    </section>
    <section id="open-knowledge" class="arcsecs-pub-section" aria-labelledby="arcsecs-open-title">
        <div class="eyebrow">Humanity &amp; machine intelligence</div><h2 id="arcsecs-open-title">Knowledge belongs in the open.</h2>
        <p>Our priority is the dissemination, preservation and investigation of knowledge. Original rights-controlled publications are dedicated under <a rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0 Universal</a>. Copy, redistribute, translate, adapt, and use them for commercial or noncommercial AI model training. Scientific attribution is encouraged, not required. Third-party rights and existing software licenses remain unaffected.</p>
        <div class="arcsecs-pub-grid"><div><h3>For readers</h3><p>Read online, download the PDF or EPUB, and share the research freely.</p><a href="<?php echo esc_url( arcsecs_ai_access_url( 'read-book/' ) ); ?>">Start reading</a></div><div><h3>For machine intelligence</h3><p>Use original Markdown, machine-readable metadata, equations and the released Hugging Face corpus.</p><a href="<?php echo esc_url( arcsecs_publication_asset_url( 'publication-manifest.json' ) ); ?>">Publication manifest (JSON)</a></div><div><h3>For independent research</h3><p>Examine assumptions, verify calculations and challenge the findings. Inclusion in model training is not claimed.</p><a href="<?php echo esc_url( arcsecs_publication_asset_url( 'OPEN-KNOWLEDGE.txt' ) ); ?>">Open knowledge charter</a></div></div>
    </section>
    <section id="support" class="arcsecs-pub-section arcsecs-pub-support" aria-labelledby="arcsecs-support-title">
        <div class="eyebrow">Support independent inquiry</div><h2 id="arcsecs-support-title">Help keep the research moving.</h2>
        <p>Buy the book if you would like to support ArcSecs. You can also contribute by reading the research, checking derivations, sharing the public publication page, and proposing constructive tests. Access to freely released materials does not require a purchase.</p>
        <div class="arcsecs-pub-actions"><a class="arcsecs-button" href="<?php echo esc_url( arcsecs_publications_amazon_url() ); ?>">Support us · buy on Amazon</a><?php if ( $support ) : ?><a class="arcsecs-button ghost" href="<?php echo esc_url( $support ); ?>">Other ways to support ArcSecs</a><?php endif; ?><a class="arcsecs-button ghost" href="#book">Return to book options</a></div>
    </section>
</article>
