(() => {
  const sourceSections = document.querySelectorAll('[data-evidence-sources]');

  const normalize = (value) => (value || '').toString().trim().toLowerCase();

  sourceSections.forEach((section) => {
    const searchInput = section.querySelector('[data-evidence-search]');
    const typeSelect = section.querySelector('[data-evidence-type]');
    const resetButton = section.querySelector('[data-evidence-reset]');
    const countElement = section.querySelector('[data-evidence-count]');
    const emptyElement = section.querySelector('[data-evidence-empty]');
    const topicCards = Array.from(section.querySelectorAll('[data-evidence-topic-card]'));
    const sourceCards = Array.from(section.querySelectorAll('[data-evidence-source-card]'));

    if (!searchInput || !typeSelect || !countElement || topicCards.length === 0 || sourceCards.length === 0) {
      return;
    }

    const updateEvidenceFilters = () => {
      const searchText = normalize(searchInput.value);
      const selectedType = typeSelect.value || 'all';
      let visibleSourceCount = 0;
      let visibleTopicCount = 0;

      topicCards.forEach((topicCard) => {
        const childSourceCards = Array.from(topicCard.querySelectorAll('[data-evidence-source-card]'));
        let hasVisibleSource = false;

        childSourceCards.forEach((sourceCard) => {
          const keywords = normalize(sourceCard.getAttribute('data-source-keywords'));
          const sourceType = sourceCard.getAttribute('data-source-type') || '';
          const matchesSearch = searchText.length === 0 || keywords.includes(searchText);
          const matchesType = selectedType === 'all' || sourceType === selectedType;
          const isVisible = matchesSearch && matchesType;

          sourceCard.hidden = !isVisible;

          if (isVisible) {
            hasVisibleSource = true;
            visibleSourceCount += 1;
          }
        });

        topicCard.hidden = !hasVisibleSource;
        if (hasVisibleSource) {
          visibleTopicCount += 1;
        }
      });

      countElement.textContent = `${visibleSourceCount} source${visibleSourceCount === 1 ? '' : 's'} visible across ${visibleTopicCount} topic${visibleTopicCount === 1 ? '' : 's'}.`;

      if (emptyElement) {
        emptyElement.hidden = visibleSourceCount > 0;
      }
    };

    searchInput.addEventListener('input', updateEvidenceFilters);
    typeSelect.addEventListener('change', updateEvidenceFilters);

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        searchInput.value = '';
        typeSelect.value = 'all';
        updateEvidenceFilters();
        searchInput.focus();
      });
    }

    updateEvidenceFilters();
  });
})();
