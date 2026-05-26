/* =========================================
   PURCHASE ORDERS MODULE
========================================= */

let poItems = [];
let loadedPurchaseOrders = [];

document.addEventListener("DOMContentLoaded", () => {
    initializePurchaseOrders();
});

/* =========================================
   INITIALIZE
========================================= */

function initializePurchaseOrders() {

    const form =
        document.getElementById("purchaseOrderForm");

    if (!form) return;

    setDefaultDate_();

    addPOItemRow();

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        savePurchaseOrder();

    });

    loadPurchaseOrders();

}

/* =========================================
   DEFAULT DATE
========================================= */

function setDefaultDate_() {

    const orderDate =
        document.getElementById("orderDate");

    if (orderDate && !orderDate.value) {

        orderDate.value =
            new Date()
            .toISOString()
            .split("T")[0];

    }

}

/* =========================================
   ITEM ROWS
========================================= */

function addPOItemRow() {

    poItems.push({
        productName: "",
        quantity: 1,
        unitPrice: 0,
        subtotal: 0
    });

    renderPOItemRows();

}

function removePOItemRow(index) {

    poItems.splice(index, 1);

    renderPOItemRows();

}

function updatePOItem(index, field, value) {

    poItems[index][field] = value;

    const qty =
        Number(poItems[index].quantity || 0);

    const price =
        Number(poItems[index].unitPrice || 0);

    poItems[index].subtotal =
        qty * price;

    renderPOItemRows();

}

function renderPOItemRows() {

    const tbody =
        document.getElementById("poItemsBody");

    if (!tbody) return;

    if (!poItems.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No items added yet.
                </td>
            </tr>
        `;

        return;

    }

    tbody.innerHTML = "";

    poItems.forEach((item, index) => {

        tbody.innerHTML += `
            <tr>

                <td>
                    <input
                        type="text"
                        value="${item.productName || ""}"
                        placeholder="Product / Item name"
                        onchange="updatePOItem(${index}, 'productName', this.value)">
                </td>

                <td>
                    <input
                        type="number"
                        value="${item.quantity || 1}"
                        min="1"
                        onchange="updatePOItem(${index}, 'quantity', this.value)">
                </td>

                <td>
                    <input
                        type="number"
                        value="${item.unitPrice || 0}"
                        min="0"
                        step="0.01"
                        onchange="updatePOItem(${index}, 'unitPrice', this.value)">
                </td>

                <td>
                    ₱${Number(item.subtotal || 0).toLocaleString()}
                </td>

                <td>
                    <button
                        type="button"
                        class="danger-btn"
                        onclick="removePOItemRow(${index})">

                        Remove

                    </button>
                </td>

            </tr>
        `;

    });

}

/* =========================================
   SAVE PURCHASE ORDER
========================================= */

async function savePurchaseOrder() {

    const cleanedItems = poItems
        .filter(item =>
            String(item.productName || "").trim()
        )
        .map(item => ({
            ProductName: item.productName,
            Quantity: Number(item.quantity || 0),
            UnitPrice: Number(item.unitPrice || 0),
            Subtotal: Number(item.subtotal || 0)
        }));

    if (!cleanedItems.length) {

        alert("Please add at least one product/item.");

        return;

    }

    const totalAmount =
        cleanedItems.reduce((sum, item) => {

            return sum +
                Number(item.Subtotal || 0);

        }, 0);

    const payload = {

        action: "addPurchaseOrder",

        supplierName:
            getValue_("supplierName"),

        supplierContactPerson:
            getValue_("supplierContactPerson"),

        supplierContactNumber:
            getValue_("supplierContactNumber"),

        supplierEmail:
            getValue_("supplierEmail"),

        supplierAddress:
            getValue_("supplierAddress"),

        orderDate:
            getValue_("orderDate"),

        expectedDeliveryDate:
            getValue_("expectedDeliveryDate"),

        orderStatus:
            getValue_("poStatus"),

        preparedBy:
            getValue_("preparedBy"),

        supplierMessage:
            getValue_("supplierMessage"),

        notes:
            getValue_("notes"),

        totalAmount:
            totalAmount,

        items:
            cleanedItems

    };

    if (!payload.supplierName) {

        alert("Please enter supplier name.");

        return;

    }

    try {

        const response =
            await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify(payload)

            });

        const data =
            await response.json();

        if (data.success) {

            alert("Purchase order saved successfully.");

            document
                .getElementById("purchaseOrderForm")
                .reset();

            poItems = [];

            addPOItemRow();

            setDefaultDate_();

            loadPurchaseOrders();

        } else {

            alert(
                data.message ||
                "Purchase order save failed."
            );

        }

    } catch (error) {

        console.error(error);

        alert("Server error.");

    }

}

/* =========================================
   LOAD PURCHASE ORDERS
========================================= */

async function loadPurchaseOrders() {

    const tbody =
        document.getElementById(
            "purchaseOrdersTableBody"
        );

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="7">
                Loading purchase orders...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify({
                    action: "getPurchaseOrders"
                })

            });

        const data =
            await response.json();

        loadedPurchaseOrders =
            data.rows ||
            data.data ||
            data.purchaseOrders ||
            [];

        if (!loadedPurchaseOrders.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No purchase orders found.
                    </td>
                </tr>
            `;

            return;

        }

        tbody.innerHTML = "";

        loadedPurchaseOrders.forEach((po, index) => {

            tbody.innerHTML += `
                <tr>

                    <td>
                        <strong>
                            ${po.PurchaseOrderID || po.POID || "-"}
                        </strong>
                    </td>

                    <td>
                        ${po.SupplierName || "-"}
                    </td>

                    <td>
                        ${po.OrderDate || "-"}
                    </td>

                    <td>
                        ${po.ExpectedDeliveryDate || "-"}
                    </td>

                    <td>
                        ₱${Number(po.TotalAmount || 0).toLocaleString()}
                    </td>

                    <td>
                        <span class="status-pill active">
                            ${po.OrderStatus || "PENDING"}
                        </span>
                    </td>

                    <td>

                        <button
                            type="button"
                            class="save-btn"
                            onclick="openPOModal(${index})">

                            View P.O

                        </button>

                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    Failed to load purchase orders.
                </td>
            </tr>
        `;

    }

}

/* =========================================
   OPEN PO MODAL
========================================= */

function openPOModal(index) {

    const po =
        loadedPurchaseOrders[index];

    if (!po) {

        alert("Purchase order not found.");

        return;

    }

    setText_(
        "poIdText",
        po.PurchaseOrderID || po.POID || "-"
    );

    setText_(
        "poSupplierText",
        po.SupplierName || "-"
    );

    setText_(
        "poContactPersonText",
        po.SupplierContactPerson ||
        po.ContactPerson ||
        "-"
    );

    setText_(
        "poContactNumberText",
        po.SupplierContactNumber ||
        po.ContactNumber ||
        "-"
    );

    setText_(
        "poSupplierEmailText",
        po.SupplierEmail ||
        po.Email ||
        "-"
    );

    setText_(
        "poDateText",
        po.OrderDate || "-"
    );

    setText_(
        "poExpectedDateText",
        po.ExpectedDeliveryDate || "-"
    );

    setText_(
        "poMessageText",
        po.SupplierMessage ||
        "Dear Supplier..."
    );

    setText_(
        "poNotesText",
        po.Notes || "-"
    );

    setText_(
        "poPreparedByText",
        po.PreparedBy ||
        "Admin Signature"
    );

    const items =
        parseItems_(
            po.Items ||
            po.POItems ||
            []
        );

    renderPOModalItems_(items);

    const total =
        Number(
            po.TotalAmount || 0
        );

    setText_(
        "poTotalText",
        "₱" + total.toLocaleString()
    );

    const modal =
        document.getElementById("poModal");

    if (modal) {

        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";

    }

}

/* =========================================
   CLOSE MODAL
========================================= */

function closePOModal() {

    const modal =
        document.getElementById("poModal");

    if (modal) {

        modal.style.display = "none";

    }

}

/* =========================================
   MODAL ITEMS
========================================= */

function renderPOModalItems_(items) {

    const tbody =
        document.getElementById(
            "poModalItemsBody"
        );

    if (!tbody) return;

    if (!items.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    No items found.
                </td>
            </tr>
        `;

        return;

    }

    tbody.innerHTML = "";

    items.forEach(item => {

        const qty =
            Number(
                item.Quantity ||
                item.quantity ||
                0
            );

        const price =
            Number(
                item.UnitPrice ||
                item.unitPrice ||
                0
            );

        const subtotal =
            Number(
                item.Subtotal ||
                item.subtotal ||
                qty * price
            );

        tbody.innerHTML += `
            <tr>

                <td>
                    ${item.ProductName || item.productName || "-"}
                </td>

                <td>
                    ${qty}
                </td>

                <td>
                    ₱${price.toLocaleString()}
                </td>

                <td>
                    ₱${subtotal.toLocaleString()}
                </td>

            </tr>
        `;

    });

}

/* =========================================
   PREPARE EMAIL
========================================= */

function preparePOEmail() {

    const supplierEmail =
        document.getElementById(
            "poSupplierEmailText"
        ).innerText;

    if (
        !supplierEmail ||
        supplierEmail === "-"
    ) {

        alert("Supplier email is missing.");

        return;

    }

    const subject =
        encodeURIComponent(
            "Purchase Order from M&N Consumer Goods"
        );

    const body =
        encodeURIComponent(
`Dear Supplier,

Please see the attached / printed purchase order from M&N Consumer Goods.

Thank you.

M&N Consumer Goods`
        );

    window.location.href =
        `mailto:${supplierEmail}?subject=${subject}&body=${body}`;

}

/* =========================================
   HELPERS
========================================= */

function parseItems_(items) {

    if (Array.isArray(items)) {
        return items;
    }

    if (
        typeof items === "string" &&
        items.trim()
    ) {

        try {

            return JSON.parse(items);

        } catch (error) {

            console.warn(
                "Could not parse PO items:",
                items
            );

        }

    }

    return [];

}

function getValue_(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}

function setText_(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.innerText =
            value || "-";

    }

}

/* =========================================
   GLOBALS
========================================= */

window.addPOItemRow =
    addPOItemRow;

window.removePOItemRow =
    removePOItemRow;

window.updatePOItem =
    updatePOItem;

window.openPOModal =
    openPOModal;

window.closePOModal =
    closePOModal;

window.preparePOEmail =
    preparePOEmail;