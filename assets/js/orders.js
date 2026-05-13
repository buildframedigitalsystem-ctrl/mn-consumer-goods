let signatureCanvas;
let signatureCtx;
let isDrawing = false;
let cartItems = [];
let loadedProducts = [];

/* =========================================
   INITIALIZE ORDER SYSTEM
========================================= */

function initializeOrders() {

    const orderForm =
        document.getElementById("orderForm");

    if (!orderForm) return;

    initializeSignaturePad();

    loadProducts();
    initializeCartSystem();

    orderForm.addEventListener(
        "submit",
        submitOrderForm
    );

    loadOrders();
}

/* =========================================
   SUBMIT ORDER
========================================= */

async function submitOrderForm(e) {

    e.preventDefault();

    const submitBtn =
        document.getElementById("submitOrderBtn");

    if (submitBtn) {

        submitBtn.disabled = true;
        submitBtn.innerText = "Saving Order...";
    }

    try {

        const signatureImage =
            signatureCanvas.toDataURL("image/png");

        const payload = {

            action: "addOrder",

            customerName:
                document.getElementById("customerName")?.value || "",

            contactNumber:
                document.getElementById("contactNumber")?.value || "",

            orderType:
                document.getElementById("orderType")?.value || "",

            totalAmount:
                Number(
                    document.getElementById("totalAmount")?.value || 0
                ),

            paymentStatus:
                document.getElementById("paymentStatus")?.value || "UNPAID",

            orderNotes:
                document.getElementById("orderNotes")?.value || "",

            signatureImage:
                signatureImage,

            deliveryStatus:
                "PENDING",

            orderStatus:
                "NEW",

            createdAt:
                new Date().toISOString(),

            items:
                cartItems
        };

        const response =
            await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify(payload)
            });

        const data =
            await response.json();

        console.log(
            "ORDER RESPONSE:",
            data
        );

        if (data.success) {

            alert(
                `Order Saved.\nInvoice #: ${data.InvoiceID || "N/A"}`
            );

            orderForm.reset();

            clearSignature();

            await loadOrders();

            if (
                typeof loadDashboardAnalytics ===
                "function"
            ) {

                loadDashboardAnalytics();
            }

        } else {

            alert(
                data.message ||
                "Order save failed."
            );
        }

    } catch (error) {

        console.error(
            "ORDER ERROR:",
            error
        );

        alert(
            "Server connection failed."
        );

    } finally {

        if (submitBtn) {

            submitBtn.disabled = false;

            submitBtn.innerText =
                "Submit Order";
        }
    }
}

/* =========================================
   LOAD ORDERS
========================================= */

async function loadOrders() {

    try {

        const response =
            await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify({
                    action: "getOrders"
                })
            });

        const data =
            await response.json();

        console.log(
            "ORDERS:",
            data
        );

        const rows =
            data.rows ||
            data.orders ||
            [];

        const tbody =
            document.getElementById(
                "ordersTableBody"
            );

        if (!tbody) return;

        tbody.innerHTML = "";

        if (!rows.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No orders found.
                    </td>
                </tr>
            `;

            return;
        }

        rows.forEach(order => {

            const safeOrder =
                JSON.stringify(order)
                    .replace(/'/g, "&apos;");

            tbody.innerHTML += `
                <tr>

                    <td>
                        ${order.InvoiceID || order.OrderID || ""}
                    </td>

                    <td>
                        ${order.CustomerName || ""}
                    </td>

                    <td>
                        ${order.OrderType || ""}
                    </td>

                    <td>
                        ₱${Number(
                order.TotalAmount || 0
            ).toLocaleString()}
                    </td>

                    <td>
                        ${order.PaymentStatus || ""}
                    </td>

                    <td>
                        ${order.DeliveryStatus || ""}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="primary-btn"
                            onclick='openInvoiceModal(${safeOrder})'
                        >
                            View Invoice
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(
            "LOAD ORDERS ERROR:",
            error
        );
    }
}


/* =========================================
   PRODUCT SYSTEM
========================================= */

async function loadProducts() {

    try {

        const response =
            await fetch(API.BASE_URL, {

                method: "POST",

                body: JSON.stringify({
                    action: "getProducts"
                })
            });

        const data =
            await response.json();

        console.log("PRODUCTS:", data);

        loadedProducts =
            data.products ||
            data.rows ||
            [];

        const select =
            document.getElementById("productSelect");

        if (!select) return;

        select.innerHTML =
            `<option value="">Select Product</option>`;

        loadedProducts.forEach(product => {

            const option =
                document.createElement("option");

            option.value =
                product.ProductID;

            option.textContent =
                `${product.ProductName} - ₱${Number(
                    product.RetailPrice || 0
                ).toLocaleString()}`;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "LOAD PRODUCTS ERROR:",
            error
        );
    }
}

function initializeCartSystem() {

    const addBtn =
        document.getElementById("addToCartBtn");

    if (!addBtn) return;

    addBtn.addEventListener(
        "click",
        addProductToCart
    );
}

function addProductToCart() {

    const productId =
        document.getElementById("productSelect")?.value;

    const quantity =
        Number(
            document.getElementById("productQuantity")?.value || 1
        );

    if (!productId) {

        alert("Please select a product.");
        return;
    }

    const product =
        loadedProducts.find(
            item =>
                String(item.ProductID) ===
                String(productId)
        );

    if (!product) {

        alert("Product not found.");
        return;
    }

    const unitPrice =
        Number(
            product.RetailPrice || 0
        );

    const lineTotal =
        quantity * unitPrice;

    cartItems.push({

        productId:
            product.ProductID,

        productName:
            product.ProductName,

        quantity:
            quantity,

        unitPrice:
            unitPrice,

        lineTotal:
            lineTotal
    });

    renderCart();
}

function renderCart() {

    const tbody =
        document.getElementById("cartTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!cartItems.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    No products added.
                </td>
            </tr>
        `;

        updateTotalAmount();

        return;
    }

    cartItems.forEach(item => {

        tbody.innerHTML += `
            <tr>

                <td>
                    ${item.productName}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ₱${Number(item.unitPrice)
                .toLocaleString()}
                </td>

                <td>
                    ₱${Number(item.lineTotal)
                .toLocaleString()}
                </td>

            </tr>
        `;
    });

    updateTotalAmount();
}

function updateTotalAmount() {

    let total = 0;

    cartItems.forEach(item => {

        total +=
            Number(item.lineTotal || 0);
    });

    const totalInput =
        document.getElementById("totalAmount");

    if (totalInput) {

        totalInput.value =
            total;
    }
}

/* =========================================
   SIGNATURE PAD
========================================= */

function initializeSignaturePad() {

    signatureCanvas =
        document.getElementById(
            "signatureCanvas"
        );

    if (!signatureCanvas) return;

    signatureCtx =
        signatureCanvas.getContext("2d");

    signatureCtx.lineWidth = 2;

    signatureCtx.lineCap = "round";

    signatureCtx.strokeStyle =
        "#0f172a";

    signatureCanvas.addEventListener(
        "mousedown",
        startDrawing
    );

    signatureCanvas.addEventListener(
        "mouseup",
        stopDrawing
    );

    signatureCanvas.addEventListener(
        "mouseleave",
        stopDrawing
    );

    signatureCanvas.addEventListener(
        "mousemove",
        drawSignature
    );

    signatureCanvas.addEventListener(
        "touchstart",
        startTouchDrawing
    );

    signatureCanvas.addEventListener(
        "touchend",
        stopDrawing
    );

    signatureCanvas.addEventListener(
        "touchmove",
        drawTouchSignature
    );

    const clearBtn =
        document.getElementById(
            "clearSignatureBtn"
        );

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

function stopDrawing() {

    isDrawing = false;
}

function drawSignature(e) {

    if (!isDrawing) return;

    signatureCtx.lineTo(
        e.offsetX,
        e.offsetY
    );

    signatureCtx.stroke();
}

function startTouchDrawing(e) {

    e.preventDefault();

    const rect =
        signatureCanvas.getBoundingClientRect();

    const touch =
        e.touches[0];

    isDrawing = true;

    signatureCtx.beginPath();

    signatureCtx.moveTo(
        touch.clientX - rect.left,
        touch.clientY - rect.top
    );
}

function drawTouchSignature(e) {

    e.preventDefault();

    if (!isDrawing) return;

    const rect =
        signatureCanvas.getBoundingClientRect();

    const touch =
        e.touches[0];

    signatureCtx.lineTo(
        touch.clientX - rect.left,
        touch.clientY - rect.top
    );

    signatureCtx.stroke();
}

function clearSignature() {

    if (
        !signatureCtx ||
        !signatureCanvas
    ) return;

    signatureCtx.clearRect(
        0,
        0,
        signatureCanvas.width,
        signatureCanvas.height
    );
}

/* =========================================
   AUTO START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeOrders
);