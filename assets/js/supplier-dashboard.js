/* =================================
   SUPPLIER SESSION
================================= */

const supplierSession = JSON.parse(localStorage.getItem("mnSupplierSession"));

/* =================================
   DASHBOARD ELEMENTS
================================= */

const supplierMain = document.querySelector(".dashboard-main");
const supplierLinks = document.querySelectorAll(".sidebar-menu a[data-page]");
const supplierLogoutBtn = document.getElementById("supplierLogoutBtn");

/* =================================
   ACTIVE SIDEBAR
================================= */

function setActiveSupplier(page) {

    supplierLinks.forEach(link => {
        link.classList.remove("active");
    });

    const activeLink = document.querySelector(
        `.sidebar-menu a[data-page="${page}"]`
    );

    if (activeLink) {
        activeLink.classList.add("active");
    }
}

/* =================================
   DASHBOARD PAGE
================================= */

function loadSupplierDashboard() {

    setActiveSupplier("dashboard");

    supplierMain.innerHTML = `
    
        <header class="dashboard-topbar">

            <div>
                <h1>Supplier Dashboard</h1>
                <p>
                    Welcome to the M&N Supplier Portal
                </p>
            </div>

            <button class="new-order-btn">
                View Purchase Orders
            </button>

        </header>

        <section class="dashboard-stats">

            <div class="stat-card">
                <h3>Total Purchase Orders</h3>
                <h2>42</h2>
            </div>

            <div class="stat-card">
                <h3>Pending Deliveries</h3>
                <h2>8</h2>
            </div>

            <div class="stat-card">
                <h3>Completed Deliveries</h3>
                <h2>31</h2>
            </div>

            <div class="stat-card">
                <h3>Supplier Rating</h3>
                <h2>4.9</h2>
            </div>

        </section>

        <section class="recent-orders">

            <div class="section-header">
                <h2>Recent Supplier Transactions</h2>
            </div>

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>PO Number</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>

                    <tr>
                        <td>PO-1001</td>
                        <td>May 08, 2026</td>
                        <td>Delivered</td>
                        <td>₱120,000</td>
                    </tr>

                    <tr>
                        <td>PO-1002</td>
                        <td>May 07, 2026</td>
                        <td>Pending</td>
                        <td>₱85,000</td>
                    </tr>

                    <tr>
                        <td>PO-1003</td>
                        <td>May 06, 2026</td>
                        <td>Processing</td>
                        <td>₱64,500</td>
                    </tr>

                </tbody>

            </table>

        </section>
    
    `;
}

/* =================================
   PURCHASE ORDERS
================================= */

function loadPurchaseOrders() {

    setActiveSupplier("purchaseOrders");

    supplierMain.innerHTML = `

        <header class="dashboard-topbar">

            <div>
                <h1>Purchase Orders</h1>
                <p>Manage incoming purchase orders from M&N.</p>
            </div>

        </header>

        <section class="recent-orders">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>PO Number</th>
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

/* =================================
   PRODUCT DELIVERIES
================================= */

function loadProductDeliveries() {

    setActiveSupplier("deliveries");

    supplierMain.innerHTML = `

        <header class="dashboard-topbar">

            <div>
                <h1>Product Deliveries</h1>
                <p>Track supplier deliveries and shipment schedules.</p>
            </div>

        </header>

        <section class="recent-orders">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Delivery ID</th>
                        <th>Status</th>
                        <th>Arrival Date</th>
                    </tr>
                </thead>

                <tbody>

                    <tr>
                        <td colspan="3">
                            No delivery records yet.
                        </td>
                    </tr>

                </tbody>

            </table>

        </section>

    `;
}

/* =================================
   PRODUCT RECEIVING
================================= */

function loadProductReceiving() {

    setActiveSupplier("receiving");

    supplierMain.innerHTML = `

        <header class="dashboard-topbar">

            <div>
                <h1>Product Receiving</h1>
                <p>View received inventory and receiving confirmations.</p>
            </div>

        </header>

        <section class="recent-orders">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Receiving ID</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    <tr>
                        <td colspan="3">
                            No receiving records yet.
                        </td>
                    </tr>

                </tbody>

            </table>

        </section>

    `;
}

/* =================================
   SUPPLIER TRANSACTIONS
================================= */

function loadSupplierTransactions() {

    setActiveSupplier("transactions");

    supplierMain.innerHTML = `

        <header class="dashboard-topbar">

            <div>
                <h1>Supplier Transactions</h1>
                <p>Monitor supplier payment and transaction history.</p>
            </div>

        </header>

        <section class="recent-orders">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody>

                    <tr>
                        <td colspan="3">
                            No supplier transactions yet.
                        </td>
                    </tr>

                </tbody>

            </table>

        </section>

    `;
}

/* =================================
   ACCOUNT SETTINGS
================================= */

function loadSupplierSettings() {

    setActiveSupplier("settings");

    supplierMain.innerHTML = `

        <header class="dashboard-topbar">

            <div>
                <h1>Account Settings</h1>
                <p>Manage supplier account information.</p>
            </div>

        </header>

        <section class="recent-orders">

            <table class="admin-table">

                <tbody>

                    <tr>
                        <th>Supplier Name</th>
                        <td>${supplierSession?.supplierName || "-"}</td>
                    </tr>

                    <tr>
                        <th>Email</th>
                        <td>${supplierSession?.email || "-"}</td>
                    </tr>

                    <tr>
                        <th>Mobile</th>
                        <td>${supplierSession?.mobile || "-"}</td>
                    </tr>

                    <tr>
                        <th>Status</th>
                        <td>${supplierSession?.status || "-"}</td>
                    </tr>

                </tbody>

            </table>

        </section>

    `;
}

/* =================================
   SIDEBAR EVENTS
================================= */

supplierLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const page = this.dataset.page;

        switch (page) {

            case "dashboard":
                loadSupplierDashboard();
                break;

            case "purchaseOrders":
                loadPurchaseOrders();
                break;

            case "deliveries":
                loadProductDeliveries();
                break;

            case "receiving":
                loadProductReceiving();
                break;

            case "transactions":
                loadSupplierTransactions();
                break;

            case "settings":
                loadSupplierSettings();
                break;
        }
    });
});

/* =================================
   LOGOUT
================================= */

if (supplierLogoutBtn) {

    supplierLogoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("mnSupplierSession");

        alert("Supplier logged out.");

        window.location.href = "supplier-login.html";
    });
}

/* =================================
   INITIAL LOAD
================================= */

loadSupplierDashboard();