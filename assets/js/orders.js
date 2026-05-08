let signatureCanvas;
let signatureCtx;
let isDrawing = false;

function initializeOrders() {
    const orderForm = document.getElementById("orderForm");
    if (!orderForm) return;

    initializeSignaturePad();

    orderForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const signatureImage =
            signatureCanvas.toDataURL("image/png");

        const payload = {
            action: "addOrder",
            customerName: document.getElementById("customerName").value,
            contactNumber: document.getElementById("contactNumber").value,
            orderType: document.getElementById("orderType").value,
            totalAmount: document.getElementById("totalAmount").value,
            paymentStatus: document.getElementById("paymentStatus").value,
            orderNotes: document.getElementById("orderNotes").value,
            signatureImage: signatureImage
        };

        try {
            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                alert("Order saved.");
                orderForm.reset();
                clearSignature();
                loadOrders();
            } else {
                alert(data.message || "Order save failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Server error.");
        }
    });

    loadOrders();
}

function initializeSignaturePad() {
    signatureCanvas = document.getElementById("signatureCanvas");
    if (!signatureCanvas) return;

    signatureCtx = signatureCanvas.getContext("2d");

    signatureCtx.lineWidth = 2;
    signatureCtx.lineCap = "round";
    signatureCtx.strokeStyle = "#0f172a";

    signatureCanvas.addEventListener("mousedown", startDrawing);
    signatureCanvas.addEventListener("mouseup", stopDrawing);
    signatureCanvas.addEventListener("mouseleave", stopDrawing);
    signatureCanvas.addEventListener("mousemove", drawSignature);

    signatureCanvas.addEventListener("touchstart", startTouchDrawing);
    signatureCanvas.addEventListener("touchend", stopDrawing);
    signatureCanvas.addEventListener("touchmove", drawTouchSignature);

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

function stopDrawing() {
    isDrawing = false;
}

function drawSignature(e) {
    if (!isDrawing) return;

    signatureCtx.lineTo(e.offsetX, e.offsetY);
    signatureCtx.stroke();
}

function startTouchDrawing(e) {
    e.preventDefault();

    const rect = signatureCanvas.getBoundingClientRect();
    const touch = e.touches[0];

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

    const rect = signatureCanvas.getBoundingClientRect();
    const touch = e.touches[0];

    signatureCtx.lineTo(
        touch.clientX - rect.left,
        touch.clientY - rect.top
    );

    signatureCtx.stroke();
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

async function loadOrders() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getOrders"
            })
        });

        const data = await response.json();

        const rows =
            data.rows ||
            data.orders ||
            [];

        const tbody =
            document.getElementById("ordersTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        rows.forEach(order => {

            const safeOrder = JSON
                .stringify(order)
                .replace(/'/g, "&apos;");

            tbody.innerHTML += `
                <tr>
                    <td>${order.OrderID || ""}</td>
                    <td>${order.CustomerName || ""}</td>
                    <td>${order.OrderType || ""}</td>
                    <td>${order.TotalAmount || order.Total || ""}</td>
                    <td>${order.PaymentStatus || ""}</td>
                    <td>${order.OrderStatus || order.Status || ""}</td>
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
        console.error(error);
    }
}