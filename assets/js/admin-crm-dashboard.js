document.addEventListener("DOMContentLoaded", () => {
    loadAdminCRM();
});

async function loadAdminCRM() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getAdminCRM"
            })
        });

        const result = await response.json();

        if (!result.success) {
            alert(result.message || "Failed to load Admin CRM.");
            return;
        }

        renderAdminResellers(result.resellers || []);
        renderAdminQuotations(result.quotations || []);
        renderAdminDeliveries(result.deliveries || []);

    } catch (error) {
        console.error(error);
        alert("Connection error while loading Admin CRM.");
    }
}

function renderAdminResellers(rows) {
    const table = document.getElementById("adminResellerTable");
    if (!table) return;

    if (!rows.length) {
        table.innerHTML = `<tr><td colspan="5">No reseller applications yet.</td></tr>`;
        return;
    }

    table.innerHTML = rows.map(row => `
        <tr>
            <td>${escapeHTML(row.FullName || "-")}</td>
            <td>${escapeHTML(row.BusinessName || "-")}</td>
            <td>${escapeHTML(row.Mobile || "-")}</td>
            <td>${escapeHTML(row.Status || "-")}</td>
            <td>
                <button class="mini-action-btn" onclick="updateResellerStatus('${escapeHTML(row.ApplicationID)}', 'APPROVED')">
                    Approve
                </button>
                <button class="mini-danger-btn" onclick="updateResellerStatus('${escapeHTML(row.ApplicationID)}', 'REJECTED')">
                    Reject
                </button>
            </td>
        </tr>
    `).join("");
}

function renderAdminQuotations(rows) {
    const table = document.getElementById("adminQuotationTable");
    if (!table) return;

    if (!rows.length) {
        table.innerHTML = `<tr><td colspan="5">No quotation requests yet.</td></tr>`;
        return;
    }

    table.innerHTML = rows.map(row => `
        <tr>
            <td>${escapeHTML(row.CustomerName || "-")}</td>
            <td>${escapeHTML(row.RequestedProducts || "-")}</td>
            <td>${escapeHTML(row.DeliveryArea || "-")}</td>
            <td>${escapeHTML(row.QuotationStatus || "-")}</td>
            <td>
                <button class="mini-action-btn" onclick="updateQuotationStatus('${escapeHTML(row.QuotationID)}', 'PREPARING')">
                    Preparing
                </button>
                <button class="mini-action-btn" onclick="updateQuotationStatus('${escapeHTML(row.QuotationID)}', 'SENT')">
                    Sent
                </button>
                <button class="mini-danger-btn" onclick="updateQuotationStatus('${escapeHTML(row.QuotationID)}', 'CANCELLED')">
                    Cancel
                </button>
            </td>
        </tr>
    `).join("");
}

function renderAdminDeliveries(rows) {
    const table = document.getElementById("adminDeliveryTable");
    if (!table) return;

    if (!rows.length) {
        table.innerHTML = `<tr><td colspan="5">No delivery bookings yet.</td></tr>`;
        return;
    }

    table.innerHTML = rows.map(row => `
        <tr>
            <td>${escapeHTML(row.CustomerName || "-")}</td>
            <td>${escapeHTML(row.DeliveryArea || "-")}</td>
            <td>${escapeHTML(row.PreferredDate || "-")}</td>
            <td>${escapeHTML(row.DeliveryStatus || "-")}</td>
            <td>
                <button class="mini-action-btn" onclick="updateDeliveryStatus('${escapeHTML(row.BookingID)}', 'SCHEDULED')">
                    Scheduled
                </button>
                <button class="mini-action-btn" onclick="updateDeliveryStatus('${escapeHTML(row.BookingID)}', 'OUT FOR DELIVERY')">
                    Out
                </button>
                <button class="mini-action-btn" onclick="updateDeliveryStatus('${escapeHTML(row.BookingID)}', 'DELIVERED')">
                    Delivered
                </button>
            </td>
        </tr>
    `).join("");
}

async function updateResellerStatus(applicationId, status) {
    await updateAdminCRMStatus({
        action: "updateResellerApplicationStatus",
        applicationId,
        status
    });
}

async function updateQuotationStatus(quotationId, status) {
    await updateAdminCRMStatus({
        action: "updateQuotationStatus",
        quotationId,
        status
    });
}

async function updateDeliveryStatus(bookingId, status) {
    await updateAdminCRMStatus({
        action: "updateDeliveryStatus",
        bookingId,
        status
    });
}

async function updateAdminCRMStatus(payload) {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            alert("Status updated.");
            loadAdminCRM();
        } else {
            alert(result.message || "Update failed.");
        }

    } catch (error) {
        console.error(error);
        alert("Connection error while updating status.");
    }
}

function escapeHTML(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}