/* =========================================
   UNIVERSAL DASHBOARD LAYOUT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboardSidebar_();
    loadDefaultDashboardPage_();
});

/* =========================================
   DETECT DASHBOARD TYPE
========================================= */

function getDashboardType_() {
    const bodyType = document.body.dataset.dashboard;

    if (bodyType) return bodyType;

    if (window.location.pathname.includes("agent-dashboard")) {
        return "agent";
    }

    if (window.location.pathname.includes("customer-dashboard")) {
        return "customer";
    }

    if (window.location.pathname.includes("supplier-dashboard")) {
        return "supplier";
    }

    return "agent";
}

/* =========================================
   SIDEBAR ACTIVE MENU
========================================= */

function initializeDashboardSidebar_() {
    const menuLinks =
        document.querySelectorAll(".sidebar-menu a[data-page]");

    menuLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            menuLinks.forEach(item => {
                item.classList.remove("active");
            });

            this.classList.add("active");

            const page = this.dataset.page;

            loadDashboardPage_(page);
        });
    });
}

/* =========================================
   LOAD DEFAULT PAGE
========================================= */

function loadDefaultDashboardPage_() {
    const activeLink =
        document.querySelector(".sidebar-menu a.active[data-page]");

    const page =
        activeLink?.dataset.page || "dashboard";

    loadDashboardPage_(page);
}

/* =========================================
   LOAD DASHBOARD PAGE
========================================= */

async function loadDashboardPage_(page) {
    const main =
        document.querySelector(".dashboard-main");

    if (!main) return;

    const dashboardType = getDashboardType_();

    const filePath =
        `sections/${dashboardType}/${page}.html`;

    main.innerHTML = `
        <div class="dashboard-loading">
            Loading ${formatDashboardTitle_(page)}...
        </div>
    `;

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error("Section not found: " + filePath);
        }

        const html = await response.text();

        main.innerHTML = html;

    } catch (error) {
        console.error(error);

        main.innerHTML = `
            <section class="dashboard-section">

                <h1>
                    ${formatDashboardTitle_(page)}
                </h1>

                <p>
                    This section is not yet created.
                </p>

                <small>
                    Missing file: ${filePath}
                </small>

            </section>
        `;
    }
}

/* =========================================
   FORMAT TITLE
========================================= */

function formatDashboardTitle_(text) {
    return text
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase())
        .trim();
}