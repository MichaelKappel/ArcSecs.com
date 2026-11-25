(() => {
    "use strict";

    const initializeSourceBrowser = (browser) => {
        const sourcePanels = Array.from(browser.querySelectorAll("[data-typescript-source-panel]"));
        const filterInput = browser.querySelector("[data-typescript-source-filter]");
        const copyButton = browser.querySelector("[data-typescript-source-copy]");
        const statusElement = browser.querySelector("[data-typescript-source-status]");

        if (sourcePanels.length === 0) {
            return;
        }

        const updateStatus = () => {
            if (!(statusElement instanceof HTMLElement)) {
                return;
            }

            const openPanel = sourcePanels.find((panel) => panel instanceof HTMLDetailsElement && panel.open);
            const visibleCount = sourcePanels.filter((panel) => !panel.hidden).length;
            const totalCount = sourcePanels.length;
            const openName = openPanel instanceof HTMLElement ? openPanel.dataset.sourceName || "No file selected" : "No file selected";
            statusElement.textContent = `${openName} · ${visibleCount} of ${totalCount} files visible`;
        };

        const openPanel = (panelToOpen, pushHash) => {
            sourcePanels.forEach((panel) => {
                if (panel instanceof HTMLDetailsElement) {
                    panel.open = panel === panelToOpen;
                }
            });

            if (pushHash && panelToOpen instanceof HTMLElement) {
                const sourceName = panelToOpen.dataset.sourceName || "";
                const encodedName = encodeURIComponent(sourceName);
                if (encodedName.length > 0) {
                    history.replaceState(null, "", `#typescript-source-${encodedName}`);
                }
            }

            updateStatus();
        };

        sourcePanels.forEach((panel) => {
            const summary = panel.querySelector("summary");
            if (summary instanceof HTMLElement) {
                summary.addEventListener("click", () => {
                    window.setTimeout(() => {
                        if (panel instanceof HTMLDetailsElement && panel.open) {
                            openPanel(panel, true);
                        } else {
                            updateStatus();
                        }
                    }, 0);
                });
            }
        });

        if (filterInput instanceof HTMLInputElement) {
            filterInput.addEventListener("input", () => {
                const query = filterInput.value.trim().toLowerCase();
                let firstVisiblePanel = null;

                sourcePanels.forEach((panel) => {
                    const searchableText = panel instanceof HTMLElement ? (panel.dataset.sourceSearch || "").toLowerCase() : "";
                    const isVisible = query.length === 0 || searchableText.includes(query);
                    panel.hidden = !isVisible;

                    if (isVisible && firstVisiblePanel === null) {
                        firstVisiblePanel = panel;
                    }
                });

                const openVisiblePanel = sourcePanels.find((panel) => panel instanceof HTMLDetailsElement && panel.open && !panel.hidden);
                if (!openVisiblePanel && firstVisiblePanel instanceof HTMLDetailsElement) {
                    openPanel(firstVisiblePanel, false);
                }

                updateStatus();
            });
        }

        if (copyButton instanceof HTMLButtonElement) {
            copyButton.addEventListener("click", async () => {
                const openSource = sourcePanels.find((panel) => panel instanceof HTMLDetailsElement && panel.open && !panel.hidden);
                const codeElement = openSource instanceof HTMLElement ? openSource.querySelector("code") : null;

                if (!(codeElement instanceof HTMLElement)) {
                    copyButton.textContent = "No source selected";
                    window.setTimeout(() => {
                        copyButton.textContent = "Copy selected source";
                    }, 1800);
                    return;
                }

                try {
                    await navigator.clipboard.writeText(codeElement.textContent || "");
                    copyButton.textContent = "Copied source";
                } catch (error) {
                    copyButton.textContent = "Copy failed";
                }

                window.setTimeout(() => {
                    copyButton.textContent = "Copy selected source";
                }, 1800);
            });
        }

        const hash = decodeURIComponent(window.location.hash || "");
        if (hash.startsWith("#typescript-source-")) {
            const requestedName = hash.replace("#typescript-source-", "");
            const requestedPanel = sourcePanels.find((panel) => panel instanceof HTMLElement && panel.dataset.sourceName === requestedName);
            if (requestedPanel instanceof HTMLDetailsElement) {
                openPanel(requestedPanel, false);
                requestedPanel.scrollIntoView({ block: "start" });
            }
        } else {
            const initiallyOpenPanel = sourcePanels.find((panel) => panel instanceof HTMLDetailsElement && panel.open);
            if (initiallyOpenPanel instanceof HTMLDetailsElement) {
                openPanel(initiallyOpenPanel, false);
            } else if (sourcePanels[0] instanceof HTMLDetailsElement) {
                openPanel(sourcePanels[0], false);
            }
        }

        updateStatus();
    };

    document.addEventListener("DOMContentLoaded", () => {
        const browsers = Array.from(document.querySelectorAll("[data-typescript-source-browser]"));
        browsers.forEach((browser) => initializeSourceBrowser(browser));
    });
})();
