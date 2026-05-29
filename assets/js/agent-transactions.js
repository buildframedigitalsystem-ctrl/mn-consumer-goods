document.addEventListener("DOMContentLoaded", () => {
    initializeAgentTransactions();
});

let agentTransactionItems = [];

function initializeAgentTransactions() {
    const form = document.getElementById("agentTransactionForm");

    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            await saveAgentTransactionsBatch_();
        });
    }

    renderTransactionItems_();
    loadAgentTransactions_();
}

function addTransactionItem_() {
    const transactionType =
        document.getElementById("transactionType").value;

    const productId =
        document.getElementById("productId").value;

    const productName =
        document.getElementById("productName").value;

    const quantity =
        Number(document.getElementById("quantity").value || 0);

    const unitPrice =
        Number(document.getElementById("unitPrice").value || 0);

    if (!transactionType) {
        alert("Please select transaction type.");
        return;
    }

    if (!productName || quantity <= 0) {
        alert("Product name and quantity are required.");
        return;
    }

    agentTransactionItems.push({
        transactionType,
        productId,
        productName,
        quantity,
        unitPrice,
        totalAmount: quantity * unitPrice
    });

    renderTransactionItems_();
    clearProductInputs_();
}

function renderTransactionItems_() {
    const tbody =
        document.getElementById("transactionItemsTableBody");

    if (!tbody) return;

    if (!agentTransactionItems.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    No items added yet.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML =
        agentTransactionItems.map((item, index) => {
            return `
                <tr>
                    <td>
                        ${item.transactionType || "-"}
                    </td>

                    <td>
                        ${item.productName || "-"}
                    </td>

                    <td>
                        ${item.quantity || 0}
                    </td>

                    <td>
                        ₱${formatMoney_(item.unitPrice)}
                    </td>

                    <td>
                        ₱${formatMoney_(item.totalAmount)}
                    </td>

                    <td>
                        <button
                            type="button"
                            onclick="removeTransactionItem_(${index})"
                            class="delete-btn">
                            Remove
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
}

function removeTransactionItem_(index) {
    agentTransactionItems.splice(index, 1);
    renderTransactionItems_();
}

function clearProductInputs_() {
    document.getElementById("productId").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("quantity").value = 0;
    document.getElementById("unitPrice").value = 0;
}

async function saveAgentTransactionsBatch_() {
    if (!agentTransactionItems.length) {
        alert("Please add transaction items first.");
        return;
    }

    const transactionType =
        document.getElementById("transactionType").value;

    const agentName =
        document.getElementById("agentName").value;

    const storeName =
        document.getElementById("storeName").value;

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const remarks =
        document.getElementById("remarks").value;

    if (!agentName) {
        alert("Please enter agent name.");
        return;
    }

    try {
        const payload = {
            action: "addAgentTransaction",
            agentName,
            transactionType,
            storeName,
            paymentMethod,
            remarks,
            items: agentTransactionItems
        };

        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Failed to save transaction.");
            return;
        }

        alert("Agent transactions saved.");

        document
            .getElementById("agentTransactionForm")
            .reset();

        agentTransactionItems = [];

        renderTransactionItems_();
        loadAgentTransactions_();

    } catch (error) {
        console.error(error);
        alert("Server error.");
    }
}

async function loadAgentTransactions_() {
    try {
        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getAgentTransactions"
            })
        });

        const data = await response.json();

        const rows =
            data.transactions ||
            data.rows ||
            [];

        const tbody =
            document.getElementById("agentTransactionsTableBody");

        if (!tbody) return;

        if (!rows.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No transactions found.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML =
            rows.map(row => {
                return `
                    <tr>
                        <td>
                            ${formatDate_(row.TransactionDate)}
                        </td>

                        <td>
                            ${row.AgentName || ""}
                        </td>

                        <td>
                            ${row.TransactionType || ""}
                        </td>

                        <td>
                            ${row.ProductName || ""}
                        </td>

                        <td>
                            ${row.Quantity || 0}
                        </td>

                        <td>
                            ₱${formatMoney_(row.TotalAmount)}
                        </td>

                        <td>
                            ${row.Status || ""}
                        </td>
                    </tr>
                `;
            }).join("");

    } catch (error) {
        console.error(error);
    }
}

function formatMoney_(value) {
    return Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate_(value) {
    if (!value) return "";

    return new Date(value).toLocaleDateString("en-PH");
}

window.addTransactionItem_ = addTransactionItem_;
window.removeTransactionItem_ = removeTransactionItem_;