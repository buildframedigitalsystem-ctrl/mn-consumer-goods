/* =========================================
   M&N ADMIN OS CONTROLLER
   BuildFrame Store Operating System
========================================= */

/* ===============================
   SECTION LOADER
================================ */

async function loadSection(id, file) {
    const el = document.getElementById(id);

    if (!el) {
        console.warn(`Container not found: ${id}`);
        return false;
    }

    try {
        el.innerHTML = `
            <div class="admin-loading">
                Loading module...
            </div>
        `;

        const res = await fetch(file, {
            cache: "no-store"
        });

        if (!res.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        const html = await res.text();

        el.innerHTML = html;

        return true;

    } catch (error) {
        console.error(error);

        el.innerHTML = `
            <div class="admin-error-card">
                <h3>Module unavailable</h3>
                <p>${file}</p>
                <small>${error.message}</small>
            </div>
        `;

        return false;
    }
}

/* ===============================
   ADMIN DASHBOARD INIT
================================ */

async function initializeAdminDashboard() {
    console.log("Initializing M&N Admin OS...");

    await loadSection(
        "adminSidebar",
        "sections/admin/admin-sidebar.html"
    );

    await loadSection(
        "adminHeader",
        "sections/admin/admin-header.html"
    );

    await loadAdminPage("home");

    bindSidebarMenu();
    bindAdminKeyboardShortcuts();
    exposeAdminControlRoutes();

    console.log("M&N Admin OS initialized.");
}

/* ===============================
   SIDEBAR MENU
================================ */

function bindSidebarMenu() {
    const menuItems =
        document.querySelectorAll(".sidebar-menu li, .sidebar-menu a[data-page]");

    menuItems.forEach(item => {
        item.addEventListener("click", async (event) => {
            event.preventDefault();

            const page =
                item.dataset.page ||
                item.getAttribute("data-page");

            if (!page) return;

            await loadAdminPage(page);
        });
    });
}

/* ===============================
   MASTER PAGE ROUTER
================================ */

async function loadAdminPage(page) {
    setActiveSidebarItem(page);

    const routes = {
        home: {
            file: "sections/admin/admin-home.html",
            init: null
        },

        products: {
            file: "sections/admin/product-form.html",
            init: "initializeProducts"
        },

        suppliers: {
            file: "sections/admin/supplier-form.html",
            init: "initializeSuppliers"
        },

        "purchase-orders": {
            file: "sections/admin/purchase-order-form.html",
            init: "initializePurchaseOrders"
        },

        "product-receiving": {
            file: "sections/admin/product-receiving-form.html",
            init: "initializeProductReceiving"
        },

        inventory: {
            file: "sections/admin/inventory-view.html",
            init: "initializeInventory"
        },

        orders: {
            file: "sections/admin/order-form.html",
            init: "initializeOrders"
        },

        customers: {
            file: "sections/admin/customer-form.html",
            init: "initializeCustomers"
        },

        reports: {
            file: "sections/admin/reports-dashboard.html",
            init: "initializeReports"
        },

        search: {
            file: "sections/admin/admin-search-block.html",
            init: "initAdminSearchBlock"
        },

        crm: {
            external: "admin-crm-dashboard.html"
        },

        store: {
            external: "index.html"
        },

        retail: {
            external: "retail.html"
        },

        wholesale: {
            external: "wholesale.html"
        },

        promos: {
            external: "promos.html"
        },

        delivery: {
            external: "delivery-booking.html"
        },

        quotation: {
            external: "quotation-request.html"
        },

        reseller: {
            external: "reseller-application.html"
        },

        "store-setup": {
            external: "admin-store-setup.html"
        },

        "admin-products": {
            external: "admin-products.html"
        },

        "master-dashboard": {
            external: "master-dashboard.html"
        }
    };

    const route = routes[page] || routes.home;

    if (route.external) {
        window.location.href = route.external;
        return;
    }

    const loaded =
        await loadSection(
            "adminContent",
            route.file
        );

    if (!loaded) return;

    runModuleInitializer(route.init);
}

/* ===============================
   ACTIVE SIDEBAR STATE
================================ */

function setActiveSidebarItem(page) {
    const menuItems =
        document.querySelectorAll(".sidebar-menu li, .sidebar-menu a[data-page]");

    menuItems.forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.page === page
        );
    });
}

/* ===============================
   SAFE MODULE INITIALIZER
================================ */

function runModuleInitializer(functionName) {
    if (!functionName) return;

    const fn = window[functionName];

    if (typeof fn === "function") {
        fn();
    } else {
        console.warn(`${functionName} is not available yet.`);
    }
}

/* ===============================
   ADMIN CONTROL ROUTES
================================ */

function exposeAdminControlRoutes() {
    window.loadAdminPage = loadAdminPage;

    window.goToAdminControl = function () {
        window.location.href = "admin-dashboard.html";
    };

    window.goToStorefront = function () {
        window.location.href = "index.html";
    };

    window.goToMasterDashboard = function () {
        window.location.href = "master-dashboard.html";
    };
}

/* ===============================
   KEYBOARD SHORTCUTS
================================ */

function bindAdminKeyboardShortcuts() {
    document.addEventListener("keydown", function (event) {
        const key = event.key.toLowerCase();

        if ((event.ctrlKey || event.metaKey) && key === "f") {
            event.preventDefault();
            openAdminSearchOverlay();
        }

        if ((event.ctrlKey || event.metaKey) && key === "h") {
            event.preventDefault();
            loadAdminPage("home");
        }

        if ((event.ctrlKey || event.metaKey) && key === "p") {
            event.preventDefault();
            loadAdminPage("products");
        }

        if ((event.ctrlKey || event.metaKey) && key === "o") {
            event.preventDefault();
            loadAdminPage("orders");
        }

        if (event.key === "Escape") {
            closeAdminSearchOverlay();
        }
    });
}

/* ===============================
   SAFE SEARCH OVERLAY CONTROL
================================ */

function openAdminSearchOverlay() {
    const overlay =
        document.getElementById("metalSearchOverlay");

    if (!overlay) {
        console.warn("Search overlay not found.");
        return;
    }

    overlay.classList.add("active");

    setTimeout(() => {
        document
            .getElementById("adminSearchInput")
            ?.focus();
    }, 80);
}

function closeAdminSearchOverlay() {
    const overlay =
        document.getElementById("metalSearchOverlay");

    if (!overlay) return;

    overlay.classList.remove("active");
}

/* ===============================
   AUTO INITIALIZE
================================ */

document.addEventListener("DOMContentLoaded", () => {
    initializeAdminDashboard();
});