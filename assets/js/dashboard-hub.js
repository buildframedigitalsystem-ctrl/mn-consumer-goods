const session = JSON.parse(
    localStorage.getItem("mnSession")
);

if (!session) {
    window.location.href = "admin-login.html";
}

const role = String(session?.Role || "").toUpperCase();

if (role === "ADMIN") {
    window.location.href = "admin-dashboard.html";
}

if (role === "CUSTOMER") {
    window.location.href = "customer-dashboard.html";
}

if (role === "SUPPLIER") {
    window.location.href = "supplier-dashboard.html";
}

if (role === "AGENT" || role === "RESELLER") {
    window.location.href = "agent-dashboard.html";
}