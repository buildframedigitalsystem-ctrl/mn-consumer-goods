/* =========================================
   M&N ORDERS MODULE
========================================= */

let cartItems = [];
let loadedOrders = [];

let signatureCanvas;
let signatureCtx;
let isDrawing = false;

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeOrders();
});

/* =========================================
   MAIN INIT
========================================= */

function initializeOrders() {
    initializeSignaturePad();
    initializeAddToCart();
    initializeOrderSubmit();
    loadProducts();
    loadOrders();
}

/* =========================================
   LOAD PRODUCTS
========================================= */

async function loadProducts() {
    const productSelect = document.getElementById("productSelect");

    if (!productSelect) return;

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getProducts"
            })
        });

        const data = await response.json();

        const products =
            data.products ||
            data.rows ||
            [];

        productSelect.innerHTML = `
            <option value="">Select product</option>
        `;

        products.forEach(product => {
            const option = document.createElement("option");

            option.value = JSON.stringify(product);

            const price = Number(
                product.WholesalePrice || 0
            );

            option.textContent =
           `${product.ProductName} - ₱${formatMoney_(price)}`;

            productSelect.appendChild(option);
        });

    } catch (error) {
        console.error("LOAD PRODUCTS ERROR:", error);
    }
}

/* =========================================
   ADD TO CART
========================================= */

function initializeAddToCart() {
    const addBtn = document.getElementById("addToCartBtn");

    if (!addBtn) return;

    addBtn.addEventListener("click", () => {
        const productRaw = document.getElementById("productSelect").value;
        const qty = Number(document.getElementById("productQuantity").value);

        if (!productRaw) {
            alert("Please select product.");
            return;
        }

        if (!qty || qty <= 0) {
            alert("Please enter quantity.");
            return;
        }

        const product = JSON.parse(productRaw);

        const item = {
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            Qty: qty,
            Price: Number(product.WholesalePrice || 0),
            Total: Number(product.WholesalePrice || 0) * qty
        };

        cartItems.push(item);

        renderCartItems();
        computeTotalAmount();
    });
}

/* =========================================
   RENDER CART
========================================= */

function renderCartItems() {
    const tbody = document.getElementById("cartTableBody");

    if (!tbody) return;

    if (cartItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No products added.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = "";

    cartItems.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.ProductName}</td>
                <td>${item.Qty}</td>
                <td>₱${item.Price.toLocaleString()}</td>
                <td>₱${item.Total.toLocaleString()}</td>
                <td>
                    <button
                        type="button"
                        onclick="removeCartItem(${index})"
                        style="
                            background:#dc2626;
                            color:white;
                            border:none;
                            padding:8px 12px;
                            border-radius:10px;
                            cursor:pointer;
                            font-weight:700;
                        "
                    >
                        Remove
                    </button>
                </td>
            </tr>
        `;
    });
}

/* =========================================
   REMOVE CART ITEM
========================================= */

function removeCartItem(index) {
    cartItems.splice(index, 1);

    renderCartItems();
    computeTotalAmount();
}

window.removeCartItem = removeCartItem;

/* =========================================
   TOTAL
========================================= */

function computeTotalAmount() {
    const total = cartItems.reduce((sum, item) => {
        return sum + item.Total;
    }, 0);

    const totalInput = document.getElementById("totalAmount");

    if (totalInput) {
        totalInput.value = total;
    }
}

/* =========================================
   SIGNATURE PAD
========================================= */

function initializeSignaturePad() {
    signatureCanvas = document.getElementById("signatureCanvas");

    if (!signatureCanvas) return;

    signatureCtx = signatureCanvas.getContext("2d");

    signatureCtx.strokeStyle = "#0f172a";
    signatureCtx.lineWidth = 2;

    signatureCanvas.addEventListener("mousedown", startDrawing);
    signatureCanvas.addEventListener("mousemove", draw);
    signatureCanvas.addEventListener("mouseup", stopDrawing);
    signatureCanvas.addEventListener("mouseleave", stopDrawing);

    const clearBtn = document.getElementById("clearSignatureBtn");

    if (clearBtn) {
        clearBtn.addEventListener("click", clearSignature);
    }
}

function startDrawing(e) {
    isDrawing = true;

    signatureCtx.beginPath();
    signatureCtx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (!isDrawing) return;

    signatureCtx.lineTo(e.offsetX, e.offsetY);
    signatureCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearSignature() {
    if (!signatureCtx || !signatureCanvas) return;

    signatureCtx.clearRect(
        0,
        0,
        signatureCanvas.width,
        signatureCanvas.height
    );
}

/* =========================================
   SUBMIT ORDER
========================================= */

function initializeOrderSubmit() {
    const form = document.getElementById("orderForm");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        saveOrderLive();
    });
}

/* =========================================
   SAVE ORDER
========================================= */

async function saveOrderLive() {
    const user = JSON.parse(localStorage.getItem("mnUser") || "{}");

    const storeId =
        user.CustomerID ||
        user.StoreID ||
        user.customerId ||
        "";

    const storeName =
        user.StoreName ||
        user.CustomerName ||
        user.storeName ||
        "M&N Partner Store";

    if (!storeId) {
        alert("Store session not found. Please log in again.");
        window.location.href = "login.html";
        return;
    }

    const payload = {
        action: "submitStoreOrder",

        storeId: storeId,
        customerId: storeId,

        storeName: storeName,
        customerName:
            document.getElementById("customerName").value ||
            storeName,

        contactNumber:
            document.getElementById("contactNumber").value ||
            user.ContactNumber ||
            "",

        orderType: document.getElementById("orderType").value,
        paymentStatus: document.getElementById("paymentStatus").value,
        orderNotes: document.getElementById("orderNotes").value,

        orderStatus: "NEW",
        deliveryStatus: "PENDING",

        totalAmount: Number(
            document.getElementById("totalAmount").value || 0
        ),

        signatureImage: signatureCanvas
            ? signatureCanvas.toDataURL("image/png")
            : "",

        items: cartItems
    };

    const response = await fetch(API.BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("SAVE ORDER:", data);

    if (data.success) {
        alert("Order submitted successfully.");
        resetOrderForm();
        loadOrders();
    } else {
        alert(data.message || "Order failed.");
    }
}

/* =========================================
   RESET FORM
========================================= */

function resetOrderForm() {
    const form = document.getElementById("orderForm");

    if (form) {
        form.reset();
    }

    cartItems = [];

    renderCartItems();
    computeTotalAmount();
    clearSignature();
}

/* =========================================
   LOAD ORDERS
========================================= */

async function loadOrders() {
    const tbody = document.getElementById("ordersTableBody");

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="7">Loading orders...</td>
        </tr>
    `;

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getOrders"
            })
        });

        const data = await response.json();

        console.log("LIVE ORDERS:", data);

        loadedOrders = data.orders || data.rows || [];

        renderOrders();

    } catch (error) {
        console.error("LOAD ORDERS ERROR:", error);

        tbody.innerHTML = `
            <tr>
                <td colspan="7">Failed to load orders.</td>
            </tr>
        `;
    }
}

/* =========================================
   RENDER ORDERS
========================================= */
function renderOrders() {
    const tbody = document.getElementById("ordersTableBody");

    if (!tbody) return;

    if (loadedOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">No orders found.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = "";

    loadedOrders.forEach((order, index) => {
        const paymentStatus = normalizePaymentStatus_(order.PaymentStatus);
        const deliveryStatus = normalizeDeliveryStatus_(order.DeliveryStatus);

        tbody.innerHTML += `
            <tr>
                <td>
                    <strong>${order.InvoiceID || order.OrderID || "-"}</strong>
                    <br>
                    <small>${order.OrderDate || order.CreatedAt || ""}</small>
                </td>

                <td>
                    <strong>${order.CustomerName || order.StoreName || "-"}</strong>
                    <br>
                    <small>${order.ContactNumber || ""}</small>
                </td>

                <td>${order.OrderType || "Wholesale"}</td>

                <td>
                    <strong>₱${formatMoney_(order.TotalAmount || 0)}</strong>
                </td>

                <td>
                    <select class="status-select payment-select">
                        <option value="Unpaid" ${paymentStatus === "Unpaid" ? "selected" : ""}>Unpaid</option>
                        <option value="Partial" ${paymentStatus === "Partial" ? "selected" : ""}>Partial</option>
                        <option value="Paid" ${paymentStatus === "Paid" ? "selected" : ""}>Paid</option>
                        <option value="Overdue" ${paymentStatus === "Overdue" ? "selected" : ""}>Overdue</option>
                        <option value="Cancelled" ${paymentStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>

                <td>
                    <select class="status-select delivery-select">
                        <option value="Pending" ${deliveryStatus === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Preparing" ${deliveryStatus === "Preparing" ? "selected" : ""}>Preparing</option>
                        <option value="Ready For Delivery" ${deliveryStatus === "Ready For Delivery" ? "selected" : ""}>Ready For Delivery</option>
                        <option value="Out For Delivery" ${deliveryStatus === "Out For Delivery" ? "selected" : ""}>Out For Delivery</option>
                        <option value="Delivered" ${deliveryStatus === "Delivered" ? "selected" : ""}>Delivered</option>
                        <option value="Failed Delivery" ${deliveryStatus === "Failed Delivery" ? "selected" : ""}>Failed Delivery</option>
                        <option value="Returned" ${deliveryStatus === "Returned" ? "selected" : ""}>Returned</option>
                        <option value="Cancelled" ${deliveryStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>

                <td>

                     <button type="button" onclick="openInvoiceByIndex(${index})" style="background:#005f2f;color:white;border:none;padding:10px 14px;border-radius:12px;font-weight:800;cursor:pointer;">View Invoice</button>

                    <button type="button" onclick="approveOrder(${index})" style="background:#16a34a;color:white;border:none;padding:10px 14px;border-radius:12px;font-weight:800;cursor:pointer;margin-right:8px;">Approve</button>

                    <button type="button" onclick="rejectOrder(${index})" style="background:#dc2626;color:white;border:none;padding:10px 14px;border-radius:12px;font-weight:800;cursor:pointer;margin-right:8px;">Reject</button>

                    <button type="button" onclick="updateOrderStatuses(${index})" style="background:#2563eb;color:white;border:none;padding:10px 14px;border-radius:12px;font-weight:800;cursor:pointer;margin-right:8px;">Update</button>

                    <button type="button" onclick="moveOrderToNextStage(${index})" style="background:#16a34a;color:white;border:none;padding:10px 14px;border-radius:12px;font-weight:800;cursor:pointer;margin-right:8px;">Next Step</button>

                    
                </td>
            </tr>
        `;
    });
}


/* =========================================
   UPDATE ORDER STATUSES
========================================= */
async function updateOrderStatuses(index) {
    const rows = document.querySelectorAll("#ordersTableBody tr");
    const row = rows[index];

    if (!row) return;

    const order = loadedOrders[index];

    if (!order) return;

    const paymentStatus = row.querySelector(".payment-select").value;
    const deliveryStatus = row.querySelector(".delivery-select").value;

    const payload = {
        action: "updateOrderStatuses",

        orderId: order.OrderID || "",
        invoiceId: order.InvoiceID || "",

        orderStatus: order.OrderStatus || "PROCESSING",

        paymentStatus: paymentStatus,
        deliveryStatus: deliveryStatus
    };

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            alert("Order status updated.");

            order.PaymentStatus = paymentStatus;
            order.DeliveryStatus = deliveryStatus;

            loadOrders();
        } else {
            alert(data.message || "Status update failed.");
        }

    } catch (error) {
        console.error(error);
        alert("Server error while updating order status.");
    }
}

/* =========================================
   OPEN INVOICE
========================================= */

/* =========================================
   OPEN INVOICE
========================================= */

function openInvoiceByIndex(index) {
    const order = loadedOrders[index];

    if (!order) {
        alert("Invoice data not found.");
        return;
    }

    setInvoiceText_("invoiceIdText", order.InvoiceID || order.OrderID || "-");
    setInvoiceText_("invoiceCustomerText", order.CustomerName || order.StoreName || "-");
    setInvoiceText_("invoiceContactText", order.ContactNumber || "-");
    setInvoiceText_("invoiceOrderTypeText", order.OrderType || "Wholesale");
    setInvoiceText_("invoicePaymentStatusText", order.PaymentStatus || "Unpaid");
    setInvoiceText_("invoiceDeliveryStatusText", order.DeliveryStatus || "Pending");
    setInvoiceText_("invoiceDateText", order.OrderDate || order.CreatedAt || "-");
    setInvoiceText_("invoiceNotesText", order.Notes || order.OrderNotes || "-");

    setInvoiceText_(
        "invoiceTotalText",
        "₱" + formatMoney_(order.TotalAmount || 0)
    );

    let items = [];

    if (Array.isArray(order.Items)) {
        items = order.Items;
    } else if (typeof order.Items === "string" && order.Items.trim()) {
        try {
            items = JSON.parse(order.Items);
        } catch (error) {
            console.warn("Could not parse order items:", order.Items);
        }
    }

    renderInvoiceItems_(items);

    const signatureImage = document.getElementById("invoiceSignatureImage");

    if (signatureImage) {
        signatureImage.src = order.SignatureImage || "";
        signatureImage.style.display = order.SignatureImage ? "block" : "none";
    }

    const modal = document.getElementById("invoiceModal");

    if (modal) {
        modal.style.display = "flex";
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
    } else {
        alert("Invoice modal not found.");
    }
}

function setInvoiceText_(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.innerText = value || "-";
    }
}

/* =========================================
   CLOSE INVOICE
========================================= */

function closeInvoiceModal() {
    const modal = document.getElementById("invoiceModal");

    if (modal) {
        modal.style.display = "none";
    }
}

function closeSimpleInvoice_() {
    closeInvoiceModal();
}

function normalizePaymentStatus_(status) {
    const value = String(status || "").trim().toLowerCase();

    if (value === "paid") return "Paid";
    if (value === "partial") return "Partial";
    if (value === "overdue") return "Overdue";
    if (value === "cancelled" || value === "canceled") return "Cancelled";

    return "Unpaid";
}

function normalizeDeliveryStatus_(status) {
    const value = String(status || "").trim().toLowerCase();

    if (value === "delivered") return "Delivered";
    if (value === "on the way") return "Out For Delivery";
    if (value === "out for delivery") return "Out For Delivery";
    if (value === "accepted") return "Preparing";
    if (value === "preparing") return "Preparing";
    if (value === "ready for delivery") return "Ready For Delivery";
    if (value === "failed delivery") return "Failed Delivery";
    if (value === "returned") return "Returned";
    if (value === "cancelled" || value === "canceled") return "Cancelled";

    return "Pending";
}

/* =========================================
   MOVE ORDER TO NEXT STAGE
========================================= */

async function moveOrderToNextStage(index) {

    const order =
        loadedOrders[index];

    if (!order) return;

    const current =
        normalizeDeliveryStatus_(
            order.DeliveryStatus
        );

    let next = current;

    if (current === "Pending") {
        next = "Preparing";
    }

    else if (current === "Preparing") {
        next = "Ready For Delivery";
    }

    else if (current === "Ready For Delivery") {
        next = "Out For Delivery";
    }

    else if (current === "Out For Delivery") {
        next = "Delivered";
    }

    else if (current === "Delivered") {

        alert(
            "Order already delivered."
        );

        return;
    }

    const payload = {
        action: "updateOrderStatuses",

        orderId: order.OrderID || "",
        invoiceId: order.InvoiceID || "",

        orderStatus: "PROCESSING",

        paymentStatus: order.PaymentStatus || "Unpaid",
        deliveryStatus: next
    };

    try {

        const response =
            await fetch(API.BASE_URL, {

                method: "POST",
                body: JSON.stringify(payload)

            });

        const data =
            await response.json();

        if (data.success) {

            alert(
                `Order moved to:\n\n${next}`
            );

            order.DeliveryStatus = next;

            loadOrders();

        } else {

            alert(
                data.message ||
                "Failed to move order."
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "Server error."
        );
    }
}

/* =========================================
   GLOBAL FUNCTIONS
========================================= */

window.loadOrders = loadOrders;
window.openInvoiceByIndex = openInvoiceByIndex;
window.updateOrderStatuses = updateOrderStatuses;
window.moveOrderToNextStage = moveOrderToNextStage;
window.closeInvoiceModal = closeInvoiceModal;
window.closeSimpleInvoice_ = closeSimpleInvoice_;

async function approveOrder(index) {
    const order = loadedOrders[index];

    if (!order) return;

    const payload = {
        action: "updateOrderStatuses",
        orderId: order.OrderID || "",
        invoiceId: order.InvoiceID || "",
        orderStatus: "APPROVED",
        paymentStatus: order.PaymentStatus || "Unpaid",
        deliveryStatus: order.DeliveryStatus || "Pending"
    };

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            alert("Order approved successfully.");
            loadOrders();
        } else {
            alert(data.message || "Approval failed.");
        }
    } catch (error) {
        console.error(error);
        alert("Server error.");
    }
}

async function rejectOrder(index) {
    const order = loadedOrders[index];

    if (!order) return;

    const payload = {
        action: "updateOrderStatuses",
        orderId: order.OrderID || "",
        invoiceId: order.InvoiceID || "",
        orderStatus: "REJECTED",
        paymentStatus: "Cancelled",
        deliveryStatus: "Cancelled"
    };

    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            alert("Order rejected.");
            loadOrders();
        } else {
            alert(data.message || "Reject failed.");
        }
    } catch (error) {
        console.error(error);
        alert("Server error.");
    }
}

window.approveOrder = approveOrder;
window.rejectOrder = rejectOrder;

function formatMoney_(value) {
    return Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function renderInvoiceItems_(items) {
    const tbody = document.getElementById("invoiceItemsBody");

    if (!tbody) return;

    if (!items || !items.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">No items found.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = "";

    items.forEach(item => {
        const qty = Number(item.Quantity || item.Qty || 0);
        const price = Number(item.UnitPrice || item.Price || 0);
        const subtotal = Number(item.Subtotal || item.Total || qty * price);

        tbody.innerHTML += `
            <tr>
                <td>${item.ProductName || "-"}</td>
                <td>${qty}</td>
               <td>₱${formatMoney_(price)}</td>
                <td>₱${formatMoney_(subtotal)}</td>
            </tr>
        `;
    });
}