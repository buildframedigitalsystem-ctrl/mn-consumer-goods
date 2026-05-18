/* =========================================
   M&N ADMIN SYSTEM HEALTH
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeSystemHealth();
});

function initializeSystemHealth() {
    setStatus("adminAppStatus", "Online", "good");
    setStatus("storeAppStatus", "Separated", "good");

    const runBtn = document.getElementById("runSystemCheckBtn");

    if (runBtn) {
        runBtn.addEventListener("click", runSystemCheck);
    }

    runSystemCheck();
}

async function runSystemCheck() {
    setStatus("backendStatus", "Checking...", "pending");
    setStatus("sheetStatus", "Checking...", "pending");

    const tableBody = document.getElementById("systemHealthTableBody");

    try {
        if (!window.API || !API.BASE_URL) {
            throw new Error("API.BASE_URL is missing.");
        }

        const response = await fetch(`${API.BASE_URL}?action=systemHealth`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "System health check failed.");
        }

        setStatus("backendStatus", "Online", "good");
        setStatus("sheetStatus", "Connected", "good");

        if (tableBody) {
            tableBody.innerHTML = buildHealthRows(data);
        }

    } catch (error) {
        console.error(error);

        setStatus("backendStatus", "Needs Check", "bad");
        setStatus("sheetStatus", "Needs Check", "bad");

        if (tableBody) {
            tableBody.innerHTML += `
                <tr>
                    <td>Live Backend Check</td>
                    <td>Apps Script</td>
                    <td>Needs Check</td>
                    <td>${error.message}</td>
                </tr>
            `;
        }
    }
}

function buildHealthRows(data) {
    const checks = data.checks || [];

    if (!checks.length) {
        return `
            <tr>
                <td>Backend WebApp</td>
                <td>Apps Script</td>
                <td>Online</td>
                <td>Backend responded successfully.</td>
            </tr>
        `;
    }

    return checks.map(check => `
        <tr>
            <td>${check.name || "-"}</td>
            <td>${check.module || "-"}</td>
            <td>${check.status || "-"}</td>
            <td>${check.notes || "-"}</td>
        </tr>
    `).join("");
}

function setStatus(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = text;
    el.className = "";

    if (type) {
        el.classList.add(`status-${type}`);
    }
}