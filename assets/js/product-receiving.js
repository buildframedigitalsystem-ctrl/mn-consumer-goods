async function initializeProductReceiving() {

    const form =
        document.getElementById("productReceivingForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const payload = {

            action: "addProductReceiving",

            purchaseOrderId:
                document.getElementById("purchaseOrderId").value,

            productId:
                document.getElementById("productId").value,

            productName:
                document.getElementById("productName").value,

            quantityReceived:
                document.getElementById("quantityReceived").value,

            unitCost:
                document.getElementById("unitCost").value,

            receivedDate:
                document.getElementById("receivedDate").value

        };

        try {

            const response = await fetch(API.BASE_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {

                alert("Stocks received.");

                form.reset();

                loadReceivingRecords();

            } else {

                alert(data.message || "Receiving failed.");

            }

        } catch (error) {

            console.error(error);

            alert("Server error.");

        }

    });

    loadReceivingRecords();

}

async function loadReceivingRecords() {

    try {

        const response = await fetch(API.BASE_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getProductReceiving"
            })
        });

        const data = await response.json();

        const rows = data.rows || [];

        const tbody =
            document.getElementById("receivingTableBody");

        if (!tbody) return;

        tbody.innerHTML = "";

        rows.forEach(item => {

            tbody.innerHTML += `
                <tr>
                    <td>${item.ReceivingID || ""}</td>
                    <td>${item.PurchaseOrderID || ""}</td>
                    <td>${item.ProductName || ""}</td>
                    <td>${item.QuantityReceived || ""}</td>
                    <td>${item.UnitCost || ""}</td>
                    <td>${item.ReceivedDate || ""}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}