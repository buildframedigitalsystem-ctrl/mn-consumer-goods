document.addEventListener("DOMContentLoaded", () => {
    initializeProductReceiving();
});

function initializeProductReceiving() {
    const form = document.getElementById("productReceivingForm");
    if (!form) return;

    setReceivingDefaultDate_();
    bindReceivingCalculations_();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        saveProductReceiving_();
    });
}

function setReceivingDefaultDate_() {
    const receivedDate = document.getElementById("receivedDate");
    if (receivedDate && !receivedDate.value) {
        receivedDate.value = new Date().toISOString().split("T")[0];
    }
}

function bindReceivingCalculations_() {
    const qty = document.getElementById("quantityReceived");
    const cost = document.getElementById("unitCost");

    if (qty) qty.addEventListener("input", updateReceivingTotal_);
    if (cost) cost.addEventListener("input", updateReceivingTotal_);
}

function updateReceivingTotal_() {
    const qty = Number(getValue_("quantityReceived") || 0);
    const cost = Number(getValue_("unitCost") || 0);
    const total = qty * cost;

    const totalCost = document.getElementById("totalCost");
    if (totalCost) totalCost.value = total.toFixed(2);
}

async function saveProductReceiving_() {
    updateReceivingTotal_();

    const payload = {
        action: "addProductReceiving",

        purchaseOrderId: getValue_("purchaseOrderID"),
        supplierId: getValue_("supplierID"),
        supplierName: getValue_("supplierName"),

        productId: getValue_("productID"),
        productName: getValue_("productName"),

        quantityOrdered: Number(getValue_("quantityOrdered") || 0),
        quantityReceived: Number(getValue_("quantityReceived") || 0),
        unitCost: Number(getValue_("unitCost") || 0),
        totalCost: Number(getValue_("totalCost") || 0),

        receivedDate: getValue_("receivedDate"),
        receivedBy: getValue_("receivedBy"),
        receivingStatus: getValue_("receivingStatus"),
        notes: getValue_("notes")
    };

    if (!payload.supplierName) {
        alert("Please enter supplier name.");
        return;
    }

    if (!payload.productId || !payload.productName) {
        alert("Please enter product ID and product name.");
        return;
    }

    if (payload.quantityReceived <= 0) {
        alert("Quantity received must be greater than zero.");
        return;
    }

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            alert("Received stocks saved. Inventory updated automatically.");

            document.getElementById("productReceivingForm").reset();
            setReceivingDefaultDate_();
            updateReceivingTotal_();

        } else {
            alert(data.message || "Failed to save received stocks.");
        }

    } catch (error) {
        console.error(error);
        alert("Server error while saving received stocks.");
    }
}

function getValue_(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}

window.initializeProductReceiving = initializeProductReceiving;