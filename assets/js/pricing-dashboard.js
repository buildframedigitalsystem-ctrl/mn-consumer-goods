/* =========================================
   M&N PRICING DASHBOARD
   FILE: assets/js/pricing-dashboard.js
========================================= */

const PRICING_API_URL =
    "https://script.google.com/macros/s/AKfycbzbUww2SKIl6uqQvPqLtO6L35A0Xw5Ny0N5hjq16JOguAiLUAovKMdUagJ9SgK1fOSJ/exec";

/* =========================================
   LOAD PRICING RULES
========================================= */

async function loadPricingRules() {
    const box = document.getElementById("pricingRulesTable");
    box.innerHTML = "Loading pricing rules...";

    const data = await pricingGet_("getPricingRules");

    renderPricingTable_(box, data.data || []);
}

/* =========================================
   LOAD PRICE LEVELS
========================================= */

async function loadPriceLevels() {
    const box = document.getElementById("priceLevelsTable");
    box.innerHTML = "Loading price levels...";

    const data = await pricingGet_("getPriceLevels");

    renderPricingTable_(box, data.data || []);
}

/* =========================================
   LOAD AGENT PRICE LIST
========================================= */

async function loadAgentPriceList() {
    const box = document.getElementById("agentPriceListTable");
    box.innerHTML = "Loading agent price list...";

    const data = await pricingGet_("getAgentPriceList");

    renderPricingTable_(box, data.data || []);
}

/* =========================================
   LOAD COMMISSION RULES
========================================= */

async function loadCommissionRules() {
    const box = document.getElementById("commissionRulesTable");
    box.innerHTML = "Loading commission rules...";

    const data = await pricingGet_("getCommissionRules");

    renderPricingTable_(box, data.data || []);
}

/* =========================================
   LIVE PRICING PREVIEW
========================================= */

async function runPricingPreview() {
    const productId = document.getElementById("previewProductId").value.trim();
    const agentId = document.getElementById("previewAgentId").value.trim();
    const saleAmount = document.getElementById("previewSaleAmount").value;

    const resultBox = document.getElementById("pricingPreviewResult");

    resultBox.textContent = "Calculating pricing preview...";

    const url =
        `${PRICING_API_URL}?action=getFullPricingPreview` +
        `&productId=${encodeURIComponent(productId)}` +
        `&agentId=${encodeURIComponent(agentId)}` +
        `&saleAmount=${encodeURIComponent(saleAmount)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        resultBox.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        resultBox.textContent = "Pricing preview failed: " + error.message;
    }
}

/* =========================================
   GET HELPER
========================================= */

async function pricingGet_(action) {
    const url = `${PRICING_API_URL}?action=${encodeURIComponent(action)}`;

    const response = await fetch(url);
    return await response.json();
}

/* =========================================
   TABLE RENDERER
========================================= */

function renderPricingTable_(container, rows) {
    if (!rows || rows.length === 0) {
        container.innerHTML = `
      <div class="empty-state">
        No records found.
      </div>
    `;
        return;
    }

    const headers = Object.keys(rows[0]);

    let html = `
    <table class="admin-table pricing-table">
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
  `;

    rows.forEach(row => {
        html += `
      <tr>
        ${headers.map(header => `<td>${formatPricingValue_(row[header])}</td>`).join("")}
      </tr>
    `;
    });

    html += `
      </tbody>
    </table>
  `;

    container.innerHTML = html;
}

/* =========================================
   FORMAT VALUES
========================================= */

function formatPricingValue_(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

/* =========================================
   AUTO LOAD WHEN SECTION IS OPENED
========================================= */

function initializePricingDashboard() {
    if (!document.querySelector(".pricing-dashboard")) return;

    loadPricingRules();
    loadPriceLevels();
    loadAgentPriceList();
    loadCommissionRules();
}