/* =========================================
   PERMISSION.JS
   BuildFrame Store OS Role Guard
========================================= */

function getSession_() {
    return JSON.parse(localStorage.getItem("mnSession"));
}

function getUser_() {
    return JSON.parse(localStorage.getItem("mnUser"));
}

/* =========================================
   DETECT LOGIN PAGE BY CURRENT DASHBOARD
========================================= */

function getLoginPageByRole_(role) {
    role = String(role || "").toUpperCase();

    if (role === "ADMIN") return "admin-login.html";
    if (role === "CUSTOMER") return "customer-login.html";
    if (role === "SUPPLIER") return "supplier-login.html";
    if (role === "AGENT") return "agent-login.html";
    if (role === "RESELLER") return "agent-login.html";

    return "dashboard-hub.html";
}

/* =========================================
   LOGOUT
========================================= */

function logout_() {
    const session = getSession_();
    const role = session ? session.Role : "";

    localStorage.removeItem("mnSession");
    localStorage.removeItem("mnUser");

    window.location.href = getLoginPageByRole_(role);
}

/* =========================================
   REQUIRE LOGIN
========================================= */

function requireLogin_(fallbackLoginPage = "admin-login.html") {
    const session = getSession_();

    if (!session) {
        window.location.href = fallbackLoginPage;
        return null;
    }

    return session;
}

/* =========================================
   REQUIRE ROLE
========================================= */

function requireRole_(allowedRoles, fallbackLoginPage = "admin-login.html") {
    const session = requireLogin_(fallbackLoginPage);

    if (!session) return;

    const role = String(session.Role || "").toUpperCase();
    const cleanAllowedRoles = allowedRoles.map(r => String(r).toUpperCase());

    if (!cleanAllowedRoles.includes(role)) {
        alert("You are not allowed to access this dashboard.");
        window.location.href = "dashboard-hub.html";
    }
}

/* =========================================
   DISPLAY LOGGED-IN USER
========================================= */

function displayLoggedInUser_() {
    const user = getUser_();
    const session = getSession_();

    const displayName =
        user?.FullName ||
        session?.FullName ||
        "User";

    const role =
        user?.Role ||
        session?.Role ||
        "";

    const nameTargets =
        document.querySelectorAll("[data-user-name]");

    const roleTargets =
        document.querySelectorAll("[data-user-role]");

    nameTargets.forEach(el => {
        el.textContent = displayName;
    });

    roleTargets.forEach(el => {
        el.textContent = role;
    });
}