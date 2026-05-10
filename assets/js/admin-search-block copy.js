/* =================================
   ADMIN FLOATING METAL SEARCH
================================= */

function initAdminSearchBlock() {

    const overlay = document.getElementById("metalSearchOverlay");
    const closeBtn = document.getElementById("metalSearchClose");
    const searchType = document.getElementById("adminSearchType");
    const searchInput = document.getElementById("adminSearchInput");
    const searchBtn = document.getElementById("adminSearchBtn");
    const resultsBox = document.getElementById("adminSearchResults");

    if (!overlay || !searchType || !searchInput || !searchBtn || !resultsBox) return;

    openMetalSearch();

    if (closeBtn) {
        closeBtn.addEventListener("click", closeMetalSearch);
    }

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            closeMetalSearch();
        }
    });

    searchBtn.addEventListener("click", runAdminSearch);

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            runAdminSearch();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeMetalSearch();
        }
    });

    async function runAdminSearch() {

        const action = searchType.value;
        const keyword = searchInput.value.trim();

        if (!keyword) {
            resultsBox.innerHTML = "<p>Please enter a search keyword.</p>";
            searchInput.focus();
            return;
        }

        resultsBox.innerHTML = "<p>Searching...</p>";

        try {

            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify({
                    action: action,
                    SearchTerm: keyword
                })
            });

            const result = await response.json();

            if (!result.success) {
                resultsBox.innerHTML = `<p>${result.message || "Search failed."}</p>`;
                return;
            }

            renderAdminSearchResults(result.results || []);

        } catch (error) {

            console.error(error);
            resultsBox.innerHTML = "<p>Connection error.</p>";

        }

    }

}

function openMetalSearch() {

    const overlay = document.getElementById("metalSearchOverlay");
    const searchInput = document.getElementById("adminSearchInput");

    if (!overlay) return;

    overlay.classList.add("show");

    setTimeout(() => {
        if (searchInput) searchInput.focus();
    }, 100);

}

function closeMetalSearch() {

    const overlay = document.getElementById("metalSearchOverlay");

    if (!overlay) return;

    overlay.classList.remove("show");

}

function renderAdminSearchResults(results) {

    const resultsBox = document.getElementById("adminSearchResults");

    if (!resultsBox) return;

    if (!results || results.length === 0) {
        resultsBox.innerHTML = "<p>No matching records found.</p>";
        return;
    }

    let html = `
        <div class="metal-search-count">
            ${results.length} result(s) found
        </div>
    `;

    results.forEach((item, index) => {

        html += `
            <div class="metal-result-card">
                <h4>Result ${index + 1}</h4>
                <pre>${JSON.stringify(item, null, 2)}</pre>
            </div>
        `;

    });

    resultsBox.innerHTML = html;
}