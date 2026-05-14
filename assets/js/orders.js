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

    const productSelect =
        document.getElementById("productSelect");

    if (!productSelect) return;

    try {

        productSelect.innerHTML = `
            <option value="">
                Select Product
            </option>
        `;

        const sampleProducts = [

            {
                ProductID: "P001",
                ProductName: "Lucky Me Pancit Canton",
                RetailPrice: 18
            },

            {
                ProductID: "P002",
                ProductName: "Coca Cola 1.5L",
                RetailPrice: 75
            },

            {
                ProductID: "P003",
                ProductName: "Piattos Cheese",
                RetailPrice: 22
            }

        ];

        sampleProducts.forEach(product => {

            const option =
                document.createElement("option");

            option.value =
                JSON.stringify(product);

            option.textContent =
                `${product.ProductName} - ₱${product.RetailPrice}`;

            productSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);
    }
}

/* =========================================
   ADD TO CART
========================================= */

function initializeAddToCart() {

    const addBtn =
        document.getElementById("addToCartBtn");

    if (!addBtn) return;

    addBtn.addEventListener("click", () => {

        const productRaw =
            document.getElementById("productSelect").value;

        const qty =
            Number(
                document.getElementById("productQuantity").value
            );

        if (!productRaw) {

            alert("Please select product.");
            return;
        }

        const product =
            JSON.parse(productRaw);

        const item = {

            ProductID:
                product.ProductID,

            ProductName:
                product.ProductName,

            Qty:
                qty,

            Price:
                Number(product.RetailPrice),

            Total:
                Number(product.RetailPrice) * qty
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

    const tbody =
        document.getElementById("cartTableBody");

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

                <td>
                    ₱${item.Price.toLocaleString()}
                </td>

                <td>
                    ₱${item.Total.toLocaleString()}
                </td>

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

window.removeCartItem =
    removeCartItem;

window.openInvoiceByIndex =
    openInvoiceByIndex;

/* =========================================
   TOTAL
========================================= */

function computeTotalAmount() {

    const total =
        cartItems.reduce((sum, item) => {

            return sum + item.Total;

        }, 0);

    const totalInput =
        document.getElementById("totalAmount");

    if (totalInput) {

        totalInput.value = total;
    }
}

/* =========================================
   SIGNATURE PAD
========================================= */

function initializeSignaturePad() {

    signatureCanvas =
        document.getElementById("signatureCanvas");

    if (!signatureCanvas) return;

    signatureCtx =
        signatureCanvas.getContext("2d");

    signatureCtx.strokeStyle =
        "#0f172a";

    signatureCtx.lineWidth = 2;

    signatureCanvas.addEventListener(
        "mousedown",
        startDrawing
    );

    signatureCanvas.addEventListener(
        "mousemove",
        draw
    );

    signatureCanvas.addEventListener(
        "mouseup",
        stopDrawing
    );

    signatureCanvas.addEventListener(
        "mouseleave",
        stopDrawing
    );

    const clearBtn =
        document.getElementById("clearSignatureBtn");

    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            clearSignature
        );
    }
}

function startDrawing(e) {

    isDrawing = true;

    signatureCtx.beginPath();

    signatureCtx.moveTo(
        e.offsetX,
        e.offsetY
    );
}

function draw(e) {

    if (!isDrawing) return;

    signatureCtx.lineTo(
        e.offsetX,
        e.offsetY
    );

    signatureCtx.stroke();
}

function stopDrawing() {

    isDrawing = false;
}

function clearSignature() {

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

    const form =
        document.getElementById("orderForm");

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

    const payload = {
        action: "addOrder",
        customerName: document.getElementById("customerName").value,
        contactNumber: document.getElementById("contactNumber").value,
        orderType: document.getElementById("orderType").value,
        paymentStatus: document.getElementById("paymentStatus").value,
        orderNotes: document.getElementById("orderNotes").value,
        totalAmount: Number(document.getElementById("totalAmount").value || 0),
        signatureImage: signatureCanvas ? signatureCanvas.toDataURL("image/png") : "",
        items: cartItems
    };

    const response = await fetch(API.BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("SAVE ORDER:", data);

    if (data.success) {
        alert("Order saved to Google Sheets.");
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

    document.getElementById("orderForm").reset();

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

    const tbody =
        document.getElementById("ordersTableBody");

    if (!tbody) return;

    if (loadedOrders.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    No orders found.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = "";

    loadedOrders.forEach((order, index) => {

        tbody.innerHTML += `
            <tr>

                <td>${order.InvoiceID}</td>

                <td>${order.CustomerName}</td>

                <td>${order.OrderType}</td>

                <td>
                    ₱${Number(order.TotalAmount).toLocaleString()}
                </td>

                <td>${order.PaymentStatus}</td>

                <td>${order.DeliveryStatus}</td>

                <td>
                    <button
                        type="button"
                        onclick="openInvoiceByIndex(${index})"
                        style="
                            background:#005f2f;
                            color:white;
                            border:none;
                            padding:10px 14px;
                            border-radius:12px;
                            font-weight:800;
                            cursor:pointer;
                            box-shadow:0 6px 14px rgba(0,95,47,0.18);
                        "
                    >
                        View Invoice
                    </button>
                </td>

            </tr>
        `;
    });
}

/* =========================================
   OPEN INVOICE
========================================= */

function openInvoiceByIndex(index) {

    const order = loadedOrders[index];

    if (!order) {
        alert("Invoice data not found.");
        return;
    }

    setInvoiceText_("invoiceIdText", order.InvoiceID || order.OrderID);
    setInvoiceText_("invoiceCustomerText", order.CustomerName);
    setInvoiceText_("invoiceContactText", order.ContactNumber);
    setInvoiceText_("invoiceOrderTypeText", order.OrderType);
    setInvoiceText_("invoicePaymentStatusText", order.PaymentStatus);
    setInvoiceText_("invoiceDeliveryStatusText", order.DeliveryStatus);
    setInvoiceText_("invoiceDateText", order.OrderDate || order.CreatedAt);
    setInvoiceText_("invoiceNotesText", order.Notes || order.OrderNotes);

    setInvoiceText_(
        "invoiceTotalText",
        "₱" + Number(order.TotalAmount || 0).toLocaleString()
    );

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
        alert("Invoice modal not found in store-order-form.html.");
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

function closeSimpleInvoice_() {

    const modal =
        document.getElementById("invoiceModal");

    if (modal) {

        modal.style.display = "none";
    }
}

window.closeSimpleInvoice_ =
    closeSimpleInvoice_;