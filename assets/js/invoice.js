function openInvoiceModalFromButton(button) {
    const rawOrder = button.getAttribute("data-order");

    if (!rawOrder) {
        alert("Invoice data not found.");
        return;
    }

    try {
        const order = JSON.parse(rawOrder);
        openInvoiceModal(order);
    } catch (error) {
        console.error("Invoice parse error:", error);
        alert("Invoice data error.");
    }
}

function openInvoiceModal(order) {
    const modal = document.getElementById("invoiceModal");

    if (!modal) return;

    setInvoiceText_("invoiceIdText", order.InvoiceID || order.OrderID || "-");
    setInvoiceText_("invoiceCustomerText", order.CustomerName || order.StoreName || "-");

    setInvoiceText_(
        "invoiceAddressText",
        order.CustomerAddress ||
        order.StoreAddress ||
        order.Address ||
        order.DeliveryAddress ||
        "-"
    );

    setInvoiceText_("invoiceContactText", order.ContactNumber || "-");
    setInvoiceText_("invoiceOrderTypeText", order.OrderType || "Wholesale");
    setInvoiceText_("invoicePaymentStatusText", order.PaymentStatus || "Unpaid");
    setInvoiceText_("invoiceDeliveryStatusText", order.DeliveryStatus || "Pending");
    setInvoiceText_("invoiceDateText", order.OrderDate || order.CreatedAt || "-");
    setInvoiceText_("invoiceNotesText", order.Notes || order.OrderNotes || "-");

    const items = parseInvoiceItems_(order.Items);

    renderInvoiceItems_(items);

    const itemsTotal =
        Number(order.TotalAmount || calculateItemsTotal_(items));

    const discount = Number(order.DiscountAmount || 0);
    const deliveryFee = Number(order.DeliveryFee || 0);
    const partialPayments = Number(order.PartialPayments || 0);
    const returnsAmount = Number(order.ReturnsAmount || 0);

    const subtotal = itemsTotal - discount + deliveryFee;
    const balanceDue = subtotal - partialPayments - returnsAmount;

    setInvoiceText_("invoiceItemsTotalText", "₱" + formatMoney_(itemsTotal));
    setInvoiceText_("invoiceDiscountText", "₱" + formatMoney_(discount));
    setInvoiceText_("invoiceDeliveryFeeText", "₱" + formatMoney_(deliveryFee));
    setInvoiceText_("invoiceSubtotalText", "₱" + formatMoney_(subtotal));
    setInvoiceText_("invoicePartialPaymentsText", "₱" + formatMoney_(partialPayments));
    setInvoiceText_("invoiceReturnsText", "₱" + formatMoney_(returnsAmount));
    setInvoiceText_("invoiceBalanceDueText", "₱" + formatMoney_(balanceDue));

    const signatureImage = document.getElementById("invoiceSignatureImage");

    if (signatureImage) {
        signatureImage.src = order.SignatureImage || "";
        signatureImage.style.display = order.SignatureImage ? "block" : "none";
    }

    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
}

function parseInvoiceItems_(rawItems) {
    if (Array.isArray(rawItems)) return rawItems;

    if (typeof rawItems === "string" && rawItems.trim()) {
        try {
            return JSON.parse(rawItems);
        } catch (error) {
            console.warn("Could not parse order items:", rawItems);
        }
    }

    return [];
}

function renderInvoiceItems_(items) {
    const tbody = document.getElementById("invoiceItemsBody");

    if (!tbody) return;

    if (!items.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">No items found.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = "";

    items.forEach(item => {
        const qty = Number(item.Quantity || item.Qty || item.quantity || 0);
        const price = Number(item.UnitPrice || item.Price || item.price || 0);
        const subtotal = Number(item.Subtotal || item.Total || qty * price);

        tbody.innerHTML += `
            <tr>
                <td>${item.ProductName || item.productName || "-"}</td>
                <td>${qty}</td>
                <td>₱${formatMoney_(price)}</td>
                <td>₱${formatMoney_(subtotal)}</td>
            </tr>
        `;
    });
}

function calculateItemsTotal_(items) {
    return items.reduce((sum, item) => {
        const qty = Number(item.Quantity || item.Qty || item.quantity || 0);
        const price = Number(item.UnitPrice || item.Price || item.price || 0);
        const subtotal = Number(item.Subtotal || item.Total || qty * price);

        return sum + subtotal;
    }, 0);
}

function closeInvoiceModal() {
    const modal = document.getElementById("invoiceModal");

    if (modal) {
        modal.style.display = "none";
    }
}

function printInvoiceModal() {
    const invoiceBox = document.querySelector(".invoice-box");

    if (!invoiceBox) {
        alert("Invoice content not found.");
        return;
    }

    const printWindow = window.open("", "PRINT", "width=900,height=700");

    if (!printWindow) {
        alert("Please allow popups to print invoice.");
        return;
    }

    printWindow.document.open();

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>M&N Invoice</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 24px;
                    color: #111827;
                    background: white;
                }

                .invoice-close-btn,
                .invoice-actions {
                    display: none !important;
                }

                .invoice-header {
                    text-align: center;
                    border-bottom: 2px solid #111827;
                    padding-bottom: 18px;
                    margin-bottom: 22px;
                }

                .invoice-header h2 {
                    margin: 0;
                    font-size: 30px;
                    font-weight: 900;
                }

                .invoice-header p {
                    margin: 8px 0;
                    color: #475569;
                }

                .invoice-details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    margin-bottom: 20px;
                }

                small {
                    display: block;
                    color: #64748b;
                    margin-bottom: 4px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }

                th, td {
                    padding: 10px;
                    border-bottom: 1px solid #e5e7eb;
                    text-align: left;
                }

                th {
                    background: #f1f5f9;
                }

                .invoice-summary-block {
                    margin-top: 20px;
                    padding: 16px;
                    background: #f8fafc;
                    border-radius: 12px;
                }

                .invoice-summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 6px 0;
                }

                .total-row {
                    font-size: 20px;
                    font-weight: 900;
                }

                .invoice-signature-box {
                    margin-top: 20px;
                }

                .invoice-signature-box img {
                    max-width: 260px;
                    margin-top: 10px;
                }
            </style>
        </head>

        <body>
            ${invoiceBox.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 500);
}

function setInvoiceText_(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.innerText = value || "-";
    }
}

function formatMoney_(value) {
    return Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

window.openInvoiceModalFromButton = openInvoiceModalFromButton;
window.openInvoiceModal = openInvoiceModal;
window.closeInvoiceModal = closeInvoiceModal;
window.printInvoiceModal = printInvoiceModal;

