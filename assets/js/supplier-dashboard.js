/* =================================
   SUPPLIER SESSION
================================= */

const supplierSession =
    JSON.parse(
        localStorage.getItem(
            "mnSupplierSession"
        )
    );

if (!supplierSession) {

    alert("Please login first.");

    window.location.href =
        "supplier-login.html";

}

/* =================================
   ELEMENTS
================================= */

const mainContent =
    document.querySelector(
        ".dashboard-main"
    );

const menuLinks =
    document.querySelectorAll(
        ".sidebar-menu a[data-page]"
    );

const logoutBtn =
    document.getElementById(
        "supplierLogoutBtn"
    );

/* =================================
   HELPERS
================================= */

function getSupplierName() {

    return supplierSession?.supplierName
        || "Supplier";

}

function setActive(pageName) {

    menuLinks.forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.page === pageName
        );

    });

}

/* =================================
   PAGES
================================= */

function renderDashboard() {

    mainContent.innerHTML = `
    
        <header class="dashboard-topbar">

            <div>
                <h1>Supplier Dashboard</h1>

                <p>
                    Welcome back,
                    ${getSupplierName()}
                </p>
            </div>

        </header>

        <section class="dashboard-stats">

            <div class="stat-card">
                <h3>Total Products</h3>
                <h2>0</h2>
            </div>

            <div class="stat-card">
                <h3>Pending P.O.</h3>
                <h2>0</h2>
            </div>

            <div class="stat-card">
                <h3>Deliveries</h3>
                <h2>0</h2>
            </div>

            <div class="stat-card">
                <h3>Payables</h3>
                <h2>₱0.00</h2>
            </div>

        </section>
    
    `;

}

function renderProducts() {

    mainContent.innerHTML = `
    
        <header class="dashboard-topbar">

            <div>
                <h1>Supplier Products</h1>

                <p>
                    Products linked to this supplier.
                </p>
            </div>

        </header>

        <section class="recent-orders">

            <table>

                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Cost</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="4">
                            No supplier products yet.
                        </td>
                    </tr>
                </tbody>

            </table>

        </section>
    
    `;

}

function renderPurchaseOrders() {

    mainContent.innerHTML = `
    
        <header class="dashboard-topbar">

            <div>
                <h1>Purchase Orders</h1>

                <p>
                    Purchase orders from M&N.
                </p>
            </div>

        </header>

        <section class="recent-orders">

            <table>

                <thead>
                    <tr>
                        <th>P.O. ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="4">
                            No purchase orders yet.
                        </td>
                    </tr>
                </tbody>

            </table>

        </section>
    
    `;

}

function renderDeliveries() {

    mainContent.innerHTML = `
    
        <header class="dashboard-topbar">

            <div>
                <h1>Deliveries</h1>

                <p>
                    Supplier shipment tracking.
                </p>
            </div>

        </header>

        <section class="recent-orders">

            <table>

                <thead>
                    <tr>
                        <th>Delivery ID</th>
                        <th>Status</th>
                        <th>Received By</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="4">
                            No deliveries yet.
                        </td>
                    </tr>
                </tbody>

            </table>

        </section>
    
    `;

}

function renderPayables() {

    mainContent.innerHTML = `
    
        <header class="dashboard-topbar">

            <div>
                <h1>Supplier Payables</h1>

                <p>
                    Outstanding balances and payments.
                </p>
            </div>

        </header>

        <section class="dashboard-stats">

            <div class="stat-card">
                <h3>Total Payable</h3>
                <h2>₱0.00</h2>
            </div>

            <div class="stat-card">
                <h3>Paid</h3>
                <h2>₱0.00</h2>
            </div>

            <div class="stat-card">
                <h3>Remaining</h3>
                <h2>₱0.00</h2>
            </div>

        </section>
    
    `;

}

function renderSettings() {

    mainContent.innerHTML = `
    
        <header class="dashboard-topbar">

            <div>
                <h1>Supplier Settings</h1>

                <p>
                    Supplier profile information.
                </p>
            </div>

        </header>

        <section class="recent-orders">

            <table>

                <tbody>

                    <tr>
                        <th>Supplier ID</th>
                        <td>
                            ${supplierSession.supplierId || "-"}
                        </td>
                    </tr>

                    <tr>
                        <th>Supplier Name</th>
                        <td>
                            ${supplierSession.supplierName || "-"}
                        </td>
                    </tr>

                    <tr>
                        <th>Email</th>
                        <td>
                            ${supplierSession.email || "-"}
                        </td>
                    </tr>

                    <tr>
                        <th>Mobile</th>
                        <td>
                            ${supplierSession.mobile || "-"}
                        </td>
                    </tr>

                </tbody>

            </table>

        </section>
    
    `;

}

/* =================================
   EVENTS
================================= */

menuLinks.forEach(link => {

    link.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            const page =
                this.dataset.page;

            setActive(page);

            if (page === "dashboard")
                renderDashboard();

            if (page === "products")
                renderProducts();

            if (page === "purchaseOrders")
                renderPurchaseOrders();

            if (page === "deliveries")
                renderDeliveries();

            if (page === "payables")
                renderPayables();

            if (page === "settings")
                renderSettings();

        }
    );

});

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            localStorage.removeItem(
                "mnSupplierSession"
            );

            alert(
                "Logged out successfully."
            );

            window.location.href =
                "supplier-login.html";

        }
    );

}

/* =================================
   INITIAL LOAD
================================= */

setActive("dashboard");

renderDashboard();