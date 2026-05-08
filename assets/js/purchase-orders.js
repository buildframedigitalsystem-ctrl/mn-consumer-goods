async function initializePurchaseOrders() {
    const purchaseOrderForm = document.getElementById("purchaseOrderForm");
    if (!purchaseOrderForm) return;

    purchaseOrderForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            action: "addPurchaseOrder",
            supplierId: document.getElementById("supplierId").value,
            supplierName: document.getElementById("supplierName").value,
            orderDate: document.getElementById("orderDate").value,
            expectedDeliveryDate: document.getElementById("expectedDeliveryDate").value,
            totalAmount: document.getElementById("totalAmount").value,
            notes: document.getElementById("notes").value
        };

        try {
            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                alert("Purchase order saved.");
                purchaseOrderForm.reset();
                loadPurchaseOrders();
            } else {
                alert(data.message || "Purchase order save failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Server error.");
        }
    });

    loadPurchaseOrders();
}

async function loadPurchaseOrders() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({ action: "getPurchaseOrders" })
        });

        const data = await response.json();
        const rows = data.rows || data.data || [];

        const tbody = document.getElementById("purchaseOrdersTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        rows.forEach(po => {
            tbody.innerHTML += `
                <tr>
                    <td>${po.PurchaseOrderID || ""}</td>
                    <td>${po.SupplierName || ""}</td>
                    <td>${po.OrderDate || ""}</td>
                    <td>${po.ExpectedDeliveryDate || ""}</td>
                    <td>${po.TotalCost || ""}</td>
                    <td>${po.OrderStatus || ""}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}