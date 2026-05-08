async function loadSection(id, file) {

    const el = document.getElementById(id);

    if (!el) return;

    try {

        const res = await fetch(file);

        const html = await res.text();

        el.innerHTML = html;

    } catch (error) {

        console.error(error);

    }

}

async function initializeAdminDashboard() {

    await loadSection(
        "adminSidebar",
        "sections/admin/admin-sidebar.html"
    );

    await loadSection(
        "adminHeader",
        "sections/admin/admin-header.html"
    );

    await loadSection(
        "adminContent",
        "sections/admin/admin-home.html"
    );

    bindSidebarMenu();

}

function bindSidebarMenu() {

    const menuItems =
        document.querySelectorAll(".sidebar-menu li");

    menuItems.forEach(item => {

        item.addEventListener("click", async () => {

            const page = item.dataset.page;

            if (!page) return;

            /* =========================
               HOME
            ========================= */

            if (page === "home") {

                await loadSection(
                    "adminContent",
                    "sections/admin/admin-home.html"
                );

            }

            /* =========================
               PRODUCTS
            ========================= */

            if (page === "products") {

                await loadSection(
                    "adminContent",
                    "sections/admin/product-form.html"
                );

                initializeProducts();

            }

            /* =========================
               SUPPLIERS
            ========================= */

            if (page === "suppliers") {

                await loadSection(
                    "adminContent",
                    "sections/admin/supplier-form.html"
                );

                initializeSuppliers();

            }

            /* =========================
               PURCHASE ORDERS
            ========================= */

            if (page === "purchase-orders") {

                await loadSection(
                    "adminContent",
                    "sections/admin/purchase-order-form.html"
                );

                initializePurchaseOrders();

            }
            if (page === "product-receiving") {

                await loadSection(
                    "adminContent",
                    "sections/admin/product-receiving-form.html"
                );

                initializeProductReceiving();

            }

            if (page === "inventory") {

                await loadSection(
                    "adminContent",
                    "sections/admin/inventory-view.html"
                );

                initializeInventory();

            }

            if (page === "orders") {

                await loadSection(
                    "adminContent",
                    "sections/admin/order-form.html"
                );

                initializeOrders();

            }

            if (page === "customers") {

                await loadSection(
                    "adminContent",
                    "sections/admin/customer-form.html"
                );

                initializeCustomers();

            }

            if (page === "reports") {

                await loadSection(
                    "adminContent",
                    "sections/admin/reports-dashboard.html"
                );

                initializeReports();

            }

        });

    });

}

initializeAdminDashboard();