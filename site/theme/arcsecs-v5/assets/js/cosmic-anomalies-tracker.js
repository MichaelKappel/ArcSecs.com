(function () {
  const page = document.querySelector('[data-anomalies-page]');
  if (!page) {
    return;
  }

  const cards = Array.from(page.querySelectorAll('[data-anomalies-card]'));
  const searchInput = page.querySelector('[data-anomalies-search]');
  const categorySelect = page.querySelector('[data-anomalies-category]');
  const statusSelect = page.querySelector('[data-anomalies-status]');
  const evidenceSelect = page.querySelector('[data-anomalies-evidence]');
  const observationModeButton = page.querySelector('[data-anomalies-observation-mode]');
  const resultCount = page.querySelector('[data-anomalies-result-count]');
  const emptyState = page.querySelector('[data-anomalies-empty]');
  const progress = page.querySelector('[data-anomalies-reading-progress]');
  const expandButton = page.querySelector('[data-anomalies-expand]');
  const collapseButton = page.querySelector('[data-anomalies-collapse]');
  const resetButton = page.querySelector('[data-anomalies-reset]');

  const normalize = (value) => String(value || '').trim().toLowerCase();

  const buildFilterUrl = () => {
    if (!window.history || !window.URLSearchParams) {
      return;
    }

    const parameters = new URLSearchParams(window.location.search);
    const searchValue = searchInput ? searchInput.value.trim() : '';
    const categoryValue = categorySelect ? categorySelect.value : 'all';
    const statusValue = statusSelect ? statusSelect.value : 'all';
    const evidenceValue = evidenceSelect ? evidenceSelect.value : 'all';
    const isObservationFirst = page.classList.contains('anomalies-observation-mode');

    if (searchValue.length > 0) {
      parameters.set('anomalySearch', searchValue);
    } else {
      parameters.delete('anomalySearch');
    }

    if (categoryValue !== 'all') {
      parameters.set('anomalyCategory', categoryValue);
    } else {
      parameters.delete('anomalyCategory');
    }

    if (statusValue !== 'all') {
      parameters.set('anomalyStatus', statusValue);
    } else {
      parameters.delete('anomalyStatus');
    }

    if (evidenceValue !== 'all') {
      parameters.set('anomalyEvidence', evidenceValue);
    } else {
      parameters.delete('anomalyEvidence');
    }

    if (isObservationFirst) {
      parameters.set('anomalyMode', 'observation');
    } else {
      parameters.delete('anomalyMode');
    }

    const queryString = parameters.toString();
    const nextUrl = window.location.pathname + (queryString ? '?' + queryString : '') + window.location.hash;
    window.history.replaceState({}, '', nextUrl);
  };

  const syncObservationModeButton = () => {
    if (!observationModeButton) {
      return;
    }

    const isObservationFirst = page.classList.contains('anomalies-observation-mode');
    observationModeButton.setAttribute('aria-pressed', isObservationFirst ? 'true' : 'false');
    observationModeButton.textContent = isObservationFirst ? 'Observation-first on' : 'Observation-first off';
  };

  const updateFilters = (shouldUpdateUrl) => {
    const searchValue = normalize(searchInput ? searchInput.value : '');
    const categoryValue = categorySelect ? categorySelect.value : 'all';
    const statusValue = statusSelect ? statusSelect.value : 'all';
    const evidenceValue = evidenceSelect ? evidenceSelect.value : 'all';
    let visibleCount = 0;

    cards.forEach((card) => {
      const keywords = normalize(card.getAttribute('data-keywords'));
      const category = card.getAttribute('data-category') || '';
      const status = card.getAttribute('data-status') || '';
      const evidenceTier = card.getAttribute('data-evidence-tier') || '';
      const matchesSearch = searchValue.length === 0 || keywords.includes(searchValue);
      const matchesCategory = categoryValue === 'all' || category === categoryValue;
      const matchesStatus = statusValue === 'all' || status === statusValue;
      const matchesEvidence = evidenceValue === 'all' || evidenceTier === evidenceValue;
      const isVisible = matchesSearch && matchesCategory && matchesStatus && matchesEvidence;

      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = visibleCount + (visibleCount === 1 ? ' anomaly visible.' : ' anomalies visible.');
    }
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
    if (shouldUpdateUrl) {
      buildFilterUrl();
    }
  };

  const hydrateFiltersFromUrl = () => {
    if (!window.URLSearchParams) {
      return;
    }

    const parameters = new URLSearchParams(window.location.search);
    const searchValue = parameters.get('anomalySearch');
    const categoryValue = parameters.get('anomalyCategory');
    const statusValue = parameters.get('anomalyStatus');
    const evidenceValue = parameters.get('anomalyEvidence');
    const modeValue = parameters.get('anomalyMode');

    if (modeValue === 'observation') {
      page.classList.add('anomalies-observation-mode');
    }
    syncObservationModeButton();

    if (searchInput && searchValue !== null) {
      searchInput.value = searchValue;
    }
    if (categorySelect && categoryValue !== null && Array.from(categorySelect.options).some((option) => option.value === categoryValue)) {
      categorySelect.value = categoryValue;
    }
    if (statusSelect && statusValue !== null && Array.from(statusSelect.options).some((option) => option.value === statusValue)) {
      statusSelect.value = statusValue;
    }
    if (evidenceSelect && evidenceValue !== null && Array.from(evidenceSelect.options).some((option) => option.value === evidenceValue)) {
      evidenceSelect.value = evidenceValue;
    }
  };

  [searchInput, categorySelect, statusSelect, evidenceSelect].forEach((control) => {
    if (control) {
      control.addEventListener('input', () => updateFilters(true));
      control.addEventListener('change', () => updateFilters(true));
    }
  });

  if (observationModeButton) {
    observationModeButton.addEventListener('click', () => {
      page.classList.toggle('anomalies-observation-mode');
      syncObservationModeButton();
      buildFilterUrl();
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      if (categorySelect) {
        categorySelect.value = 'all';
      }
      if (statusSelect) {
        statusSelect.value = 'all';
      }
      if (evidenceSelect) {
        evidenceSelect.value = 'all';
      }
      page.classList.remove('anomalies-observation-mode');
      syncObservationModeButton();
      updateFilters(true);
      if (searchInput) {
        searchInput.focus({ preventScroll: true });
      }
    });
  }

  if (expandButton) {
    expandButton.addEventListener('click', () => {
      page.querySelectorAll('.anomalies-detail').forEach((detail) => {
        detail.open = true;
      });
    });
  }

  if (collapseButton) {
    collapseButton.addEventListener('click', () => {
      page.querySelectorAll('.anomalies-detail').forEach((detail) => {
        detail.open = false;
      });
    });
  }


  const runBuilder = page.querySelector('[data-simulation-run-builder]');
  const profileSelect = runBuilder ? runBuilder.querySelector('[data-simulation-profile-select]') : null;
  const profileOutput = runBuilder ? runBuilder.querySelector('[data-simulation-profile-output]') : null;
  const profilesScript = runBuilder ? runBuilder.querySelector('[data-simulation-profiles]') : null;
  const copySimulationButton = runBuilder ? runBuilder.querySelector('[data-simulation-copy]') : null;
  let simulationProfiles = [];

  const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  if (profilesScript && profilesScript.textContent) {
    try {
      const parsedProfiles = JSON.parse(profilesScript.textContent);
      if (Array.isArray(parsedProfiles)) {
        simulationProfiles = parsedProfiles;
      }
    } catch (error) {
      simulationProfiles = [];
    }
  }

  const findSimulationProfile = () => {
    if (!profileSelect || simulationProfiles.length === 0) {
      return null;
    }

    const selectedSlug = profileSelect.value;
    return simulationProfiles.find((profile) => profile && profile.slug === selectedSlug) || simulationProfiles[0];
  };

  const formatSimulationPlanText = (profile) => {
    if (!profile) {
      return '';
    }

    const controls = Array.isArray(profile.controls) ? profile.controls.map((control) => '- ' + control).join('\n') : '';
    return [
      'ArcSecs simulation run card: ' + profile.name,
      '',
      'Objective: ' + profile.objective,
      '',
      'Controls to inspect:',
      controls,
      '',
      'Pass condition: ' + profile.pass,
      '',
      'Failure condition: ' + profile.fail,
    ].join('\n');
  };

  const renderSimulationProfile = () => {
    const profile = findSimulationProfile();
    if (!profileOutput || !profile) {
      return;
    }

    const controls = Array.isArray(profile.controls) ? profile.controls : [];
    profileOutput.innerHTML = [
      '<article class="anomalies-run-card">',
      '<span class="anomalies-ledger-category">Simulation run card</span>',
      '<h3>' + escapeHtml(profile.name) + '</h3>',
      '<p><strong>Objective:</strong> ' + escapeHtml(profile.objective) + '</p>',
      '<h4>Controls to inspect</h4>',
      '<ul>' + controls.map((control) => '<li>' + escapeHtml(control) + '</li>').join('') + '</ul>',
      '<div class="anomalies-run-card__checks">',
      '<p><strong>Pass condition:</strong> ' + escapeHtml(profile.pass) + '</p>',
      '<p><strong>Failure condition:</strong> ' + escapeHtml(profile.fail) + '</p>',
      '</div>',
      '</article>',
    ].join('');
  };

  if (profileSelect) {
    profileSelect.addEventListener('change', renderSimulationProfile);
  }

  if (copySimulationButton) {
    copySimulationButton.addEventListener('click', () => {
      const profile = findSimulationProfile();
      const text = formatSimulationPlanText(profile);
      const originalText = copySimulationButton.textContent;
      const markCopied = () => {
        copySimulationButton.textContent = 'Run plan copied';
        copySimulationButton.setAttribute('aria-live', 'polite');
        window.setTimeout(() => {
          copySimulationButton.textContent = originalText;
        }, 1600);
      };

      if (!text) {
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(markCopied).catch(() => {
          window.prompt('Copy simulation run plan', text);
        });
      } else {
        window.prompt('Copy simulation run plan', text);
      }
    });
  }

  page.querySelectorAll('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', () => {
      const hash = button.getAttribute('data-copy-link') || '#top';
      const url = window.location.origin + window.location.pathname + window.location.search + hash;
      const originalText = button.textContent;
      const markCopied = () => {
        button.textContent = 'Copied';
        button.setAttribute('aria-live', 'polite');
        window.setTimeout(() => {
          button.textContent = originalText;
        }, 1400);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(markCopied).catch(() => {
          window.prompt('Copy section link', url);
        });
      } else {
        window.prompt('Copy section link', url);
      }
    });
  });

  page.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      if (!window.history || !anchor.hash) {
        return;
      }
      window.setTimeout(() => {
        window.history.replaceState({}, '', window.location.pathname + window.location.search + anchor.hash);
      }, 0);
    });
  });

  const updateProgress = () => {
    if (!progress) {
      return;
    }
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = documentHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100)) : 0;
    progress.style.transform = 'scaleX(' + percent / 100 + ')';
  };

  syncObservationModeButton();
  hydrateFiltersFromUrl();
  updateFilters(false);
  renderSimulationProfile();
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
})();
