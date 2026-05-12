/* =========================================
   BUILDFRAME UNIVERSAL SEARCH ENGINE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeUniversalSearch_();

});

/* =========================================
   INITIALIZE
========================================= */

function initializeUniversalSearch_() {

    createSearchOverlay_();

    document.addEventListener("keydown", function (e) {

        const isCtrlF =
            (e.ctrlKey || e.metaKey) &&
            e.key.toLowerCase() === "f";

        if (isCtrlF) {

            e.preventDefault();

            openUniversalSearch_();

        }

        if (e.key === "Escape") {

            closeUniversalSearch_();

        }

    });

}

/* =========================================
   CREATE SEARCH OVERLAY
========================================= */

function createSearchOverlay_() {

    if (document.getElementById("universalSearchOverlay")) return;

    const overlay = document.createElement("div");

    overlay.id = "universalSearchOverlay";

    overlay.innerHTML = `
    
        <div class="universal-search-panel">

            <div class="universal-search-header">

                <h2>SYSTEM SEARCH ENGINE</h2>

                <button onclick="closeUniversalSearch_()">✕</button>

            </div>

            <div class="universal-search-body">

                <input
                    type="text"
                    id="universalSearchInput"
                    placeholder="Search products, customers, orders..."
                >

                <div id="universalSearchResults">

                    <div class="search-placeholder">

                        Start typing to search the system...

                    </div>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);

    const input =
        document.getElementById(
            "universalSearchInput"
        );

    input.addEventListener("input", async function () {

        await performUniversalSearch_(
            this.value.trim()
        );

    });

}

/* =========================================
   OPEN
========================================= */

function openUniversalSearch_() {

    const overlay =
        document.getElementById(
            "universalSearchOverlay"
        );

    if (!overlay) return;

    overlay.classList.add("active");

    setTimeout(() => {

        const input =
            document.getElementById(
                "universalSearchInput"
            );

        if (input) input.focus();

    }, 100);

}

/* =========================================
   CLOSE
========================================= */

function closeUniversalSearch_() {

    const overlay =
        document.getElementById(
            "universalSearchOverlay"
        );

    if (!overlay) return;

    overlay.classList.remove("active");

}

/* =========================================
   SEARCH
========================================= */

async function performUniversalSearch_(keyword) {

    const resultsContainer =
        document.getElementById(
            "universalSearchResults"
        );

    if (!resultsContainer) return;

    if (!keyword) {

        resultsContainer.innerHTML = `
        
            <div class="search-placeholder">

                Start typing to search the system...

            </div>

        `;

        return;

    }

    try {

        resultsContainer.innerHTML = `
        
            <div class="search-loading">

                Searching database...

            </div>

        `;

        const response = await fetch(
            API.BASE_URL,
            {
                method: "POST",
                body: JSON.stringify({
                    action: "universalSearch",
                    keyword: keyword
                })
            }
        );

        const result =
            await response.json();

        if (!result.success) {

            throw new Error(
                result.message ||
                "Search failed."
            );

        }

        renderUniversalResults_(
            result
        );

    } catch (error) {

        console.error(error);

        resultsContainer.innerHTML = `
        
            <div class="search-error">

                Failed to search database.

            </div>

        `;

    }

}

/* =========================================
   RENDER RESULTS
========================================= */

function renderUniversalResults_(data) {

    const resultsContainer =
        document.getElementById(
            "universalSearchResults"
        );

    if (!resultsContainer) return;

    const products =
        data.products || [];

    if (products.length === 0) {

        resultsContainer.innerHTML = `
        
            <div class="search-empty">

                No results found.

            </div>

        `;

        return;

    }

    resultsContainer.innerHTML = `
    
        <div class="search-section">

            <h3>PRODUCTS</h3>

            ${products.map(product => `
                
                    <div class="search-item">

                        <strong>
                            ${product.ProductName || ""}
                        </strong>

                        <span>
                            ${product.Category || ""}
                        </span>

                    </div>

                `).join("")
        }

        </div>

    `;

}