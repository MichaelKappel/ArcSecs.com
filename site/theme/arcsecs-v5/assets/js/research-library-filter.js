(() => {
  'use strict';
  const filter = document.querySelector('[data-library-filter]');
  if (!filter) return;
  const input = filter.querySelector('input');
  const count = filter.querySelector('[data-library-count]');
  const cards = Array.from(document.querySelectorAll('[data-library-report]'));
  const empty = document.querySelector('[data-library-empty]');
  const normalize = value => value.toLocaleLowerCase('en').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const haystacks = cards.map(card => normalize(card.dataset.librarySearch || ''));
  const apply = () => {
    const terms = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach((card, index) => { const match = terms.every(term => haystacks[index].includes(term)); card.hidden = !match; if (match) visible++; });
    count.textContent = `${visible} of ${cards.length} reports`; if (empty) empty.hidden = visible !== 0;
  };
  filter.hidden = false; input.addEventListener('input', apply); filter.querySelector('[data-library-clear]').addEventListener('click', () => { input.value = ''; apply(); input.focus(); }); apply();
})();
