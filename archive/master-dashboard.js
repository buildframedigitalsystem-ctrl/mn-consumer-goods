/* =========================================
   MASTER DASHBOARD
========================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbzbUww2SKIl6uqQvPqLtO6L35A0Xw5Ny0N5hjq16JOguAiLUAovKMdUagJ9SgK1fOSJ/exec";

document.addEventListener("DOMContentLoaded", () => {

    activateMasterSidebar();
    activateRefreshButton();

    loadMasterSection("overview");

});

/* =========================================
   SIDEBAR
========================================= */

function activateMasterSidebar() {

    const sidebarLinks =
        document.querySelectorAll(".master-sidebar a[data-page]");

    sidebarLinks.forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            sidebarLinks.forEach(item =>
                item.classList.remove("active")
            );

            this.classList.add("active");

            const page =
                this.dataset.page;

            handleMasterPage(page);

            loadMasterSection(page);

        });

    });

}

/* =========================================
   PAGE TITLES
========================================= */

function handleMasterPage(page) {

    const title =
        document.querySelector(".master-header h1");

    const subtitle =
        document.querySelector(".master-header p");

    const pages = {

        overview: [
            "Master Dashboard",
            "M&N Consumer Goods Operating System"
        ],

        orders: [
            "Orders Dashboard",
            "Order status, sales flow, and transactions"
        ],

        inventory: [
            "Inventory Dashboard",
            "Stock levels, alerts, and product movement"
        ],

        deliveries: [
            "Deliveries Dashboard",
            "Pending, outgoing, and completed deliveries"
        ],

        customers: [
            "Customer Dashboard",
            "Customer types, balances, and analytics"
        ],

        suppliers: [
            "Supplier Dashboard",
            "Supplier orders and payables analytics"
        ],

        agents: [
            "Agent Dashboard",
            "Agent sales and commission analytics"
        ],

        pricing: [
            "Pricing Engine",
            "Markup rules, pricing levels, commissions, and live pricing preview"
        ],

        reports: [
            "Reports Dashboard",
            "Sales, expenses, and financial analytics"
        ],

        settings: [
            "Settings Dashboard",
            "Pricing, rules, dropdowns, and system configuration"
        ]

    };

    if (!pages[page]) return;

    title.textContent =
        pages[page][0];

    subtitle.textContent =
        pages[page][1];

}

/* =========================================
   REFRESH BUTTON
========================================= */

function activateRefreshButton() {

    const refreshBtn =
        document.getElementById("dashboardRefreshBtn");

    if (!refreshBtn) return;

    refreshBtn.addEventListener("click", () => {

        const activePage =
            document.querySelector(".master-sidebar a.active")
                ?.dataset.page || "overview";

        loadMasterSection(activePage);

    });

}

/* =========================================
   MASTER SECTION LOADER
========================================= */

async function loadMasterSection(section) {

    const container =
        document.getElementById("masterDashboardContent");

    if (!container) return;

    try {

        const response =
            await fetch(`sections/master-dashboard/${section}.html`);

        if (response.ok) {

            const html =
                await response.text();

            if (html && html.trim()) {

                container.innerHTML = html;

            } else {

                container.innerHTML =
                    getFallbackSectionHTML(section);

            }

        } else {

            container.innerHTML =
                getFallbackSectionHTML(section);

        }

    } catch (error) {

        console.error(error);

        container.innerHTML =
            getFallbackSectionHTML(section);

    }

    try {

        await initializeSection(section);

    } catch (error) {

        console.error(error);

    }

}

/* =========================================
   INITIALIZE SECTION
========================================= */

async function initializeSection(section) {

    destroyExistingCharts();

    switch (section) {

        case "overview":

            await loadDashboardKPIs();
            await loadRecentOrders();
            await loadDashboardCharts();

            break;

        case "orders":

            await loadOrdersDashboard();

            break;

        case "inventory":

            await loadInventoryDashboard();

            break;

        case "deliveries":

            await loadDeliveriesDashboard();

            break;

        case "customers":

            await loadCustomersDashboard();

            break;

        case "suppliers":

            await loadSuppliersDashboard();

            break;

        case "agents":

            await loadAgentsDashboard();

            break;

        case "pricing":

            await initializePricingDashboard();

            break;

        case "reports":

            await loadReportsDashboard();

            break;

        case "settings":

            await loadSettingsDashboard();

            break;

    }

}

/* =========================================
   FALLBACK SECTIONS
========================================= */

function getFallbackSectionHTML(section) {

    if (section === "overview")
        return getOverviewDashboardHTML();

    if (section === "orders")
        return getOrdersDashboardHTML();

    if (section === "inventory")
        return getInventoryDashboardHTML();

    if (section === "deliveries")
        return getDeliveriesDashboardHTML();

    if (section === "customers")
        return getCustomersDashboardHTML();

    if (section === "suppliers")
        return getSuppliersDashboardHTML();

    if (section === "agents")
        return getAgentsDashboardHTML();

    if (section === "reports")
        return getReportsDashboardHTML();

    if (section === "settings")
        return getSettingsDashboardHTML();

    if (section === "pricing") {

        return `
            <section class="dashboard-grid">
                <div class="panel large">
                    <h3>Pricing Engine</h3>
                    <p>Pricing dashboard loading...</p>
                </div>
            </section>
        `;

    }

    return `
        <section class="dashboard-grid">
            <div class="panel large">
                <h3>Dashboard Section</h3>
                <p>This section is ready.</p>
            </div>
        </section>
    `;

}

/* =========================================
   OVERVIEW KPI DATA
========================================= */

async function loadDashboardKPIs() {

    setText("totalSales", "₱0.00");
    setText("totalOrders", "0");
    setText("totalProducts", "0");
    setText("lowStock", "0");
    setText("totalCustomers", "0");
    setText("pendingDeliveries", "0");

}

/* =========================================
   RECENT ORDERS
========================================= */

async function loadRecentOrders() {
    if (typeof API_URL === "undefined") return;

    try {
        const response = await fetch(API_URL + "?action=getOrders");
        const data = await response.json();

        const table = document.getElementById("recentOrdersTable");
        if (!table) return;

        table.innerHTML = "";

        if (!data.orders?.length) {
            table.innerHTML = `
                <tr>
                    <td colspan="4">No orders yet</td>
                </tr>
            `;
            return;
        }

        data.orders.slice(0, 5).forEach(order => {
            table.innerHTML += `
                <tr>
                    <td>${order.OrderID || "-"}</td>
                    <td>${order.CustomerName || "-"}</td>
                    <td>${order.OrderStatus || "-"}</td>
                    <td>₱${Number(order.TotalAmount || 0).toLocaleString()}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

/* =========================================
   OVERVIEW CHARTS
========================================= */

async function loadDashboardCharts() {
    await loadSalesSummaryChart();
    await loadOrderStatusChart();
    await loadSalesTrendChart();
    await loadInventoryStatusChart();
    await loadBestSellersChart();
    await loadDeliveryStatusChart();

    createCustomerTypesChart();
    createPayablesChart();
}

/* =========================================
   LIVE CHART LOADERS
========================================= */

async function loadSalesSummaryChart() {
    const data = await fetchAnalyticsData("getSalesSummaryAnalytics");

    createDoughnutChart(
        "salesSummaryChart",
        data.labels?.length ? data.labels : ["Retail", "Wholesale", "Agent"],
        hasChartValues(data.values) ? data.values : [45, 35, 20]
    );
}

async function loadOrderStatusChart() {
    const data = await fetchAnalyticsData("getOrderStatusAnalytics");

    createDoughnutChart(
        "orderStatusChart",
        data.labels?.length ? data.labels : ["New", "Processing", "Delivered", "Cancelled"],
        hasChartValues(data.values) ? data.values : [12, 8, 20, 2]
    );
}

async function loadSalesTrendChart() {
    const data = await fetchAnalyticsData("getSalesTrendAnalytics");

    createLineChart(
        "salesTrendChart",
        data.labels?.length ? data.labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        hasChartValues(data.values) ? data.values : [1200, 2500, 1800, 3400, 4200, 3800, 5200],
        "Sales"
    );
}

async function loadInventoryStatusChart() {
    const data = await fetchAnalyticsData("getInventoryStatusAnalytics");

    createBarChart(
        "inventoryStatusChart",
        data.labels?.length ? data.labels : ["In Stock", "Low Stock", "Out"],
        hasChartValues(data.values) ? data.values : [40, 8, 3],
        "Products"
    );
}

async function loadBestSellersChart() {
    const data = await fetchAnalyticsData("getBestSellersAnalytics");

    createBarChart(
        "bestSellersChart",
        data.labels?.length ? data.labels : ["Coffee", "Rice", "Soap", "Milk", "Sugar"],
        hasChartValues(data.values) ? data.values : [120, 95, 70, 60, 45],
        "Sold"
    );
}

async function loadDeliveryStatusChart() {
    const data = await fetchAnalyticsData("getDeliveryAnalytics");

    createBarChart(
        "deliveryStatusChart",
        data.labels?.length ? data.labels : ["Pending", "Outgoing", "Delivered", "Failed"],
        hasChartValues(data.values) ? data.values : [7, 5, 20, 1],
        "Deliveries"
    );
}

/* =========================================
   MODULE DASHBOARDS
========================================= */

async function loadOrdersDashboard() {
    setContentIfEmpty(getOrdersDashboardHTML());

    await loadOrdersKPIs();
    await loadOrderStatusChart();
    await loadSalesTrendChart();
    await loadRecentOrders();
}

async function loadInventoryDashboard() {
    setContentIfEmpty(getInventoryDashboardHTML());

    await loadInventoryKPIs();
    await loadInventoryStatusChart();
    createInventoryMovementChart();
    await loadLowStockTable();
    await loadInventoryAlertsTable();
}

async function loadDeliveriesDashboard() {
    setContentIfEmpty(getDeliveriesDashboardHTML());

    await loadDeliveryStatusChart();
}

async function loadCustomersDashboard() {
    setContentIfEmpty(getCustomersDashboardHTML());

    createCustomerTypesChart();
}

async function loadSuppliersDashboard() {
    setContentIfEmpty(getSuppliersDashboardHTML());

    createPayablesChart();
}

async function loadAgentsDashboard() {
    setContentIfEmpty(getAgentsDashboardHTML());

    createLineChart(
        "agentSalesChart",
        ["Mon", "Tue", "Wed", "Thu", "Fri"],
        [5000, 9000, 12000, 8000, 15000],
        "Agent Sales"
    );
}

async function loadReportsDashboard() {
    setContentIfEmpty(getReportsDashboardHTML());

    createLineChart(
        "reportsSalesChart",
        ["Jan", "Feb", "Mar", "Apr"],
        [10000, 22000, 18000, 30000],
        "Sales"
    );

    createBarChart(
        "reportsProfitChart",
        ["Revenue", "Expenses", "Profit"],
        [300000, 180000, 120000],
        "Financial"
    );
}

async function loadSettingsDashboard() {
    setContentIfEmpty(getSettingsDashboardHTML());
}

function setContentIfEmpty(html) {
    const container = document.getElementById("masterDashboardContent");

    if (!container) return;

    if (!container.innerHTML.trim()) {
        container.innerHTML = html;
    }
}

/* =========================================
   ORDERS DASHBOARD HTML
========================================= */

function getOrdersDashboardHTML() {
    return `
        <section class="kpi-grid">
            <div class="kpi-card">
                <span>🧾</span>
                <p>Total Orders</p>
                <h2 id="ordersTotalOrders">0</h2>
            </div>

            <div class="kpi-card">
                <span>🕒</span>
                <p>Processing</p>
                <h2 id="ordersProcessing">0</h2>
            </div>

            <div class="kpi-card">
                <span>🚚</span>
                <p>Delivered</p>
                <h2 id="ordersDelivered">0</h2>
            </div>

            <div class="kpi-card">
                <span>❌</span>
                <p>Cancelled</p>
                <h2 id="ordersCancelled">0</h2>
            </div>
        </section>

        <section class="dashboard-grid">
            <div class="panel">
                <h3>Order Status Analytics</h3>
                <div class="chart-box">
                    <canvas id="orderStatusChart"></canvas>
                </div>
            </div>

            <div class="panel">
                <h3>Sales Trend</h3>
                <div class="chart-box">
                    <canvas id="salesTrendChart"></canvas>
                </div>
            </div>

            <div class="panel large">
                <h3>Latest Orders</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody id="recentOrdersTable">
                        <tr>
                            <td colspan="4">No orders yet</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

/* =========================================
   INVENTORY DASHBOARD HTML
========================================= */

function getInventoryDashboardHTML() {
    return `
        <section class="kpi-grid">
            <div class="kpi-card">
                <span>📦</span>
                <p>Total Inventory</p>
                <h2 id="inventoryTotalProducts">0</h2>
            </div>

            <div class="kpi-card">
                <span>⚠️</span>
                <p>Low Stock</p>
                <h2 id="inventoryLowStock">0</h2>
            </div>

            <div class="kpi-card">
                <span>❌</span>
                <p>Out of Stock</p>
                <h2 id="inventoryOutStock">0</h2>
            </div>

            <div class="kpi-card">
                <span>🚚</span>
                <p>Incoming Deliveries</p>
                <h2 id="inventoryIncoming">0</h2>
            </div>
        </section>

        <section class="dashboard-grid">
            <div class="panel">
                <h3>Inventory Status</h3>
                <div class="chart-box">
                    <canvas id="inventoryStatusChart"></canvas>
                </div>
            </div>

            <div class="panel">
                <h3>Inventory Movement</h3>
                <div class="chart-box">
                    <canvas id="inventoryMovementChart"></canvas>
                </div>
            </div>

            <div class="panel">
                <h3>Low Stock Products</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Remaining</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody id="lowStockTable">
                        <tr>
                            <td colspan="3">No low stock products</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="panel">
                <h3>Inventory Alerts</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Alert</th>
                        </tr>
                    </thead>

                    <tbody id="inventoryAlertsTable">
                        <tr>
                            <td colspan="2">No inventory alerts</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

/* =========================================
   OTHER DASHBOARD HTML
========================================= */

function getDeliveriesDashboardHTML() {
    return `
        <section class="kpi-grid">
            <div class="kpi-card">
                <span>🚚</span>
                <p>Pending Deliveries</p>
                <h2>12</h2>
            </div>

            <div class="kpi-card">
                <span>📦</span>
                <p>Out For Delivery</p>
                <h2>7</h2>
            </div>

            <div class="kpi-card">
                <span>✅</span>
                <p>Delivered</p>
                <h2>154</h2>
            </div>
        </section>

        <section class="dashboard-grid">
            <div class="panel">
                <h3>Delivery Status</h3>
                <div class="chart-box">
                    <canvas id="deliveryStatusChart"></canvas>
                </div>
            </div>
        </section>
    `;
}

function getCustomersDashboardHTML() {
    return `
        <section class="kpi-grid">
            <div class="kpi-card">
                <span>👥</span>
                <p>Total Customers</p>
                <h2>320</h2>
            </div>

            <div class="kpi-card">
                <span>🛒</span>
                <p>Active Buyers</p>
                <h2>188</h2>
            </div>

            <div class="kpi-card">
                <span>💰</span>
                <p>Wholesale Accounts</p>
                <h2>42</h2>
            </div>
        </section>

        <section class="dashboard-grid">
            <div class="panel">
                <h3>Customer Types</h3>
                <div class="chart-box">
                    <canvas id="customerTypesChart"></canvas>
                </div>
            </div>
        </section>
    `;
}

function getSuppliersDashboardHTML() {
    return `
        <section class="kpi-grid">
            <div class="kpi-card">
                <span>🏪</span>
                <p>Total Suppliers</p>
                <h2>28</h2>
            </div>

            <div class="kpi-card">
                <span>📦</span>
                <p>Pending PO</p>
                <h2>9</h2>
            </div>

            <div class="kpi-card">
                <span>💳</span>
                <p>Supplier Payables</p>
                <h2>₱120,000</h2>
            </div>
        </section>

        <section class="dashboard-grid">
            <div class="panel">
                <h3>Supplier Payables</h3>
                <div class="chart-box">
                    <canvas id="payablesChart"></canvas>
                </div>
            </div>
        </section>
    `;
}

function getAgentsDashboardHTML() {
    return `
        <section class="kpi-grid">
            <div class="kpi-card">
                <span>🧑‍💼</span>
                <p>Total Agents</p>
                <h2>35</h2>
            </div>

            <div class="kpi-card">
                <span>💰</span>
                <p>Total Commission</p>
                <h2>₱48,000</h2>
            </div>

            <div class="kpi-card">
                <span>📈</span>
                <p>Top Agent Sales</p>
                <h2>₱320,000</h2>
            </div>
        </section>

        <section class="dashboard-grid">
            <div class="panel">
                <h3>Agent Sales</h3>
                <div class="chart-box">
                    <canvas id="agentSalesChart"></canvas>
                </div>
            </div>
        </section>
    `;
}

function getReportsDashboardHTML() {
    return `
        <section class="dashboard-grid">
            <div class="panel">
                <h3>Sales Reports</h3>
                <div class="chart-box">
                    <canvas id="reportsSalesChart"></canvas>
                </div>
            </div>

            <div class="panel">
                <h3>Profit Reports</h3>
                <div class="chart-box">
                    <canvas id="reportsProfitChart"></canvas>
                </div>
            </div>
        </section>
    `;
}

function getSettingsDashboardHTML() {
    return `
        <section class="dashboard-grid">
            <div class="panel large">
                <h3>System Settings</h3>

                <table>
                    <tbody>
                        <tr>
                            <th>Pricing Engine</th>
                            <td>ACTIVE</td>
                        </tr>

                        <tr>
                            <th>Auto Markup</th>
                            <td>ACTIVE</td>
                        </tr>

                        <tr>
                            <th>Wholesale Pricing</th>
                            <td>ACTIVE</td>
                        </tr>

                        <tr>
                            <th>Agent Pricing</th>
                            <td>ACTIVE</td>
                        </tr>

                        <tr>
                            <th>Commission Rules</th>
                            <td>ACTIVE</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

/* =========================================
   ORDERS KPI LOADER
========================================= */

async function loadOrdersKPIs() {
    const data = await fetchAnalyticsData("getOrderStatusAnalytics");
    const values = data.values || [0, 0, 0, 0];

    setText("ordersTotalOrders", values.reduce((a, b) => Number(a) + Number(b), 0));
    setText("ordersProcessing", values[1] || 0);
    setText("ordersDelivered", values[2] || 0);
    setText("ordersCancelled", values[3] || 0);
}

/* =========================================
   INVENTORY HELPERS
========================================= */

async function loadInventoryKPIs() {
    const data = await fetchAnalyticsData("getInventoryStatusAnalytics");
    const values = data.values || [0, 0, 0];

    setText("inventoryTotalProducts", values.reduce((a, b) => Number(a) + Number(b), 0));
    setText("inventoryLowStock", values[1] || 0);
    setText("inventoryOutStock", values[2] || 0);
    setText("inventoryIncoming", 12);
}

function createInventoryMovementChart() {
    createLineChart(
        "inventoryMovementChart",
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        [12, 18, 9, 22, 15, 28, 31],
        "Inventory Movement"
    );
}

async function loadLowStockTable() {
    const table = document.getElementById("lowStockTable");

    if (!table) return;

    table.innerHTML = `
        <tr>
            <td>Coffee</td>
            <td>3</td>
            <td>LOW STOCK</td>
        </tr>

        <tr>
            <td>Sugar</td>
            <td>1</td>
            <td>CRITICAL</td>
        </tr>
    `;
}

async function loadInventoryAlertsTable() {
    const table = document.getElementById("inventoryAlertsTable");

    if (!table) return;

    table.innerHTML = `
        <tr>
            <td>Coffee</td>
            <td>Reorder immediately</td>
        </tr>

        <tr>
            <td>Sugar</td>
            <td>Out of stock risk</td>
        </tr>
    `;
}

/* =========================================
   STATIC CHARTS
========================================= */

function createCustomerTypesChart() {
    createDoughnutChart(
        "customerTypesChart",
        ["Retail", "Wholesale", "Reseller"],
        [60, 25, 15]
    );
}

function createPayablesChart() {
    createBarChart(
        "payablesChart",
        ["Paid", "Unpaid", "Due"],
        [35000, 18000, 9000],
        "Amount"
    );
}

/* =========================================
   ANALYTICS FETCHER
========================================= */

async function fetchAnalyticsData(action) {
    if (typeof API_URL === "undefined") {
        return {
            success: false,
            labels: [],
            values: []
        };
    }

    try {
        const response = await fetch(API_URL + "?action=" + action);
        return await response.json();

    } catch (error) {
        console.error(error);

        return {
            success: false,
            labels: [],
            values: []
        };
    }
}

/* =========================================
   CHART STORAGE
========================================= */

const dashboardCharts = {};

function destroyExistingCharts() {
    Object.keys(dashboardCharts).forEach(key => {
        dashboardCharts[key].destroy();
        delete dashboardCharts[key];
    });
}

/* =========================================
   CHART BUILDERS
========================================= */

function createDoughnutChart(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId);

    if (!ctx || typeof Chart === "undefined") return;

    dashboardCharts[canvasId] = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "#d4af37",
                    "#ffffff",
                    "#2ecc71",
                    "#8bc34a",
                    "#c0392b"
                ],
                borderColor: "#062015",
                borderWidth: 2
            }]
        },
        options: chartOptionsNoScales()
    });
}

function createLineChart(canvasId, labels, data, label) {
    const ctx = document.getElementById(canvasId);

    if (!ctx || typeof Chart === "undefined") return;

    dashboardCharts[canvasId] = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: "#d4af37",
                backgroundColor: "rgba(212,175,55,0.15)",
                pointBackgroundColor: "#ffffff",
                pointBorderColor: "#d4af37",
                tension: 0.4,
                fill: true
            }]
        },
        options: chartOptionsWithScales()
    });
}

function createBarChart(canvasId, labels, data, label) {
    const ctx = document.getElementById(canvasId);

    if (!ctx || typeof Chart === "undefined") return;

    dashboardCharts[canvasId] = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: [
                    "#d4af37",
                    "#2ecc71",
                    "#ffffff",
                    "#8bc34a",
                    "#c0392b"
                ],
                borderColor: "#062015",
                borderWidth: 1
            }]
        },
        options: chartOptionsWithScales()
    });
}

/* =========================================
   CHART OPTIONS
========================================= */

function chartOptionsNoScales() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#ffffff"
                }
            }
        }
    };
}

function chartOptionsWithScales() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#ffffff"
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#ffffff"
                },
                grid: {
                    color: "rgba(255,255,255,0.08)"
                }
            },
            y: {
                ticks: {
                    color: "#ffffff"
                },
                grid: {
                    color: "rgba(255,255,255,0.08)"
                }
            }
        }
    };
}

/* =========================================
   HELPERS
========================================= */

function hasChartValues(values) {
    if (!Array.isArray(values)) return false;

    return values.some(value =>
        Number(value || 0) > 0
    );
}

function setText(id, value) {
    const el = document.getElementById(id);

    if (el) {
        el.textContent = value;
    }
}