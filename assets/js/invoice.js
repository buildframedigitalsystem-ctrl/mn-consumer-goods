function openInvoiceModalFromButton(button) {

    const rawOrder =
        button.getAttribute("data-order");

    if (!rawOrder) {
        alert("Invoice data not found.");
        return;
    }

    try {

        const order =
            JSON.parse(rawOrder);

        openInvoiceModal(order);

    } catch (error) {

        console.error("Invoice parse error:", error);
        alert("Invoice data error.");
    }
}

function openInvoiceModal(order) {

    const modal =
        document.getElementById("invoiceModal");

    if (!modal) return;

    /* =========================
       BASIC DETAILS
    ========================= */

    setInvoiceText_(
        "invoiceIdText",
        order.InvoiceID
    );

    setInvoiceText_(
        "invoiceCustomerText",
        order.CustomerName
    );

    setInvoiceText_(
        "invoiceContactText",
        order.ContactNumber
    );

    setInvoiceText_(
        "invoiceOrderTypeText",
        order.OrderType
    );

    setInvoiceText_(
        "invoicePaymentStatusText",
        order.PaymentStatus
    );

    setInvoiceText_(
        "invoiceDeliveryStatusText",
        order.DeliveryStatus
    );

    setInvoiceText_(
        "invoiceDateText",
        order.OrderDate
    );

    setInvoiceText_(
        "invoiceNotesText",
        order.Notes
    );

    /* =========================
       TOTAL
    ========================= */

    const total =
        Number(order.TotalAmount || 0);

    setInvoiceText_(
        "invoiceTotalText",
        "₱" + total.toLocaleString()
    );

    /* =========================
       SIGNATURE
    ========================= */

    const signatureImage =
        document.getElementById(
            "invoiceSignatureImage"
        );

    if (signatureImage) {

        signatureImage.src =
            order.SignatureImage || "";

        signatureImage.style.display =
            order.SignatureImage
                ? "block"
                : "none";
    }

    modal.style.display = "flex";
}

function closeInvoiceModal() {

    const modal =
        document.getElementById("invoiceModal");

    if (modal) {
        modal.style.display = "none";
    }
}

function initializeInvoiceModal() {

    const closeBtn =
        document.getElementById(
            "closeInvoiceBtn"
        );

    const printBtn =
        document.getElementById(
            "printInvoiceBtn"
        );

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeInvoiceModal
        );
    }

    if (printBtn) {

        printBtn.addEventListener(
            "click",
            printInvoice_
        );
    }

    window.addEventListener(
        "click",
        function (e) {

            const modal =
                document.getElementById(
                    "invoiceModal"
                );

            if (e.target === modal) {
                closeInvoiceModal();
            }
        }
    );
}

function printInvoice_() {

    window.print();
}

function setInvoiceText_(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.innerText =
        value || "-";
}

document.addEventListener(
    "DOMContentLoaded",
    initializeInvoiceModal
);