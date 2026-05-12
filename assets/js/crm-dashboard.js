document.addEventListener("DOMContentLoaded", () => {
    loadCRMDashboard();
});

async function loadCRMDashboard() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getCRMDashboard"
            })
        });

        const result = await response.json();

        if (!result.success) {
            console.error(result.message);
            return;
        }

        const data = result.data || {};

        setText("totalLeads", data.totalLeads || 0);
        setText("pendingQuotations", data.pendingQuotations || 0);
        setText("resellerApplications", data.resellerApplications || 0);
        setText("deliveryBookings", data.deliveryBookings || 0);

        renderResellerApplications(data.recentResellers || []);
        renderQuotationRequests(data.recentQuotations || []);
        renderDeliveryBookings(data.recentDeliveries || []);

    } catch (error) {
        console.error(error);
    }
}

function renderResellerApplications(rows) {
    const table = document.getElementById("resellerApplicationsTable");
    if (!table) return;

    if (!rows.length) {
        table.innerHTML = `<tr><td colspan="4">No reseller applications yet.</td></tr>`;
        return;
    }

    table.innerHTML = rows.map(row => `
        <tr>
            <td>${escapeHTML(row.FullName || "-")}</td>
            <td>${escapeHTML(row.BusinessName || "-")}</td>
            <td>${escapeHTML(row.Mobile || "-")}</td>
            <td>${escapeHTML(row.Status || "-")}</td>
        </tr>
    `).join("");
}

function renderQuotationRequests(rows) {
    const table = document.getElementById("quotationRequestsTable");
    if (!table) return;

    if (!rows.length) {
        table.innerHTML = `<tr><td colspan="4">No quotation requests yet.</td></tr>`;
        return;
    }

    table.innerHTML = rows.map(row => `
        <tr>
            <td>${escapeHTML(row.CustomerName || "-")}</td>
            <td>${escapeHTML(row.RequestedProducts || "-")}</td>
            <td>${escapeHTML(row.DeliveryArea || "-")}</td>
            <td>${escapeHTML(row.QuotationStatus || "-")}</td>
        </tr>
    `).join("");
}

function renderDeliveryBookings(rows) {
    const table = document.getElementById("deliveryBookingsTable");
    if (!table) return;

    if (!rows.length) {
        table.innerHTML = `<tr><td colspan="4">No delivery bookings yet.</td></tr>`;
        return;
    }

    table.innerHTML = rows.map(row => `
        <tr>
            <td>${escapeHTML(row.CustomerName || "-")}</td>
            <td>${escapeHTML(row.DeliveryArea || "-")}</td>
            <td>${escapeHTML(row.PreferredDate || "-")}</td>
            <td>${escapeHTML(row.DeliveryStatus || "-")}</td>
        </tr>
    `).join("");
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function escapeHTML(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}