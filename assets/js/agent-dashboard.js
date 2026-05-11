/* =========================================
   AGENT DASHBOARD SECURITY
========================================= */

const agentSession =
    JSON.parse(
        sessionStorage.getItem("mnUserSession")
    ) ||
    JSON.parse(
        localStorage.getItem("mnUserSession")
    ) ||
    JSON.parse(
        localStorage.getItem("mnAgentSession")
    );

if (!agentSession) {

    alert("Please login first.");

    window.location.href =
        "agent-login.html";

}

/* =========================================
   ROLE CHECK
========================================= */

const agentRole =
    agentSession.role ||
    agentSession.Role ||
    "";

if (
    agentRole !== "AGENT" &&
    agentRole !== "RESELLER"
) {

    alert(
        "Access denied."
    );

    window.location.href =
        "login.html";

}

/* =========================================
   ELEMENTS
========================================= */

const sidebarLinks =
    document.querySelectorAll(
        ".sidebar-menu a[data-page]"
    );

const dashboardMain =
    document.querySelector(
        ".dashboard-main"
    );

const logoutBtn =
    document.getElementById(
        "agentLogoutBtn"
    );

/* =========================================
   SIDEBAR ACTIVE
========================================= */

function setActiveSidebar(page) {

    sidebarLinks.forEach(link => {

        link.classList.remove(
            "active"
        );

        if (
            link.dataset.page === page
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}

/* =========================================
   LOAD DASHBOARD
========================================= */

function loadDashboard() {

    setActiveSidebar(
        "dashboard"
    );

    dashboardMain.innerHTML = `

        <section class="dashboard-section">

            <h1>
                Agent / Reseller Dashboard
            </h1>

            <p>
                Welcome to your reseller workspace.
            </p>

            <div class="dashboard-cards">

                <div class="dashboard-card">

                    <h3>
                        Total Sales
                    </h3>

                    <p id="agentTotalSales">
                        ₱0.00
                    </p>

                </div>

                <div class="dashboard-card">

                    <h3>
                        Commission Due
                    </h3>

                    <p id="agentCommission">
                        ₱0.00
                    </p>

                </div>

                <div class="dashboard-card">

                    <h3>
                        Assigned Deliveries
                    </h3>

                    <p id="agentDeliveries">
                        0
                    </p>

                </div>

                <div class="dashboard-card">

                    <h3>
                        Customers Assisted
                    </h3>

                    <p id="agentCustomers">
                        0
                    </p>

                </div>

            </div>

        </section>

    `;

}

/* =========================================
   LOAD SALES
========================================= */

function loadSales() {

    setActiveSidebar(
        "sales"
    );

    dashboardMain.innerHTML = `

        <section class="dashboard-section">

            <h1>
                My Sales
            </h1>

            <p>
                Agent sales transactions.
            </p>

        </section>

    `;

}

/* =========================================
   LOAD COMMISSIONS
========================================= */

function loadCommissions() {

    setActiveSidebar(
        "commissions"
    );

    dashboardMain.innerHTML = `

        <section class="dashboard-section">

            <h1>
                Commissions
            </h1>

            <p>
                Agent commission records.
            </p>

        </section>

    `;

}

/* =========================================
   LOAD DELIVERIES
========================================= */

function loadDeliveries() {

    setActiveSidebar(
        "deliveries"
    );

    dashboardMain.innerHTML = `

        <section class="dashboard-section">

            <h1>
                Assigned Deliveries
            </h1>

            <p>
                Delivery assignments.
            </p>

        </section>

    `;

}

/* =========================================
   LOAD CUSTOMERS
========================================= */

function loadCustomers() {

    setActiveSidebar(
        "customers"
    );

    dashboardMain.innerHTML = `

        <section class="dashboard-section">

            <h1>
                My Customers
            </h1>

            <p>
                Customers handled by this agent.
            </p>

        </section>

    `;

}

/* =========================================
   LOAD SETTINGS
========================================= */

function loadSettings() {

    setActiveSidebar(
        "settings"
    );

    dashboardMain.innerHTML = `

        <section class="dashboard-section">

            <h1>
                Account Settings
            </h1>

            <p>
                Manage your agent account.
            </p>

        </section>

    `;

}

/* =========================================
   SIDEBAR EVENTS
========================================= */

sidebarLinks.forEach(link => {

    link.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            const page =
                this.dataset.page;

            switch (page) {

                case "dashboard":

                    loadDashboard();

                    break;

                case "sales":

                    loadSales();

                    break;

                case "commissions":

                    loadCommissions();

                    break;

                case "deliveries":

                    loadDeliveries();

                    break;

                case "customers":

                    loadCustomers();

                    break;

                case "settings":

                    loadSettings();

                    break;

            }

        }
    );

});

/* =========================================
   LOGOUT
========================================= */

function logoutAgent() {

    sessionStorage.removeItem(
        "mnUserSession"
    );

    localStorage.removeItem(
        "mnUserSession"
    );

    localStorage.removeItem(
        "mnAgentSession"
    );

    window.location.href =
        "agent-login.html";

}

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            logoutAgent();

        }
    );

}

/* =========================================
   INITIAL LOAD
========================================= */

loadDashboard();