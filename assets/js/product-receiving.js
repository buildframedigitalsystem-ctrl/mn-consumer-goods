/* =========================================
   M&N PRODUCT RECEIVING
   Admin Inventory Stock-In Engine
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeProductReceiving();
});

async function initializeProductReceiving() {
    const form = document.getElementById("productReceivingForm");

    if (!form) return;

    setTodayDate_();
    bindReceivingCalculator_();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const quantityReceived =
            Number(document.getElementById("quantityReceived").value || 0);

        const unitCost =
            Number(document.getElementById("unitCost").value || 0);

        const payload = {
            action: "addProductReceiving",

            purchaseOrderId:
                document.getElementById("purchaseOrderID").value.trim(),

            supplierId:
                document.getElementById("supplierID").value.trim(),

            supplierName:
                document.getElementById("supplierName").value.trim(),

            productId:
                document.getElementById("productID").value.trim(),

            productName:
                document.getElementById("productName").value.trim(),

            quantityOrdered:
                Number(document.getElementById("quantityOrdered").value || 0),

            quantityReceived,

            unitCost,

            totalCost:
                quantityReceived * unitCost,

            receivedDate:
                document.getElementById("receivedDate").value,

            receivedBy:
                document.getElementById("receivedBy").value.trim(),

            receivingStatus:
                document.getElementById("receivingStatus").value,

            notes:
                document.getElementById("notes").value.trim()
        };

        if (!payload.productId || !payload.productName || !payload.quantityReceived) {
            alert("Please complete Product ID, Product Name, and Quantity Received.");
            return;
        }

        try {
            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                alert("Stocks received and inventory updated.");

                form.reset();
                setTodayDate_();

                loadReceivingRecords();
            } else {
                alert(data.message || "Receiving failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Server error.");
        }
    });

    loadReceivingRecords();
}

function bindReceivingCalculator_() {
    const quantityInput = document.getElementById("quantityReceived");
    const unitCostInput = document.getElementById("unitCost");
    const totalCostInput = document.getElementById("totalCost");

    if (!quantityInput || !unitCostInput || !totalCostInput) return;

    const calculateTotal = () => {
        const quantity = Number(quantityInput.value || 0);
        const unitCost = Number(unitCostInput.value || 0);

        totalCostInput.value = (quantity * unitCost).toFixed(2);
    };

    quantityInput.addEventListener("input", calculateTotal);
    unitCostInput.addEventListener("input", calculateTotal);
}

function setTodayDate_() {
    const receivedDate = document.getElementById("receivedDate");

    if (!receivedDate) return;

    if (!receivedDate.value) {
        receivedDate.value = new Date().toISOString().slice(0, 10);
    }
}

async function loadReceivingRecords() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getProductReceiving"
            })
        });

        const data = await response.json();
        const rows = data.rows || [];

        const tbody =
            document.getElementById("receivingTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        rows.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${escapeHTML_(item.ReceivingID || "")}</td>
                    <td>${escapeHTML_(item.PurchaseOrderID || "")}</td>
                    <td>${escapeHTML_(item.SupplierName || "")}</td>
                    <td>${escapeHTML_(item.ProductName || "")}</td>
                    <td>${escapeHTML_(item.QuantityReceived || "")}</td>
                    <td>${escapeHTML_(item.UnitCost || "")}</td>
                    <td>${escapeHTML_(item.TotalCost || "")}</td>
                    <td>${escapeHTML_(item.ReceivedDate || "")}</td>
                    <td>${escapeHTML_(item.ReceivingStatus || "")}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

function escapeHTML_(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}