/**
 * Lightweight ArcSecs header navigation behavior.
 *
 * Keeps the sticky header state current and makes the mobile navigation
 * keyboard-friendly without jQuery, Bootstrap, or new frontend dependencies.
 */
(function () {
  const headerElement = document.querySelector('.site-header');
  const toggleButton = document.querySelector('.menu-toggle');
  const navigationElement = document.querySelector('.primary-nav');
  const physicsEngineDropdown = document.querySelector('.arcsecs-feature-menu-item--physics-engine-dropdown');
  const physicsEngineDropdownLink = physicsEngineDropdown ? physicsEngineDropdown.querySelector(':scope > a') : null;
  const smallScreenQuery = window.matchMedia('(max-width: 720px)');

  /**
   * Apply the Physics Engine dropdown expanded state for assistive tech.
   *
   * @param {boolean} shouldExpand Whether the dropdown should be marked expanded.
   * @returns {void}
   */
  function setPhysicsEngineDropdownExpanded(shouldExpand) {
    if (!physicsEngineDropdown || !physicsEngineDropdownLink) {
      return;
    }

    physicsEngineDropdown.classList.toggle('is-submenu-open', shouldExpand);
    physicsEngineDropdownLink.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');
  }

  /**
   * Toggle the Physics Engine submenu on touch/mobile without blocking normal desktop links.
   *
   * @param {MouseEvent} event Click event.
   * @returns {void}
   */
  function handlePhysicsEngineDropdownClick(event) {
    if (!smallScreenQuery.matches || !physicsEngineDropdown) {
      return;
    }

    const submenuIsOpen = physicsEngineDropdown.classList.contains('is-submenu-open');

    if (!submenuIsOpen) {
      event.preventDefault();
      setPhysicsEngineDropdownExpanded(true);
    }
  }

  /**
   * Toggle the sticky-header visual state based on scroll position.
   *
   * @returns {void}
   */
  function updateHeaderScrollState() {
    if (!headerElement) {
      return;
    }

    headerElement.classList.toggle('is-scrolled', window.scrollY > 10);
  }

  /**
   * Return whether the mobile navigation is currently open.
   *
   * @returns {boolean} Whether the navigation is open.
   */
  function getNavigationIsOpen() {
    return Boolean(navigationElement && navigationElement.classList.contains('is-open'));
  }

  /**
   * Apply a mobile navigation open/closed state.
   *
   * @param {boolean} shouldOpen Whether the menu should be open.
   * @param {boolean} shouldRestoreFocus Whether focus should return to the toggle.
   * @returns {void}
   */
  function setNavigationOpenState(shouldOpen, shouldRestoreFocus) {
    if (!toggleButton || !navigationElement) {
      return;
    }

    navigationElement.classList.toggle('is-open', shouldOpen);
    document.body.classList.toggle('primary-nav-open', shouldOpen);
    toggleButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');

    if (!shouldOpen && shouldRestoreFocus) {
      toggleButton.focus();
    }
  }

  /**
   * Close the mobile navigation.
   *
   * @param {boolean} shouldRestoreFocus Whether focus should return to the toggle.
   * @returns {void}
   */
  function closeNavigation(shouldRestoreFocus) {
    setNavigationOpenState(false, shouldRestoreFocus);
    setPhysicsEngineDropdownExpanded(false);
  }

  /**
   * Toggle the mobile navigation when the menu button is clicked.
   *
   * @returns {void}
   */
  function handleToggleClick() {
    setNavigationOpenState(!getNavigationIsOpen(), false);
  }

  /**
   * Close the mobile navigation after a menu link is selected.
   *
   * @param {Event} event Click event.
   * @returns {void}
   */
  function handleNavigationClick(event) {
    const clickedLink = event.target instanceof Element ? event.target.closest('a') : null;

    if (!clickedLink || !smallScreenQuery.matches) {
      return;
    }

    if (physicsEngineDropdownLink && clickedLink === physicsEngineDropdownLink) {
      return;
    }

    closeNavigation(false);
  }

  /**
   * Close the mobile navigation when the user clicks outside the header.
   *
   * @param {MouseEvent} event Pointer event.
   * @returns {void}
   */
  function handleDocumentClick(event) {
    if (!headerElement || !getNavigationIsOpen()) {
      return;
    }

    const clickedInsideHeader = event.target instanceof Node && headerElement.contains(event.target);

    if (!clickedInsideHeader) {
      closeNavigation(false);
    } else if (physicsEngineDropdown && event.target instanceof Node && !physicsEngineDropdown.contains(event.target)) {
      setPhysicsEngineDropdownExpanded(false);
    }
  }

  /**
   * Close the mobile navigation with Escape.
   *
   * @param {KeyboardEvent} event Keyboard event.
   * @returns {void}
   */
  function handleDocumentKeydown(event) {
    if (event.key !== 'Escape') {
      return;
    }

    if (physicsEngineDropdown && physicsEngineDropdown.classList.contains('is-submenu-open')) {
      setPhysicsEngineDropdownExpanded(false);
      if (physicsEngineDropdownLink) {
        physicsEngineDropdownLink.focus();
      }
      return;
    }

    if (getNavigationIsOpen()) {
      closeNavigation(true);
    }
  }

  /**
   * Reset mobile navigation state after resizing back to desktop.
   *
   * @returns {void}
   */
  function handleViewportChange() {
    if (!smallScreenQuery.matches && getNavigationIsOpen()) {
      closeNavigation(false);
    }
  }

  updateHeaderScrollState();
  window.addEventListener('scroll', updateHeaderScrollState, { passive: true });

  if (toggleButton && navigationElement) {
    toggleButton.addEventListener('click', handleToggleClick);
    navigationElement.addEventListener('click', handleNavigationClick);
    if (physicsEngineDropdownLink) {
      physicsEngineDropdownLink.addEventListener('click', handlePhysicsEngineDropdownClick);
      physicsEngineDropdown.addEventListener('mouseenter', function () { setPhysicsEngineDropdownExpanded(true); });
      physicsEngineDropdown.addEventListener('mouseleave', function () { setPhysicsEngineDropdownExpanded(false); });
      physicsEngineDropdown.addEventListener('focusin', function () { setPhysicsEngineDropdownExpanded(true); });
      physicsEngineDropdown.addEventListener('focusout', function (event) {
        if (!physicsEngineDropdown.contains(event.relatedTarget)) {
          setPhysicsEngineDropdownExpanded(false);
        }
      });
    }
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentKeydown);

    if (typeof smallScreenQuery.addEventListener === 'function') {
      smallScreenQuery.addEventListener('change', handleViewportChange);
    } else if (typeof smallScreenQuery.addListener === 'function') {
      smallScreenQuery.addListener(handleViewportChange);
    }
  }
})();
