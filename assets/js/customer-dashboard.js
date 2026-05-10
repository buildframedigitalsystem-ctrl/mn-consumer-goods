/* =================================
   CUSTOMER DASHBOARD SESSION
================================= */

const customerSession = JSON.parse(localStorage.getItem("mnCustomerSession"));

if (!customerSession) {
    alert("Please login first.");
    window.location.href = "customer-login.html";
}

/* =================================
   DASHBOARD ELEMENTS
================================= */

const mainContent = document.querySelector(".dashboard-main");
const menuLinks = document.querySelectorAll(".sidebar-menu a[data-page]");
const logoutBtn = document.getElementById("customerLogoutBtn");

/* =================================
   HELPERS
================================= */

function getCustomerName() {
    return customerSession?.fullName || "Customer";
}

function getCustomerType() {
    return customerSession?.customerType || "Retail";
}

function setActive(pageName) {
    menuLinks.forEach(link => {
        link.classList.toggle("active", link.dataset.page === pageName);
    });
}

/* =================================
   PAGES
================================= */

function renderDashboard() {
    mainContent.innerHTML = `
        <header class="dashboard-topbar">
            <div>
                <h1>Customer Dashboard</h1>
                <p>Welcome back, ${getCustomerName()} • ${getCustomerType()} Customer</p>
            </div>

            <button class="new-order-btn">
                + Create Order
            </button>
        </header>

        <section class="dashboard-stats">
            <div class="stat-card">
                <h3>Total Orders</h3>
                <h2>0</h2>
            </div>

            <div class="stat-card">
                <h3>Pending Orders</h3>
                <h2>0</h2>
            </div>

            <div class="stat-card">
                <h3>Delivered</h3>
                <h2>0</h2>
            </div>

            <div class="stat-card">
                <h3>Customer Type</h3>
                <h2>${getCustomerType()}</h2>
            </div>
        </section>

        <section class="recent-orders">
            <div class="section-header">
                <h2>Recent Orders</h2>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="4">No orders yet. Customer order data will appear here later.</td>
                    </tr>
                </tbody>
            </table>
        </section>
    `;
}

function renderMyOrders() {
    mainContent.innerHTML = `
        <header class="dashboard-topbar">
            <div>
                <h1>My Orders</h1>
                <p>View all your submitted M&N orders.</p>
            </div>

            <button class="new-order-btn">
                + New Order
            </button>
        </header>

        <section class="recent-orders">
            <div class="section-header">
                <h2>Order List</h2>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="5">No customer orders found yet.</td>
                    </tr>
                </tbody>
            </table>
        </section>
    `;
}

function renderTracking() {
    mainContent.innerHTML = `
        <header class="dashboard-topbar">
            <div>
                <h1>Order Tracking</h1>
                <p>Track delivery and fulfillment status of your orders.</p>
            </div>
        </header>

        <section class="recent-orders">
            <div class="section-header">
                <h2>Tracking Status</h2>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Current Status</th>
                        <th>Delivery Notes</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="4">No tracking records yet.</td>
                    </tr>
                </tbody>
            </table>
        </section>
    `;
}

function renderHistory() {
    mainContent.innerHTML = `
        <header class="dashboard-topbar">
            <div>
                <h1>Order History</h1>
                <p>Your completed and previous transactions.</p>
            </div>
        </header>

        <section class="recent-orders">
            <div class="section-header">
                <h2>Completed Orders</h2>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date Completed</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td colspan="4">No completed orders yet.</td>
                    </tr>
                </tbody>
            </table>
        </section>
    `;
}

function renderPricing() {
    mainContent.innerHTML = `
        <header class="dashboard-topbar">
            <div>
                <h1>Wholesale Pricing</h1>
                <p>Special pricing access based on your customer type.</p>
            </div>
        </header>

        <section class="dashboard-stats">
            <div class="stat-card">
                <h3>Account Type</h3>
                <h2>${getCustomerType()}</h2>
            </div>

            <div class="stat-card">
                <h3>Wholesale Access</h3>
                <h2>${getCustomerType() === "Wholesale" ? "Active" : "Locked"}</h2>
            </div>
        </section>

        <section class="recent-orders">
            <div class="section-header">
                <h2>Pricing Notice</h2>
            </div>

            <p>
                Wholesale pricing will later be connected to the product database.
                Retail customers will see regular pricing, while approved wholesale customers
                can access bulk pricing and reseller offers.
            </p>
        </section>
    `;
}

function renderSettings() {
    mainContent.innerHTML = `
        <header class="dashboard-topbar">
            <div>
                <h1>Account Settings</h1>
                <p>View your registered customer information.</p>
            </div>
        </header>

        <section class="recent-orders">
            <div class="section-header">
                <h2>Customer Profile</h2>
            </div>

            <table>
                <tbody>
                    <tr>
                        <th>Customer ID</th>
                        <td>${customerSession.customerId || "-"}</td>
                    </tr>
                    <tr>
                        <th>Full Name</th>
                        <td>${customerSession.fullName || "-"}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>${customerSession.email || "-"}</td>
                    </tr>
                    <tr>
                        <th>Mobile</th>
                        <td>${customerSession.mobile || "-"}</td>
                    </tr>
                    <tr>
                        <th>Customer Type</th>
                        <td>${customerSession.customerType || "-"}</td>
                    </tr>
                    <tr>
                        <th>Account Status</th>
                        <td>${customerSession.accountStatus || "-"}</td>
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
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const page = this.dataset.page;

        setActive(page);

        if (page === "dashboard") renderDashboard();
        if (page === "myOrders") renderMyOrders();
        if (page === "tracking") renderTracking();
        if (page === "history") renderHistory();
        if (page === "pricing") renderPricing();
        if (page === "settings") renderSettings();
    });
});

if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();

        localStorage.removeItem("mnCustomerSession");

        alert("Logged out successfully.");

        window.location.href = "customer-login.html";
    });
}

/* =================================
   INITIAL LOAD
================================= */

setActive("dashboard");
renderDashboard();