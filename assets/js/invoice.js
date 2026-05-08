function openInvoiceModal(order) {

    const modal =
        document.getElementById("invoiceModal");

    if (!modal) return;

    document.getElementById("invoiceIdText")
        .innerText = order.InvoiceID || "-";

    document.getElementById("invoiceCustomerText")
        .innerText = order.CustomerName || "-";

    document.getElementById("invoiceOrderTypeText")
        .innerText = order.OrderType || "-";

    document.getElementById("invoiceTotalText")
        .innerText = order.TotalAmount || "0";

    document.getElementById("invoiceSignatureImage")
        .src = order.SignatureImage || "";

    modal.style.display = "flex";

}

function closeInvoiceModal() {

    document.getElementById("invoiceModal")
        .style.display = "none";

}

function initializeInvoiceModal() {

    const closeBtn =
        document.getElementById("closeInvoiceBtn");

    const printBtn =
        document.getElementById("printInvoiceBtn");

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeInvoiceModal
        );

    }

    if (printBtn) {

        printBtn.addEventListener(
            "click",
            () => window.print()
        );

    }

}